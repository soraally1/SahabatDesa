/* eslint-env node */
export default {
  rules: {
    'react/no-unknown-property': ['error', {
      ignore: [
        'object',
        'position',
        'rotation',
        'intensity',
        'castShadow',
        'shadow-mapSize-width',
        'shadow-mapSize-height',
        'attach',
        'args'
      ]
    }]
  }
};
