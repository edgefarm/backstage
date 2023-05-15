import { useEntity } from '@backstage/plugin-catalog-react';
import { Grid } from '@material-ui/core';
import React from 'react';

export const NodeMetricsComponent = () => {
  const grafanaHost = 'https://grafana.edgefarm.dev';

  const { entity } = useEntity();
  const nodeName = entity.metadata.name;

  const dashboards = {
    'CPU Usage Gauge': `/d-solo/9041c477-8dd9-4bb7-88ae-d35dee62cbfb/edge-nodes?orgId=1&refresh=5s&theme=light&var-instance=${nodeName}&panelId=${14}`,
    'CPU Usage': `/d-solo/9041c477-8dd9-4bb7-88ae-d35dee62cbfb/edge-nodes?orgId=1&refresh=5s&theme=light&var-instance=${nodeName}&panelId=${2}`,
    'Load Average': `/d-solo/9041c477-8dd9-4bb7-88ae-d35dee62cbfb/edge-nodes?orgId=1&refresh=5s&theme=light&var-instance=${nodeName}&panelId=${43}`,
    'Memory Usage': `/d-solo/9041c477-8dd9-4bb7-88ae-d35dee62cbfb/edge-nodes?orgId=1&refresh=5s&theme=light&var-instance=${nodeName}&panelId=${4}`,
    'Memory Usage Gauge': `/d-solo/9041c477-8dd9-4bb7-88ae-d35dee62cbfb/edge-nodes?orgId=1&refresh=5s&theme=light&var-instance=${nodeName}&panelId=${5}`,
    'Hardware Temperature': `/d-solo/9041c477-8dd9-4bb7-88ae-d35dee62cbfb/edge-nodes?orgId=1&refresh=5s&theme=light&var-instance=${nodeName}&panelId=${41}`,
    'Disc I/O': `/d-solo/9041c477-8dd9-4bb7-88ae-d35dee62cbfb/edge-nodes?orgId=1&refresh=5s&theme=light&var-instance=${nodeName}&panelId=${6}`,
    'Disc Space Usage': `/d-solo/9041c477-8dd9-4bb7-88ae-d35dee62cbfb/edge-nodes?orgId=1&refresh=5s&theme=light&var-instance=${nodeName}&panelId=${7}`,
    'Network Received': `/d-solo/9041c477-8dd9-4bb7-88ae-d35dee62cbfb/edge-nodes?orgId=1&refresh=5s&theme=light&var-instance=${nodeName}&panelId=${8}`,
    'Network Transmitted': `/d-solo/9041c477-8dd9-4bb7-88ae-d35dee62cbfb/edge-nodes?orgId=1&refresh=5s&theme=light&var-instance=${nodeName}&panelId=${9}`,
  };

  return (
    <Grid container alignItems="stretch">
      {Object.entries(dashboards).map(([dashboardName, dashboardUrl]) => (
        <Grid item md={6}>
          <iframe
            title={dashboardName}
            src={`${grafanaHost}${dashboardUrl}`}
            width="600"
            height="200"
            frameBorder={0}
          />
        </Grid>
      ))}
    </Grid>
  );
};
