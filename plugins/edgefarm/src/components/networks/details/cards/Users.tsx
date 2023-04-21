import { CardTab, TabbedCard, WarningPanel } from '@backstage/core-components';
import React from 'react';
import UserDetails from './User';
import { CircularProgress, Typography } from '@material-ui/core';
import { User } from '@internal/plugin-edgefarm-backend';

type Props = {
  items: User[];
  isLoading: boolean;
};

const Users = ({ items, isLoading }: Props) => {
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
      <TabbedCard title="User">
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
              <UserDetails value={item} />
            </CardTab>
          );
        })}
      </TabbedCard>
    </>
  );
};

export default Users;
