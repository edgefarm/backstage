import { MetadataDto } from './common';

export class Details {
  Name: string;
  Namespace?: string;
  Labels: Record<string, string>;
  Annotations: Record<string, string>;
  NodeSelector: string[];
  rawData: PlanDetailsDto;

  constructor(dto: PlanDetailsDto) {
    this.Name = dto.metadata.name;
    this.Namespace = dto.metadata.namespace;
    this.Labels = dto.metadata.labels;
    this.Annotations = dto.metadata.annotations;
    this.NodeSelector = dto.spec.nodeSelector.matchExpressions.map(r => {
      const result = `${r.key} ${r.operator.toLowerCase()}`;
      if (r.values) {
        return `${result} (${r.values.reduce(
          (p, c, i) => (i === 0 ? `${c}` : `${p}, ${c}`),
          '',
        )})`;
      }
      if (r.value) {
        return `${result} ${r.value}`;
      }
      return result;
    });

    this.rawData = dto;
  }
}

interface PlanDetailsDto {
  apiVersion: string;
  kind: string;
  metadata: MetadataDto;
  spec: PlanDetailsSpecDto;
}

interface PlanDetailsSpecDto {
  nodeSelector: {
    matchExpressions: {
      key: string;
      operator: string;
      value?: string;
      values?: string[];
    }[];
  };
}
