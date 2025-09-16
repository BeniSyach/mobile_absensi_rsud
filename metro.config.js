/* eslint-env node */

const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Pastikan JSON dan BIN ikut ke bundler
config.resolver.assetExts = [
  ...config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  'tflite',
  'bin',
  'json',
];

// Resolver untuk TensorFlow.js
config.resolver.alias = {
  ...config.resolver.alias,
  crypto: 'react-native-crypto-js',
};

// Tambahan optimisasi release untuk Vision Camera + Worklets + Reanimated
config.transformer.minifierConfig = {
  mangle: { toplevel: true, keep_fnames: true },
  compress: {
    unused: true,
    dead_code: true,
    drop_debugger: true,
    conditionals: true,
    evaluate: true,
    drop_console: true,
  },
  output: {
    ascii_only: true,
    comments: false,
  },
  keep_fnames: true,
};

config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'svg',
  'cjs',
  'mjs',
];

// Pastikan NativeWind tetap jalan
module.exports = withNativeWind(config, { input: './global.css' });
