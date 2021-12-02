import * as React from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HeroSection from "../components/HeroSection";
import Header from "../components/Header"
import Projects from "../components/Projects"



const darkTheme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: '#dd5013' ,
    },
    secondary: {
      main: '#fcb733',
    },
  }
});



// markup
const IndexPage = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Header/>
      <HeroSection/>
      <Projects/>
    </ThemeProvider>
  );
}

export default IndexPage
