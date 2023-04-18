import { EntityLayout } from '@backstage/plugin-catalog';
import { ApplicationDetailsComponent } from '@internal/plugin-edgefarm';
import React from 'react';

export const applicationEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <ApplicationDetailsComponent />
    </EntityLayout.Route>
  </EntityLayout>
);
