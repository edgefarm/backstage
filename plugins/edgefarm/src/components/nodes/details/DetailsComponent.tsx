import { InfoCard } from '@backstage/core-components';
import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { EntityWarningContentComponent } from '../../warning';
import { EntityAboutCard } from '@backstage/plugin-catalog';
import Metadata from './cards/Metadata';
import ApplicationList from './cards/ApplicationList';
import SystemChildEntitiesLinkList from './cards/SystemChildEntitiesLinkList';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import Quota from './cards/Quota';
import { EntityCatalogGraphCard } from '@backstage/plugin-catalog-graph';

export class NodeDetails {
  Labels: Record<string, string> = {};
  Annotations: Record<string, string> = {};
  Name?: string;
  OsImage?: string;
  KernelVersion?: string;
  ContainerRuntimeVersion?: string;
  KubeletVersion?: string;
  KubeProxyVersion?: string;
  Architecture?: string;
  isOnline: boolean = false;

  constructor(payload: any) {
    this.Labels = payload.Labels;
    this.Annotations = payload.Annotations;
    this.Name = payload.Name;
    this.OsImage = payload.OsImage;
    this.KernelVersion = payload.KernelVersion;
    this.ContainerRuntimeVersion = payload.ContainerRuntimeVersion;
    this.KubeletVersion = payload.KubeletVersion;
    this.KubeProxyVersion = payload.KubeProxyVersion;
    this.Architecture = payload.Architecture;
    this.isOnline = payload.isOnline;
  }
}

export const NodeDetailsComponent = () => {
  const config = useApi(configApiRef);
  const backendUrl = config.getString('backend.baseUrl');
  const { entity } = useEntity();
  const annotations = entity.metadata.annotations ?? {};
  const clusterName = annotations['edgefarm.io/cluster'] ?? '';
  const nodeName = entity.metadata.name;

  const [nodeDetails, setNodeDetails] = useState<NodeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getMetadata = async () => {
      const response = await fetch(
        `${backendUrl}/api/edgefarm/${clusterName}/nodes/${nodeName}`,
      );
      if (response.status === 200) {
        const payload = await response.json();
        setNodeDetails(new NodeDetails(payload));
      }
      setIsLoading(false);
    };
    getMetadata();
  }, [backendUrl, clusterName, nodeName]);

  return (
    <Grid container alignItems="stretch">
      <EntityWarningContentComponent />

      <Grid item xs={12} md={6}>
        <InfoCard title="Metadata" variant="gridItem">
          <Metadata nodeDetails={nodeDetails} isLoading={isLoading} />
        </InfoCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid item xs={12}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid item xs={12}>
          <EntityCatalogGraphCard variant="gridItem" height={400} />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <InfoCard title="Quota" variant="gridItem">
          <Quota />
        </InfoCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <SystemChildEntitiesLinkList type="application" title="Applications" />
      </Grid>
      <Grid item xs={12} md={6}>
        <SystemChildEntitiesLinkList type="network" title="Networks" />
      </Grid>
    </Grid>
  );
};
