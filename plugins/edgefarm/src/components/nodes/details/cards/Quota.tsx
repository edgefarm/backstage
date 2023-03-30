import { InfoCard, ItemCardGrid, ItemCardHeader, Table, TableColumn } from '@backstage/core-components'
import { BackstageTheme } from '@backstage/theme';
import { Card, CardMedia, CardContent, Container, Grid, makeStyles } from '@material-ui/core'
import React from 'react'
import QuotaItem from './QuotaItem'

const useStyles = makeStyles<BackstageTheme>(theme => ({
  tableWrapper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
}));

type Props = {}

const Quota = (props: Props) => {
  const classes = useStyles();

  const columns: TableColumn[] = [
    {
      title: 'Resource Type',
      field: 'type',
      highlight: true,
    },
    {
      title: 'Used',
      field: 'used',
    },
    {
      title: 'Limit',
      field: 'limit',
    },
  ];

  const tableData = [
    { type: 'CPU (Request)', used: '100', limit: '100' },
    { type: 'CPU (Limit)', used: '100', limit: '100' },
    { type: 'Memory (Request)', used: '100', limit: '100' },
    { type: 'Memory (Limit)', used: '100', limit: '100' },
  ]

  return (
    <InfoCard title="Quota" >
      <Grid container direction='row' spacing={0}>
        <Grid item xs={6} sm={6} lg={3}>
          <QuotaItem title="CPU" subtitle='Request' unit="core" limit={100} actual={Math.floor(Math.random() * 100)} />
        </Grid>
        <Grid item xs={6} sm={6} lg={3}>
          <QuotaItem title="Memory" subtitle='Request' unit="MiB" limit={100} actual={Math.floor(Math.random() * 100)} />
        </Grid>
        <Grid item xs={6} sm={6} lg={3}>
          <QuotaItem title="CPU" subtitle='Limit' unit="core" limit={100} actual={Math.floor(Math.random() * 100)} />
        </Grid>
        <Grid item xs={6} sm={6} lg={3}>
          <QuotaItem title="Memory" subtitle='Limit' unit="MiB" limit={100} actual={Math.floor(Math.random() * 100)} />
        </Grid>
      </Grid>
      <Container className={classes.tableWrapper}>
      <Table
        options={{ paging: false, padding: 'dense', toolbar: false , sorting: false}}
        data={tableData}
        columns={columns}
        title="Backstage Table"
      />
      </Container>
    </InfoCard>
  )
}

export default Quota
