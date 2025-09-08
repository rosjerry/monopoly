# Monopoly Game Frontend

A modern React-based Monopoly game frontend built with TypeScript, Vite, PixiJS, and GSAP animations.

## Prerequisites

Before setting up this frontend application, you must have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Git**

## Backend Setup (Required First)

**⚠️ Important: You must set up the backend API before running this frontend application.**

1. Clone the backend repository:
   ```bash
   git clone https://github.com/rosjerry/monopoly-fake-api.git
   cd monopoly-fake-api
   ```

2. Follow the setup instructions in the backend repository's README to:
   - Install backend dependencies
   - Configure and start the API server
   - Ensure the API is running and accessible

3. Make note of the backend API URL (typically `http://localhost:3000` or as configured)

## Frontend Setup

Once the backend is running, follow these steps to set up the frontend:

### 1. Clone the Repository

```bash
git clone <your-frontend-repository-url>
cd monopoly
```

### 2. Install Dependencies

```bash
npm install
```

Or if you prefer yarn:

```bash
yarn install
```

### 3. Environment Configuration

If needed, create a `.env` file in the root directory to configure API endpoints:

```bash
# .env
VITE_API_URL=http://localhost:3000
```

### 4. Start Development Server

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

The application will start on `http://localhost:3001` and should automatically open in your browser.

## Available Scripts

- **`npm run dev`** - Start development server (port 3001)
- **`npm run build`** - Build production bundle (includes linting and TypeScript compilation)
- **`npm run lint`** - Run ESLint for code quality checks
- **`npm run fmt`** - Format code using Prettier
- **`npm start`** - Alias for `npm run dev`

## Technology Stack

- **React 19** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **PixiJS 8** - 2D graphics rendering
- **GSAP** - Animation library
- **Zustand** - State management
- **TanStack Query** - Data fetching and caching
- **Howler.js** - Audio management
- **Motion** - Animation utilities

## Project Structure

```
src/
├── api/           # API client and hooks
├── components/    # Reusable React components
├── config/        # Configuration files (styles, etc.)
├── constants/     # Game constants and settings
├── hooks/         # Custom React hooks
├── store/         # Zustand stores
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── App.tsx        # Main App component
├── Scene.tsx      # Game scene component
└── main.tsx       # Application entry point
```

## Development Notes

- The application uses **PixiJS** for high-performance 2D graphics rendering
- **GSAP** provides smooth animations and transitions
- Audio is managed through **Howler.js** for cross-browser compatibility
- State management is handled by **Zustand** for simplicity and performance
- The app is configured to run on port **3001** to avoid conflicts with the backend API

## Troubleshooting

### Common Issues

1. **Backend API not accessible**
   - Ensure the backend server is running
   - Check if the API URL in your environment configuration is correct
   - Verify there are no CORS issues

2. **Port conflicts**
   - The frontend runs on port 3001 by default
   - If this port is in use, Vite will automatically suggest an alternative

3. **Audio not working**
   - Check browser audio permissions
   - Ensure audio files are present in `public/assets/main/sounds/`

4. **Build failures**
   - Run `npm run lint` to check for code quality issues
   - Ensure all TypeScript errors are resolved

### Getting Help

If you encounter issues:

1. Check that the backend API is properly set up and running
2. Verify all dependencies are installed correctly
3. Check the browser console for error messages
4. Ensure you're using a compatible Node.js version (18+)

## License

This project is private and proprietary.
