import js from "@eslint/js";

const nodeGlobals = {
  AbortSignal: "readonly",
  Buffer: "readonly",
  URL: "readonly",
  console: "readonly",
  fetch: "readonly",
  process: "readonly",
  setTimeout: "readonly",
};

export default [
  {
    ignores: [
      "node_modules/**",
      "packages/script/dist-vendor/**",
      "packages/wp-plugin/assets/**",
      "demo/statement.html",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: nodeGlobals,
    },
  },
  {
    files: ["scripts/audit-demo.mjs"],
    languageOptions: {
      globals: {
        document: "readonly",
        getComputedStyle: "readonly",
      },
    },
  },
  {
    files: ["packages/script/csp-adapter.js"],
    languageOptions: {
      sourceType: "script",
      globals: {
        CSSStyleSheet: "readonly",
        Document: "readonly",
        DocumentFragment: "readonly",
        Element: "readonly",
        HTMLElement: "readonly",
        Node: "readonly",
        ShadowRoot: "readonly",
        document: "readonly",
      },
    },
  },
];
