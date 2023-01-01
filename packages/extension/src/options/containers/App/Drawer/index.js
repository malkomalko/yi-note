import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  Grid,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Hidden,
  Drawer
} from '@material-ui/core';
import {
  Bookmarks as BookmarksIcon,
  Settings as SettingsIcon,
  Help as HelpIcon
} from '@material-ui/icons';
import {
  APP_ID,
  FAQ_URL
} from '@yi-note/common/constants';
import { getVersion } from '@yi-note/common/utils';
import { drawerWidth, headerHeight } from '../constants';

const version = getVersion();

const StyledNav = styled.nav`
  width: ${drawerWidth}px;
`;

const StyledDrawer = styled(({ ...rest }) => (
  <Drawer classes={{ paper: 'paper' }} {...rest} />
))`
  & .paper {
    width: ${drawerWidth}px;
  }
`;

const StyledDrawerHeader = styled.div`
  height: ${headerHeight}px;
  display: flex;
  align-items: center;
  padding-left: 20px;
`;

const ResponsiveDrawer = () => {
  const { t } = useTranslation(['options']);
  const history = useHistory();
  const { pathname } = useLocation();
  const containerRef = useRef(null);
  const { open } = useStoreState(state => state.app.drawer);
  const { setOpen } = useStoreActions(actions => actions.app.drawer);

  useEffect(() => {
    containerRef.current = document.getElementById(APP_ID);
  }, []);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const drawer = (
    <>
      <StyledDrawerHeader>
        <Grid container direction="row" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h6">{t('appName')}</Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="body2"
              color="textSecondary"
            >{`v${version}`}</Typography>
          </Grid>
        </Grid>
      </StyledDrawerHeader>
      <Divider />
      <List>
        {[
          {
            label: t('bookmarks.title'),
            path: '/',
            icon: <BookmarksIcon />,
            onClick: () => history.push('/')
          },
          {
            label: t('settings.title'),
            path: '/settings',
            icon: <SettingsIcon />,
            onClick: () => history.push('/settings')
          }
        ].map(item => (
          <ListItem
            button
            key={item.label}
            onClick={item.onClick}
            selected={pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <ListItem button onClick={() => window.open(FAQ_URL, '_blank')}>
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary={t('faq')} />
        </ListItem>
      </List>
      <Divider />
    </>
  );

  return (
    <StyledNav>
      <Hidden smUp>
        <StyledDrawer
          variant="temporary"
          container={containerRef.current}
          open={open}
          onClose={handleDrawerToggle}
        >
          {drawer}
        </StyledDrawer>
      </Hidden>
      <Hidden xsDown>
        <StyledDrawer variant="permanent" open>
          {drawer}
        </StyledDrawer>
      </Hidden>
    </StyledNav>
  );
};

export default ResponsiveDrawer;
