const webpack = require('webpack')
module.exports = function override(config, env) {
  config.resolve.fallback = {
    url: require.resolve('url'),
    path: require.resolve('path-browserify'),
    fs: false,
    assert: require.resolve('assert'),
    crypto: require.resolve('crypto-browserify'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    buffer: require.resolve('buffer'),
    stream: require.resolve('stream-browserify'),
    zlib: false,
    net: false,
    dns: false,
    tls: false,
    events: false,
    process: false,
    vm: false
  }
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  )

  return config
}
