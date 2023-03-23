import { Config } from "@backstage/config";

export interface ClusterDetails {
    name: string;
    url: string;
    serviceAccountToken?: string;
    skipMetricsLookup?: boolean;
    caData?: string;
    caFile?: string;
    skipTLSVerify: boolean;
}

export class ClusterLocator {
    clusters: ClusterDetails[] = [];

    constructor(config: Config) {
        const clusterLocaterConfig = config.getConfigArray('kubernetes.clusterLocatorMethods')
            .find((c) => c.getString('type') === "config" ? c : undefined);
        if (clusterLocaterConfig === undefined) {
            throw new Error(
                `Cannot find any kubernetes config with type=config found`,
            );
        }

        clusterLocaterConfig!.getConfigArray('clusters').map((c) => {
            this.clusters.push(
                {
                    name: c.getString('name'),
                    url: c.getString('url'),
                    serviceAccountToken: c.getOptionalString('serviceAccountToken'),
                    skipTLSVerify: c.getOptionalBoolean('skipTLSVerify') ?? false,
                    skipMetricsLookup: c.getOptionalBoolean('skipMetricsLookup') ?? false,
                    caData: c.getOptionalString('caData'),
                    caFile: c.getOptionalString('caFile'),
                }
            );
        });
    }

    getClusterDetails(clusterName: string): ClusterDetails | undefined {
        return this.clusters.find((c) => c.name === clusterName);
    }
}
