# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the plant-care-scheduler-3 frontend repository.

## 🚀 Development Commands

| Command | Action | Details |
|---------|--------|---------|
| `npm run dev` | Start Vite dev server at http://localhost:5173 with HMR |
| `npm run build` | Build for production: `tsc -b` + `vite build` → `/dist` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run Oxlint with TypeScript/React rules |
| `npm run lint -- --fix` | Auto-fix linting issues (when supported) |

## 🏗️ Core Architecture

### Technology Stack
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8 (ESM-native, fast HMR)
- **UI Library**: Material-UI v9 (MUI) with custom theme
- **State Management**: 
  - TanStack React Query v5 (server state)
  - React Context (AuthContext for auth/UI state)
- **Data Layer**: 
  - React Hook Form v7 + Zod (form validation)
  - Axios (HTTP client with auth interceptors)
- **Routing**: React Router DOM v7
- **Utilities**: date-fns (dates), Recharts (charts), UUID (IDs)
- **Linting**: Oxlint (React/TypeScript plugins)

### Directory Structure (Current State)
```
src/
├── components/          # Reusable UI components
│   ├── layout/          # Layout components (TO BE CREATED)
│   ├── ui/              # Generic UI elements (Button, Input, Card, etc.) - MINIMAL
│   └── features/        # Feature-specific components (plants, tasks, etc.) - PARTIAL (PlantCard implemented)
├── pages/               # Page components (route components) - PARTIALLY IMPLEMENTED
│   ├── dashboard/       # Dashboard page (DashboardPage.tsx - IMPLEMENTED with mock data)
│   ├── plants/          # Plant management pages (PlantListPage.tsx, PlantFormPage.tsx - IMPLEMENTED)
│   ├── tasks/           # Task management pages (TO BE COMPLETED)
│   ├── health/          # Health tracking pages (TO BE COMPLETED)
│   ├── auth/            # Auth pages (login, register) - TO BE COMPLETED
│   ├── profile/         # User profile - TO BE COMPLETED
│   ├── community/       # Community features - TO BE COMPLETED
│   ├── consultations/   # Expert consultations - TO BE COMPLETED
│   ├── environment/     # Environmental data - TO BE COMPLETED
│   └── analytics/       # Analytics & reports - TO BE COMPLETED
├── services/            # API service layer (axios instances) - IMPLEMENTED
│   ├── authService.ts   # Auth endpoints (COMPLETE with interceptors)
│   ├── plantService.ts  # Plant CRUD operations (COMPLETE)
│   ├── careTaskService.ts # Care task operations (COMPLETE)
│   ├── healthService.ts # Health logging (COMPLETE)
│   └── ...              # Other domain services
├── store/               # React Context providers - PARTIAL
│   ├── AuthContext.tsx  # Auth state (user, login, logout) - COMPLETE
│   └── RequireAuth.tsx  # Route protection wrapper - COMPLETE
├── types/               # TypeScript interfaces & types - PARTIAL
│   ├── api.ts           # API response types (MINIMAL)
│   ├── auth.ts          # Auth-related types (COMPLETE)
│   ├── plants.ts        # Plant domain types (COMPLETE)
│   ├── tasks.ts         # Task domain types (COMPLETE)
│   └── ...              # Other domain types
├── hooks/               # Custom React hooks - PARTIAL
│   ├── usePlants.ts     # Plant data hooks (COMPLETE)
│   ├── useTasks.ts      # Task data hooks (COMPLETE)
│   ├── useAuth.ts       # Auth wrapper (useContext) - COMPLETE
│   └── ...              # Feature-specific hooks
├── utils/               # Pure utility functions - TO BE COMPLETED
│   ├── helpers.ts       # Date/string/format helpers
│   ├── validators.ts    # Validation helpers
│   └── constants.ts     # App constants
├── assets/              # Static assets (images, icons, etc.) - TO BE POPULATED
├── styles/              # Global CSS & theme
│   └── theme.ts         # MUI theme customization - PARTIAL
├── App.tsx              # Root component - COMPLETE (includes router, theme, auth provider)
├── main.tsx             # App entry point - COMPLETE (includes React Query provider)
├── routes.tsx           # Route definitions - SUBSTANTIALLY COMPLETE (needs actual page components)
└── vite.config.ts       # Vite configuration
```

## 🔑 Key Architectural Patterns

