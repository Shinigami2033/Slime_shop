# Slime E-commerce Application

## Overview

This is a full-stack e-commerce application built with React, Express.js, and PostgreSQL, specifically designed for selling slime products. The application features a modern, responsive design with a focus on user experience and includes newsletter subscription functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side navigation
- **State Management**: React Query (@tanstack/react-query) for server state
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Storage**: In-memory storage with Map data structures
- **Session Management**: Memory-based session store (memorystore)
- **Development**: Hot reload with tsx

### Project Structure
```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/ui/  # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/          # Express backend
├── shared/          # Shared types and schemas
└── migrations/      # Database migrations
```

## Key Components

### Data Schema
- **User Types**: Basic user authentication with username/password
- **Newsletter Types**: Email subscription management with timestamps
- **Schema Validation**: Zod schemas for type safety and validation
- **Storage**: In-memory Map-based storage with auto-incrementing IDs

### Frontend Components
- **Landing Page**: Product showcase with newsletter signup
- **UI Components**: Complete set of shadcn/ui components (buttons, forms, cards, etc.)
- **Form Handling**: React Hook Form with Zod validation
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Backend Services
- **Storage Interface**: Abstracted storage layer with in-memory Map implementation
- **Route Registration**: Modular route structure with /api prefix
- **Error Handling**: Centralized error handling middleware
- **Development Tools**: Request logging and Vite integration
- **Admin Interface**: Newsletter subscriber management and CSV export

## Data Flow

1. **Client Requests**: Frontend makes API calls using React Query
2. **Server Processing**: Express routes handle requests through storage interface
3. **Memory Operations**: In-memory storage manages data persistence during runtime
4. **Response Handling**: JSON responses with proper error handling
5. **State Updates**: React Query manages cache invalidation and updates

## External Dependencies

### Core Dependencies
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **react-hook-form**: Form validation and handling
- **zod**: Schema validation
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for development
- **esbuild**: Production build optimization
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Storage**: In-memory storage initializes automatically on startup

### Environment Configuration
- **Development**: Uses tsx for hot reload and Vite dev server
- **Production**: Serves static files and runs bundled Express server
- **Storage**: In-memory storage requires no external database configuration

### Scripts
- `dev`: Start development server with hot reload
- `build`: Build both frontend and backend for production
- `start`: Run production server

The application is structured as a monorepo with clear separation between client and server code, shared types, and a robust development workflow optimized for the Replit environment. All data is stored in-memory, making it perfect for development and testing without external database dependencies.

## Recent Changes

**July 15, 2025**
- ✓ Removed SQL/PostgreSQL integration and Drizzle ORM
- ✓ Simplified schema to use TypeScript interfaces with Zod validation
- ✓ Converted to in-memory storage using Map data structures
- ✓ Added admin interface for viewing newsletter subscriptions
- ✓ Removed database dependencies (@neondatabase/serverless, drizzle-orm, drizzle-kit, drizzle-zod)