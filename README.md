# DevToolkit

A collection of developer tools in one place. Format code, convert data, test APIs, generate identifiers, and more—all running in your browser.

## What's Included

The toolkit includes 41 tools organized into categories:

**Formatters**: JSON, YAML, XML, SQL, HTML, Markdown, and Shell script formatting

**Encoders/Decoders**: Base64, URL, and HTML entity encoding/decoding

**Security Tools**: JWT decoder, hash generator (MD5, SHA-1, SHA-256, SHA-512), and password generator

**Generators**: UUIDs, QR codes, color picker, and Lorem Ipsum text

**Converters**: CSV to JSON, image to Base64, timestamp converter, case converter, and JSON to TypeScript

**Testing & Utilities**: Regex tester, API tester, text diff, JSONPath tester, and string utilities

**Code Tools**: Code analyzer, code explainer, JavaScript minifier, shell command builder, command cheatsheet, and cURL generator

**DevOps**: Docker command builder, cron expression builder, batch processor, and workflow automation

**Other**: GraphQL tools, API docs generator, and usage statistics

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/AntonioQuijanoGit/DevToolKit.git
cd DevToolKit/devtoolkit

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000` (or the port specified in `package.json`).

### Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Docker

The project includes Docker configuration for easy deployment:

```bash
# Build image
docker build -t devtoolkit .

# Run container
docker run -p 3000:3000 devtoolkit

# Or use docker-compose
docker-compose up -d
```

## Features

**Offline Support**: All tools work client-side. No API calls required for most operations.

**Responsive Design**: Works on desktop, tablet, and mobile devices with a mobile-first approach.

**Dark/Light Mode**: Theme switching with system preference detection.

**Keyboard Shortcuts**: 
- `Cmd/Ctrl + K` - Open command palette
- `?` - Show keyboard shortcuts
- `ESC` - Close modals

**History & Favorites**: Recent tools are tracked automatically. Mark tools as favorites for quick access.

**Usage Statistics**: View which tools you use most frequently.

## Tech Stack

- **Framework**: Next.js 16.1.1 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (built on Radix UI)
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **Testing**: Jest with React Testing Library

## Project Structure

```
devtoolkit/
├── app/                    # Next.js pages and layouts
│   ├── tools/             # Individual tool pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            
│   ├── layout/           # Sidebar, headers, etc.
│   ├── shared/           # Reusable components
│   └── ui/               # Base UI components
├── lib/                   
│   ├── constants/        # Tool definitions, examples
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Zustand stores
│   └── utils/            # Utility functions
├── __tests__/            # Test files
└── public/               # Static assets
```

## Development Notes

The app uses a mobile-first responsive design. Breakpoints follow Tailwind's default system (sm: 640px, md: 768px, lg: 1024px, xl: 1280px).

State is managed client-side using Zustand stores. Data persists in localStorage for history, favorites, and statistics.

Accessibility features include:
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader support
- Reduced motion support
- High contrast mode support

## Contributing

Contributions are welcome. Please ensure tests pass and follow the existing code style.

## License

MIT

## Author

Antonio Quijano
