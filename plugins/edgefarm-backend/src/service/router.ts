import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { ClusterLocator } from '../cluster-locator';
import { Client } from '../kubernetes';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;
  const router = Router();
  router.use(express.json());

  router.get('/:clusterName/nodes/:nodeName', async (req, response) => {
    const { nodeName, clusterName } = req.params;

    const clusterDetails = new ClusterLocator(config).getClusterDetails(
      clusterName,
    );
    if (clusterDetails === undefined) {
      response
        .status(400)
        .json({ error: `Cluster config for ${clusterName} not found` });
      return;
    }

    const api = new Client(clusterDetails);

    try {
      const resp = await api.getNodeDetails(nodeName);
      response.json(resp);
    } catch (e: any) {
      response.status(500).json({ error: e.message });
    }
  });

  router.get('/:clusterName/nodes/:nodeName/quota', async (req, response) => {
    const { nodeName, clusterName } = req.params;

    const clusterDetails = new ClusterLocator(config).getClusterDetails(
      clusterName,
    );
    if (clusterDetails === undefined) {
      response
        .status(400)
        .json({ error: `Cluster config for ${clusterName} not found` });
      return;
    }

    const api = new Client(clusterDetails);

    try {
      const resp = await api.getNodeQuota(nodeName);
      response.json(resp);
    } catch (e: any) {
      response.status(500).json({ error: e.message });
    }
  });

  router.get('/:clusterName/applications/:appName', async (req, response) => {
    const { appName, clusterName } = req.params;

    const clusterDetails = new ClusterLocator(config).getClusterDetails(
      clusterName,
    );
    if (clusterDetails === undefined) {
      response
        .status(400)
        .json({ error: `Cluster config for ${clusterName} not found` });
      return;
    }

    const api = new Client(clusterDetails);

    try {
      const resp = await api.getApplicationDetails(appName);
      response.json(resp);
    } catch (e: any) {
      response.status(500).json({ error: e.message });
    }
  });

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });
  router.use(errorHandler());
  return router;
}

export interface ClusterDetails {
  name: string;
  url: string;
  serviceAccountToken?: string | undefined;
  skipTLSVerify?: boolean;
  caData?: string | undefined;
  caFile?: string | undefined;
}
