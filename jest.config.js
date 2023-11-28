/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["mocks/*"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/mocks/singleton.ts"],
};
