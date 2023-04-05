import { JSONPath } from 'jsonpath-plus';
import { NodeDetails } from './nodeDetails';
import { QuotaValues, ResourceQuota } from './nodeQuota';

interface QuotaAggregator {
  fromKubernetesQuotaResponse(data: any): ResourceQuota;
  fromKubernetesDetailsResponse(data: NodeDetails): QuotaValues;
}

export class MemoryQuotaAggregator implements QuotaAggregator {
  fromKubernetesDetailsResponse(data: NodeDetails): QuotaValues {
    const result: QuotaValues = {};

    result.raw = this.convertToValueWithoutUnit(data.allocatableMemory);
    ({ value: result.value, unit: result.unit } = this.convertToHumanReadable(
      result.raw!,
    ));

    return result;
  }

  fromKubernetesQuotaResponse(data: any): ResourceQuota {
    const limit: QuotaValues = {};
    const request: QuotaValues = {};
    limit.raw = JSONPath({
      path: '$.items..resources.limits.memory',
      json: data,
    })
      .map(this.convertToValueWithoutUnit)
      .reduce((partialSum: number, a: number): number => partialSum + a, 0);
    request.raw = JSONPath({
      path: '$.items..resources.requests.memory',
      json: data,
    })
      .map(this.convertToValueWithoutUnit)
      .reduce((partialSum: number, a: number): number => partialSum + a, 0);

    ({ value: limit.value, unit: limit.unit } = this.convertToHumanReadable(
      limit.raw!,
    ));
    ({ value: request.value, unit: request.unit } = this.convertToHumanReadable(
      request.raw!,
    ));

    return { limit, request };
  }
  private convertToValueWithoutUnit(item: string): number {
    const matches = item.match(/^([0-9]+)([a-zA-Z]{0,2})$/);
    if (!matches || matches?.length < 3) {
      throw new Error(`Invalid value ${item}.`);
    }

    const value = Number(matches[1]);

    if (!matches[2]) return value;

    const suffix = matches[2];
    switch (suffix) {
      case 'E':
      case 'e':
        return value * Math.pow(1024, 6);
      case 'P':
      case 'p':
        return value * Math.pow(1024, 5);
      case 'T':
      case 't':
        return value * Math.pow(1024, 4);
      case 'G':
      case 'g':
        return value * Math.pow(1024, 3);
      case 'M':
      case 'm':
        return value * Math.pow(1024, 2);
      case 'K':
      case 'k':
        return value * 1024;
      case 'Ei':
      case 'ei':
        return value * Math.pow(1000, 6);
      case 'Pi':
      case 'pi':
        return value * Math.pow(1000, 5);
      case 'Ti':
      case 'ti':
        return value * Math.pow(1000, 4);
      case 'Gi':
      case 'gi':
        return value * Math.pow(1000, 3);
      case 'Mi':
      case 'mi':
        return value * Math.pow(1000, 2);
      case 'Ki':
      case 'ki':
        return value * 1000;
      default:
        throw new Error(`Unkown Memory suffix ${suffix}`);
    }
  }

  private convertToHumanReadable(value: number): {
    value: number;
    unit: string;
  } {
    const availableUnits = ['Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei'];
    let unit = '';
    let index = 0;
    while (value > 1024) {
      // eslint-disable-next-line no-param-reassign
      value /= 1024;
      unit = availableUnits[index];
      index++;
    }

    return { value: Math.round(value * 100) / 100, unit };
  }
}

export class CpuQuotaAggregator implements QuotaAggregator {
  fromKubernetesDetailsResponse(data: NodeDetails): QuotaValues {
    const result: QuotaValues = {};

    result.raw = this.convertToValueWithoutUnit(data.allocatableCPU);
    ({ value: result.value, unit: result.unit } = this.convertToHumanReadable(
      result.raw!,
    ));

    return result;
  }

  fromKubernetesQuotaResponse(data: any): ResourceQuota {
    const limit: QuotaValues = {};
    const request: QuotaValues = {};
    limit.raw = JSONPath({ path: '$.items..resources.limits.cpu', json: data })
      .map(this.convertToValueWithoutUnit)
      .reduce((partialSum: number, a: number): number => partialSum + a, 0);
    request.raw = JSONPath({
      path: '$.items..resources.requests.cpu',
      json: data,
    })
      .map(this.convertToValueWithoutUnit)
      .reduce((partialSum: number, a: number): number => partialSum + a, 0);

    ({ value: limit.value, unit: limit.unit } = this.convertToHumanReadable(
      limit.raw!,
    ));
    ({ value: request.value, unit: request.unit } = this.convertToHumanReadable(
      request.raw!,
    ));

    return { limit, request };
  }
  private convertToValueWithoutUnit(item: string): number {
    const matches = item.match(/^([1-9][0-9]*)(m?)$/);
    if (!matches || matches?.length < 3) {
      throw new Error(`Invalid value ${item}.`);
    }

    const value = Number(matches[1]);

    if (!matches[2]) return value;

    const suffix = matches[2];
    switch (suffix) {
      case 'm':
        return value / 1000;
      default:
        throw new Error(`Unkown CPU suffix ${suffix}`);
    }
  }

  private convertToHumanReadable(value: number): {
    value: number;
    unit: string;
  } {
    if (Math.floor(value) === value)
      return { value: value, unit: value > 1 ? ' cores' : ' core' };

    return { value: value * 1000, unit: 'm' };
  }
}
