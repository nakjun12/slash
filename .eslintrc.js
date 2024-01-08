module.exports = {
  root: true,

  env: {
    es6: true, // ECMAScript 6 문법과 글로벌 변수 사용을 허용합니다.
    node: true, // Node.js 글로벌 변수와 Node.js 스코프 사용을 허용합니다.
    browser: true, // 브라우저 글로벌 변수 사용을 허용합니다.
    jest: true, // Jest 테스트 프레임워크의 글로벌 변수 사용을 허용합니다.
    'shared-node-browser': true, // Node.js와 브라우저가 공유하는 글로벌 변수 사용을 허용합니다.
  },

  parser: '@typescript-eslint/parser', // 파서로 '@typescript-eslint/parser'를 사용합니다.
  parserOptions: {
    ecmaFeatures: { jsx: true }, // JSX 문법 사용을 허용합니다.
  },

  extends: [
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended', // ESLint의 기본 규칙 세트를 사용합니다.
    'plugin:react/recommended', // React 규칙을 적용합니다.
    'plugin:react-hooks/recommended', // React Hooks 규칙을 적용합니다.
    'prettier', // Prettier와 충돌하지 않는 ESLint 규칙을 사용합니다.
  ],
  plugins: ['@typescript-eslint', 'import', 'react', 'react-hooks', '@emotion'],
  settings: {
    'import/resolver': { typescript: {} }, // import 문제를 해결하기 위해 TypeScript 설정을 사용합니다.
    react: { version: 'detect' }, // 설치된 React 버전을 자동으로 감지합니다.
  },
  rules: {
    'no-implicit-coercion': 'error', // 암시적 타입 강제 변환을 금지합니다.
    'no-warning-comments': [
      'warn',
      {
        terms: ['TODO', 'FIXME', 'XXX', 'BUG'],
        location: 'anywhere',
      },
    ],
    curly: ['error', 'all'], // 모든 제어문에 중괄호 사용을 강제합니다.
    eqeqeq: ['error', 'always', { null: 'ignore' }], // '==' 대신 '===' 사용을 강제합니다.

    '@emotion/pkg-renaming': 'error', // @emotion 패키지 재명명 규칙을 적용합니다.

    // Hoisting을 전략적으로 사용한 경우가 많아서
    '@typescript-eslint/no-use-before-define': 'off',
    // 모델 정의 부분에서 class와 interface를 합치기 위해 사용하는 용법도 잡고 있어서
    '@typescript-eslint/no-empty-interface': 'off',
    // 모델 정의 부분에서 파라미터 프로퍼티를 잘 쓰고 있어서
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-var-requires': 'warn',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
    '@typescript-eslint/no-inferrable-types': 'warn',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      { format: ['camelCase', 'UPPER_CASE', 'PascalCase'], selector: 'variable', leadingUnderscore: 'allow' },
      { format: ['camelCase', 'PascalCase'], selector: 'function' },
      { format: ['PascalCase'], selector: 'interface' },
      { format: ['PascalCase'], selector: 'typeAlias' },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: [
          'public-static-field',
          'private-static-field',
          'public-instance-field',
          'private-instance-field',
          'public-constructor',
          'private-constructor',
          'public-instance-method',
          'private-instance-method',
        ],
      },
    ],

    'react/prop-types': 'off', // React의 prop-types 사용을 비활성화합니다.
    'react/display-name': 'off', // React 컴포넌트의 displayName 설정을 강제하지 않습니다.
    'react-hooks/exhaustive-deps': 'error', // React Hook의 의존성 배열을 전체적으로 검사합니다.
    'react/react-in-jsx-scope': 'off', // JSX에서 React를 범위 내에 두는 것을 강제하지 않습니다.
    'react/no-unknown-property': ['error', { ignore: ['css'] }], // 알려지지 않은 JSX 속성 사용을 금지합니다.
  },
};
