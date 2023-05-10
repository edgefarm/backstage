import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import {
  PageWithHeader,
  Content,
  Table,
  TableColumn,
  ContentHeader,
  CreateButton,
} from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { EntityRefLink, catalogApiRef } from '@backstage/plugin-catalog-react';
import React, { useEffect, useState } from 'react';

export const DeviceListPage = () => {
  const orgName =
    useApi(configApiRef).getOptionalString('organization.name') ?? 'Backstage';
  const catalogApi = useApi(catalogApiRef);

  const [count, setCount] = useState<number>(0);
  const [tableItems, setTableItems] = useState<object[]>([]);
  useEffect(() => {
    const loadData = async () => {
      const items: object[] = [];
      const response = await catalogApi.getEntities({
        filter: {
          kind: 'Component',
          'spec.type': 'device',
        },
      });
      if (response) {
        setCount(response.items.length);
        response.items.forEach(item => {
          const result: {
            name: JSX.Element;
            system: JSX.Element | string;
            owner: JSX.Element | string;
          } = {
            name: (
              <EntityRefLink
                entityRef={stringifyEntityRef({
                  kind: item.kind,
                  namespace: item.metadata.namespace,
                  name: item.metadata.name,
                })}
                title={item.metadata.name}
              />
            ),
            system: '',
            owner: (item.spec?.owner as string) ?? '',
          };
          if (item.spec?.system) {
            result.system = (
              <EntityRefLink
                entityRef={item.spec.system as string}
                title={parseEntityRef(item.spec.system as string).name}
              />
            );
          }
          items.push(result);
        });
      }
      setTableItems(items);
    };
    loadData();
  }, [catalogApi]);

  const columns: TableColumn[] = [
    {
      title: 'Name',
      field: 'name',
      highlight: true,
    },
    {
      title: 'System',
      field: 'system',
    },
    {
      title: 'owner',
      field: 'owner',
    },
  ];

  return (
    <PageWithHeader title={`${orgName} Devices`} themeId="home">
      <Content>
        <ContentHeader title="">
          <CreateButton
            title="Add Device"
            to="/create/templates/default/edgefarm-device-add"
          />
        </ContentHeader>
        <Table
          options={{ paging: false, padding: 'dense' }}
          data={tableItems}
          columns={columns}
          title={`All (${count})`}
        />
      </Content>
    </PageWithHeader>
  );
};
