import { EntityLayout } from '@backstage/plugin-catalog';
import { NetworkDetailsComponent } from '@internal/plugin-edgefarm';
import React from 'react';

export const networkEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <NetworkDetailsComponent />
    </EntityLayout.Route>
  </EntityLayout>
);
