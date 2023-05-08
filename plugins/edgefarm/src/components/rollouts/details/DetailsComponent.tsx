import { Grid } from '@material-ui/core';
import React from 'react';
import { EntityWarningContentComponent } from '../../warning';
import StatusList from './cards/StatusList';
import Details from './cards/Details';

export const DetailsComponent = () => {
  return (
    <Grid container alignItems="stretch">
      <EntityWarningContentComponent />
      <Grid item xs={12}>
        <Details />
      </Grid>
      <Grid item xs={12}>
        <StatusList />
      </Grid>
    </Grid>
  );
};
