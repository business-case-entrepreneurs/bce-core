'use strict';

module.exports = {
  // prettier-ignore
  types: [
    { value: 'feat',     name: 'feat     New feature' },
    { value: 'fix',      name: 'fix      Bug fix' },
    { value: 'docs',     name: 'docs     Documentation change' },
    { value: 'refactor', name: 'refactor Code refactoring change' },
    { value: 'chore',    name: 'chore    Chore change' }
  ],
  skipQuestions: ['scope']
};
