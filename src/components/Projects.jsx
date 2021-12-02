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
  {
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing ",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco",
    imageUrl:
      "https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=697&q=80",
    imageAlt: "Project 1 Image",
    tags: ["React.js", "Material-UI", "Gatsby.js"],
    links: [
      {
        icon: GitHubIcon,
        href: "https://www.github.com",
      },
      {
        icon: OpenInNewIcon,
        href: "https://www.google.com",
      },
    ],
  },
  {
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco",
    imageAlt: "Project 2 Image",
    imageUrl:
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80",
    tags: ["GraphQL", "Apollo Client", "Prisma", "Material-UI"],
    links: [
      {
        icon: GitHubIcon,
        href: "https://www.github.com",
      },
      {
        icon: OpenInNewIcon,
        href: "https://www.google.com",
      },
    ],
  },
  {
    title: "Lorem ipsum dolor ",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco",
    imageAlt: "Project 3 Image",
    imageUrl:
      "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    tags: ["React.js", "Node.js", "PostgreSQL", "Next.js"],
    links: [
      {
        icon: OpenInNewIcon,
        href: "https://www.google.com",
      },
    ],
  },
];

export default Projects;