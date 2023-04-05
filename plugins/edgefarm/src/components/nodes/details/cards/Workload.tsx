import { GaugeCard } from '@backstage/core-components';
import React from 'react';

const Workload = (props: { title: string }) => {
  return <GaugeCard inverse title={props.title} progress={Math.random()} />;
};

export default Workload;
