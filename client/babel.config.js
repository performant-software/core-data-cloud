export default {
  plugins: [
    'transform-flow-strip-types'
  ],
  presets: [
    '@babel/preset-flow',
    ['@babel/preset-env', {
      targets: {
        node: 'current'
      }
    }]
  ]
};
