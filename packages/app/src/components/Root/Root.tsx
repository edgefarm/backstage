import React, { PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/core';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import {
  Settings as SidebarSettings,
  UserSettingsSignInAvatar,
} from '@backstage/plugin-user-settings';
import {
  Sidebar,
  sidebarConfig,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarPage,
  SidebarSpace,
  useSidebarOpenState,
  Link,
  SidebarSubmenu,
  SidebarSubmenuItem,
} from '@backstage/core-components';
import MenuIcon from '@material-ui/icons/Menu';
import DeviceIcon from '@material-ui/icons/Memory';
import NetworkIcon from '@material-ui/icons/DeviceHub';
import ApplicationsIcon from '@material-ui/icons/SettingsApplications';
import GettingStartedIcon from '@material-ui/icons/PlayArrowOutlined';
// import DashboardIcon from '@material-ui/icons/DashboardTwoTone';
import CatalogIcon from '@material-ui/icons/ViewList';
import LocationIcon from '@material-ui/icons/Place';
import ReleaseIcon from '@material-ui/icons/SystemUpdate';

const useSidebarLogoStyles = makeStyles({
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 24,
  },
});

const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useSidebarOpenState();

  return (
    <div className={classes.root}>
      <Link to="/" underline="none" className={classes.link} aria-label="Home">
        {isOpen ? <LogoFull /> : <LogoIcon />}
      </Link>
    </div>
  );
};

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />
      {/* <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
        <SidebarSearchModal />
      </SidebarGroup> */}
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        {/* Global nav, not org-specific */}
        <SidebarItem
          icon={GettingStartedIcon}
          to="gettingstarted"
          text="Getting Started"
        />
        {/* <SidebarItem icon={DashboardIcon} to="dashboard" text="Dashboard" /> */}
        <SidebarDivider />
        <SidebarItem
          icon={DeviceIcon}
          to="catalog?filters[kind]=Component&filters[type]=Device"
          text="Devices"
        />

        <SidebarItem
          icon={ApplicationsIcon}
          to="catalog?filters[kind]=Component&filters[type]=Application"
          text="Applications"
        />
        <SidebarItem
          icon={NetworkIcon}
          to="catalog?filters[kind]=Component&filters[type]=Network"
          text="Networks"
        />
        <SidebarItem
          icon={ReleaseIcon}
          to="catalog?filters[kind]=Component&filters[type]=Release"
          text="Firmware"
        />
        <SidebarDivider />
        <SidebarItem icon={CatalogIcon} text="Others">
          <SidebarSubmenu>
            <SidebarSubmenuItem
              icon={LocationIcon}
              to="catalog?filters[kind]=Location"
              title="Locations"
            />
          </SidebarSubmenu>
        </SidebarItem>

        {/* <SidebarItem icon={HomeIcon} to="catalog" text="Home" /> */}
        {/* <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" /> */}
        {/* <SidebarItem icon={LibraryBooks} to="docs" text="Docs" /> */}
        <SidebarDivider />
        <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
        {/* End global nav */}
        {/* <SidebarScrollWrapper>
          <SidebarItem icon={MapIcon} to="tech-radar" text="Tech Radar" />
        </SidebarScrollWrapper> */}
      </SidebarGroup>
      <SidebarSpace />
      <SidebarDivider />
      <SidebarGroup
        label="Settings"
        icon={<UserSettingsSignInAvatar />}
        to="/settings"
      >
        <SidebarSettings />
      </SidebarGroup>
    </Sidebar>
    {children}
  </SidebarPage>
);
