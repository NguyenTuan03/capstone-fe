module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'chore', 'docs', 'style', 'refactor', 'perf', 'test', 'ci'],
    ],
    'subject-empty': [2, 'never'],
    'header-max-length': [2, 'always', 100],
  },
};
