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

## Why Web3

### Value Propositions for Emerging Artists

When implementing features for Amply, keep in mind these core Web3 advantages that benefit emerging artists:

#### 🌍 **Massive User Base**
- **23 Million Users**: World App provides instant access to millions of verified humans
- **Built-in Wallets**: Every user already has payment capabilities
- **Zero Gas Fees**: Free transactions on World Chain enable micro-tipping

#### 🎵 **Artist Empowerment**
- **True Ownership**: NFT masters secured by Ledger hardware wallets
- **Permanent Storage**: Walrus ensures content lives forever, uncensorable
- **Direct Monetization**: No intermediaries between artists and fans

#### 🔐 **Trust & Transparency**
- **Verified Humans**: World ID eliminates bot fraud in engagement metrics
- **Clear Transactions**: ERC-7730 makes every interaction transparent
- **Immutable Records**: Blockchain ensures transparent revenue tracking

#### 💡 **Technical Advantages**
- **MiniKit SDK**: Full integration with World App features
- **Superchain Benefits**: Part of the Optimism ecosystem
- **Decentralized Infrastructure**: No single point of failure

### Hackathon Prize Alignment

When building features, consider these prize categories totaling $27,000:

1. **Best Mini App ($17,000)**: Requires MiniKit SDK integration
2. **Walrus Storage ($10,000)**: Innovative decentralized storage use
3. **Clear Signing ($4,000)**: ERC-7730 transaction transparency

Always prioritize features that leverage these Web3 advantages to solve real problems for emerging artists in the music ecosystem.

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

### Integration Testing Components
When implementing new features that integrate with external services (World ID, Ledger, Walrus), ALWAYS create corresponding test components in the `/test` routes:

1. **For World ID features**: Create test components in `/app/test/world/page.tsx` that:
   - Demonstrate the verification flow
   - Show authentication states
   - Test error scenarios
   - Provide mock verification for development

2. **For Ledger features**: Create test components in `/app/test/ledger/page.tsx` that:
   - Test wallet connection flows
   - Demonstrate NFT signing
   - Show transaction approval UI
   - Handle disconnection scenarios

3. **For Walrus features**: Create test components in `/app/test/walrus/page.tsx` that:
   - Test file upload/download
   - Display blob IDs and metadata
   - Monitor upload progress
   - Test error handling

These test components should:
- Be isolated from production code
- Include clear UI for testing each feature
- Show request/response data for debugging
- Provide mock data options for offline development
- Display integration status and errors clearly

## Documentation Resources

When implementing features, consult these documentation resources:

- **Verifications**: When implementing features related to identity verifications, user authentication, or proof systems, be sure to read `/docs/world-id-docs`
  - **World Mini Apps (MiniKit)**: For client-side actions in World Mini Apps including ID verification, wallet operations, and social features, see `/docs/minikit-js/demo/with-next` for a complete Next.js implementation example
  - **MiniKit Implementation**: For specific MiniKit integration examples and code snippets for Amply, see `/docs/MINIKIT_IMPLEMENTATION_GUIDE.md`
- **Storage**: When implementing features related to decentralized storage, file handling, or data persistence, be sure to read `/docs/walrus`
  - **Implementation Guide**: For specific Walrus API integration examples and code snippets, see `/docs/WALRUS_IMPLEMENTATION_GUIDE.md`
- **Hardware Wallet Integration**: When implementing features related to Ledger hardware wallet integration, NFT custody, or secure transaction signing, be sure to read `/docs/ledger-live-wiki`
  - **Clear Signing (ERC-7730)**: For implementing transparent transaction signing and creating human-readable transaction displays, see `/docs/ERC7730_CLEAR_SIGNING_GUIDE.md`