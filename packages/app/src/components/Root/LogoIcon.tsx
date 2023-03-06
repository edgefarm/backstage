import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  svg: {
    width: 'auto',
    height: 28,
  },
  path: {
    fill: '#7df3e1',
  },
});

const LogoIcon = () => {
  return <img src="https://avatars.githubusercontent.com/u/70633499?s=35" width="35px"/>;
};

export default LogoIcon;
