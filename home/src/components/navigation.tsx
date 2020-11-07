import navigationStyles from "./navigation.module.scss"
import { Link } from "gatsby"
import React from "react"

const Navigation = () => {
  return (
    <nav>
      <ul className={navigationStyles.navList}>
        <li>
          <Link className={navigationStyles.navItem} activeClassName={navigationStyles.activeNavItem} to={"/"}>Home</Link>
        </li>
        <li>
          <Link className={navigationStyles.navItem} activeClassName={navigationStyles.activeNavItem} to={"/blog"}>Blog</Link>
        </li>
        <li>
          <Link className={navigationStyles.navItem} activeClassName={navigationStyles.activeNavItem} to={"/about"}>About</Link>
        </li>
        <li>
          <Link className={navigationStyles.navItem} activeClassName={navigationStyles.activeNavItem}
                to={"/contact"}>Contact</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation;