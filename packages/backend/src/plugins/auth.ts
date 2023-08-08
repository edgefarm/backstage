import {
  createRouter,
  providers,
  defaultAuthProviderFactories,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const router = await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    discovery: env.discovery,
    tokenManager: env.tokenManager,
    providerFactories: {
      ...defaultAuthProviderFactories,
      'keycloak-auth-provider': providers.oidc.create({
        signIn: {
          resolver(info, ctx) {
            const name = info.result.userinfo.preferred_username ?? 'guest';
            console.log('auth ts resolver: signing in user name', name);

            return ctx.signInWithCatalogUser({
              entityRef: { name },
            });
          },
        },
      }),
    },
    // ..
  });
  return router;
}
