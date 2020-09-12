import React from "react"
import { Link } from "gatsby"

import { rhythm } from "../utils/typography"

declare const __PATH_PREFIX__: string // TODO: Gatsby から型定義を持ってこれるようにする

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  let header

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
          {/* TODO: 画像を持っていく */}
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
