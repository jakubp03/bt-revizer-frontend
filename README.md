# bt-revizer-frontend

React single-page application for creating and taking quizzes, organizing them into categories, and reviewing attempts and learning statistics. The frontend is maintained in a separate repository from the backend.

The backend is maintained in a separate repository: [bt-revizer-backend](https://github.com/jakubp03/bt-revizer-backend).

## Architecture Diagram Of The Whole App

![Architecture diagram](docs/architecture%20diagram.png)

## Technology

- React 19 and TypeScript
- Vite
- Redux Toolkit
- Tailwind CSS and shadcn/ui
- Axios and React Router

## Prerequisites

- Node.js 20.19+ or 22.12+
- npm
- A running bt-revizer backend, unless you only need to work on frontend pages that do not make API requests

## Local Setup

1. Clone this repository and enter its directory.
2. Create a local environment file from the example:

	```sh
	cp .env.example .env
	```

3. Edit `.env` and set the backend URLs for your environment:

	```dotenv
	VITE_API_BASE_URL=
	```

	Set `VITE_API_BASE_URL` to the backend API base URL reachable from your browser (including the API prefix used by your backend, if applicable). `.env.example` documents the environment variables used by the frontend.

4. Install dependencies and start the Vite development server:

	```sh
	npm ci
	npm run dev
	```

	Open the URL printed by Vite (by default, `http://localhost:5173`).

### Other Commands

```sh
npm run build       # Type-check and create a production build in dist/
npm run preview     # Serve the production build locally
npm run lint        # Run ESLint
npm run typecheck   # Run the TypeScript compiler without emitting files
```

## Docker Compose

The Docker Compose configuration is maintained in the [bt-revizer-backend repository](https://github.com/jakubp03/bt-revizer-backend), not in this frontend repository. Clone both repositories as siblings under the same parent directory:

```text
parent-directory/
├── bt-revizer-backend/     # Backend repository; contains compose.yaml
│   └── compose.yaml
└── bt-revizer-frontend/    # This repository
```

Follow the backend repository's instructions to configure and start the full application with Docker Compose. Run Docker Compose from the backend repository, where `compose.yaml` is located.

## API Documentation

See [the full API documentation](docs/api-doc.md) for endpoint details, request and response formats, and authentication requirements.

## Project Structure

```text
src/
├── App.tsx                 # Application routes
├── main.tsx                # Frontend entry point
├── components/
│   ├── handlers/           # Authentication, initialization, and route guards
│   ├── ui/                 # Layout, shared UI, and page views
│   └── theme-provider.tsx  # Theme provider
├── services/               # API client and image services
├── store/                  # Redux store, slices, and async thunks
├── types/                  # TypeScript types
└── utils/                  # Shared utility functions
```


