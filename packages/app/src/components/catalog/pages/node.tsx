import { EntityLayout } from "@backstage/plugin-catalog";
import { NodeDetailsComponent } from "@internal/plugin-edgefarm/src/components/nodes/details";
import { NodeMetricsComponent } from "@internal/plugin-edgefarm/src/components/nodes/metrics";
import React from "react";

export const nodeEntityPage = (
    <EntityLayout>
        <EntityLayout.Route path="/" title="Overview">
            <NodeDetailsComponent />
        </EntityLayout.Route>

        <EntityLayout.Route path="/metrics" title="Metrics">
            <NodeMetricsComponent />
        </EntityLayout.Route>

    </EntityLayout>
);
