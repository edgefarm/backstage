export class NodeDetails {
    Metadata: NodeDetailsMetadata;
    Status: NodeDetailsStatus;

    constructor(nodeDetailsDto: NodeDetailsDto) {
        this.Metadata = new NodeDetailsMetadata(nodeDetailsDto.metadata)
        this.Status = new NodeDetailsStatus(nodeDetailsDto.status);
    }
}

class NodeDetailsMetadata {
    Name: string;
    Namespace?: string;
    Labels: Record<string, string>;
    Annotations: Record<string, string>;

    constructor(metadata: NodeDetailsMetadataDto) {
        this.Name = metadata.name;
        this.Namespace = metadata.namespace;
        this.Labels = metadata.labels;
        this.Annotations = metadata.annotations;
    }
}
class NodeDetailsStatus {
    Conditions: NodeDetailsStatusCondition[];
    NodeInfo: NodeDetailsStatusNodeInfo;

    constructor(status: NodeDetailsStatusDto) {
        this.Conditions = status.conditions.map((condition) => {
            return new NodeDetailsStatusCondition(condition);
        });
        this.NodeInfo = new NodeDetailsStatusNodeInfo(status.nodeInfo);
    }
}
class NodeDetailsStatusNodeInfo {
    KernelVersion: string;
    OsImage: string;
    ContainerRuntimeVersion: string;
    KubeletVersion: string;
    KubeProxyVersion: string;
    Architecture: string;
    OperatingSystem: string;

    constructor(nodeInfo: NodeDetailsStatusNodeInfoDto) {
        this.KernelVersion = nodeInfo.kernelVersion;
        this.OsImage = nodeInfo.osImage;
        this.ContainerRuntimeVersion = nodeInfo.containerRuntimeVersion;
        this.KubeletVersion = nodeInfo.kubeletVersion;
        this.KubeProxyVersion = nodeInfo.kubeProxyVersion;
        this.Architecture = nodeInfo.architecture;
        this.OperatingSystem = nodeInfo.operatingSystem;
    }
}

class NodeDetailsStatusCondition {
    Type: string;
    Status: string;
    LastHeartbeatTime: string;
    LastTransitionTime: string;
    Reason: string;
    Message: string;

    constructor(condition: NodeDetailsStatusConditionDto) {
        this.Type = condition.type;
        this.Status = condition.status;
        this.LastHeartbeatTime = condition.lastHeartbeatTime;
        this.LastTransitionTime = condition.lastTransitionTime;
        this.Reason = condition.reason;
        this.Message = condition.message;
    }

}

interface NodeDetailsMetadataDto {
    name: string;
    namespace?: string;
    uid: string;
    resourceVersion: string;
    creationTimestamp: string;
    labels: {
        [key: string]: string;
    };
    annotations: {
        [key: string]: string;
    };
}
interface NodeDetailsStatusDto {
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
    conditions: NodeDetailsStatusConditionDto[];
    daemonEndpoints: {
        kubeletEndpoint: {
            Port: number;
        };
    };
    images: {
        names: string[];
        sizeBytes: number;
    }[];
    nodeInfo: NodeDetailsStatusNodeInfoDto;
    volumesAttached: {
        name: string;
    }[];
    volumesInUse: string[];
}

interface NodeDetailsStatusConditionDto {
    type: string;
    status: string;
    lastHeartbeatTime: string;
    lastTransitionTime: string;
    reason: string;
    message: string;
}

interface NodeDetailsStatusNodeInfoDto {
    machineID: string;
    systemUUID: string;
    bootID: string;
    kernelVersion: string;
    osImage: string;
    containerRuntimeVersion: string;
    kubeletVersion: string;
    kubeProxyVersion: string;
    operatingSystem: string;
    architecture: string;
}

interface NodeDetailsDto {
    apiVersion: string;
    kind: string;
    metadata: NodeDetailsMetadataDto;
    spec: {
        podCIDR: string;
        podCIDRs: string[];
        providerID: string;
        unschedulable: boolean;
    };
    status: NodeDetailsStatusDto;
}
