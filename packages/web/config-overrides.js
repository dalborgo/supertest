const rewireYarnWorkspaces = require('react-app-rewire-yarn-workspaces')
const {addBabelPlugin, override} = require('customize-cra')

module.exports = (config, env) => rewireYarnWorkspaces(config, env)

module.exports = override(
  addBabelPlugin(['@babel/plugin-proposal-optional-chaining'])
)

