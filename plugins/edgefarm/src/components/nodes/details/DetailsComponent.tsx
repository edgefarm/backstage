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

type Props = {}

export const NodeDetailsComponent = (props: Props) => {
  const config = useApi(configApiRef);
  const backendUrl = config.getString('backend.baseUrl');
  const { entity } = useEntity();
  const annotations = entity.metadata.annotations ?? {};
  const clusterName = annotations['edgefarm.io/cluster'] ?? '';
  const nodeName = entity.metadata.name;

  const [nodeDetails, setNodeDetails] = useState(null);
  useEffect(() => {
    const getMetadata = async () => {
      const response = await fetch(`${backendUrl}/api/edgefarm/${clusterName}/nodes/${nodeName}`);
      const payload = await response.json();
      setNodeDetails(payload);
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
            <Metadata nodeDetails={nodeDetails} />
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
