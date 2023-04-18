import {
  CardTab,
  StatusError,
  StatusOK,
  TabbedCard,
  WarningPanel,
} from '@backstage/core-components';
import React from 'react';
import { ApplicationDetails } from '@internal/plugin-edgefarm-backend';
import Component from './Component';
import { CircularProgress, Typography } from '@material-ui/core';

const Components = (props: {
  details: ApplicationDetails | null;
  isLoading: boolean;
}) => {
  if (props.isLoading) return <CircularProgress />;

  const details = props.details;
  if (!details)
    return (
      <WarningPanel
        title="Data is missing"
        message="We were unable to find any data for this node."
      />
    );

  return (
    <>
      <TabbedCard title="Components">
        {details.Components.map((c, i) => {
          return (
            <CardTab
              key={i}
              label={
                <Typography component="span">
                  {c.Healthy ? <StatusOK /> : <StatusError />}
                  {c.Name.toLocaleUpperCase()}
                </Typography>
              }
            >
              <Component component={c} />
            </CardTab>
          );
        })}
      </TabbedCard>
    </>
  );
};

export default Components;
