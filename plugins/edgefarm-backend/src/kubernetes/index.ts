import { ClusterDetails } from '../cluster-locator';
import fetch, { RequestInit } from 'node-fetch';
import { bufferFromFileOrString } from '@kubernetes/client-node';
import * as https from 'https';
import { NodeDetails } from './nodeDetails';
import { NodeQuota } from './nodeQuota';
import { MemoryQuotaAggregator, CpuQuotaAggregator } from './quotaAggregator';
import { ApplicationDetails } from './applicationDetails';

export class Client {
  constructor(readonly cluster: ClusterDetails) {}

  async getNodeDetails(nodeName: string): Promise<NodeDetails> {
    const [url, requestInit] = this.prepareRequest(this.cluster);
    url.pathname = `/api/v1/nodes/${nodeName}`;

    const resp = await fetch(url, requestInit);
    const data = await resp.json();

    return this.handleErrorResponse(data);
  }

  async getNodeQuota(nodeName: string): Promise<NodeQuota> {
    const [url, requestInit] = this.prepareRequest(this.cluster);
    url.pathname = `/api/v1/pods`;
    url.search = `fieldSelector=spec.nodeName=${nodeName},status.phase!=Failed,status.phase!=Succeeded&limit=500`;

    const resp = await fetch(url, requestInit);
    const data = await resp.json();

    if (data.code >= 400) {
      throw new Error(data.message);
    }
    const memQuotaAggregator = new MemoryQuotaAggregator();
    const cpuQuotaAggregator = new CpuQuotaAggregator();

    const memory = memQuotaAggregator.fromKubernetesQuotaResponse(data);
    const cpu = cpuQuotaAggregator.fromKubernetesQuotaResponse(data);

    const nodeDetails = await this.getNodeDetails(nodeName);
    memory.allocatable =
      memQuotaAggregator.fromKubernetesDetailsResponse(nodeDetails);
    cpu.allocatable =
      cpuQuotaAggregator.fromKubernetesDetailsResponse(nodeDetails);

    return { memory, cpu };
  }

  async getApplicationDetails(appName: string): Promise<ApplicationDetails> {
    const [url, requestInit] = this.prepareRequest(this.cluster);

    const namespace = 'default';
    url.pathname = `/apis/core.oam.dev/v1beta1/namespaces/${namespace}/applications/${appName}`;

    const resp = await fetch(url, requestInit);
    const data = await resp.json();

    if (data.code >= 400) {
      throw new Error(data.message);
    }

    return new ApplicationDetails(data);
  }

  handleErrorResponse(data: any): NodeDetails {
    if (data.code >= 400) {
      throw new Error(data.message);
    }

    return new NodeDetails(data);
  }

  private prepareRequest = (
    clusterDetails: ClusterDetails,
  ): [URL, RequestInit] => {
    const requestInit: RequestInit = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${clusterDetails.serviceAccountToken}`,
      },
    };

    const url: URL = new URL(clusterDetails.url);
    if (url.protocol === 'https:') {
      requestInit.agent = new https.Agent({
        ca:
          bufferFromFileOrString(
            clusterDetails.caFile,
            clusterDetails.caData,
          ) ?? undefined,
        rejectUnauthorized: !clusterDetails.skipTLSVerify,
      });
    }
    return [url, requestInit];
  };
}
