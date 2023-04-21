import { MetadataDto } from './common';

interface Metadata {
  name: string;
  namespace?: string;
  annotations: Record<string, string>;
  labels: Record<string, string>;
}

export interface Stream {
  name: string;
  subNetworkRef?: string;
  type: 'Standard' | 'Aggregate';
  references?: string[];
  config: {
    discard: 'Old' | 'New' | 'All';
    discardNewPerSubject: boolean;
    duplicates: string;
    maxAge: number;
    maxBytes: number;
    maxConsumers: number;
    maxMsgSize: number;
    maxMsgs: number;
    maxMsgsPerSubject: number;
    noAck: boolean;
    replicas: number;
    retention: string;
    storage: string;
    subjects?: string[];
  };
}

export interface Subnetwork {
  name: string;
  tolerations: string[];
  nodeSelectorTerm: {
    matchExpressions: {
      key: string;
      operator: string;
    }[];
  };
  limits: {
    fileStorage: string;
    inMemoryStorage: string;
  };
}

export interface User {
  name: string;
  permissions: {
    pub: {
      allow: string[];
      deny: string[];
    };
    sub: {
      allow: string[];
      deny: string[];
    };
  };
  limits: {
    data: number;
    payload: number;
    subscriptions: number;
  };
}

export class Details {
  name: string;
  metadata: Metadata;
  streams: Stream[];
  subnetworks: Subnetwork[];
  users: User[];
  rawData: any;

  constructor(dto: Dto) {
    this.name = dto.metadata.name;
    this.metadata = {
      name: dto.metadata.name,
      namespace: dto.metadata.namespace,
      annotations: dto.metadata.annotations,
      labels: dto.metadata.labels,
    };
    this.streams = dto.spec.parameters.streams;
    this.subnetworks = dto.spec.parameters.subNetworks;
    this.users = dto.spec.parameters.users;
    this.rawData = dto;
  }
}

interface Dto {
  apiVersion: string;
  kind: string;
  metadata: MetadataDto;
  spec: NetworkDetailsSpecDto;
  status: StatusDto;
}

interface NetworkDetailsSpecDto {
  parameters: {
    streams: StreamDto[];
    subNetworks: SubnetworkDto[];
    users: UserDto[];
  };
}

interface StreamDto {
  name: string;
  subNetworkRef?: string;
  type: 'Standard' | 'Aggregate';
  references?: string[];
  config: {
    discard: 'Old' | 'New' | 'All';
    discardNewPerSubject: boolean;
    duplicates: string;
    maxAge: number;
    maxBytes: number;
    maxConsumers: number;
    maxMsgSize: number;
    maxMsgs: number;
    maxMsgsPerSubject: number;
    noAck: boolean;
    replicas: number;
    retention: string;
    storage: string;
    subjects?: string[];
  };
}

interface SubnetworkDto {
  name: string;
  tolerations: string[];
  nodeSelectorTerm: {
    matchExpressions: {
      key: string;
      operator: string;
    }[];
  };
  limits: {
    fileStorage: string;
    inMemoryStorage: string;
  };
}

interface UserDto {
  name: string;
  permissions: {
    pub: {
      allow: string[];
      deny: string[];
    };
    sub: {
      allow: string[];
      deny: string[];
    };
  };
  limits: {
    data: number;
    payload: number;
    subscriptions: number;
  };
}

interface StatusDto {
  conditions: {
    lastTransitionTime: string;
    reason: string;
    status: string;
    type: string;
  }[];
}
