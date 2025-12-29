export const examples = {
  "json-formatter": `{
  "name": "DevToolkit",
  "version": "1.0.0",
  "tools": [
    {
      "id": "json-formatter",
      "name": "JSON Formatter",
      "category": "Formatters"
    }
  ],
  "features": {
    "darkMode": true,
    "offline": true
  }
}`,
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
};




