import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { edgefarmPlugin, EdgefarmPage } from '../src/plugin';

createDevApp()
  .registerPlugin(edgefarmPlugin)
  .addPage({
    element: <EdgefarmPage />,
    title: 'Root Page',
    path: '/edgefarm'
  })
  .render();
