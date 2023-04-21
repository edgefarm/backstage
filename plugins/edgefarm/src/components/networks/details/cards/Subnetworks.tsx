import { CardTab, TabbedCard, WarningPanel } from '@backstage/core-components';
import React from 'react';
import SubnetworkDetails from './Subnetwork';
import { CircularProgress, Typography } from '@material-ui/core';
import { Subnetwork } from '@internal/plugin-edgefarm-backend';

type Props = {
  items: Subnetwork[];
  isLoading: boolean;
};

const Subnetworks = ({ items, isLoading }: Props) => {
  if (isLoading) return <CircularProgress />;

  if (!items || items.length === 0)
    return (
      <WarningPanel
        title="Data is missing"
        message="We were unable to find any data for this node."
      />
    );

  return (
    <>
      <TabbedCard title="Subnetworks">
        {items.map((item, i) => {
          return (
            <CardTab
              key={i}
              label={
                <Typography component="span">
                  {item.name.toLocaleUpperCase()}
                </Typography>
              }
            >
              <SubnetworkDetails value={item} />
            </CardTab>
          );
        })}
      </TabbedCard>
    </>
  );
};

export default Subnetworks;
