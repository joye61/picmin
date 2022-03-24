import path from "path";

export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/renderer/$1",
  },
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      isolatedModules: true,
      tsconfig: "./__tests__/tsconfig.json"
    },
  },
  rootDir: path.resolve(__dirname),
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/(release|dist|public|resources)",
  ],
};