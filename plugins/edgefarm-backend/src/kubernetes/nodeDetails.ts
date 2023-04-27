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
  Hostname?: string;
  IPAddress?: string;
  rawData: NodeDetailsDto;

  constructor(dto: NodeDetailsDto) {
    this.rawData = dto;
    this.Name = dto.metadata.name;
    this.Labels = dto.metadata.labels;
    this.Annotations = dto.metadata.annotations;
    this.KernelVersion = dto.status.nodeInfo.kernelVersion;
    this.OsImage = dto.status.nodeInfo.osImage;
    this.ContainerRuntimeVersion = dto.status.nodeInfo.containerRuntimeVersion;
    this.KubeletVersion = dto.status.nodeInfo.kubeletVersion;
    this.KubeProxyVersion = dto.status.nodeInfo.kubeProxyVersion;
    this.Architecture = dto.status.nodeInfo.architecture;
    this.OperatingSystem = dto.status.nodeInfo.operatingSystem;
    this.allocatableCPU = dto.status.allocatable.cpu;
    this.allocatableMemory = dto.status.allocatable.memory;
    this.Hostname = dto.status.addresses.find(
      a => a.type === 'Hostname',
    )?.address;
    this.IPAddress = dto.status.addresses.find(
      a => a.type === 'InternalIP',
    )?.address;

    if (!dto.status.conditions || dto.status.conditions.length === 0) {
      this.isOnline = false;
    } else {
      const item = dto.status.conditions.find(
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