### 1. Authentication Flow
- **JWT-based auth** with refresh token rotation
- **AuthContext** provides: `user`, `isLoading`, `login()`, `register()`, `logout()`, `updateProfile()`
- **Axios interceptors** (in `authService.ts`):
  - Request: Automatically attaches Bearer token from localStorage
  - Response: Handles 401s by attempting token refresh; redirects to login on failure
- **Protected Routes**: Implemented using `RequireAuth` wrapper component (in `src/store/RequireAuth.tsx`)

### 2. State Management Strategy
- **Server State (React Query)**:
  - Used for all API data: plants, care tasks, health logs, etc.
  - Provides automatic caching, background updates, stale-while-revalidate
  - Implemented via service hooks (see `hooks/`)
  - Mutation hooks handle optimistic updates & cache invalidation
- **Client State (React Context)**:
  - AuthContext: Authentication state only (implemented)
  - UI state (modals, tabs, etc.) handled locally with `useState`/`useReducer`
- **Form State**: React Hook Form + Zod for all form validation

### 3. API Service Pattern
Each domain gets a service file in `src/services/`:
- **Structure**: 
  - Single axios instance with base URL from `import.meta.env.VITE_API_URL`
  - Request/response interceptors for auth handling (in authService)
  - Methods return AxiosResponse<ApiResponse<T>> for type safety
- **Example** (`plantService.ts`):
  ```typescript
  export const plantService = {
    getPlants: (page: number, size: number, sort?: string) => 
      api.get<ApiResponse<PlantResponse[]>>(`/plants`, { params: { page, size, sort } }),
    getPlantById: (id: number) => api.get<ApiResponse<PlantResponse>>(`/plants/${id}`),
    createPlant: (data: PlantFormData) => api.post<ApiResponse<PlantResponse>>(`/plants`, data),
    updatePlant: (id: number, data: PlantFormData) => api.put<ApiResponse<PlantResponse>>(`/plants/${id}`, data),
    deletePlant: (id: number) => api.delete<ApiResponse<void>>(`/plants/${id}`)
  };
  ```
- **Usage**: Services imported directly into components/hooks; React Query handles data fetching

### 4. Component Architecture (Planned)
- **Atomic Design Principles** (adapted):
  - **Atoms**: Basic UI elements (Button, Input, Icon) in `components/ui/`
  - **Molecules**: Simple combinations (FormField, CardWithActions) in `components/ui/`
  - **Organisms**: Complex UI sections (PlantCard, TaskList) in `components/features/`
  - **Templates**: Page layouts in `components/layout/`
  - **Pages**: Route components in `pages/`
- **Styling Approach**:
  - Primary: MUI `sx` prop for component-specific styling
  - Secondary: `styled()` utility for reusable styled components
  - Global: `src/styles/` for CSS resets and utilities
  - Theme: Customized in `src/theme.ts` (palette, typography, components)

### 5. Routing & Navigation (SUBSTANTIALLY COMPLETE)
- **Definitions**: `src/routes.tsx` using React Router v7 (needs actual page components)
- **Route Protection**: 
  - `RequireAuth` wrapper component checks auth state (implemented)
  - `RequireGuest` wrapper component for public routes (implemented)
  - Public routes: `/login`, `/register`
  - Protected routes: All others (redirect to login if unauthenticated)
- **Route Structure** (NEEDS PAGE COMPONENTS):
  ```
  /                    → Dashboard (protected)
  /plants              → Plant list (protected)
  /plants/:id          → Plant detail (protected)
  /plants/:id/tasks    → Plant care tasks (protected)
  /tasks               → All tasks (protected)
  /health              → Health overview (protected)
  /profile             → User profile (protected)
  /login               → Login (public)
  /register            → Register (public)
  /community           → Community features (protected)
  /consultations       → Expert consultations (protected)
  /environment         → Environmental data (protected)
  /analytics           → Analytics & reports (protected)
  ```

### 6. Data Flow & State Updates
1. **Component** calls **React Query hook** (from `hooks/`)
2. **Hook** calls **Service method** (from `services/`)
3. **Service** makes **API call** via axios instance
4. **Response** processed by React Query:
   - Loading state → shows skeleton/spinner
   - Success state → updates cache, triggers re-render
   - Error state → shows error state, may trigger retry
5. **Mutations** (create/update/delete):
   - Optimistically update UI
   - On success: invalidate relevant queries to refetch
   - On error: rollback optimistic update, show error

### 7. Error Handling Patterns
- **API Errors**: 
  - Services throw errors → caught by React Query → `error` state
  - Components display via `error` state or use global error boundary
