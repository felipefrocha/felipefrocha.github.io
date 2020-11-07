import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import imageStyles from './image.module.scss'

/*
 * This component is built using `gatsby-image` to automatically serve optimized
 * images with lazy loading and reduced file sizes. The image is loaded using a
 * `useStaticQuery`, which allows us to load the image from directly within this
 * component, rather than having to pass the image data down from pages.
 *
 * For more information, see the docs:
 * - `gatsby-image`: https://gatsby.dev/gatsby-image
 * - `useStaticQuery`: https://www.gatsbyjs.com/docs/use-static-query/
 */
interface Props {
  pathImage: string
  className?: string | object
}


const Image = ({pathImage, className}:Props) => {
  const data = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: { eq: "gatsby-astronaut.png" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)
  console.log(pathImage);

  if (!data?.placeholderImage?.childImageSharp?.fluid) {
    return <div>Picture not found</div>
  }

  return <Img className={className || imageStyles.img} fluid={data.placeholderImage.childImageSharp.fluid} />
}

export default Image
