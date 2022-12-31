import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Grid } from '@material-ui/core';
import {
  BookmarkBorderOutlined as BookmarkIcon,
  Sync as SyncIcon,
  OpenInNew as OpenInNewIcon,
  FavoriteBorder as SponsorIcon
} from '@material-ui/icons';
import { IconButton } from '@yi-note/common/components';
import { useSyncNotes, useLoadScreenshots } from '../../../hooks';

export const StyledIconContainer = styled(Grid)`
  padding-right: 5px;
`;

const Toolbar = () => {
  const { t } = useTranslation(['notesView', 'bookmark']);
  const { id } = useStoreState(state => state.page.data);
  const {
    page: { bookmarkPage, removePage },
    alerts: { show: showAlerts }
  } = useStoreActions(actions => actions);
  const { platform, hasNotesToSync, getNotesToSync } = useSyncNotes();
  const { loadScreenshots } = useLoadScreenshots();

  const handleRemovePage = () => {
    showAlerts({
      content: t('bookmark:remove.alert'),
      onConfirm: removePage.bind(null, id)
    });
  };

  const handleOpenInDetailPage = () => {
    browser.runtime.sendMessage({
      action: 'open-options',
      data: { action: 'open-page', data: id }
    });
  };

  const handleSyncNotes = async () => {
    const notesToSync = await getNotesToSync();
    loadScreenshots(notesToSync);
  };

  return (
    <Grid container direction="row" alignItems="center">
      {!id ? (
        <StyledIconContainer item>
          <IconButton
            tooltip={t('bookmark:add.tooltip')}
            onClick={bookmarkPage}
          >
            <BookmarkIcon />
          </IconButton>
        </StyledIconContainer>
      ) : (
        <StyledIconContainer item>
          <IconButton
            color="red"
            tooltip={t('bookmark:remove.tooltip')}
            onClick={handleRemovePage}
          >
            <BookmarkIcon />
          </IconButton>
        </StyledIconContainer>
      )}
      {hasNotesToSync && (
        <StyledIconContainer item>
          <IconButton
            tooltip={t('sync.tooltip', { platform })}
            onClick={handleSyncNotes}
          >
            <SyncIcon />
          </IconButton>
        </StyledIconContainer>
      )}
      {id && (
        <StyledIconContainer item>
          <IconButton
            tooltip={t('detail.tooltip')}
            onClick={handleOpenInDetailPage}
          >
            <OpenInNewIcon />
          </IconButton>
        </StyledIconContainer>
      )}
    </Grid>
  );
};

export default Toolbar;
