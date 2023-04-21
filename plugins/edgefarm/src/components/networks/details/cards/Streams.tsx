import { CardTab, TabbedCard, WarningPanel } from '@backstage/core-components';
import React from 'react';
import { Stream } from '@internal/plugin-edgefarm-backend';
import StreamComponent from './Stream';
import { CircularProgress, Typography } from '@material-ui/core';

type Props = {
  items: Stream[];
  isLoading: boolean;
};

const Streams = ({ items, isLoading }: Props) => {
  if (isLoading) return <CircularProgress />;

  if (!items || items.length === 0)
    return (
      <WarningPanel
        title="No streams found"
        message="This networks seems to have no streams."
      />
    );

  return (
    <>
      <TabbedCard title="Streams">
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
              <StreamComponent value={item} />
            </CardTab>
          );
        })}
      </TabbedCard>
    </>
  );
};

export default Streams;
