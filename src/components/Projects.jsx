import {
  Container,
  Grid,
  Typography,
  Card,
  CardActions,
  Chip,
  Hidden,
  IconButton,
  CardContent,
  CardMedia,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  cardMedia: {
    width: 180,
  },
  card: {
    display: "flex",
  },
  links: {
    marginRight: "auto",
  },
  tag: {
    marginRight: 5,
    marginBottom: 5,
  },
}));

function TagsContainer({ tags }) {
  const styles = useStyles();
  return (
    <div>
      {tags.map((tag) => (
        <Chip
          className={styles.tag}
          label={tag}
          variant="outlined"
          key={tag}
        ></Chip>
      ))}
    </div>
  );
}

const Projects = () => {
  return (
    <Container maxWidth="md">
      <Box>
        <Typography variant="h4">Projects</Typography>
      </Box>
      <Grid
        container
        direction="column"
        spacing={4}
      >
        {projectsData.map((data) => <Project {...data} />)}
      </Grid>
    </Container>
  )
}

const Project = ({ title, description, imageUrl, tags, links }) => {
  const styles = useStyles();
  return (
    <Grid item>
      <Card className={styles.card}>
        <div>
          <CardContent>
            <Typography variant="h5" paragraph>
              {title}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              {description}
            </Typography>
            <Hidden mdUp>
              <TagsContainer tags={tags} />
            </Hidden>
          </CardContent>
          <CardActions>
            <div className={styles.links}>
              {links.map((linkItem) => (
                <IconButton href={linkItem.href} key={linkItem.href}>
                  <linkItem.icon />
                </IconButton>
              ))}
            </div>
            <Hidden smDown>
              <TagsContainer tags={tags} />
            </Hidden>
          </CardActions>
        </div>
        <Hidden xsDown>
          <CardMedia className={styles.cardMedia} image={imageUrl}></CardMedia>
        </Hidden>
      </Card>
    </Grid>
  );
}

const projectsData = [
  // {
  //   title: "",
  //   description:
  //     "",
  //   imageUrl:
  //     "",
  //   imageAlt: "Project 1 Image",
  //   tags: [],
  //   links: [
  //     {
  //       icon: GitHubIcon,
  //       href: "https://www.github.com/felipefrocha",
  //     },
  //     {
  //       icon: OpenInNewIcon,
  //       href: "https://www.google.com",
  //     },
  //   ],
  // },
  
];

export default Projects;