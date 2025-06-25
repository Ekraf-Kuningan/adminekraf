// ...existing code...
module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    // ...existing code...
    'node_modules/(?!(?:react-native|@react-native|react-native-reanimated|@react-navigation|react-native-vector-icons|nativewind|@fortawesome|react-native-animatable|react-native-linear-gradient|react-native-image-picker|@react-native-async-storage|react-native-css-interop|react-native/Libraries|@react-native-community)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: [
    '<rootDir>/.nodule/'
  ],
  // ...existing code...
  globals: {
    'babel-jest': {
      babelrc: false,
      configFile: './babel.config.js',
    },
  },
};
// ...existing code...