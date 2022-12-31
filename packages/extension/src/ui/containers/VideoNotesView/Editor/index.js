import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { secondsToTime } from '@yi-note/common/utils';
import { MarkdownEditor } from '@yi-note/common/components';
import { storage as StorageService } from '@yi-note/common/services';
import {
  TYPE_VIDEO_NOTE,
  KEY_PAUSE_VIDEO_WHEN_EDITING
} from '@yi-note/common/constants';
import TextButton from '../../../components/TextButton';
import { takeScreenshot } from '../../../utils';
import { PlayerFactory } from '../../../services/player';

const StyledStatus = styled.span`
  font-weight: bold;
`;

const Editor = () => {
  const { t } = useTranslation('notesView');
  const {
    videoNotes: {
      editor: { active, note }
    },
    app: { showingAd: disabled },
    settings: { data: settings }
  } = useStoreState(state => state);
  const {
    app: { setOpen },
    videoNotes: {
      editor: { setNote, reset },
      edit
    },
    page: { saveNote }
  } = useStoreActions(actions => actions);

  const handleKeyPress = React.useCallback((event) => {
    if (event.key === 'Escape') {
      reset();
      setOpen(false);
    }
    if (event.key === 'Enter' && event.ctrlKey) {
      handleSave();
      setOpen(false);
    }
  }, [note]);

  React.useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const handleFocus = async () => {
    const player = await PlayerFactory.getPlayer();
    if (settings[KEY_PAUSE_VIDEO_WHEN_EDITING]) {
      player.pause();
    }
    const timestamp = await player.getCurrentTime();
    const videoEl = player.getVideoElement();
    const dataUri = await takeScreenshot(videoEl);
    edit({ timestamp, image: dataUri });
  };

  const handleUnPauseVideo = async () => {
    const player = await PlayerFactory.getPlayer();
    player.play();
  };

  function handleSave() {
    const { content = '' } = note;
    if (content.trim()) {
      // Upsert note
      saveNote({ ...note, type: TYPE_VIDEO_NOTE });
      reset();
      // TODO: load count from state store
      StorageService.getStorage()
        .getNotes()
        .then(notes => {});
    }
  };

  const handleChange = value => {
    setNote({ content: value });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <MarkdownEditor
          disabled={disabled}
          content={note.content}
          placeholder={t('editor.placeholder')}
          onChange={handleChange}
          onFocus={handleFocus}
          onHandleUnPauseVideo={handleUnPauseVideo}
        />
      </Grid>
      {active && (
        <Grid item container alignItems="center">
          <Grid item xs={6}>
            <Grid container spacing={1}>
              <Grid item>
                {note.id ? (
                  <StyledStatus>{t('editor.statusExisting')}</StyledStatus>
                ) : (
                  <StyledStatus>{t('editor.statusNew')}</StyledStatus>
                )}
              </Grid>
              <Grid item>{secondsToTime(note.timestamp)}</Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container justify="flex-end" spacing={1}>
              <Grid item>
                <TextButton onClick={reset}>
                  {t('editor.cancelButton')}
                </TextButton>
              </Grid>
              <Grid item>
                <TextButton onClick={handleSave}>
                  {t('editor.saveButton')}
                </TextButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default Editor;
