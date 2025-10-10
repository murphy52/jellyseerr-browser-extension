# Seerr Style Guide

This style guide establishes coding standards, naming conventions, project structure guidelines, and best practices for the Seerr project - an open-source media request and discovery manager for Jellyfin, Plex, and Emby.

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [TypeScript & JavaScript Standards](#typescript--javascript-standards)
- [React Component Guidelines](#react-component-guidelines)
- [Styling Guidelines](#styling-guidelines)
- [API & Server-side Guidelines](#api--server-side-guidelines)
- [Database & Entity Guidelines](#database--entity-guidelines)
- [Naming Conventions](#naming-conventions)
- [Internationalization (i18n)](#internationalization-i18n)
- [File Organization](#file-organization)
- [Development Tools & Configuration](#development-tools--configuration)
- [Best Practices](#best-practices)

## Project Overview

Seerr is a Next.js application with a TypeScript backend using Express and TypeORM. It follows a monorepo structure with clear separation between client-side (`src/`) and server-side (`server/`) code.

## Technology Stack

### Frontend
- **Next.js** (^14.2.25) - React framework
- **React** (^18.3.1) - UI library
- **TypeScript** (4.9.5) - Type safety
- **Tailwind CSS** (3.2.7) - Utility-first styling
- **React Intl** (^6.6.8) - Internationalization
- **SWR** (2.2.5) - Data fetching
- **Formik** (^2.4.6) - Form handling
- **Yup** (0.32.11) + **Zod** (3.24.2) - Schema validation

### Backend
- **Express** (4.21.2) - Server framework
- **TypeORM** (0.3.12) - ORM
- **SQLite3** (5.1.7) / **PostgreSQL** (pg 8.11.0) - Database
- **OpenAPI Validator** (express-openapi-validator 4.13.8) - API validation

### Development Tools
- **ESLint** (8.35.0) - Code linting
- **Prettier** (2.8.4) - Code formatting
- **Husky** (8.0.3) - Git hooks
- **Cypress** (14.1.0) - E2E testing
- **pnpm** (^10.0.0) - Package manager

## Project Structure

```
seerr/
├── src/                          # Frontend code
│   ├── components/              # React components
│   ├── pages/                   # Next.js pages
│   ├── styles/                  # Global styles
│   ├── hooks/                   # Custom React hooks
│   ├── context/                 # React context providers
│   ├── utils/                   # Utility functions
│   ├── i18n/                    # Internationalization
│   └── assets/                  # Static assets
├── server/                      # Backend code
│   ├── api/                     # External API integrations
│   ├── entity/                  # TypeORM entities
│   ├── routes/                  # Express routes
│   ├── lib/                     # Server utilities
│   ├── constants/               # Server constants
│   ├── interfaces/              # TypeScript interfaces
│   └── middleware/              # Express middleware
├── public/                      # Static files
├── config/                      # Configuration files
└── cypress/                     # E2E tests
```

## TypeScript & JavaScript Standards

### General Rules

1. **Strict TypeScript Configuration**
   - Use strict mode (`"strict": true`)
   - Enable decorator support for TypeORM entities
   - Use path aliases: `@app/*` for src, `@server/*` for server

2. **Type Imports**
   ```typescript
   // ✅ Good - Use type-only imports when possible
   import type { NextPage } from 'next';
   import type { User } from '@app/hooks/useUser';
   
   // ❌ Avoid - Regular imports for types
   import { NextPage } from 'next';
   ```

3. **Array Types**
   ```typescript
   // ✅ Good - Use array syntax
   const items: string[] = [];
   
   // ❌ Avoid - Generic syntax
   const items: Array<string> = [];
   ```

4. **Function Return Types**
   - Explicit return types are optional but recommended for public APIs
   - Always specify return types for exported functions

### ESLint Configuration

Key rules enforced:
- `@typescript-eslint/consistent-type-imports` - Prefer type-only imports
- `no-relative-import-paths/no-relative-import-paths` - Use absolute imports except for same folder
- `no-console: 1` - Warn on console usage
- `@typescript-eslint/no-unused-vars` - Error on unused variables

## React Component Guidelines

### Component Structure

1. **Functional Components with Hooks**
   ```typescript
   import type { ReactNode } from 'react';
   
   interface ComponentProps {
     title: string;
     children?: ReactNode;
   }
   
   const Component = ({ title, children }: ComponentProps) => {
     // Component logic
     return (
       <div>
         <h1>{title}</h1>
         {children}
       </div>
     );
   };
   
   export default Component;
   ```

2. **File Naming**
   - Component files: `ComponentName/index.tsx`
   - Pages: `kebab-case.tsx`
   - Utilities: `camelCase.ts`

3. **Props Interface Naming**
   ```typescript
   // ✅ Good
   interface AirDateBadgeProps {
     airDate: string;
   }
   
   // ❌ Avoid
   interface IAirDateBadgeProps {
     airDate: string;
   }
   ```

### Component Patterns

1. **Default Exports for Components**
   ```typescript
   const AirDateBadge = ({ airDate }: AirDateBadgeProps) => {
     // Component implementation
   };
   
   export default AirDateBadge;
   ```

2. **Internationalization Integration**
   ```typescript
   import defineMessages from '@app/utils/defineMessages';
   import { useIntl } from 'react-intl';
   
   const messages = defineMessages('components.AirDateBadge', {
     airedrelative: 'Aired {relativeTime}',
     airsrelative: 'Airing {relativeTime}',
   });
   
   const Component = () => {
     const intl = useIntl();
     
     return (
       <span>
         {intl.formatMessage(messages.airedrelative)}
       </span>
     );
   };
   ```

3. **Data Fetching with SWR**
   ```typescript
   import useSWR from 'swr';
   
   const Component = () => {
     const { data, error } = useSWR<ApiResponse>('/api/v1/endpoint');
     
     if (!data && !error) {
       return null; // Loading state
     }
     
     if (!data) {
       return null; // Error state
     }
     
     return <div>{/* Component content */}</div>;
   };
   ```

## Styling Guidelines

### Tailwind CSS Usage

1. **Utility-First Approach**
   ```typescript
   // ✅ Good - Use Tailwind utilities
   <div className="flex items-center space-x-2">
     <Badge badgeType="light">Content</Badge>
   </div>
   
   // ❌ Avoid - Custom CSS when Tailwind utilities exist
   <div style={{ display: 'flex', alignItems: 'center' }}>
   ```

2. **Custom CSS Classes**
   - Use `@layer components` for reusable component styles
   - Use `@layer utilities` for utility extensions
   - Prefer CSS custom properties for theming

3. **Responsive Design**
   ```typescript
   // ✅ Good - Mobile-first responsive classes
   <div className="text-2xl font-bold xl:text-4xl">
   ```

4. **Color Scheme**
   - Primary: Indigo variants (`indigo-500`, `indigo-400`)
   - Background: Gray-900 (`bg-gray-900`)
   - Text: Gray-300 (`text-gray-300`)
   - Secondary text: Gray-400 (`text-gray-400`)

### Component Styling Patterns

1. **Media Components**
   ```css
   .media-page {
     @apply relative -mx-4 bg-cover bg-center px-4;
     margin-top: calc(-4rem - env(safe-area-inset-top));
     padding-top: calc(4rem + env(safe-area-inset-top));
   }
   ```

2. **Card Layouts**
   ```css
   ul.cards-vertical {
     grid-template-columns: repeat(auto-fill, minmax(9.375rem, 1fr));
   }
   
   ul.cards-horizontal {
     grid-template-columns: repeat(auto-fill, minmax(16.5rem, 1fr));
   }
   ```

## API & Server-side Guidelines

### Entity Definition

1. **TypeORM Entities**
   ```typescript
   import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
   
   @Entity()
   @Unique(['tmdbId'])
   export class Blacklist implements BlacklistItem {
     @PrimaryGeneratedColumn()
     public id: number;
   
     @Column({ type: 'varchar' })
     public mediaType: MediaType;
   
     @Column()
     @Index()
     public tmdbId: number;
   
     constructor(init?: Partial<Blacklist>) {
       Object.assign(this, init);
     }
   }
   ```

2. **Static Methods for Business Logic**
   ```typescript
   public static async addToBlacklist(
     { blacklistRequest }: { blacklistRequest: BlacklistRequest },
     entityManager?: EntityManager
   ): Promise<void> {
     const em = entityManager ?? dataSource;
     // Implementation
   }
   ```

### API Structure

1. **Provider Pattern**
   ```typescript
   export const getMetadataProvider = async (
     mediaType: 'movie' | 'tv' | 'anime'
   ): Promise<TvShowProvider> => {
     try {
       const settings = await getSettings();
       // Provider logic
       return new TheMovieDb();
     } catch (e) {
       logger.error('Failed to get metadata provider', {
         label: 'Metadata',
         message: e.message,
       });
       return new TheMovieDb();
     }
   };
   ```

2. **Error Handling**
   - Always use try-catch blocks for async operations
   - Log errors with structured logging (winston)
   - Provide fallback behavior

## Database & Entity Guidelines

### Column Decorators

1. **Database-Aware Columns**
   ```typescript
   import { DbAwareColumn } from '@server/utils/DbColumnHelper';
   
   @DbAwareColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
   public createdAt: Date;
   ```

2. **Nullable Columns**
   ```typescript
   @Column({ nullable: true, type: 'varchar' })
   title?: string;
   ```

3. **Relationships**
   ```typescript
   @ManyToOne(() => User, (user) => user.id, { eager: true })
   user?: User;
   
   @OneToOne(() => Media, (media) => media.blacklist, { onDelete: 'CASCADE' })
   @JoinColumn()
   public media: Media;
   ```

## Naming Conventions

### Files and Directories

1. **Components**: PascalCase directories with `index.tsx`
   - `AirDateBadge/index.tsx`
   - `CompanyCard/index.tsx`

2. **Pages**: kebab-case
   - `discover/trending.tsx`
   - `issues/index.tsx`

3. **Utilities**: camelCase
   - `defineMessages.ts`
   - `polyfillIntl.ts`

4. **Constants**: SCREAMING_SNAKE_CASE
   ```typescript
   export const WEEK = 1000 * 60 * 60 * 24 * 8;
   ```

### Variables and Functions

1. **Variables**: camelCase
   ```typescript
   const currentLocale = 'en';
   const hasPermission = true;
   ```

2. **Functions**: camelCase
   ```typescript
   const loadLocaleData = (locale: AvailableLocale) => {
     // Implementation
   };
   ```

3. **Classes**: PascalCase
   ```typescript
   export class Blacklist implements BlacklistItem {
     // Implementation
   }
   ```

4. **Interfaces**: PascalCase (no "I" prefix)
   ```typescript
   interface ExtendedAppProps extends AppProps {
     user: User;
   }
   ```

### CSS Classes

1. **Tailwind**: Use standard Tailwind naming
2. **Custom Classes**: kebab-case
   ```css
   .media-page
   .slider-header
   .server-type-button
   ```

## Internationalization (i18n)

### Message Definition

1. **Component Messages**
   ```typescript
   import defineMessages from '@app/utils/defineMessages';
   
   const messages = defineMessages('components.AirDateBadge', {
     airedrelative: 'Aired {relativeTime}',
     airsrelative: 'Airing {relativeTime}',
   });
   ```

2. **Message Keys**: Use dot notation for namespacing
   - `components.AirDateBadge.airedrelative`
   - `pages.discover.trending`

3. **Locale Files**: Use underscore for region variants
   - `en.json` (base)
   - `es_MX.json` (Spanish Mexico)
   - `zh_Hans.json` (Simplified Chinese)

### Usage Patterns

1. **Simple Messages**
   ```typescript
   const intl = useIntl();
   return intl.formatMessage(messages.airedrelative);
   ```

2. **Messages with Variables**
   ```typescript
   intl.formatMessage(messages.dockerVolumeMissingDescription, {
     code: (msg: React.ReactNode) => (
       <code className="bg-opacity-50">{msg}</code>
     ),
     appDataPath: data.appDataPath,
   })
   ```

## File Organization

### Import Order

1. **External libraries** (React, Next.js, etc.)
2. **Internal absolute imports** (`@app/*`, `@server/*`)
3. **Relative imports** (same directory only)

```typescript
import { FormattedRelativeTime, useIntl } from 'react-intl';
import useSWR from 'swr';

import Badge from '@app/components/Common/Badge';
import defineMessages from '@app/utils/defineMessages';

import './LocalComponent.css'; // If needed
```

### Directory Structure Best Practices

1. **Component Organization**
   ```
   components/
   ├── Common/              # Reusable UI components
   │   ├── Badge/
   │   ├── Alert/
   │   └── Button/
   ├── Layout/              # Layout components
   ├── Discover/            # Feature-specific components
   └── Settings/            # Settings components
   ```

2. **Utility Organization**
   ```
   utils/
   ├── defineMessages.ts
   ├── polyfillIntl.ts
   └── validation.ts
   ```

## Development Tools & Configuration

### Package Management

- **Use pnpm**: Enforced by `preinstall` script
- **Lock file**: Always commit `pnpm-lock.yaml`
- **Node version**: ^22.0.0

### Git Workflow

1. **Conventional Commits**: Enforced by commitlint
   ```
   feat: add new component
   fix: resolve navigation bug
   docs: update README
   ```

2. **Pre-commit Hooks**: Lint and format on commit
   ```json
   "lint-staged": {
     "**/*.{ts,tsx,js}": ["prettier --write", "eslint"],
     "**/*.{json,md,css}": ["prettier --write"]
   }
   ```

### Code Quality Tools

1. **ESLint**: Comprehensive linting with TypeScript support
2. **Prettier**: Code formatting with Tailwind plugin
3. **Stylelint**: CSS linting with Tailwind support
4. **Husky**: Git hooks for quality gates

## Best Practices

### Performance

1. **Dynamic Imports for Locales**
   ```typescript
   const loadLocaleData = (locale: AvailableLocale): Promise<any> => {
     switch (locale) {
       case 'es':
         return import('../i18n/locale/es.json');
       // ...
     }
   };
   ```

2. **Lazy Loading**: Use Next.js dynamic imports for large components
3. **Image Optimization**: Use Next.js `Image` component
4. **Bundle Analysis**: Regular bundle size monitoring

### Security

1. **CSRF Protection**: Implemented with `@dr.pogodin/csurf`
2. **Rate Limiting**: Express rate limiting middleware
3. **Input Validation**: OpenAPI validation + Yup/Zod schemas
4. **Secure Headers**: Security middleware configuration

### Error Handling

1. **Graceful Degradation**
   ```typescript
   if (!data && !error) {
     return null; // Loading state
   }
   
   if (!data) {
     return null; // Error state - graceful fallback
   }
   ```

2. **Structured Logging**
   ```typescript
   logger.error('Failed to get metadata provider', {
     label: 'Metadata',
     message: e.message,
   });
   ```

### Accessibility

1. **Semantic HTML**: Use proper HTML elements
2. **ARIA Labels**: Implement where needed
3. **ESLint JSX a11y**: Enforced accessibility rules
4. **Keyboard Navigation**: Ensure all interactive elements are accessible

### Testing

1. **E2E Testing**: Cypress for critical user flows
2. **Type Safety**: Comprehensive TypeScript coverage
3. **API Testing**: OpenAPI schema validation

---

## Contributing

When contributing to Seerr, please:

1. Follow this style guide consistently
2. Write meaningful commit messages using conventional commit format
3. Ensure all linting and formatting passes
4. Add appropriate TypeScript types
5. Include internationalization for user-facing strings
6. Test across different screen sizes and browsers
7. Consider accessibility in your implementations

For questions about this style guide, please refer to the existing codebase for examples or open a discussion in the project repository.