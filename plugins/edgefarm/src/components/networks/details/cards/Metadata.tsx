import React from 'react';
import { NetworkDetails } from '@internal/plugin-edgefarm-backend';
import { StructuredMetadataTable } from '@backstage/core-components';
import { Chip } from '@material-ui/core';

const recordToJSXElement = (record: Record<string, string>) => {
  if (!record) return <>None</>;
  const tmpArray: string[] = [];
  Object.keys(record).forEach(key => {
    tmpArray.push(`${key}: ${record[key]}`);
  });
  if (tmpArray.length > 0) {
    return tmpArray
      .map(item => <Chip label={item} size="small" />)
      .reduce((result, item) => (
        <>
          {result} {item}
        </>
      ));
  }
  return <></>;
};

type Props = {
  details: NetworkDetails | null;
};

const Metadata = ({ details }: Props) => {
  if (!details) return <></>;

  const labels: JSX.Element = recordToJSXElement(details.metadata.labels);
  const annotations: JSX.Element = recordToJSXElement(
    details.metadata.annotations,
  );

  const metadata: { [index: string]: any } = {
    Name: details.name,
    Namespace: details.metadata.namespace ?? 'default',
    Labels: labels,
    Annotations: annotations,
  };

  return <StructuredMetadataTable dense metadata={metadata} />;
};

export default Metadata;
