import { Grid } from '@material-ui/core';
import React from 'react';
import { EntityWarningContentComponent } from '../../warning';
import Metadata from './cards/Metadata';
import Rollouts from './cards/Deployments';
import { InfoCard } from '@backstage/core-components';

export const DetailsComponent = () => {
  return (
    <Grid container alignItems="stretch">
      <EntityWarningContentComponent />
      <Grid item xs={12} md={6}>
        <InfoCard title="Metadata" variant="gridItem">
          <Metadata />
        </InfoCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <Rollouts />
      </Grid>
    </Grid>
  );
};
