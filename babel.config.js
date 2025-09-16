module.exports = function (api) {
  api.cache(true);

  const isDev = process.env.NODE_ENV === 'development';

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@env': './src/lib/env.js',
          },
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
            '.cjs',
            '.mjs',
          ],
        },
      ],

      // Hanya aktifkan async generator transform di dev, jarang dibutuhkan di release
      ...(isDev ? ['@babel/plugin-transform-async-generator-functions'] : []),
      // ['react-native-worklets-core/plugin'],
      // Harus paling akhir
      ['react-native-reanimated/plugin', { processNestedWorklets: true }],
    ],
  };
};
