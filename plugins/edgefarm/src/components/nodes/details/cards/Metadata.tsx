import { StatusOK, StatusError, StructuredMetadataTable, WarningPanel } from '@backstage/core-components';
import { Chip } from '@material-ui/core';
import React from 'react'
import { useEntity } from "@backstage/plugin-catalog-react";

const recordToJSXElement = (obj: any) => {
    if (!obj) return <></>
    const tmpArray: string[] = []
    Object.keys(obj).forEach(function (key) {
        tmpArray.push(key + ": " + obj[key])
    });
    if (tmpArray.length > 0) {
        return tmpArray.map((item) => <Chip label={item} size="small" />).reduce((result, item) => <>{result} {item}</>)
    } else {
        return <></>
    }
}

const Metadata = (props: { nodeDetails: any }) => {
    if (!props.nodeDetails || !props.nodeDetails.metadata) return (
        <WarningPanel
            title="Data is missing"
            message="We were unable to find any data for this node."
        />
    )

    const isOnline = Math.random() >= 0.5;

    const { entity } = useEntity();



    const labels: JSX.Element = recordToJSXElement(props.nodeDetails?.metadata.labels)
    const annotations: JSX.Element = recordToJSXElement(props.nodeDetails?.metadata.annotations)

    const metadata = {
        Status: isOnline ? <><StatusOK /> Online</> : <><StatusError /> Offline</>,
        Name: entity.metadata.name,
        'OS Version': props.nodeDetails?.status.nodeInfo.osImage ?? '',
        Uptime: '1 day',
        Roles: 'control-plane',
        'Kernel-Version': props.nodeDetails?.status.nodeInfo.kernelVersion ?? '',
        'Container-Runtime-Version': props.nodeDetails?.status.nodeInfo.containerRuntimeVersion ?? '',
        'Kubelet-Version': props.nodeDetails?.status.nodeInfo.kubeletVersion ?? '',
        'Kube-Proxy-Version': props.nodeDetails?.status.nodeInfo.kubeProxyVersion ?? '',
        Architecture: props.nodeDetails?.status.nodeInfo.architecture ?? '',
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
