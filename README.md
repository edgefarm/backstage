# EdgeFarm Portal

This application is based on the Backstage application from Spotify
Relevant docs are

- https://backstage.io/docs/overview/what-is-backstage
- https://github.com/backstage/backstage

## Directory Structure

This application is created by a kind of boilerplate provided by the Backstage developers. See https://backstage.io/docs/getting-started/
Any changes to Backstage, which is continuously developed by Spotify, are not to be implemented directly into this portal application but managed by the yarn package manager. Spotify offers a detailed upgrade guide for this: https://backstage.io/docs/getting-started/keeping-backstage-updated.

The folder structure is therefore created by the boilerplate.

```
/
  /node_modules # Contains all dependencies installed by the package manager yarn
  /packages
    /app # Here you find all necessary files for the frontend
      /public # Files that are always accessible in the browser
      /src # All relevant files where development is done
    /backend # Here you can find all necessary files for the frontend
  /plugins # Potential place to develop plugins. The idea behind a plugin is reusability in a modular way.
    /edgefarm # A plugin which contains all extensions in the frontend
    /edgefarm-backend # A plugin which includes all extensions in the backend. Especially the Kubernetes connection.
```

More details about the structure can be found here: https://backstage.io/docs/getting-started/project-structure

## Tooling

### Package Manager

As package manager `yarn` is used. With yarn you can install all dependencies that are defined in the package.json. A distinction is made between dependencies and dev-dependencies. The latter are not installed with the execution `yarn install --production`.

As an alternative, there is the package manager `npm`, which has no advantages or disadvantages, but SPotify decided to use yarn, so it is used here as well.

### Building Tools

The typescript must be converted to javascript and the javascript is usually bundled into one or sometimes several larger files. Webpack and Rollup are responsible for this.
The Backstage documentation says: `Under the hood the CLI uses Webpack for bundling, Rollup for building packages, Jest for testing, and eslint for linting.`
See also https://backstage.io/docs/local-dev/cli-overview/#introduction

### Run application locally

Before you start, make sure that you've got a github application registered and created a client secret as well as a valid github personal access token.

Define the following environment variables before starting:

- GITHUB_TOKEN (classic token with all capabilities in repo, workflow and notifications)
- GITHUB_CLIENT_ID
- GITHUB_SECRET
- K8S_URL
- K8S_SA_TOKEN
- ARGOCD_BASEURL
- ARGOCD_AUTH_TOKEN
- ARGOCD_USERNAME
- ARGOCD_PASSWORD

For now, argocd values can be any dummy values as the argocd functionality isn't finished in the project. 

```sh
export GITHUB_TOKEN=<token>
export GITHUB_CLIENT_ID=<gh applications client id>
export GITHUB_SECRET=<gh applications client secret>
export K8S_URL=<api server address with http schema>
export K8S_SA_TOKEN=<admin service account token>
export ARGOCD_BASEURL=http://dummy
export ARGOCD_AUTH_TOKEN=dummy
export ARGOCD_USERNAME=dummy
export ARGOCD_PASSWORD=dummy

copy app-config.local.example.yaml app-config.local.yaml
```

See this example `app-config.local.example.yaml`.

```yaml
app:
  baseUrl: http://localhost:3000
backend:
  baseUrl: http://localhost:7007
  listen:
    port: "7007"
  csp:
    connect-src: ["'self'", "http:", "https:"]
    img-src: ["'self'", "data:", "avatars.githubusercontent.com"]
    frame-src: ["https://grafana.edgefarm.dev"]

  database:
    client: better-sqlite3
    connection: ":memory:"

integrations:
  github:
    - host: github.com
      # This is a Personal Access Token or PAT from GitHub. You can find out how to generate this token, and more information
      # about setting up the GitHub integration here: https://backstage.io/docs/getting-started/configuration#setting-up-a-github-integration
      token: ${GITHUB_TOKEN}

auth:
  # see https://backstage.io/docs/auth/ to learn about auth providers
  environment: development
  providers:
    github:
      development:
        clientId: ${GITHUB_CLIENT_ID}
        clientSecret: ${GITHUB_SECRET}

catalog:
  # Overrides the default list locations from app-config.yaml as these contain example data.
  # See https://backstage.io/docs/features/software-catalog/software-catalog-overview#adding-components-to-the-catalog for more details
  # on how to get entities into the catalog.
  locations:
    - type: file
      target: ./workflows/all.yaml
      rules:
        - allow: [Template]
    - type: file
      target: ../../../backstage-user/ci4rail.yaml
      rules:
        - allow: [User, Group]
#    - type: url
#      target: https://github.com/edgefarm-hands-on/backstage-user/blob/main/ci4rail.yaml
#      rules:
#        - allow: [User, Group]

proxy:
  "/argocd/api":
    target: ${ARGOCD_BASEURL}/api/v1/
    changeOrigin: true
    # only if your argocd api has self-signed cert
    secure: true
    headers:
      Cookie: argocd.token=${ARGOCD_AUTH_TOKEN}

kubernetes:
  serviceLocatorMethod:
    type: "multiTenant"
  clusterLocatorMethods:
    - type: "config"
      clusters:
        - url: ${K8S_URL}
          name: default
          authProvider: "serviceAccount"
          skipTLSVerify: true
          skipMetricsLookup: true
          serviceAccountToken: ${K8S_SA_TOKEN}

argocd:
  baseUrl: ${ARGOCD_BASEURL}
  username: ${ARGOCD_USERNAME}
  password: ${ARGOCD_PASSWORD}
  waitCycles: 25
  appLocatorMethods:
    - type: "config"
      instances:
        - name: argocd
          url: ${ARGOCD_BASEURL}
          token: ${ARGOCD_AUTH_TOKEN}
```

`yarn dev` starts both frontend and backend without debugger
yarn start` starts only the frontend. Debugging is done via the developer console in the browser.
`yarn start-backend` starts only the backend. If you start the backend with `yarn start-backend --inspect` via VSCode, a debugger is attached.

You can find more information here https://www.youtube.com/watch?v=3srSf_-89OA