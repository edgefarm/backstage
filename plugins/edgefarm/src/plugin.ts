import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const edgefarmPlugin = createPlugin({
  id: 'edgefarm',
  routes: {
    root: rootRouteRef,
  },
});

export const EdgefarmPage = edgefarmPlugin.provide(
  createRoutableExtension({
    name: 'EdgefarmPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
