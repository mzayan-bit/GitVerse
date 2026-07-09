# GitVerse Architecture

## Overview

GitVerse transforms GitHub repositories into interactive planets inside a beautiful universe.

## Folder Structure

```
src/
├── app/            # Next.js App Router pages and layouts
├── components/     # Reusable React components
│   ├── ui/         # Base UI primitives (Button, Card, etc.)
│   └── layout/     # Layout components (Navbar, Footer, etc.)
├── providers/      # React context providers
├── hooks/          # Custom React hooks
├── lib/            # Third-party library configurations
├── services/       # API services and data fetching
├── store/          # State management
├── types/          # TypeScript type definitions
├── utils/          # Pure utility functions
├── styles/         # Global and shared styles
├── constants/      # Application constants
├── assets/         # Static assets (images, fonts)
├── three/          # Three.js configuration and setup
├── scene/          # Scene management and orchestration
├── planets/        # Planet generation and rendering
└── effects/        # Visual effects and post-processing

public/             # Static files served at root
docs/               # Project documentation
```

## Design Decisions

- **App Router**: Next.js 15 App Router for modern React Server Components
- **TypeScript Strict**: Full strict mode with additional safety checks
- **Tailwind CSS v4**: Utility-first CSS with PostCSS integration
- **Absolute Imports**: `@/` alias for clean import paths
- **Barrel Exports**: `index.ts` files for clean module boundaries
