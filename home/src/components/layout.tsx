/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React, {  ReactNode } from "react"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import layoutStyles from './layout.module.scss'
import Footer from "./footer"
import Navigation from "./navigation"

interface Props {
  children: ReactNode
}

const Layout = ({ children }:Props) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title,
            author
        }
      }
    }
  `)

  return (
    <div className={layoutStyles.container}>
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
      <Navigation/>
        <div
        className={layoutStyles.content}
      >
        <main>{children}</main>
      </div>
      <Footer siteAuthor={data.site.siteMetadata?.author || `author`}/>
    </div>
  )
}


export default Layout
