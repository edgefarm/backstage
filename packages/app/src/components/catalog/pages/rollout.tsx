import { EntityLayout } from '@backstage/plugin-catalog';
import { RolloutDetailsComponent } from '@internal/plugin-edgefarm';
import React from 'react';

export const rolloutEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <RolloutDetailsComponent />
    </EntityLayout.Route>
  </EntityLayout>
);
