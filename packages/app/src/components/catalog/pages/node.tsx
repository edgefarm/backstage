import { EntityLayout } from '@backstage/plugin-catalog';
import {
  NodeDetailsComponent,
  NodeMetricsComponent,
} from '@internal/plugin-edgefarm';
import React from 'react';

export const nodeEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <NodeDetailsComponent />
    </EntityLayout.Route>
    <EntityLayout.Route path="/metrics" title="Metrics">
      <NodeMetricsComponent />
    </EntityLayout.Route>
  </EntityLayout>
);
