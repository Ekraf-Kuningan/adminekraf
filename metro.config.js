// metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

module.exports = withNativeWind(mergeConfig(getDefaultConfig(__dirname), config), {
  // Pastikan path ini benar menunjuk ke file CSS Anda
  input: './global.css', // Ganti dengan path ke file CSS global Anda
});