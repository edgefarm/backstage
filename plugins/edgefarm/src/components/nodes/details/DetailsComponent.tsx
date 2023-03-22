import { InfoCard } from '@backstage/core-components'
import { Grid } from '@material-ui/core'
import React from 'react'
import { EntityWarningContentComponent } from '../../warning'
import Workload from './cards/Workload'
import { EntityAboutCard } from "@backstage/plugin-catalog";
import Metadata from './cards/Metadata'
import ApplicationList from './cards/ApplicationList'
import NetworkList from './cards/NetworkList'

type Props = {}

export const NodeDetailsComponent = (props: Props) => {
  return (
    <Grid container alignItems="stretch">
      <EntityWarningContentComponent />
      <Grid item lg={12} md={12} direction="row" >
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
      <Grid container lg={12} md={12} >
        <Grid item xs={12} md={6}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard title="Metadata" variant="gridItem" >
            <Metadata />
          </InfoCard>
        </Grid>
      </Grid>
      <Grid container lg={12} md={12} >
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
