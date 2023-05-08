import { InfoCard, StructuredMetadataTable } from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { catalogApiRef, useEntity } from '@backstage/plugin-catalog-react';
import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

type RolloutDetails = {
  NodeSelector: string[];
};

const Details = () => {
  const api = useApi(catalogApiRef);
  const config = useApi(configApiRef);
  const backendUrl = config.getString('backend.baseUrl');
  const { entity } = useEntity();
  const annotations = entity.metadata.annotations ?? {};
  const clusterName = annotations['edgefarm.io/cluster'] ?? '';
  const rolloutName = entity.metadata.name;

  const [firmwareMetadata, setFirmwareMetadata] = useState<{
    firmware: string;
    image: string;
  }>({ firmware: 'N/A', image: 'N/A' });
  useEffect(() => {
    const updateFirmwareMetadata = async () => {
      const result = { firmware: 'N/A', image: 'N/A' };
      const firmwareRef = entity.relations
        ?.filter(r => r.type === 'dependsOn')
        .map(r => r.targetRef)
        .pop();

      if (!firmwareRef) return;

      const firmware = await api.getEntityByRef(firmwareRef);

      if (!firmware) return;

      result.firmware = firmware.metadata.name;
      result.image =
        firmware.metadata.annotations?.['edgefarm.io/release-image'] ?? 'N/A';

      setFirmwareMetadata(result);
    };
    updateFirmwareMetadata();
  }, [api, backendUrl, clusterName, entity.relations, rolloutName]);

  const [targetSelectorMetadata, setTargetSelectorMetadata] = useState<{
    NodeSelector: string[];
  }>({ NodeSelector: ['N/A'] });
  useEffect(() => {
    const update = async () => {
      const result = { NodeSelector: ['N/A'] };

      const response = await fetch(
        `${backendUrl}/api/edgefarm/${clusterName}/rollouts/${rolloutName}`,
      );
      if (response.status !== 200) return;

      const payload: RolloutDetails = await response.json();
      result.NodeSelector = payload.NodeSelector;

      setTargetSelectorMetadata(result);
    };
    update();
  }, [backendUrl, clusterName, rolloutName]);

  return (
    <Grid container>
      <Grid item xs={12} md={6}>
        <InfoCard title="Firmware" variant="gridItem">
          <StructuredMetadataTable metadata={firmwareMetadata} />
        </InfoCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoCard title="Target Selector" variant="gridItem">
          <StructuredMetadataTable metadata={targetSelectorMetadata} />
        </InfoCard>
      </Grid>
    </Grid>
  );
};

export default Details;
