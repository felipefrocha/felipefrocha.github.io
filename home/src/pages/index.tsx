import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import User from "../components/user"


const IndexPage = () => (

  <Layout>
    <SEO title="Home" />
    <User avatar={"profile1.png"} username={"Felipe Fonseca Rocha"} excerpt={"Testes"}/>
  </Layout>
)

export default IndexPage
