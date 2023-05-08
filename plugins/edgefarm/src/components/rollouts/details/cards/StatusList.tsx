import { StatusError, StatusOK, Table } from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import React, { useEffect, useState } from 'react';

type RolloutStatus = {
  items: RolloutStatusItem[];
};
type RolloutStatusItem = {
  target: string;
  status: boolean;
};

const StatusList = () => {
  const config = useApi(configApiRef);
  const backendUrl = config.getString('backend.baseUrl');
  const { entity } = useEntity();
  const annotations = entity.metadata.annotations ?? {};
  const clusterName = annotations['edgefarm.io/cluster'] ?? '';
  const rolloutName = entity.metadata.name;

  const [tableItems, setTableItems] = useState<
    { nodeName: string; status: JSX.Element }[]
  >([]);
  useEffect(() => {
    const getPlans = async () => {
      const tmpItems: { nodeName: string; status: JSX.Element }[] = [];
      const response = await fetch(
        `${backendUrl}/api/edgefarm/${clusterName}/rollouts/${rolloutName}/status`,
      );
      if (response.status === 200) {
        const payload: RolloutStatus = await response.json();
        payload.items.forEach(item => {
          tmpItems.push({
            nodeName: item.target,
            status: item.status ? <StatusOK /> : <StatusError />,
          });
        });
      }
      // tmpItems.push({ nodeName: 'FooBar', status: <StatusOK /> });
      setTableItems(tmpItems);
    };
    getPlans();
  }, [backendUrl, clusterName, rolloutName]);

  const columns = [
    {
      title: 'Target Device',
      field: 'nodeName',
    },
    {
      title: 'Status',
      field: 'status',
    },
  ];

  return (
    <Table
      options={{ paging: false, padding: 'dense', toolbar: false }}
      data={tableItems}
      columns={columns}
      title="Backstage Table"
    />
  );
};

export default StatusList;
