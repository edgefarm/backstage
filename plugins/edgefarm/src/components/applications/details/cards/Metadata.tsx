import {
  StructuredMetadataTable,
  WarningPanel,
} from '@backstage/core-components';
import { Chip, CircularProgress } from '@material-ui/core';
import React from 'react';
import { ApplicationDetails } from '@internal/plugin-edgefarm-backend';

const recordToJSXElement = (record: Record<string, string>) => {
  if (!record) return <></>;
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

const Metadata = (props: {
  details: ApplicationDetails | null;
  isLoading: boolean;
}) => {
  if (props.isLoading) return <CircularProgress />;

  const details = props.details;
  if (!details)
    return (
      <WarningPanel
        title="Data is missing"
        message="We were unable to find any data for this node."
      />
    );

  const labels: JSX.Element = recordToJSXElement(details.Labels);
  const annotations: JSX.Element = recordToJSXElement(details.Annotations);

  const metadata = {
    Name: details.Name,
    Namespace: details.Namespace ?? 'default',
    Status: details.Status,
    Labels: labels,
    Annotations: annotations,
  };

  return (
    <>
      <StructuredMetadataTable dense metadata={metadata} />
    </>
  );
};

export default Metadata;
