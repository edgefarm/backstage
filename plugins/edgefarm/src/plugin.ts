import { createPlugin } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const edgefarmPlugin = createPlugin({
  id: 'edgefarm',
  routes: {
    root: rootRouteRef,
  },
});