- **Validation Errors**: 
  - Handled by React Hook Form/Zod at field level
  - Displayed via MUI `FormHelperText` or `Alert`
- **Auth Errors**: 
  - 401 responses trigger token refresh or redirect to login
- **UI Feedback**: 
  - Use MUI `Alert`, `Snackbar`, or dialog components for user feedback

### 8. Performance Considerations
- **React Query**: Automatic deduplication, caching, background updates
- **Code Splitting**: Route-based lazy loading (implement with `React.lazy()`)
- **Memoization**: Use `useMemo`/`useCallback` for expensive computations
- **Virtualization**: For large lists (consider `react-window` when needed)
- **Image Optimization**: Use modern formats, appropriate sizes, lazy loading

## 🔧 Current State & Next Steps

### What's Working
- ✅ Services layer (auth, plant, careTask, health) with axios interceptors
- ✅ AuthContext with login/logout/register functionality
- ✅ RequireAuth/RequireGuest route protection wrappers
- ✅ TypeScript interfaces for plants, tasks, auth
- ✅ Custom hooks for plants and tasks
- ✅ Dashboard page with mock data and charts
- ✅ Plant list and form pages
- ✅ MUI v9 and React Query v5 configured
- ✅ App.tsx with proper provider wrapping (Theme, Auth, Router)
- ✅ main.tsx with React Query provider
- ✅ routes.tsx with complete routing structure

### What Needs Implementation
- 🔄 **Layout Components**: Create header, sidebar, footer in `components/layout/`
- 🔄 **Remaining Pages**: Complete all page components in `pages/*` directories
- 🔄 **UI Components**: Build reusable UI components in `components/ui/` and `components/features/`
- 🔄 **Utils**: Implement helper functions in `utils/`
- 🔄 **Assets**: Add images, icons, logos to `assets/`
- 🔄 **Styling**: Complete theme customization in `theme.ts`
- 🔄 **Actual Page Content**: Replace placeholder components with real implementations

### Adding a New Feature (e.g., "Watering Schedule")
1. **Domain Modeling**:
   - Add Typescript interfaces in `src/types/watering.ts`
   - Define API response types if needed in `api.ts`

2. **API Service**:
   - Create `src/services/wateringService.ts`
   - Implement CRUD operations following existing service patterns

3. **Data Hooks**:
   - Create `src/hooks/useWatering.ts`
   - Wrap service calls with React Query (`useQuery`, `useMutation`)

4. **UI Components**:
   - Create `src/components/features/watering/` folder
   - Build reusable components (WateringForm, WateringCalendar, etc.)

5. **Pages**:
   - Create route components in `src/pages/watering/`
   - Follow existing page patterns (loading/error states, layouts)

6. **Routing**:
   - Add routes in `src/routes.tsx`
   - Use `RequireAuth` wrapper for protected routes
   - Consider nested routes for plant-specific features

7. **State Integration**:
   - Ensure cache invalidation works correctly with related features
   - Consider global state updates if needed via context/events

## 📝 Code Quality & Conventions

### TypeScript
- Strict mode enabled via `tsconfig.json`
- Prefer interfaces for object shapes, types for unions/primitives
- Avoid `any`; use generics and unknown with type guards
- Domain types in `src/types/`; API-specific types in `types/api.ts`

### React Components
- Functional components with hooks
- Export default for page/components; named exports for utilities
- Props destructuring with default values when appropriate
- Early returns for conditional rendering
- Custom hooks for reusable logic (naming: `use*`)

### Styling
- MUI `sx` prop for 90% of styling needs
- `styled()` constructor for reusable styled components
- CSS variables in theme for consistent values when needed
- Avoid global CSS unless truly global (resets, utilities)

### Error Handling
- Async functions: try/catch with meaningful error messages
- React Query: handle `error` state in components
- Forms: leverage RHF/Zod validation; show field-level errors
- User feedback: MUI Alert/Snackbar for transient messages

## 🌱 Development Workflow

1. **Start dev server**: `npm run dev`
2. **Implement feature** following established patterns
3. **Test manually**: Verify loading, error, empty, and success states
4. **Lint**: Run `npm run lint` and fix issues
5. **Review**: Ensure consistency with existing code patterns
6. **Commit**: Follow conventional commits (feat:, fix:, refactor:, etc.)

This architecture provides a scalable foundation for the plant care scheduler application with clear separation of concerns, maintainable patterns, and excellent developer experience. The application has core services, authentication, routing structure, and basic UI components in place, ready for completion of remaining pages and components.