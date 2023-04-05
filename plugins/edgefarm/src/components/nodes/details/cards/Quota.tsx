import { Table, TableColumn, WarningPanel } from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { BackstageTheme } from '@backstage/theme';
import {
  CircularProgress,
  Container,
  Grid,
  makeStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import QuotaItem from './QuotaItem';
import { useEntity } from '@backstage/plugin-catalog-react';
import { NodeQuota } from '@internal/plugin-edgefarm-backend';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  tableWrapper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
}));

const Quota = () => {
  const classes = useStyles();

  const { entity } = useEntity();
  const nodeName = entity.metadata.name;

  const config = useApi(configApiRef);
  const backendUrl = config.getString('backend.baseUrl');
  const annotations = entity.metadata.annotations ?? {};
  const clusterName = annotations['edgefarm.io/cluster'] ?? '';

  const [quota, setQuota] = useState<NodeQuota | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getQuota = async () => {
      const response = await fetch(
        `${backendUrl}/api/edgefarm/${clusterName}/nodes/${nodeName}/quota`,
      );
      if (response.status === 200) {
        const payload = await response.json();
        setQuota(payload as NodeQuota);
      }
      setIsLoading(false);
    };
    getQuota();
  });

  if (isLoading) return <CircularProgress />;

  if (!quota)
    return (
      <WarningPanel
        title="Data is missing"
        message="We were unable to find any quota data for this node."
      />
    );

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
      title: 'Max',
      field: 'max',
    },
  ];

  const tableData = [
    {
      type: 'CPU (Request)',
      used: `${quota.cpu.request.value}${quota.cpu.request.unit}`,
      max: `${quota!.cpu.allocatable?.value}${quota.cpu.allocatable?.unit}`,
    },
    {
      type: 'CPU (Limit)',
      used: `${quota.cpu.limit.value}${quota.cpu.limit.unit}`,
      max: `${quota!.cpu.allocatable?.value}${quota.cpu.allocatable?.unit}`,
    },
    {
      type: 'Memory (Request)',
      used: `${quota.memory.request.value}${quota.memory.request.unit}`,
      max: `${quota!.memory.allocatable?.value}${
        quota.memory.allocatable?.unit
      }`,
    },
    {
      type: 'Memory (Limit)',
      used: `${quota.memory.limit.value}${quota.memory.limit.unit}`,
      max: `${quota!.memory.allocatable?.value}${
        quota.memory.allocatable?.unit
      }`,
    },
  ];

  return (
    <>
      <Grid container direction="row" spacing={0}>
        <Grid item xs={6} sm={6} lg={3}>
          <QuotaItem
            title="CPU"
            subtitle="Request"
            unit={quota!.cpu.allocatable?.unit!}
            value={quota.cpu.allocatable?.value!}
            limit={quota!.cpu.allocatable?.raw!}
            actual={quota.cpu.request.raw!}
          />
        </Grid>
        <Grid item xs={6} sm={6} lg={3}>
          <QuotaItem
            title="Memory"
            subtitle="Request"
            unit={quota.memory.request.unit!}
            value={quota.memory.allocatable?.value!}
            limit={quota.memory.allocatable?.raw!}
            actual={quota.memory.request.raw!}
          />
        </Grid>
        <Grid item xs={6} sm={6} lg={3}>
          <QuotaItem
            title="CPU"
            subtitle="Limit"
            unit={quota.cpu.allocatable?.unit!}
            value={quota.cpu.allocatable?.value!}
            limit={quota.cpu.allocatable?.raw!}
            actual={quota.cpu.limit.raw!}
          />
        </Grid>
        <Grid item xs={6} sm={6} lg={3}>
          <QuotaItem
            title="Memory"
            subtitle="Limit"
            unit={quota.memory.allocatable?.unit!}
            value={quota.memory.allocatable?.value!}
            limit={quota.memory.allocatable?.raw!}
            actual={quota.memory.limit.raw!}
          />
        </Grid>
      </Grid>
      <Container className={classes.tableWrapper}>
        <Table
          options={{
            paging: false,
            padding: 'dense',
            toolbar: false,
            sorting: false,
          }}
          data={tableData}
          columns={columns}
        />
      </Container>
    </>
  );
};

export default Quota;
