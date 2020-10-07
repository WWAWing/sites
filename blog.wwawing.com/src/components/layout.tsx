import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"

declare const __PATH_PREFIX__: string // TODO: Gatsby から型定義を持ってこれるようにする

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
        maxWidth: rhythm(30),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      <header>{header}</header>
      <main>{children}</main>
      <footer
        style={{
          marginTop: rhythm(2),
        }}
      >
        <nav>
          <p>
            <a href="https://wwawing.com" target="_blank" rel="noopenner noreferrer">WWA Wing</a>
          </p>
        </nav>
        <p>Internet RPG "World Wide Adventure" © 1996-2017 NAO</p>
        <p>"WWA Wing" © 2013-{new Date().getFullYear()} WWA Wing Team</p>
        <p>
          Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </p>
      </footer>
    </div>
  )
}

export default Layout
