import { ClusterDetails } from "../cluster-locator";
import fetch, { RequestInit } from 'node-fetch';
import { bufferFromFileOrString } from '@kubernetes/client-node';
import * as https from 'https';
import { NodeDetails } from "./nodeDetails";
import { NodeQuota } from "./nodeQuota";
import { MemoryQuotaAggregator, CpuQuotaAggregator } from "./quotaAggregator";

export class Client {
    constructor(readonly cluster: ClusterDetails) { }

    async getNodeDetails(nodeName: string): Promise<NodeDetails> {
        const [url, requestInit] = this.pepareRequest(this.cluster);
        url.pathname = `/api/v1/nodes/${nodeName}`;

        const resp = await fetch(url, requestInit);
        const data = await resp.json();

        return this.handleErrorResponse(data);
    }

    async getNodeQuota(nodeName: string): Promise<NodeQuota> {
        const [url, requestInit] = this.pepareRequest(this.cluster);
        url.pathname = `/api/v1/pods`;
        url.search = `fieldSelector=spec.nodeName=${nodeName},status.phase!=Failed,status.phase!=Succeeded&limit=500`

        const resp = await fetch(url, requestInit);
        const data = await resp.json();

        if (data.code >= 400) {
            throw new Error(data.message);
        }
        const memQuotaAggregator = new MemoryQuotaAggregator();
        const cpuQuotaAggregator = new CpuQuotaAggregator();

        const memory = memQuotaAggregator.fromKubernetesQuotaResponse(data)
        const cpu = cpuQuotaAggregator.fromKubernetesQuotaResponse(data)

        const nodeDetails = await this.getNodeDetails(nodeName);
        memory.allocatable = memQuotaAggregator.fromKubernetesDetailsResponse(nodeDetails);
        cpu.allocatable = cpuQuotaAggregator.fromKubernetesDetailsResponse(nodeDetails);

        return {memory, cpu};
    }

    handleErrorResponse(data: any): NodeDetails {
        if (data.code >= 400) {
            throw new Error(data.message);
        }

        return new NodeDetails(data);
    }

    private pepareRequest = (
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
    }
}
