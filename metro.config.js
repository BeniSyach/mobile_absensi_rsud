/* eslint-env node */

const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Tambahan optimisasi release untuk Vision Camera + Worklets + Reanimated
config.transformer.minifierConfig = {
  mangle: { toplevel: true },
  compress: {
    unused: true,
    dead_code: true,
    drop_debugger: true,
    conditionals: true,
    evaluate: true,
    drop_console: true, // Hapus semua console.* di release
  },
  output: {
    ascii_only: true,
    comments: false,
  },
};

// Kalau kamu pakai SVG, aktifkan ini (bisa dihapus kalau tidak pakai SVG)

config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== 'svg'
);
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'svg',
  'cjs',
  'mjs',
];

// Pastikan NativeWind tetap jalan
module.exports = withNativeWind(config, { input: './global.css' });
