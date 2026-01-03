// Examples for DevToolKit tools
const jsonFormatterExample = "{\n  \"name\": \"DevToolkit\",\n  \"version\": \"1.0.0\",\n  \"tools\": [\n    {\n      \"id\": \"json-formatter\",\n      \"name\": \"JSON Formatter\",\n      \"category\": \"Formatters\"\n    }\n  ],\n  \"features\": {\n    \"darkMode\": true,\n    \"offline\": true\n  }\n}";

const htmlFormatterExample = "<!DOCTYPE html>\n<html>\n<head><title>Example</title></head>\n<body><h1>Hello World</h1><p>This is a test</p></body>\n</html>";

const jsMinifierExample = "function calculateTotal(items) {\n  let total = 0;\n  for (let i = 0; i < items.length; i++) {\n    total += items[i].price;\n  }\n  return total;\n}";


const graphqlToolsExample = "query { users { id name email } }";

const jsonToTypeScriptExample = "{\n  \"name\": \"John\",\n  \"age\": 30,\n  \"email\": \"john@example.com\"\n}";

export const examples = {
  "json-formatter": jsonFormatterExample,
  base64: "Hello, World!",
  "url-encoder": "https://example.com/search?q=hello world&lang=en",
  "regex-tester": {
    pattern: "\\b\\w+@\\w+\\.\\w+\\b",
    testString: "Contact us at support@example.com or info@test.org",
  },
  "jwt-decoder":
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "hash-generator": "Hello, World!",
  "uuid-generator": {
    version: "4" as const,
    count: 5,
  },
  "color-picker": {
    hex: "#0070F3",
  },
  "api-tester": {
    url: "https://api.github.com/users/octocat",
    method: "GET" as const,
  },
  "html-encoder": {
    encode: "<div>Hello & World</div>",
    decode: "&lt;div&gt;Hello &amp; World&lt;/div&gt;",
  },
  "text-diff": {
    text1: "The quick brown fox jumps over the lazy dog.",
    text2: "The quick brown fox jumps over the lazy cat.",
  },
  "html-formatter": htmlFormatterExample,
  "js-minifier": jsMinifierExample,
  "case-converter": "hello world example text",
  "password-generator": {
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  },
  "timestamp-converter": {
    timestamp: Date.now(),
    format: "ISO" as const,
  },
  "string-utilities": "Hello World! This is a test string.",
  "lorem-ipsum": {
    type: "paragraphs" as const,
    count: 3,
  },
  "qr-generator": "https://example.com",
  "json-to-typescript": jsonToTypeScriptExample,
  "image-to-base64": "",
  "shell-command-builder": {
    command: "find" as const,
    options: ["-type", "f"] as string[],
    path: "." as const,
  },
  "curl-generator": {
    method: "GET" as const,
    url: "https://api.example.com/users",
    headers: { "Content-Type": "application/json" },
  },
  "cron-builder": {
    minute: "*" as const,
    hour: "0" as const,
    day: "*" as const,
    month: "*" as const,
    weekday: "*" as const,
  },
  "docker-builder": {
    image: "node:18",
    command: "npm start",
    ports: ["3000:3000"],
  },
  "graphql-tools": graphqlToolsExample,
};
