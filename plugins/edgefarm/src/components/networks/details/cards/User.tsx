import React from 'react';
import { StructuredMetadataTable } from '@backstage/core-components';
import { User } from '@internal/plugin-edgefarm-backend';

type Props = {
  value: User | null;
};

const UserDetails = ({ value }: Props) => {
  if (!value) return <></>;

  const metadata: { [index: string]: any } = {
    name: value.name,
    'Allow Publish on Subjects':
      value.permissions.pub.allow.length > 0
        ? value.permissions.pub.allow
        : 'All',
    'Deny Publish on Subjects':
      value.permissions.pub.deny.length > 0
        ? value.permissions.pub.deny
        : 'All',
    'Allow Subscribe on Subjects':
      value.permissions.sub.allow.length > 0
        ? value.permissions.sub.allow
        : 'All',
    'Deny Subscribe on Subjects':
      value.permissions.sub.deny.length > 0
        ? value.permissions.sub.deny
        : 'All',
    'Max Messages per Payload':
      value.limits.payload === -1 ? 'Unlimited' : value.limits.payload,
    'Max Bytes per Message':
      value.limits.data === -1 ? 'Unlimited' : value.limits.data,
    'Max Subscriptions':
      value.limits.subscriptions === -1
        ? 'Unlimited'
        : value.limits.subscriptions,
  };
  return <StructuredMetadataTable dense metadata={metadata} />;
};

export default UserDetails;
