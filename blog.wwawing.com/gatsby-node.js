const { createFilePath } = require(`gatsby-source-filesystem`)

require(`ts-node`).register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es2017',
    noImplicitAny: false,
  },
})

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
