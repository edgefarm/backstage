import {
  createRouter,
  providers,
  defaultAuthProviderFactories,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import {
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
} from '@backstage/catalog-model';

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
            const name = info.result.userinfo.preferred_username ?? "guest";
            console.log("auth ts resolver: signing in user name", name);

            // const userRef = stringifyEntityRef({
            //   kind: 'User',
            //   name: info.result.userinfo.name ?? "guest",
            //   namespace: DEFAULT_NAMESPACE,
            // });
            // return ctx.issueToken({
            //   claims: {
            //     sub: userRef, // The user's own identity
            //     ent: [userRef], // A list of identities that the user claims ownership through
            //   },
            // });
            return ctx.signInWithCatalogUser({
              entityRef: { name },
            });
          },
        },
     }),
    },
    // ..
  })
  //console.log("auth ts router: ", router);
  return router;
};