import { InfoCard, TrendLine } from '@backstage/core-components'
import { Grid } from '@material-ui/core'
import React from 'react'

type Props = {}

export const NodeMetricsComponent = (props: Props) => {

  return (
    <Grid container alignItems="stretch">
      <Grid item xs={12}>
        <InfoCard title='Memory usage'>
          <TrendLine data={randData()} title="Trend over time" />
        </InfoCard>
      </Grid>
      <Grid item xs={12}>
        <InfoCard title='CPU usage'>
          <TrendLine data={randData()} title="Trend over time" />
        </InfoCard>
      </Grid>
      <Grid item xs={12}>
        <InfoCard title='Disk usage'>
          <TrendLine data={randDiskData()} title="Trend over time" />
        </InfoCard>
      </Grid>
    </Grid >
  )
}

const randData = () => {
  return Array.from({length: 100}, () => Math.floor(Math.random() * 100)/100);
}

const randDiskData = () => {
  const data: number[] = []
  while (data.length < 100) {
    if(data.length === 0){
      data.push(Math.floor(Math.random() * 100)/100)
    }
    const prev = data[data.length - 1]
    let value = 0
    if (Math.random() > 0.7) {
      value = prev + Math.floor(Math.random() * 100)/100;
    } else if(Math.random() < 0.3) {
      value = prev - Math.floor(Math.random() * 100)/100
    } else {
      value = prev
    }

    if (value > 1)  {
      data.push(1)
    } else if (value < 0) {
      data.push(0)
    } else {
      data.push(value)
    }
  }

  return data
}
