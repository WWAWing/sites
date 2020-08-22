const { createFilePath } = require(`gatsby-source-filesystem`)

require(`ts-node`).register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es2017',
    noImplicitAny: false,
  },
})

// FIXME: We've encountered an error: Objects are not valid as a React child (found: GraphQLDocumentError: GraphQLDocumentError: Unknown fragment "GatsbyImageSharpFixed".).
//    If you meant to render a collection of children, use an array instead.
exports.createPages = require(`./gatsby-node/create-pages`).createPages

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
