# DevToolkit

A comprehensive all-in-one developer tools platform with a minimalistic, premium design inspired by Vercel.

## Features

- 🎨 **40+ Essential Tools**: Format, convert, test, generate, and analyze code and data
- 🌙 **Dark/Light Mode**: Beautiful theme inspired by Vercel with smooth transitions
- ⚡ **Fast & Offline**: All tools work client-side, no API calls required
- 📱 **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- 💾 **History & Favorites**: Automatically saves your recent tool usage and favorite tools
- 🎯 **Keyboard Shortcuts**: Quick actions for power users (Cmd/Ctrl + K for search)
- 🔍 **Command Palette**: Fast navigation and tool search
- 📊 **Usage Statistics**: Track your tool usage and activity
- 🎨 **Modern UI**: Built with shadcn/ui components and Framer Motion animations

## Getting Started

```bash
# Install dependencies
npm install

# Run development server (port 3004)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Clean build cache
npm run clean
```

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **Syntax Highlighting**: Prism.js
- **UI Components**: Radix UI primitives

## Available Tools

### Formatters
- JSON Formatter - Format, minify, and validate JSON
- YAML Formatter - Format and validate YAML files
- XML Formatter - Format and validate XML documents
- SQL Formatter - Format and validate SQL queries
- HTML Formatter - Format and beautify HTML code
- Markdown Editor - Editor with live preview
- Shell Formatter - Format shell scripts

### Encoders/Decoders
- Base64 Encoder/Decoder - Encode and decode Base64 strings
- URL Encoder/Decoder - Encode and decode URL strings
- HTML Entity Encoder - Encode and decode HTML entities

### Security
- JWT Decoder - Decode and inspect JWT tokens
- Hash Generator - Generate MD5, SHA-1, SHA-256, SHA-512 hashes
- Password Generator - Generate secure passwords

### Generators
- UUID Generator - Generate UUID v1 and v4 identifiers
- Color Picker - Pick colors and convert between formats
- QR Generator - Generate QR codes
- Lorem Ipsum Generator - Generate placeholder text

### Converters
- CSV to JSON - Convert CSV to JSON and vice versa
- Image to Base64 - Convert images to Base64 with preview
- Timestamp Converter - Convert Unix timestamps to readable dates
- Case Converter - Convert text between different cases
- JSON to TypeScript - Generate TypeScript interfaces from JSON

### Testers & Utilities
- Regex Tester - Test and debug regular expressions
- Regex to Grep - Convert regex patterns to grep commands
- API Tester - Test REST APIs with custom requests
- Text Diff - Compare and highlight differences between texts
- JSON Path Tester - Query JSON data with JSONPath expressions
- String Utilities - Count characters, words, lines and more

### Code Tools
- Code Analyzer - Analyze code and get intelligent suggestions
- Code Explainer - Explain code functionality
- JS Minifier - Minify JavaScript code
- Shell Command Builder - Build shell commands interactively
- Command Cheatsheet - Quick reference for common commands
- Curl Generator - Generate curl commands from API requests

### DevOps
- Docker Builder - Build Docker commands interactively
- Cron Builder - Build cron expressions visually
- Batch Processor - Process multiple items at once
- Workflow Automation - Create and execute workflows

### Other Tools
- GraphQL Tools - Test and explore GraphQL APIs
- API Docs Generator - Generate API documentation
- Stats - View usage statistics and analytics

## Project Structure

```
devtoolkit/
├── app/                    # Next.js app directory
│   ├── tools/             # Tool pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── shared/           # Shared components
│   └── ui/               # UI components (shadcn/ui)
├── lib/                   # Utilities and stores
│   ├── constants/        # Constants and data
│   ├── hooks/            # Custom hooks
│   ├── store/            # Zustand stores
│   └── utils/            # Utility functions
└── public/               # Static assets
```

## Development

The app runs on port 3004 by default. You can change this in `package.json`.

### Key Features Implementation

- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **Offline Support**: Service worker for offline functionality
- **State Management**: Zustand for client-side state
- **Theme System**: Dark/light mode with system preference detection
- **Keyboard Navigation**: Command palette and shortcuts throughout

## License

MIT

## Author

Developed with ❤️ by Antonio Quijano
