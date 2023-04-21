import React from 'react';
import { Stream } from '@internal/plugin-edgefarm-backend';
import { StructuredMetadataTable } from '@backstage/core-components';
import { Chip } from '@material-ui/core';

const stringArrayToJSXElement = (items: string[] | undefined) => {
  if (!items || items.length <= 0) return <></>;
  if (items.length > 0) {
    return items
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
  value: Stream | null;
};

const StreamDetails = ({ value }: Props) => {
  if (!value) return <></>;

  const metadata: { [index: string]: any } = {
    Name: value.name,
    subNetworkRef: value.subNetworkRef,
    type: value.type,
    'config discard': value.config.discard,
    'config duplicates': value.config.duplicates,
    'config discardNewPerSubject': value.config.discardNewPerSubject,
    'config maxAge': value.config.maxAge,
    'config maxBytes':
      value.config.maxBytes === -1 ? 'Unlimited' : value.config.maxBytes,
    'config maxConsumer':
      value.config.maxConsumers === -1
        ? 'Unlimited'
        : value.config.maxConsumers,
    'config maxMsgSize':
      value.config.maxMsgSize === -1 ? 'Unlimited' : value.config.maxMsgSize,
    'config maxMsgs':
      value.config.maxMsgs === -1 ? 'Unlimited' : value.config.maxMsgs,
    'config maxMsgsPerSubject':
      value.config.maxMsgsPerSubject === -1
        ? 'Unlimited'
        : value.config.maxMsgsPerSubject,
    'config replicas': value.config.replicas,
    'config retention': value.config.retention,
    'config storage': value.config.storage,
  };

  if (value.type === 'Standard') {
    metadata['config subjects'] = stringArrayToJSXElement(
      value.config.subjects,
    );
  }
  if (value.type === 'Aggregate') {
    metadata.references = value.references;
  }

  return <StructuredMetadataTable dense metadata={metadata} />;
};

export default StreamDetails;
