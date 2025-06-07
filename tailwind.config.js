/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./App.{js,jsx,ts,tsx}", // Untuk file App utama Anda
    "./app/**/*.{js,jsx,ts,tsx}", // Untuk semua file JS/JSX/TS/TSX di dalam folder 'app' dan subfoldernya
    "./components/**/*.{js,jsx,ts,tsx}", // Untuk semua file JS/JSX/TS/TSX di dalam folder 'components' dan subfoldernya
    // Jika Anda memiliki file atau folder lain yang berisi komponen dengan className, tambahkan juga di sini
    // Misalnya, jika ada komponen langsung di root: "./*.{js,jsx,ts,tsx}" (tapi ini mungkin terlalu luas)
    // Atau jika ada folder lain, misal "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
    
      fontFamily: {
        'poppins-regular': ['Poppins-Regular'], // Nama file font sebenarnya
        'poppins-medium': ['Poppins-Medium'],
        'poppins-bold': ['Poppins-SemiBold'],
        'poppins-extrabold': ['Poppins-ExtraBold'],
      },
      colors: {
        'primary': '#FFAA01', // Warna utama
        'custom-orange': '#FFAA01', // Contoh warna kustom
        'custom-orange-dark': '#FFAA01', // Contoh warna kustom
      }
    },
  },
  plugins: [],
};