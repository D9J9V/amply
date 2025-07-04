# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**⚡ Amply**: Your content, your rules. Real impressions, full ownership. The future of music is human.

Amply is a decentralized digital content platform for the Audio/Video category that empowers creators with true ownership and authentic engagement metrics. The platform ensures every interaction comes from verified humans, eliminating bot fraud and creating genuine connections between artists and audiences.

### Core Features
- **Human-Verified Impressions**: All interactions are verified through World ID using Zero-Knowledge Proofs
- **True Creator Ownership**: Artists maintain full control via NFTs secured with Ledger hardware wallets
- **Decentralized Storage**: Content permanently stored on Walrus network, censorship-resistant
- **Fair Monetization**: Direct tipping and support from real fans to creators

### Technical Integration Points
- **World Chain Network**: Smart contracts for NFT ownership and verified interactions
- **World ID SDK**: Human verification system for all platform interactions
- **Walrus Storage**: Decentralized content storage for audio/video files
- **Ledger Integration**: Hardware wallet support for secure NFT custody

**Demo**: https://amply-seven.vercel.app/

## Commands

### Development
- `pnpm dev` - Start development server with Turbopack for fast refresh
- `pnpm build` - Create production build
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint to check code quality

### Package Management
This project uses **pnpm** as the package manager. Always use:
- `pnpm add <package>` for dependencies
- `pnpm add -D <package>` for dev dependencies
- `pnpm install` to install all dependencies

## Architecture

### Tech Stack
- **Next.js 15.3.5** with App Router
- **React 19** with Server Components by default
- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** for styling
- **ESLint 9** with Next.js configuration

### Project Structure
```
app/                    # App Router pages and layouts
├── layout.tsx         # Root layout with font optimization
├── page.tsx           # Home page component
└── globals.css        # Global styles and Tailwind directives

public/                # Static assets (images, fonts, etc.)
```

### Key Architectural Patterns

1. **Server Components First**: All components are Server Components by default. Only add `"use client"` when needed for:
   - Event handlers (onClick, onChange, etc.)
   - Browser APIs (window, document, etc.)
   - React hooks (useState, useEffect, etc.)
   - Third-party client-only libraries

2. **File-based Routing**: Routes are defined by the file structure in the `app/` directory:
   - `app/page.tsx` → `/`
   - `app/about/page.tsx` → `/about`
   - `app/blog/[slug]/page.tsx` → `/blog/:slug`

3. **Layouts**: Use `layout.tsx` files for shared UI across routes. The root layout in `app/layout.tsx` wraps all pages.

4. **TypeScript Conventions**:
   - Use explicit types for function parameters and return values
   - Leverage type inference where appropriate
   - Use interfaces for object shapes, types for unions/primitives

5. **Styling with Tailwind CSS v4**:
   - Use utility classes directly in JSX
   - CSS variables defined in `:root` for theming
   - Dark mode support via `dark:` prefix
   - Custom properties for design tokens

### Important Configuration

**TypeScript** (`tsconfig.json`):
- Path alias: `@/*` maps to the root directory
- Strict mode enabled for type safety
- Next.js plugin for proper type support

**ESLint** (`eslint.config.mjs`):
- Flat config format (ESLint 9)
- Extends Next.js recommended rules
- TypeScript support enabled

**Tailwind CSS**:
- Version 4 with PostCSS integration
- Custom font variables (--font-geist-sans, --font-geist-mono)
- Configured in `tailwind.config.ts` and `postcss.config.mjs`

### Development Workflow

1. **Component Development**:
   - Create components in appropriate directories
   - Use Server Components by default
   - Add client directive only when necessary
   - Follow existing naming conventions (PascalCase for components)

2. **State Management**:
   - Server state: Use Server Components and data fetching
   - Client state: Use React hooks in Client Components
   - Consider React Server Components for data fetching

3. **Performance Considerations**:
   - Leverage Server Components for better performance
   - Use dynamic imports for code splitting
   - Optimize images with Next.js Image component
   - Minimize client-side JavaScript

4. **Error Handling**:
   - Use error.tsx files for error boundaries
   - Implement loading.tsx for loading states
   - Handle errors gracefully in Server Components

### Testing Strategy
Currently no testing framework is configured. When implementing tests, consider:
- Jest or Vitest for unit testing
- React Testing Library for component testing
- Playwright or Cypress for E2E testing

## Documentation Resources

When implementing features, consult these documentation resources:

- **Verifications**: When implementing features related to identity verifications, user authentication, or proof systems, be sure to read `/docs/world-id-docs`
- **Storage**: When implementing features related to decentralized storage, file handling, or data persistence, be sure to read `/docs/walrus`