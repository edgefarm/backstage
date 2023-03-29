import { ClusterDetails } from "../cluster-locator";
import fetch, { RequestInit } from 'node-fetch';
import { bufferFromFileOrString } from '@kubernetes/client-node';
import * as https from 'https';
import { NodeDetails } from "./nodeDetails";



export class Client {
    constructor(readonly cluster: ClusterDetails) { }

    async getNodeDetails(nodeName: string): Promise<NodeDetails> {
        const [url, requestInit] = this.pepareRequest(this.cluster);
        url.pathname = `/api/v1/nodes/${nodeName}`;

        const resp = await fetch(url, requestInit);
        const data = await resp.json();

        return this.handleErrorResponse(data);
    }

    handleErrorResponse(data: any): NodeDetails  {
        if(data.code >= 400){
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
