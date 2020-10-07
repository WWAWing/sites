import path from 'path'
import { GatsbyNode } from 'gatsby'

type BlogPostsQuery = {
  allMarkdownRemark: {
    edges: {
      node: BlogPostNode
    }[]
  }
}

// TODO: graphql-types.ts から有効な型情報を持っていく
export type BlogPostNode = {
  fields: {
    slug: string
  },
  frontmatter: {
    title: string
  }
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
