import React from 'react';
import { ApplicationComponent } from '@internal/plugin-edgefarm-backend';
import {
  StatusError,
  StatusOK,
  StructuredMetadataTable,
} from '@backstage/core-components';

const Component = (props: { component: ApplicationComponent | null }) => {
  if (!props.component) return <></>;

  const c = props.component;
  const metadata = {
    Healthy: c?.Healthy ? (
      <>
        <StatusOK /> Healthy
      </>
    ) : (
      <>
        <StatusError /> Not Healthy
      </>
    ),
    Image: c.Properties.image,
    Port: c.Properties.port,
    Type: c.Type,
    Apiversion: c.ApiVersion,
    Kind: c.Kind,
  };
  return (
    <>
      <StructuredMetadataTable dense metadata={metadata} />
    </>
  );
};

export default Component;
