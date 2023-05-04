import {
  EmptyState,
  InfoCard,
  LinkButton,
  Table,
} from '@backstage/core-components';
import React, { useEffect, useState } from 'react';

type Plan = {
  id: string;
  status: string;
  target: string;
};

const Deployments = () => {
  const [tableItems, setTableItems] = useState<Plan[]>([]);
  useEffect(() => {
    const getPlans = async () => {
      // const planEntities: Plan[] = [
      //   { id: '1', status: 'Running', target: 'foo=bar' },
      // ];
      const planEntities: Plan[] = [];

      setTableItems(
        planEntities.map(item => {
          return {
            id: item.id,
            target: item.target,
            status: item.status,
          };
        }),
      );
    };
    getPlans();
  }, []);

  if (tableItems.length === 0) {
    return (
      <InfoCard title="Deployments" variant="gridItem">
        <EmptyState
          missing="data"
          title="No deployments found"
          description="Click here to create one"
          action={
            <LinkButton
              to="/create/templates/default/edgefarm-deployment-add"
              color="primary"
              variant="outlined"
            >
              Add upgrade plan
            </LinkButton>
          }
        />
      </InfoCard>
    );
  }

  const columns = [
    { field: 'target', title: 'Target' },
    { field: 'status', title: 'Status' },
  ];

  return (
    <>
      <Table
        options={{
          search: false,
          paging: false,
          toolbar: true,
          padding: 'dense',
        }}
        data={tableItems}
        columns={columns}
        title="Deployments"
      />
    </>
  );
};

export default Deployments;
