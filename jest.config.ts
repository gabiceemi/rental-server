import { pathsToModuleNameMapper } from "ts-jest";

export default {
  bail: true,
  clearMocks: true,
  coverageProvider: "v8",
  moduleNameMapper: pathsToModuleNameMapper(
    {
      "@modules/*": ["modules/*"],
      "@config/*": ["config/*"],
      "@shared/*": ["shared/*"],
      "@utils/*": ["utils/*"],
      "@errors/*": ["errors/*"],
    },
    { prefix: "<rootDir>/src" }
  ),
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts"],
};
