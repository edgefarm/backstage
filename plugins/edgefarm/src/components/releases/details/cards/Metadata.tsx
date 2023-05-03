import { StructuredMetadataTable } from '@backstage/core-components';
import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';

const Metadata = () => {
  const { entity } = useEntity();

  const metadata = {
    Name: entity.metadata.name,
    Image: entity.metadata.annotations?.['edgefarm.io/release-image'] ?? 'N/A',
  };

  return (
    <>
      <StructuredMetadataTable dense metadata={metadata} />
    </>
  );
};

export default Metadata;
