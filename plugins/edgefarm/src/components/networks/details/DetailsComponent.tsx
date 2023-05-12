import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { EntityWarningContentComponent } from '../../warning';
import SystemChildEntitiesLinkList from '../../shared/SystemChildEntitiesLinkList';
import { EntityAboutCard } from '@backstage/plugin-catalog';
import { EntityCatalogGraphCard } from '@backstage/plugin-catalog-graph';
import { InfoCard } from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { NetworkDetails } from '@internal/plugin-edgefarm-backend';
import Subnetworks from './cards/Subnetworks';
import Streams from './cards/Streams';
import Users from './cards/Users';
import Metadata from './cards/Metadata';
import { parseEntityRef } from '@backstage/catalog-model';

export const DetailsComponent = () => {
  const config = useApi(configApiRef);
  const backendUrl = config.getString('backend.baseUrl');
  const { entity } = useEntity();
  const annotations = entity.metadata.annotations ?? {};
  const clusterName = annotations['edgefarm.io/cluster'] ?? '';
  const networkName = entity.metadata.name;
  const systemName: string =
    parseEntityRef(entity.spec?.system as string).name ?? '';

  const [details, setDetails] = useState<NetworkDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getNetworkDetails = async () => {
      const response = await fetch(
        `${backendUrl}/api/edgefarm/${clusterName}/networks/${systemName.toLowerCase()}/${networkName}`,
      );
      if (response.status === 200) {
        const payload = await response.json();
        setDetails(payload as NetworkDetails);
      }
      setIsLoading(false);
    };
    getNetworkDetails();
  }, [backendUrl, clusterName, networkName, systemName]);

  return (
    <Grid container alignItems="stretch">
      <EntityWarningContentComponent />
      <Grid item xs={12} md={6}>
        <InfoCard title="Metadata" variant="gridItem">
          <Metadata details={details} />
        </InfoCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <Subnetworks items={details?.subnetworks ?? []} isLoading={isLoading} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Streams items={details?.streams ?? []} isLoading={isLoading} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Users items={details?.users ?? []} isLoading={isLoading} />
      </Grid>
      <Grid item xs={12} md={6}>
        <EntityAboutCard variant="gridItem" />
      </Grid>
      <Grid item xs={12} md={6}>
        <EntityCatalogGraphCard variant="gridItem" height={400} />
      </Grid>

      <Grid item xs={12} md={6}>
        <SystemChildEntitiesLinkList
          type="application"
          title="Applications"
          createUrl="/create/templates/default/edgefarm-application-add"
          emptyTitle="No applications found for this network"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <SystemChildEntitiesLinkList
          type="Node"
          title="Nodes"
          createUrl="/create/templates/default/edgefarm-node-add"
          emptyTitle="No nodes found for this network"
        />
      </Grid>
    </Grid>
  );
};
