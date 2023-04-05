import {
  Content,
  MarkdownContent,
  Page,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { SearchContextProvider } from '@backstage/plugin-search-react';
import React from 'react';
import { useApi, fetchApiRef } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';

export const GettingStartedPage = () => {
  const { fetch } = useApi(fetchApiRef);
  const { value, loading, error } = useAsync(async (): Promise<any> => {
    const response = await fetch(
      'https://raw.githubusercontent.com/edgefarm/edgefarm/beta/docs/gettingstarted/index.md',
    );
    if (response.status >= 400) {
      throw new Error('Error loading getting started page');
    }

    return response.text();
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <MarkdownContent content={value} dialect="gfm" />
        </Content>
      </Page>
    </SearchContextProvider>
  );
};
