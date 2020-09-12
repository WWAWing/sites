import path from 'path'
import { GatsbyNode } from 'gatsby'
import { BlogPostsQuery, MarkdownRemarkFields, MarkdownRemarkFrontmatter } from '../graphql-types'

/**
 * allMarkdownRemark の1つ1つの記事の型情報です。
 *     主に前後記事のリンクを作成する際に使用します。
 */
export type BlogPostNode = {
  fields?: Pick<MarkdownRemarkFields, "slug">
  frontmatter?: Pick<MarkdownRemarkFrontmatter, "title">
}

export const createPages: GatsbyNode["createPages"] = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.tsx`)
  const result = await graphql<BlogPostsQuery>(
    `
      query BlogPosts {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  )

  if (result.errors || result.data === undefined) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })
}
