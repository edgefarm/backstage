import { ClusterDetails } from '../cluster-locator';
import fetch, { RequestInit } from 'node-fetch';
import { bufferFromFileOrString } from '@kubernetes/client-node';
import * as https from 'https';
import { NodeDetails as NodeDetails } from './nodeDetails';
import { NodeQuota } from './nodeQuota';
import { MemoryQuotaAggregator, CpuQuotaAggregator } from './quotaAggregator';
import { ApplicationDetails as ApplicationDetails } from './applicationDetails';
import { Details as NetworkDetails } from './networkDetails';
import { Details as RolloutDetails } from './rolloutDetails';
import { RolloutStatus } from './rolloutStatus';
import { NodeDetailsDto } from './common';

export class Client {
  constructor(readonly cluster: ClusterDetails) {}

  async getNodeDetails(nodeName: string): Promise<NodeDetails> {
    const [url, requestInit] = this.prepareRequest(this.cluster);
    url.pathname = `/api/v1/nodes/${nodeName}`;

    const resp = await fetch(url, requestInit);
    const data = await resp.json();

    return this.handleErrorResponse<NodeDetails>(NodeDetails, data);
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

  async getApplicationDetails(
    appName: string,
    namespace?: string,
  ): Promise<ApplicationDetails> {
    const [url, requestInit] = this.prepareRequest(this.cluster);

    const ns = namespace ?? 'default';
    url.pathname = `/apis/core.oam.dev/v1beta1/namespaces/${ns}/applications/${appName}`;

    const resp = await fetch(url, requestInit);
    const data = await resp.json();

    return this.handleErrorResponse<ApplicationDetails>(
      ApplicationDetails,
      data,
    );
  }

  async getNetworkDetails(
    name: string,
    namespace?: string,
  ): Promise<NetworkDetails> {
    const [url, requestInit] = this.prepareRequest(this.cluster);

    const ns = namespace ?? 'default';
    url.pathname = `/apis/streams.network.edgefarm.io/v1alpha1/namespaces/${ns}/networks/${name}`;

    const resp = await fetch(url, requestInit);
    const data = await resp.json();

    return this.handleErrorResponse<NetworkDetails>(NetworkDetails, data);
  }

  async getRolloutDetails(name: string): Promise<RolloutDetails> {
    const [url, requestInit] = this.prepareRequest(this.cluster);

    const namespace = 'system-upgrade';
    url.pathname = `/apis/upgrade.cattle.io/v1/namespaces/${namespace}/plans/${name}`;

    const resp = await fetch(url, requestInit);
    const data = await resp.json();

    return this.handleErrorResponse<RolloutDetails>(RolloutDetails, data);
  }

  async getRolloutStatus(name: string): Promise<RolloutStatus> {
    const planDetails = await this.getRolloutDetails(name);

    const nodeList: {
      name: string;
      status: boolean;
    }[] = [];

    for (const v of planDetails.NodeSelector) {
      const [url, requestInit] = this.prepareRequest(this.cluster);
      const selector = v.replace(/ exists/g, '');
      url.pathname = `/api/v1/nodes`;
      url.search = `labelSelector=${encodeURI(selector)}&limit=500`;

      const resp = await fetch(url, requestInit);
      const data: { code: number; items?: NodeDetailsDto[] } =
        await resp.json();

      if (data.code >= 400) {
        continue;
      }

      data.items!.forEach(node => {
        nodeList.push({
          name: node.metadata.name,
          status: !!node.metadata.labels[`plan.upgrade.cattle.io/${name}`],
        });
      });
    }

    return this.handleErrorResponse<RolloutStatus>(RolloutStatus, {
      nodes: nodeList,
    });
  }

  handleErrorResponse<T>(Type: { new (data: any): T }, data: any): T {
    if (data.code >= 400) {
      throw new Error(data.message);
    }

    return new Type(data);
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
