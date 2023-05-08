import { EntityLayout } from '@backstage/plugin-catalog';
import { ReleaseDetailsComponent } from '@internal/plugin-edgefarm';
import React from 'react';

export const releaseEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <ReleaseDetailsComponent />
    </EntityLayout.Route>
  </EntityLayout>
);
