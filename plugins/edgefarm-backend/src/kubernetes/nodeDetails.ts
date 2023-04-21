import { MetadataDto } from './common';

export class NodeDetails {
  Labels: Record<string, string>;
  Annotations: Record<string, string>;
  Name: string;
  Namespace?: string;
  KernelVersion: string;
  OsImage: string;
  ContainerRuntimeVersion: string;
  KubeletVersion: string;
  KubeProxyVersion: string;
  Architecture: string;
  OperatingSystem: string;
  isOnline: boolean;
  allocatableCPU: string;
  allocatableMemory: string;
  rawData: NodeDetailsDto;

  constructor(nodeDetailsDto: NodeDetailsDto) {
    this.rawData = nodeDetailsDto;
    this.Name = nodeDetailsDto.metadata.name;
    this.Labels = nodeDetailsDto.metadata.labels;
    this.Annotations = nodeDetailsDto.metadata.annotations;
    this.KernelVersion = nodeDetailsDto.status.nodeInfo.kernelVersion;
    this.OsImage = nodeDetailsDto.status.nodeInfo.osImage;
    this.ContainerRuntimeVersion =
      nodeDetailsDto.status.nodeInfo.containerRuntimeVersion;
    this.KubeletVersion = nodeDetailsDto.status.nodeInfo.kubeletVersion;
    this.KubeProxyVersion = nodeDetailsDto.status.nodeInfo.kubeProxyVersion;
    this.Architecture = nodeDetailsDto.status.nodeInfo.architecture;
    this.OperatingSystem = nodeDetailsDto.status.nodeInfo.operatingSystem;
    this.allocatableCPU = nodeDetailsDto.status.allocatable.cpu;
    this.allocatableMemory = nodeDetailsDto.status.allocatable.memory;

    if (
      !nodeDetailsDto.status.conditions ||
      nodeDetailsDto.status.conditions.length === 0
    ) {
      this.isOnline = false;
    } else {
      const item = nodeDetailsDto.status.conditions.find(
        cond => cond.type === 'Ready' && cond.status === 'True',
      );
      this.isOnline = !!item;
    }
  }
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
  metadata: MetadataDto;
  spec: {
    podCIDR: string;
    podCIDRs: string[];
    providerID: string;
    unschedulable: boolean;
  };
  status: NodeDetailsStatusDto;
}
