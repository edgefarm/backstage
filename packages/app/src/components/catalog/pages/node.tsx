import { EntityLayout } from "@backstage/plugin-catalog";
import { EntityKubernetesContent } from "@backstage/plugin-kubernetes";
import { NodeDetailsComponent } from "@internal/plugin-edgefarm/src/components/nodes/details";
import React from "react";

export const nodeEntityPage = (
    <EntityLayout>
        <EntityLayout.Route path="/" title="Overview">
            <NodeDetailsComponent />
        </EntityLayout.Route>

        <EntityLayout.Route path="/kubernetes" title="Kubernetes">
            <EntityKubernetesContent refreshIntervalMs={30000} />
        </EntityLayout.Route>

    </EntityLayout>
);
