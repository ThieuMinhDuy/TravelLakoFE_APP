module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@services': './src/services',
          '@appTypes': './src/types',
          '@types': './src/types',
          '@constants': './src/constants',
          '@theme': './src/theme',
          '@utils': './src/utils',
          '@store': './src/store',
          '@hooks': './src/hooks',
          '@helpers': './src/helpers',
        },
      },
    ],
  ],
};

