import React from 'react'
import { Circle } from 'rc-progress';
import { Box, Container, makeStyles, createStyles, Theme, useTheme, Paper } from '@material-ui/core';
import { BackstagePalette, BackstageTheme } from '@backstage/theme';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  root: {
    position: 'relative',
    lineHeight: 0,
  },
  overlay: {
    position: 'absolute',
    top: '55%',
    left: '49%',
    transform: 'translate(-50%, -50%)',
    fontSize: theme.typography.pxToRem(45),
    color: theme.palette.textContrast,
  },
  overlayUnit: {
    position: 'relative',
    marginTop: '2.5rem',
    fontSize: theme.typography.pxToRem(20),
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: '2.5rem',
    color: theme.palette.textContrast,
  },
  subtitle: {
    marginLeft: '0.3rem',
    color: theme.palette.textSubtle,
    fontSize: '0.7rem',
  },
  legend: {
    textAlign: 'center',
    fontSize: '0.7rem',
    lineHeight: '2.5rem',
    color: theme.palette.textContrast,
  },
  indicatorUsed: {
    width: '0.5rem',
    height: '0.5rem',
    backgroundColor: '#FF6016',
    display: 'inline-block',
    marginRight: '0.3rem',
  },
  indicatorAvailable: {
    width: '0.5rem',
    height: '0.5rem',
    backgroundColor: theme.palette.textSubtle,
    display: 'inline-block',
    marginRight: '0.3rem',
    marginLeft: '0.3rem',
  },
  circle: {
    width: '60%',
    transform: 'translate(30%, 0)',
  },
}));

type Props = {
  title: string;
  subtitle: string;
  unit: string;
  limit: number;
  actual: number;
}

const QuotaItem = (props: Props) => {
  const {limit, actual, unit} = props;

  const classes = useStyles(props);
  return (
    <Box className={classes.root}>
      <Container className={classes.title}>
        {props.title}
        <small className={classes.subtitle}>
          {props.subtitle}
        </small>
      </Container>
      <Circle
        percent={actual / limit * 100}
        strokeWidth={12}
        trailWidth={12}
        strokeLinecap="butt"
        strokeColor="#FF6016"
        className={classes.circle} />
      <Box className={classes.overlay}>
        {limit}
        <Paper className={classes.overlayUnit}>{unit}</Paper>
      </Box>
      <Box className={classes.legend}>
        <Paper variant="outlined" square className={classes.indicatorUsed}></Paper>Used <Paper variant="outlined" square className={classes.indicatorAvailable}></Paper>Available
      </Box>
    </Box>
  )
}

export default QuotaItem
