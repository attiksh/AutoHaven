# AutoHaven Testing Documentation

## Overview

This document outlines the testing framework and strategy used in the AutoHaven project. It details how we validate functionality, ensure stability, and catch regressions through comprehensive automated tests across components, pages, hooks, and integrated flows.

## Technology Stack

- Framework: Vitest
- Rendering & Interactions: @testing-library/react
- Mocking: Built-in Vitest mocking, MSW for API mocks
- Environment: jsdom

## Directory Structure

client/src/tests/
├── components/
│   ├── car/             - Tests for car-related components
│   ├── home/            - Tests for homepage features (e.g., Hero)
│   ├── layout/          - Layout elements (e.g., Header, Footer)
│   └── ui/              - Low-level UI components (e.g., buttons)
├── hooks/               - Custom hook tests (e.g., useAuth)
├── pages/               - Page-level integration tests
├── mocks/
│   ├── handlers.ts      - API request/response handlers
│   └── server.ts        - MSW server setup
├── utils/               - Test helper functions
├── test-utils.tsx       - Custom render wrapper with context providers
└── test-setup.ts        - One-time setup for the Vitest environment

## Test Configuration

Vitest is configured via vitest.config.ts to:
- Use jsdom as the test environment
- Register custom path aliases (@, @shared)
- Load global setup from test-setup.ts

Example config:

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './client/src/tests/test-setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'client/src/shared'),
    },
  },
});

## Rendering Strategy

All tests use a custom render() utility defined in test-utils.tsx, which wraps components with:

- QueryClientProvider (React Query)
- AuthProvider (Authentication)
- Additional providers if needed

This ensures tests simulate the real application context.

## Testing Types

Component Tests:
- Render UI elements with specific props or state
- Simulate interactions (clicks, typing)
- Assert visible content and DOM structure

Example:

it('renders the hero section with search', () => {
  render(<Hero />);
  expect(screen.getByText('Find Your Perfect Drive')).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Tesla Model 3/)).toBeInTheDocument();
});

Hook Tests:
- Validate custom logic and state updates
- Use renderHook from @testing-library/react-hooks

Example:

it('returns user data when authenticated', () => {
  (useQuery as any).mockReturnValue({ data: mockUser, isLoading: false });
  const { result } = renderHook(() => useAuth());
  expect(result.current.user).toEqual(mockUser);
});

Integration Tests:
- Test interactions across components
- Simulate end-to-end flows like login > redirect > dashboard

Page Tests:
- Ensure full pages load with layout, content, and routes
- Simulate page-level interactions like submitting forms

## Mocking Strategy

API Mocking with MSW:
- Use mocks/server.ts to start mock server
- Define mock responses in mocks/handlers.ts
- Test against different success and error responses

Component Mocking:
- Stub complex or external components using vi.mock

Example:

vi.mock('@/components/ui/slider', () => ({
  Slider: ({ onValueChange }: any) => (
    <div data-testid="slider-mock">
      <button onClick={() => onValueChange([10000, 50000])}>Set Price</button>
    </div>
  ),
}));

Hook Mocking:
- Mock return values from useAuth, useToast, etc.

vi.mock('@/hooks/use-auth', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }) => <>{children}</>,
}));

(useAuth as any).mockReturnValue({
  user: null,
  loginMutation: { mutate: mockLogin, isPending: false },
});

## Best Practices

- Test user behavior, not implementation details
- Isolate tests and avoid shared global state
- Keep tests fast and reliable
- Mock only when necessary
- Write clear and descriptive test names
- Use data-testid only when required

## Running Tests

To run all tests:
npm test

To watch for changes:
npm test -- --watch

To run a specific file:
npm test -- client/src/tests/components/layout/header.test.tsx

## Conclusion

This testing strategy ensures confidence in AutoHaven’s functionality. Through component, hook, and integration tests, we maintain a stable, reliable, and scalable front-end codebase as the app continues to grow.