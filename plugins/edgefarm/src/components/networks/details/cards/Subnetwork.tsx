import React from 'react';
import { StructuredMetadataTable } from '@backstage/core-components';
import { Subnetwork } from '@internal/plugin-edgefarm-backend';

type Props = {
  value: Subnetwork | null;
};

const SubnetworkDetails = ({ value }: Props) => {
  if (!value) return <></>;

  const metadata: { [index: string]: any } = {
    Name: value.name,
    Tolerations: value.tolerations.length > 0 ? value.tolerations : 'None',
    nodeSelectors: value.nodepoolSelector.matchExpressions.map(
      v => `${v.key} ${v.operator}`,
    ),
    'Max File Storage Size': value.limits.fileStorage,
    'Max In Memory Storage Size': value.limits.inMemoryStorage,
  };
  return <StructuredMetadataTable dense metadata={metadata} />;
};

export default SubnetworkDetails;
