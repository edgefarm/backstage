import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  svg: {
    width: 'auto',
    height: 30,
  },
  path: {
    fill: '#7df3e1',
  },
});
const LogoFull = () => {
  return <img src="https://www.ci4rail.com/wp-content/uploads/2020/08/Logo-Wei%C3%9F1-1.png" width="180px"/>;
};

export default LogoFull;
