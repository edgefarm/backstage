import { StatusOK, StatusError, StructuredMetadataTable } from '@backstage/core-components';
import { Chip } from '@material-ui/core';
import React from 'react'
import { useEntity } from "@backstage/plugin-catalog-react";

const Metadata = () => {
    const isOnline = Math.random() >= 0.5;

    const { entity } = useEntity();

    const label = ['beta.kubernetes.io/arch: amd64',
        'beta.kubernetes.io/os: linux',
        'kubernetes.io/arch: amd64',
        "kubernetes.io/hostname: backstage",
        'kubernetes.io/os: linux',
        'minikube.k8s.io/name: backstage',
        'minikube.k8s.io/primary: "true"',
        'minikube.k8s.io/version: v1.28.0',
        'node-role.kubernetes.io/control-plane: ""',
    ]

    const metadata = {
        Status: isOnline ? <><StatusOK /> Online</> : <><StatusError /> Offline</>,
        Name: entity.metadata.name,
        'OS Version': 'Ubuntu 20.04',
        Uptime: '1 day',
        Roles: 'control-plane',
        'Kernel-Version': '5.4.0-1031-aws',
        'Container-Runtime-Version': 'docker://19.3.13',
        'Kubelet-Version': 'v1.20.2',
        'Kube-Proxy-Version': 'v1.20.2',
        Architecture: 'amd64',
        Labels: label.map((item) => <Chip label={item} size="small" />).reduce((result, item) => <>{result} {item}</>)
    };

    return (
        <StructuredMetadataTable metadata={metadata} />
    )
}

export default Metadata
