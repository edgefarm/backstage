import { EmptyState, InfoCard, LinkButton } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  useEntity,
  EntityRefLink,
} from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemIcon } from '@material-ui/core';
import NetworkIcon from '@material-ui/icons/DeviceHub';

type EntityLinkListProps = {
  type: string;
  title: string;
  createUrl: string;
  emptyTitle: string;
};

const SystemChildEntitiesLinkList = (props: EntityLinkListProps) => {
  const api = useApi(catalogApiRef);
  const { entity } = useEntity();
  const systemRef = entity.spec?.system as string;

  const [tableItems, setTableItems] = useState<
    { id: string; title: JSX.Element }[]
  >([]);
  useEffect(() => {
    const getNetworks = async () => {
      if (!systemRef) return;
      const systemEntity = await api.getEntityByRef(systemRef);
      if (!systemEntity) return;
      const hasPartComponents = systemEntity.relations
        ?.filter(r => r.type === 'hasPart')
        .map(r => r.targetRef);

      const networkEntities = (
        await api.getEntitiesByRefs({
          entityRefs: hasPartComponents ?? [],
        })
      ).items.filter(
        item =>
          (item?.spec?.type as string).toLowerCase() ===
          props.type.toLowerCase(),
      ) as Entity[];

      setTableItems(
        networkEntities.map(item => {
          return {
            id: item.metadata.uid ?? item.metadata.name,
            title: (
              <EntityRefLink entityRef={item} title={item.metadata.name} />
            ),
          };
        }),
      );
    };
    getNetworks();
  }, [api, props.type, systemRef]);

  if (tableItems.length === 0) {
    return (
      <InfoCard title={props.title} variant="gridItem">
        <EmptyState
          missing="data"
          title={props.emptyTitle}
          description="Click here to create one"
          action={
            <LinkButton to={props.createUrl} color="primary" variant="outlined">
              Add {props.type}
            </LinkButton>
          }
        />
      </InfoCard>
    );
  }

  return (
    <>
      <InfoCard title={props.title} variant="gridItem">
        <List dense>
          {tableItems.map(item => (
            <ListItem key={item.id}>
              <ListItemIcon>
                <NetworkIcon />
              </ListItemIcon>
              {item.title}
            </ListItem>
          ))}
        </List>
      </InfoCard>
    </>
  );
};

export default SystemChildEntitiesLinkList;
