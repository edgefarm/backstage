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

const Rollouts = () => {
  const [tableItems, setTableItems] = useState<Plan[]>([]);
  useEffect(() => {
    const getPlans = async () => {
      const planEntities: Plan[] = [];

      // planEntities.push({ id: '1', status: 'Running', target: 'foo=bar' });

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
      <InfoCard title="Rollouts" variant="gridItem">
        <EmptyState
          missing="data"
          title="No rollouts available"
          description="There are currently no rollouts planned for this firmware"
          action={
            <LinkButton
              to="/create/templates/default/edgefarm-rollout-add"
              color="primary"
              variant="contained"
            >
              Plan a rollout
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

export default Rollouts;
