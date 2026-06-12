export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
    }],
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testMatch: ['<rootDir>/src/tests/**/*.test.{js,jsx}'],
};
