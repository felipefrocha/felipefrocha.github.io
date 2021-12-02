import * as React from 'react';
import { Grid, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';

const socialItems = [
  { icon: GitHubIcon, url: "https://github.com/felipefrocha" },
  { icon: LinkedInIcon, url: "https://linkedin.com/in/felipefonsecarocha" },
  { icon: TwitterIcon, url: "https://twitter.com/_felipefrocha" },
];


const useStyles = makeStyles(theme => ({
  icon: {
    fontSize: "5em",
  },
  bar: {
    backgroundColor: "#AAAAAAAA",
     borderRadius: "5px"
    
  }
}));


const Social = ({direction}) => {
  const styles = useStyles();
  return (
    <Grid
      container
      direction={direction || "row"}
      alignContent="center"
      justifyContent="space-around"
      spacin={1}
      className={styles.bar}
    >
      {socialItems.map((icon) => (
        <Grid item>
          <Link href={icon.url} target="_blank">
          <IconButton color="secondary">
              <icon.icon className={styles.icon} />
          </IconButton>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}

export default Social;