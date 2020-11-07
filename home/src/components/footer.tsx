import React from "react"
import { graphql, useStaticQuery } from "gatsby"

interface Props{
  siteAuthor: string
}

const Footer = ({siteAuthor}:Props) => {
    return (
    <footer style={{
      marginTop: `2rem`
    }}>

      © {new Date().getFullYear()}, Built by
      {` `}
      <a href="https://www.linkedin.com/in/felipefonsecarocha/">
        {siteAuthor}
      </a>
    </footer>
  )
}

export default Footer
