import { Grid } from '@material-ui/core';
import React from 'react';
import { EntityWarningContentComponent } from '../../warning';
import SystemChildEntitiesLinkList from '../../shared/SystemChildEntitiesLinkList';
import { EntityAboutCard } from '@backstage/plugin-catalog';
import { EntityCatalogGraphCard } from '@backstage/plugin-catalog-graph';
import { InfoCard } from '@backstage/core-components';

export const DetailsComponent = () => {
  return (
    <Grid container alignItems="stretch">
      <EntityWarningContentComponent />
      <Grid item xs={12} md={6}>
        <InfoCard title="Metadata" variant="gridItem">
          Schere, Stein, Papier, Echse, Spock?
        </InfoCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid item xs={12}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid item xs={12}>
          <EntityCatalogGraphCard variant="gridItem" height={400} />
        </Grid>
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
          type="node"
          title="Nodes"
          createUrl="/create/templates/default/edgefarm-node-add"
          emptyTitle="No nodes found for this network"
        />
      </Grid>
    </Grid>
  );
};
