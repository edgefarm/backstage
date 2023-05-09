import { useEntity } from '@backstage/plugin-catalog-react';
import { Grid } from '@material-ui/core';
import React from 'react';

export const NodeMetricsComponent = () => {
  const grafanaHost = 'https://grafana.edgefarm.dev';

  const { entity } = useEntity();
  const nodeName = entity.metadata.name;

  const dashboards = {
    'CPU Usage': `/d-solo/fb4a337e-b439-4b49-b99a-eb101cd17c55/edge-nodes?orgId=1&refresh=30s&theme=light&var-instance=${nodeName}&panelId=${2}`,
    'Load Average': `/d-solo/fb4a337e-b439-4b49-b99a-eb101cd17c55/edge-nodes?orgId=1&refresh=30s&theme=light&var-instance=${nodeName}&panelId=${43}`,
    'Memory Usage': `/d-solo/fb4a337e-b439-4b49-b99a-eb101cd17c55/edge-nodes?orgId=1&refresh=30s&theme=light&var-instance=${nodeName}&panelId=${4}`,
    'Memory Usage Gauge': `/d-solo/fb4a337e-b439-4b49-b99a-eb101cd17c55/edge-nodes?orgId=1&refresh=30s&theme=light&var-instance=${nodeName}&panelId=${5}`,
    'Hardware Temperature': `/d-solo/fb4a337e-b439-4b49-b99a-eb101cd17c55/edge-nodes?orgId=1&refresh=30s&theme=light&var-instance=${nodeName}&panelId=${41}`,
    'Disc I/O': `/d-solo/fb4a337e-b439-4b49-b99a-eb101cd17c55/edge-nodes?orgId=1&refresh=30s&theme=light&var-instance=${nodeName}&panelId=${6}`,
    'Disc Space Usage': `/d-solo/fb4a337e-b439-4b49-b99a-eb101cd17c55/edge-nodes?orgId=1&refresh=30s&theme=light&var-instance=${nodeName}&panelId=${7}`,
    'Network Received': `/d-solo/fb4a337e-b439-4b49-b99a-eb101cd17c55/edge-nodes?orgId=1&refresh=30s&theme=light&var-instance=${nodeName}&panelId=${8}`,
    'Network Transmitted': `/d-solo/fb4a337e-b439-4b49-b99a-eb101cd17c55/edge-nodes?orgId=1&refresh=30s&theme=light&var-instance=${nodeName}&panelId=${9}`,
  };

  return (
    <Grid container alignItems="stretch">
      {Object.entries(dashboards).map(([dashboardName, dashboardUrl]) => (
        <Grid item md={6}>
          <iframe
            title={dashboardName}
            src={`${grafanaHost}${dashboardUrl}`}
            width="450"
            height="200"
            frameBorder={0}
          />
        </Grid>
      ))}
    </Grid>
  );
};
