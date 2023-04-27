import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

export class NodeDetails {
  Hostname: string;
  IPAddress: string;

  constructor(payload: any) {
    this.Hostname = payload.Hostname;
    this.IPAddress = payload.IPAddress;
  }
}

export const NodeMetricsComponent = () => {
  const grafanaHost = 'http://localhost:3001';
  const promPort = 9100;

  const config = useApi(configApiRef);
  const backendUrl = config.getString('backend.baseUrl');
  const { entity } = useEntity();
  const annotations = entity.metadata.annotations ?? {};
  const clusterName = annotations['edgefarm.io/cluster'] ?? '';
  const nodeName = entity.metadata.name;

  const [dashboards, setDashboards] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getMetadata = async () => {
      const response = await fetch(
        `${backendUrl}/api/edgefarm/${clusterName}/nodes/${nodeName}`,
      );
      if (response.status === 200) {
        const payload = await response.json();
        setDashboards({
          'CPU Usage': `/d-solo/MstMxWs4z/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=default&var-instance=${payload.IPAddress}:${promPort}&theme=light&panelId=2`,
          'Load Average': `/d-solo/MstMxWs4z/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=default&var-instance=${payload.IPAddress}:${promPort}&theme=light&panelId=3`,
          'Memory Usage': `/d-solo/MstMxWs4z/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=default&var-instance=${payload.IPAddress}:${promPort}&theme=light&panelId=4`,
          'Memory Usage Gauge': `/d-solo/MstMxWs4z/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=default&var-instance=${payload.IPAddress}:${promPort}&theme=light&panelId=5`,
          'Disc I/O': `/d-solo/MstMxWs4z/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=default&var-instance=${payload.IPAddress}:${promPort}&theme=light&panelId=6`,
          'Disc Space Usage': `/d-solo/MstMxWs4z/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=default&var-instance=${payload.IPAddress}:${promPort}&theme=light&panelId=7`,
          'Network Received': `/d-solo/MstMxWs4z/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=default&var-instance=${payload.IPAddress}:${promPort}&theme=light&panelId=8`,
          'Network Transmitted': `/d-solo/MstMxWs4z/node-exporter-nodes?orgId=1&refresh=30s&var-datasource=default&var-instance=${payload.IPAddress}:${promPort}&theme=light&panelId=9`,
        });
      }
      setIsLoading(false);
    };
    getMetadata();
  }, [backendUrl, clusterName, nodeName, promPort]);

  if (isLoading) return <div>Loading...</div>;

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
