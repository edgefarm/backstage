import {
  StatusOK,
  StatusError,
  StructuredMetadataTable,
  WarningPanel,
} from '@backstage/core-components';
import { Chip, CircularProgress } from '@material-ui/core';
import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { NodeDetails } from '../DetailsComponent';

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
  nodeDetails: NodeDetails | null;
  isLoading: boolean;
}) => {
  const { entity } = useEntity();

  if (props.isLoading) return <CircularProgress />;

  const nodeDetails = props.nodeDetails;
  if (!nodeDetails)
    return (
      <WarningPanel
        title="Data is missing"
        message="We were unable to find any data for this node."
      />
    );

  const labels: JSX.Element = recordToJSXElement(nodeDetails.Labels);
  const annotations: JSX.Element = recordToJSXElement(nodeDetails.Annotations);

  const isOnline = nodeDetails.isOnline;

  const metadata = {
    Status: isOnline ? (
      <>
        <StatusOK /> Online
      </>
    ) : (
      <>
        <StatusError /> Offline
      </>
    ),
    Name: entity.metadata.name,
    'OS Version': nodeDetails.OsImage ?? '',
    Uptime: '1 day (still mocked)',
    'Kernel-Version': nodeDetails.KernelVersion ?? '',
    'Container-Runtime-Version': nodeDetails.ContainerRuntimeVersion ?? '',
    'Kubelet-Version': nodeDetails.KubeletVersion ?? '',
    'Kube-Proxy-Version': nodeDetails.KubeProxyVersion ?? '',
    Architecture: nodeDetails.Architecture ?? '',
    Labels: labels,
    Annotations: annotations,
  };

  return (
    <>
      <StructuredMetadataTable metadata={metadata} />
    </>
  );
};

export default Metadata;
