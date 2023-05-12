import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { EntityWarningContentComponent } from '../../warning';
import SystemChildEntitiesLinkList from '../../shared/SystemChildEntitiesLinkList';
import { EntityAboutCard } from '@backstage/plugin-catalog';
import { EntityCatalogGraphCard } from '@backstage/plugin-catalog-graph';
import { InfoCard } from '@backstage/core-components';
import Metadata from './cards/Metadata';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ApplicationDetails } from '@internal/plugin-edgefarm-backend';
import Components from './cards/Components';

export const DetailsComponent = () => {
  const config = useApi(configApiRef);
  const backendUrl = config.getString('backend.baseUrl');
  const { entity } = useEntity();
  const annotations = entity.metadata.annotations ?? {};
  const clusterName = annotations['edgefarm.io/cluster'] ?? '';
  const appName = entity.metadata.name;
  const systemName: string =
    (entity.spec?.system as string).slice(
      -(entity.spec?.system as string).lastIndexOf('/') + 3,
    ) ?? '';

  const [details, setDetails] = useState<ApplicationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getAppDDetails = async () => {
      const response = await fetch(
        `${backendUrl}/api/edgefarm/${clusterName}/applications/${systemName.toLowerCase()}/${appName}`,
      );
      if (response.status === 200) {
        const payload = await response.json();
        setDetails(payload as ApplicationDetails);
      }
      setIsLoading(false);
    };
    getAppDDetails();
  }, [backendUrl, clusterName, appName, systemName]);

  return (
    <Grid container alignItems="stretch">
      <EntityWarningContentComponent />

      <Grid item xs={12} md={6}>
        <InfoCard title="Metadata" variant="gridItem">
          <Metadata details={details} isLoading={isLoading} />
        </InfoCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <Components details={details} isLoading={isLoading} />
      </Grid>
      <Grid item xs={12} md={6}>
        <EntityAboutCard variant="gridItem" />
      </Grid>
      <Grid item xs={12} md={6}>
        <EntityCatalogGraphCard variant="gridItem" height={400} />
      </Grid>

      <Grid item xs={12} md={6}>
        <SystemChildEntitiesLinkList
          type="Node"
          title="Nodes"
          createUrl="/create/templates/default/edgefarm-node-add"
          emptyTitle="No nodes found for this application"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <SystemChildEntitiesLinkList
          type="network"
          title="Networks"
          createUrl="/create/templates/default/edgefarm-network-add"
          emptyTitle="No networks found for this application"
        />
      </Grid>
    </Grid>
  );
};
