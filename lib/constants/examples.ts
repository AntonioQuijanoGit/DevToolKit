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
  "html-encoder": {
    encode: "<div>Hello & World</div>",
    decode: "&lt;div&gt;Hello &amp; World&lt;/div&gt;",
  },
  "text-diff": {
    text1: "The quick brown fox jumps over the lazy dog.",
    text2: "The quick brown fox jumps over the lazy cat.",
  },
  "html-formatter": `<!DOCTYPE html>
<html>
<head><title>Example</title></head>
<body><h1>Hello World</h1><p>This is a test</p></body>
</html>`,
  "js-minifier": `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`,
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
  "json-to-typescript": `{
  "name": "John",
  "age": 30,
  "email": "john@example.com"
}`,
  "image-to-base64": "",
  "shell-command-builder": {
    command: "find",
    options: ["-name", "*.js"],
    path: ".",
  },
  "curl-generator": {
    method: "GET" as const,
    url: "https://api.example.com/users",
    headers: { "Content-Type": "application/json" },
  },
  "cron-builder": {
    minute: "*",
    hour: "0",
    day: "*",
    month: "*",
    weekday: "*",
  },
  "docker-builder": {
    image: "node:18",
    command: "npm start",
    ports: ["3000:3000"],
  },
  "code-analyzer": `function example() {
  let x = 10;
  console.log(x);
  return x;
}`,
  "code-explainer": `function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}`,
  "graphql-tools": `query {
  users {
    id
    name
    email
  }
}`,
};






