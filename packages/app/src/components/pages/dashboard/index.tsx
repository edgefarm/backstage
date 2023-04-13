import { Content, Header, Page } from '@backstage/core-components';
import { SearchContextProvider } from '@backstage/plugin-search-react';
import React from 'react';

export const DashboardPage = () => {
  /* We will shortly compose a pretty homepage here. */
  return (
    <SearchContextProvider>
      <Page themeId="home">
        <Header title="Dashboard" subtitle="Overview your EdgeFarm" />
        <Content>
          <p>Put your content here</p>
        </Content>
      </Page>
    </SearchContextProvider>
  );
};
