import { Link, useStaticQuery, graphql } from "gatsby"
import React from "react"
import headerStyles from "./header.module.scss"
import ImagePerfil from "./image-perfil"

interface Props {
  siteTitle: string
}

const Header = ({ siteTitle }: Props) => (

  <header className={headerStyles.header}>
    <ImagePerfil pathImage={"perfil.jpeg"} />
    <h1>
      <Link
        className={headerStyles.title}
        to="/">
        {siteTitle}
      </Link>
    </h1>
  </header>
)

export default Header
