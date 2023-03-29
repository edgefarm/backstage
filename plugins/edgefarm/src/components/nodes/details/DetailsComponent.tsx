import { InfoCard } from '@backstage/core-components'
import { Grid } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { EntityWarningContentComponent } from '../../warning'
import Workload from './cards/Workload'
import { EntityAboutCard } from "@backstage/plugin-catalog";
import Metadata from './cards/Metadata'
import ApplicationList from './cards/ApplicationList'
import NetworkList from './cards/NetworkList'
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { useEntity } from "@backstage/plugin-catalog-react";

export class NodeDetails {
    Labels: Record<string, string> = {}
    Annotations: Record<string, string>  = {}
    Name?: string;
    OsImage?: string
    KernelVersion?: string
    ContainerRuntimeVersion?: string
    KubeletVersion?: string
    KubeProxyVersion?: string
    Architecture?: string
    isOnline: boolean = false

    constructor(payload: any) {
        this.Labels = payload.Labels
        this.Annotations = payload.Annotations
        this.Name = payload.Name
        this.OsImage = payload.OsImage
        this.KernelVersion = payload.KernelVersion
        this.ContainerRuntimeVersion = payload.ContainerRuntimeVersion
        this.KubeletVersion = payload.KubeletVersion
        this.KubeProxyVersion = payload.KubeProxyVersion
        this.Architecture = payload.Architecture
        this.isOnline = payload.isOnline
    }
}

export const NodeDetailsComponent = () => {
  const config = useApi(configApiRef);
  const backendUrl = config.getString('backend.baseUrl');
  const { entity } = useEntity();
  const annotations = entity.metadata.annotations ?? {};
  const clusterName = annotations['edgefarm.io/cluster'] ?? '';
  const nodeName = entity.metadata.name;

  const [nodeDetails, setNodeDetails] = useState<NodeDetails|null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getMetadata = async () => {
      const response = await fetch(`${backendUrl}/api/edgefarm/${clusterName}/nodes/${nodeName}`);
      const payload = await response.json();
      setNodeDetails(new NodeDetails(payload));
      setIsLoading(false);
    }
    getMetadata()
  }, [])


  return (
    <Grid container alignItems="stretch">
      <EntityWarningContentComponent />
      <Grid item lg={12} md={12} >
        <Grid container direction="row" justifyContent="center">
          <Grid item >
            <Workload title="Memory" />
          </Grid>
          <Grid item >
            <Workload title="CPU" />
          </Grid>
          <Grid item >
            <Workload title="Disk Usage" />
          </Grid>
        </Grid>
      </Grid>
      <Grid container >
        <Grid item xs={12} md={6}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard title="Metadata" variant="gridItem" >
            <Metadata nodeDetails={nodeDetails} isLoading={isLoading}/>
          </InfoCard>
        </Grid>
      </Grid>
      <Grid container >
        <Grid item xs={12} md={6}>
          <ApplicationList />
        </Grid>
        <Grid item xs={12} md={6}>
          <NetworkList />
        </Grid>
      </Grid>
    </Grid >
  )
}
