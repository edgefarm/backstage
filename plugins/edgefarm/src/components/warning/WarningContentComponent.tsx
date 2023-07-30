import {
  EntitySwitch,
  isOrphan,
  EntityOrphanWarning,
  hasCatalogProcessingErrors,
  EntityProcessingErrorsPanel,
  hasRelationWarnings,
  EntityRelationWarning,
} from '@backstage/plugin-catalog';
import { Grid } from '@material-ui/core';
import React from 'react';

export const EntityWarningContentComponent = () => {
  return (
    <>
      <EntitySwitch>
        <EntitySwitch.Case if={isOrphan}>
          <Grid item xs={12}>
            <EntityOrphanWarning />
          </Grid>
        </EntitySwitch.Case>
      </EntitySwitch>

      <EntitySwitch>
        <EntitySwitch.Case if={hasRelationWarnings}>
          <Grid item xs={12}>
            <EntityRelationWarning />
          </Grid>
        </EntitySwitch.Case>
      </EntitySwitch>

      <EntitySwitch>
        <EntitySwitch.Case if={hasCatalogProcessingErrors}>
          <Grid item xs={12}>
            <EntityProcessingErrorsPanel />
          </Grid>
        </EntitySwitch.Case>
      </EntitySwitch>
    </>
  );
};
