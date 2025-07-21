export default {
  plugins: [
    'babel-plugin-syntax-hermes-parser',
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
