export interface NodeDetails {
    apiVersion: string;
    kind: string;
    metadata: {
        name: string;
        uid: string;
        resourceVersion: string;
        creationTimestamp: string;
        labels: {
            [key: string]: string;
        };
        annotations: {
            [key: string]: string;
        };
    };
    spec: {
        podCIDR: string;
        podCIDRs: string[];
        providerID: string;
        unschedulable: boolean;
    };
    status: {
        addresses: {
            type: string;
            address: string;
        }[];
        allocatable: {
            [key: string]: string;
        };
        capacity: {
            [key: string]: string;
        };
        conditions: {
            type: string;
            status: string;
            lastHeartbeatTime: string;
            lastTransitionTime: string;
            reason: string;
            message: string;
        }[];
        daemonEndpoints: {
            kubeletEndpoint: {
                Port: number;
            };
        };
        images: {
            names: string[];
            sizeBytes: number;
        }[];
        nodeInfo: {
            architecture: string;
            bootID: string;
            containerRuntimeVersion: string;
            kernelVersion: string;
            kubeProxyVersion: string;
            kubeletVersion: string;
            machineID: string;
            operatingSystem: string;
            osImage: string;
            systemUUID: string;
        };
        volumesAttached: {
            name: string;
        }[];
        volumesInUse: string[];
    };
}
