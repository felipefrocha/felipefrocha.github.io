import { Avatar, Button, CardHeader, Container, Grid, Hidden, Paper, Typography, Zoom } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { Box, width } from "@mui/system";
import * as React from "react";
import { useState, useEffect } from "react";
import Social from "./Social";
import {StaticImage} from 'gatsby-plugin-image';

const useStyles = makeStyles(theme => ({
  section: {
    minWidth: "360px",
    height: "100vh",
  },
  container: {
    height: "100%"
  },
  content: {
    height: "100%",
    color: "white",
    zIndex: 5,
    position: 'relative'
  },
  title: {
    fontSize: "1em",
  },
  containerbox: {
    padding: '5%',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: '100%',
    width: '100%',
    position: "absolute",
    zIndex: 3
  },
  heroImage: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: '100%',
    width: '100%',
    position: "absolute",
    zIndex: 2
  }
}));


const HeroSection = () => {
  const url = 'https://avatars.githubusercontent.com/u/12678069?s=400&u=9b5e5f280f0dd6b5c4f0cea3f7f88b143e8a7e68&v=4';
  const size = 125;
  const styles = useStyles();
  const [shouldShow, setShouldShow] = useState(false);
  useEffect(() => setShouldShow(true));
  return (
    <Paper className={styles.section}>
      <StaticImage className={styles.heroImage} src="https://images.unsplash.com/photo-1549605659-32d82da3a059?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"/>
      <div className={styles.overlay}> </div>
      <Container className={styles.container} maxWidth="md">
        <Grid
          className={styles.content}
          container
          justifyContent="space-between"
          alignItems="center"
        >
          <Zoom in={shouldShow}>
            <Grid item sm={8}>
              <Hidden mdDown={true}>
                <CardHeader
                  avatar={
                    <Avatar
                      alt="Felipe Rocha"
                      src={url}
                      sx={{ width: size, height: size }}
                    />
                  }
                  title={<><Typography component="h1" variant="h3" className={styles.title} >Felipe F. Rocha</Typography>
                    <Typography variant="h5">Engenheiro de sistemas, DevOps e artesão.</Typography></>}
                />
              </Hidden>
              <Hidden mdUp={true}>
                <Typography component="h1" variant="h3" className={styles.title} >Felipe F. Rocha</Typography>
                <Typography variant="h5">Engenheiro de sistemas, DevOps e artesão.</Typography>
              </Hidden>
              <Box className={styles.containerbox}>
                <Box my={2}>
                  <Button
                    href="mailto:felipe.rocha@usodus.com"
                    variant="outlined"
                    color="secondary"
                  >
                    Get in Touch!
                  </Button>
                </Box>
              </Box>
              <Hidden mdUp={true}>
                <Social direction="row" />
              </Hidden>
            </Grid>
          </Zoom>
          <Hidden mdDown={true}>
            <Grid item>
              <Social direction="column" />
            </Grid>
          </Hidden>
        </Grid>
      </Container>
    </Paper>);
}

export default HeroSection;