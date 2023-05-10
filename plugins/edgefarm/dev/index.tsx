import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { edgefarmPlugin } from '../src/plugin';

createDevApp()
  .registerPlugin(edgefarmPlugin)
  .addPage({
    element: <>Root Page</>,
    title: 'Root Page',
    path: '/edgefarm',
  })
  .render();
