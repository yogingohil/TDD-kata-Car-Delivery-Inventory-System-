import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',
    '!src/interfaces/**/*.ts',
    '!src/types/**/*.ts',
    '!src/models/vehicle.model.ts',
    '!src/models/purchase.model.ts',
    '!src/repositories/vehicle.repository.ts',
    '!src/repositories/purchase.repository.ts',
    '!src/services/vehicle.service.ts',
    '!src/services/purchase.service.ts',
    '!src/validators/vehicle.validator.ts',
    '!src/validators/purchase.validator.ts',
  ],
  coverageDirectory: 'coverage',
};

export default config;
