module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-empty': [2, 'never'], // Do not allow empty type
    'type-case': [2, 'always', 'lower-case'], // Enforce lowercase for type
    'scope-empty': [2, 'never'], // Do not allow empty scope
    'scope-case': [2, 'always', 'lower-case'], // Enforce lowercase for scope
    'subject-empty': [2, 'never'], // Do not allow empty subject
    'subject-case': [2, 'always', 'lower-case'], // Enforce sentence case for subject
  },
};
