module.exports = {
  root: true,
  extends: [
    '@react-native',
    'prettier', // Menambahkan ini akan menerapkan pengaturan eslint-config-prettier
  ],
  plugins: [
    'prettier', // Menambahkan ini akan memungkinkan aturan eslint-plugin-prettier
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ], // Menambahkan ini akan menampilkan error jika kode tidak mengikuti aturan Prettier
  },
};
