# Transformer CDN

A web application for visualizing transformer asset data using React, TypeScript, and Material-UI.

## Features

- Interactive data visualization with Recharts
- Material-UI components for a modern look
- Redux for state management
- TypeScript for type safety
- Docker support with nginx for production deployment
- ESLint and Prettier for code quality

## Prerequisites

- Node.js (v18 or later)
- npm (v10 or later)
- Docker (optional, for containerized deployment)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/djodjotech/transformer-cdn.git
cd transformer-cdn
```

2. Install dependencies:
```bash
npm install
```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Building

To build the application:

```bash
npm run build
```

This will create a `dist` directory with the production build.

## Docker Deployment

The application uses a simple two-stage Docker build:
1. Build stage: Creates the production build
2. Production stage: Serves the built files using nginx

To build and run the Docker container:

```bash
# Build the Docker image
docker build -t transformer-cdn .

# Run the container
docker run -p 8080:80 transformer-cdn
```

The application will be available at `http://localhost:8080`.

## Project Structure

```
transformer-cdn/
├── src/
│   ├── components/     # React components
│   ├── store/         # Redux store configuration
│   ├── types/         # TypeScript type definitions
│   └── App.tsx        # Main application component
├── public/            # Static assets
├── dist/             # Production build output
├── Dockerfile        # Docker configuration
├── nginx.conf        # Nginx configuration
├── eslint.config.js  # ESLint configuration
├── .prettierrc       # Prettier configuration
├── tsconfig.json     # TypeScript configuration
├── tsconfig.app.json # TypeScript app configuration
├── tsconfig.node.json # TypeScript Node configuration
└── package.json      # Project dependencies and scripts
```

## Code Quality

The project uses ESLint and Prettier for code quality and formatting:

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier
- `npm run preview`: Preview production build

## License

MIT
