import { Link, Table, TableColumn } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  useEntity,
  EntityRefLink,
} from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import React, { useEffect, useState } from 'react';

type EntityLinkListProps = {
  type: string;
  title: string;
};

const SystemChildEntitiesLinkList = (props: EntityLinkListProps) => {
  const api = useApi(catalogApiRef);
  const { entity } = useEntity();
  const systemRef = entity.spec?.system as string;

  const [tableItems, setTableItems] = useState<{ title: JSX.Element }[]>([]);
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
      ).items.filter(item => item?.spec?.type === props.type) as Entity[];

      setTableItems(
        networkEntities.map(item => {
          return {
            title: (
              <EntityRefLink entityRef={item} title={item.metadata.name} />
            ),
          };
        }),
      );
    };
    getNetworks();
  }, [api, props.type, systemRef]);

  const columns: TableColumn[] = [
    {
      title: 'Name',
      field: 'title',
      highlight: true,
    },
  ];

  return (
    <Table
      title={props.title}
      options={{
        paging: false,
        padding: 'dense',
        search: false,
        sorting: false,
      }}
      data={tableItems}
      columns={columns}
    />
  );
};

export default SystemChildEntitiesLinkList;
