import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  let header
  const data = useStaticQuery(graphql`
    query TitleBannerQuery {
      banner: file(absolutePath: { regex: "/title-banner.png/" }) {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  if (location.pathname === rootPath) {
    header = (
      <h1
        style={{
          marginBottom: rhythm(1.5),
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          <Image
            fluid={data.banner.childImageSharp.fluid}
            alt={title}
            style={{
              display: `inline-block`,
              width: 150,
              marginRight: rhythm(0.5)
            }}
          />
          {title}
        </Link>
      </h1>
    )
  } else {
    header = (
      <h3
        style={{
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          <Image
            fluid={data.banner.childImageSharp.fluid}
            alt={title}
            style={{
              display: `inline-block`,
              width: 120,
              marginRight: rhythm(0.25)
            }}
          />
          {title}
        </Link>
      </h3>
    )
  }
  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      <header>{header}</header>
      <main>{children}</main>
      <footer>
        <nav>
          <a href="https://wwawing.com" target="_blank" rel="noopenner noreferrer">WWA Wing</a>
        </nav>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>
      </footer>
    </div>
  )
}

export default Layout
