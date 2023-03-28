import { StatusOK, StatusError, StructuredMetadataTable, WarningPanel } from '@backstage/core-components';
import { Chip } from '@material-ui/core';
import React from 'react'
import { useEntity } from "@backstage/plugin-catalog-react";
import { NodeDetails } from '@internal/plugin-edgefarm-backend';



const recordToJSXElement = (record: Record<string, string>) => {
    if (!record) return <></>
    const tmpArray: string[] = []
    Object.keys(record).forEach(function (key) {
        tmpArray.push(key + ": " + record[key])
    });
    if (tmpArray.length > 0) {
        return tmpArray.map((item) => <Chip label={item} size="small" />).reduce((result, item) => <>{result} {item}</>)
    } else {
        return <></>
    }
}

const Metadata = (props: { nodeDetails: NodeDetails }) => {
    const nodeDetails = props.nodeDetails;
    const nodeMetadata = nodeDetails?.Metadata;
    const nodeInfo = nodeDetails?.Status?.NodeInfo;
    if (!nodeDetails || !nodeMetadata || !nodeInfo) return (
        <WarningPanel
            title="Data is missing"
            message="We were unable to find any data for this node."
        />
    )

    const isOnline = Math.random() >= 0.5;

    const { entity } = useEntity();



    const labels: JSX.Element = recordToJSXElement(nodeMetadata.Labels)
    const annotations: JSX.Element = recordToJSXElement(nodeMetadata.Annotations)

    // const isOnline = props.nodeDetails.status.conditions.filter(

    const metadata = {
        Status: isOnline ? <><StatusOK /> Online</> : <><StatusError /> Offline</>,
        Name: entity.metadata.name,
        'OS Version': nodeInfo.OsImage ?? '',
        Uptime: '1 day',
        Roles: 'control-plane',
        'Kernel-Version': nodeInfo.KernelVersion ?? '',
        'Container-Runtime-Version': nodeInfo.ContainerRuntimeVersion ?? '',
        'Kubelet-Version': nodeInfo.KubeletVersion ?? '',
        'Kube-Proxy-Version': nodeInfo.KubeProxyVersion ?? '',
        Architecture: nodeInfo.Architecture ?? '',
        Labels: labels,
        Annotations: annotations,
    };

    return (
        <>
            <StructuredMetadataTable metadata={metadata} />
        </>
    )
}

export default Metadata
