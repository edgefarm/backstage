export class ApplicationComponent {
  Name: string;
  Properties: {
    image: string;
    port: number;
  };
  Type: 'webservice' | 'cron-task' | 'daemon' | 'k8s-objects' | 'task';
  Healthy: boolean = false;
  ApiVersion: string = '';
  Kind: string = '';

  constructor(
    dto: ApplicationDetailsComponentDto,
    statusDto: ApplicationStatusDto,
  ) {
    this.Name = dto.name;
    this.Properties = dto.properties;
    this.Type = dto.type;

    statusDto.services.map(service => {
      if (service.name === this.Name) {
        this.Healthy = service.healthy;
        this.ApiVersion = service.workloadDefinition.apiVersion;
        this.Kind = service.workloadDefinition.kind;
      }
    });
  }
}

export class ApplicationStatus {
  Status: string;

  constructor(dto: ApplicationStatusDto) {
    this.Status = dto.status;
  }
}

export class ApplicationDetails {
  originData: ApplicationDetailsDto;
  Name: string;
  Namespace?: string;
  Labels: Record<string, string>;
  Annotations: Record<string, string>;
  Components: ApplicationComponent[];
  Status: string;

  constructor(dto: ApplicationDetailsDto) {
    this.Name = dto.metadata.name;
    this.Namespace = dto.metadata.namespace;
    this.Labels = dto.metadata.labels;
    this.Annotations = dto.metadata.annotations;
    this.Status = new ApplicationStatus(dto.status).Status;
    this.Components = dto.spec.components.map(
      component => new ApplicationComponent(component, dto.status),
    );

    this.originData = dto;
  }
}

interface ApplicationDetailsDto {
  apiVersion: string;
  kind: string;
  metadata: ApplicationDetailsMetadataDto;
  spec: ApplicationDetailsSpecDto;
  status: ApplicationStatusDto;
}

interface ApplicationDetailsMetadataDto {
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

interface ApplicationDetailsSpecDto {
  components: ApplicationDetailsComponentDto[];
}

interface ApplicationDetailsComponentDto {
  name: string;
  properties: {
    image: string;
    port: number;
  };
  type: 'webservice' | 'cron-task' | 'daemon' | 'k8s-objects' | 'task';
}

interface ApplicationStatusDto {
  status: string;
  services: {
    healthy: boolean;
    name: string;
    namespace?: string;
    workloadDefinition: {
      apiVersion: string;
      kind: string;
    };
  }[];
}
