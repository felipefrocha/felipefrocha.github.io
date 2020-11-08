import React from "react"
import userStyles from "./user.module.scss"
import { Image } from "./genericImage"


interface Props {
  avatar: string
  username: string
  excerpt: string
}

const User = (props: Props) => {
  return(
    <div className={userStyles.container}>
      <div className={userStyles.userWrapper}>
        <Image image={props.avatar} name={'profile'} classname={userStyles.avatar}/>
        {/*<img className={userStyles.avatar} src={props.avatar} alt="" />*/}
        <div className={userStyles.description}>
          <h2 className={userStyles.username}>{props.username}</h2>
          <p className={userStyles.exerpt}>{props.excerpt}</p>
        </div>
      </div>
    </div>
  )
}

export default User