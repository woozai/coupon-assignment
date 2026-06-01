module.exports = {
  root: true,
  ignorePatterns: ['docs/', 'skills/', 'frontend/', 'backend/node_modules/'],
  overrides: [
    {
      files: ['backend/**/*.{ts,tsx}'],
      extends: ['./backend/.eslintrc.cjs'],
    },
  ],
};
