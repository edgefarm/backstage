import { EmptyState, InfoCard, LinkButton } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import {
  EntityRefLink,
  catalogApiRef,
  useEntity,
} from '@backstage/plugin-catalog-react';
import { List, ListItem, ListItemIcon } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import UpgradeIcon from '@material-ui/icons/SystemUpdate';

const Rollouts = () => {
  const api = useApi(catalogApiRef);
  const { entity } = useEntity();

  const [tableItems, setTableItems] = useState<
    { id: string; title: JSX.Element }[]
  >([]);
  useEffect(() => {
    const getPlans = async () => {
      const rolloutEntityRefs = entity.relations
        ?.filter(r => r.type === 'dependencyOf')
        .map(r => r.targetRef);
      if (!rolloutEntityRefs || rolloutEntityRefs.length === 0) return;
      const rolloutEntities = await api.getEntitiesByRefs({
        entityRefs: rolloutEntityRefs,
      });

      setTableItems(
        rolloutEntities.items
          .filter(r => r !== undefined)
          .map(item => {
            return {
              id: item!.metadata.uid ?? item!.metadata.name,
              title: (
                <EntityRefLink entityRef={item!} title={item!.metadata.name} />
              ),
            };
          }),
      );
    };
    getPlans();
  }, [api, entity.relations]);

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

  return (
    <>
      <InfoCard title="Rollouts" variant="gridItem">
        <List dense>
          {tableItems.map(item => (
            <ListItem key={item.id}>
              <ListItemIcon>
                <UpgradeIcon />
              </ListItemIcon>
              {item.title}
            </ListItem>
          ))}
        </List>
      </InfoCard>
    </>
  );
};

export default Rollouts;
