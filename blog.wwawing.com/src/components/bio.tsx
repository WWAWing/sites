/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"

import { rhythm } from "../utils/typography"
import { BioQueryQuery } from "../../graphql-types"

const Bio: React.FC = () => {
  const data: BioQueryQuery = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
          }
        }
      }
    }
  `)

  const { author, social } = data.site.siteMetadata
  return (
    <div
      style={{
        display: `flex`,
        marginBottom: rhythm(2),
      }}
    >
      {/* TODO: アイコン画像を持っていく */}
      <div>
        <p
          style={{
            marginBottom: rhythm(0.5),
          }}
        >
          {author.summary}
        </p>
        <ul
          style={{
            marginTop: rhythm(0.5),
          }}
        >
          <li>
            <a href={`https://twitter.com/${social.twitter}`} target="_blank" rel="noopenner noreferrer">
              必要であれば Twitter アカウントもフォローしましょう。
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Bio
