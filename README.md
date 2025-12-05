# zamow.to

## Table of Contents

1. [Project Description](#project-description)
2. [Tech Stack](#tech-stack)
3. [Getting Started Locally](#getting-started-locally)
4. [Available Scripts](#available-scripts)
5. [Project Scope](#project-scope)
6. [Project Status](#project-status)
7. [License](#license)

## Project Description

`zamow.to` is a B2B application designed to simplify and speed up the ordering process for professional users, such as small business owners. The MVP demonstrates core functionalities by enabling users to quickly generate orders from pasted product lists, manage a shopping cart, finalize orders offline, and view order history.

## Tech Stack

- **Frontend:** Astro 5, React 19, TailwindCSS 4, shadcn/ui
- **Backend:** Supabase (PostgreSQL-based BaaS)
- **AI:** OpenRouter for text parsing
- **Hosting:** DigitalOcean with Docker
- **CI/CD:** GitHub Actions
- **Development Tools:** ESLint, Prettier, Husky, lint-staged
- **Testing Framework:** Vitest (Unit/Integration), React Testing Library, Playwright (E2E)
- **API Testing:** Mock Service Worker (MSW), Postman
- **Code Quality:** Minimum 70% code coverage for unit tests

## Getting Started Locally

### Prerequisites

- Node.js version: `22.14.0` (as specified in `.nvmrc`)
- npm (Node Package Manager)

### Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/przeprogramowani/10x-astro-starter.git
   cd 10x-astro-starter
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` – Starts the development server.
- `npm run build` – Builds the project for production.
- `npm run preview` – Previews the built project locally.
- `npm run astro` – Runs arbitrary Astro CLI commands.
- `npm run lint` – Runs ESLint to check for code quality issues.
- `npm run lint:fix` – Automatically fixes linting issues.
- `npm run format` – Formats the code using Prettier.
- `npm run test` – Alias for the full Vitest run (`npm run test:unit`).
- `npm run test:unit` – Executes the Vitest suite in CI-friendly mode.
- `npm run test:unit:watch` – Runs Vitest in watch mode for rapid feedback.
- `npm run test:unit:coverage` – Generates Istanbul coverage reports.
- `npm run test:e2e` – Launches Chromium-based Playwright tests.
- `npm run test:e2e:debug` – Starts Playwright with the inspector for debugging.
- `npm run test:e2e:ui` – Opens Playwright UI mode for triaging test runs.

## Running Tests Locally

### Unit & Integration (Vitest + Testing Library)

1. Run the full suite with `npm run test:unit` (used in CI as well).
2. Use `npm run test:unit:watch` while developing components, hooks, or services.
3. Generate Istanbul coverage artifacts via `npm run test:unit:coverage`; output is stored in `coverage/unit`.

The Vitest config uses the jsdom environment, cleans up React trees after each test, and respects the `@/*` path alias through `vite-tsconfig-paths` as required by the testing guidelines.

### End-to-End (Playwright)

1. Install the Chromium browser bundle once per machine: `npx playwright install --with-deps chromium`.
2. Execute the smoke suite with `npm run test:e2e`; this boots the Astro dev server on port `4321` automatically.
3. Use `npm run test:e2e:debug` for inspector-driven debugging or `npm run test:e2e:ui` for triaging runs interactively.

Playwright is configured to run only the Chromium/Desktop Chrome project, capture traces and screenshots on failure, and honors a custom `PLAYWRIGHT_BASE_URL` if you need to point tests at a deployed instance.

## Testing Strategy

### Testing Framework

The project implements a comprehensive testing strategy with multiple levels of testing:

- **Unit Tests:** Vitest + React Testing Library for components, hooks, and services
- **Integration Tests:** Testing component interactions with backend APIs using MSW
- **E2E Tests:** Playwright for full user journey testing (Chrome/Desktop focus)
- **API Tests:** Direct endpoint testing with Zod validation verification
- **Security Tests:** Row Level Security (RLS) verification and authorization testing
- **Visual Regression Tests:** Playwright screenshot comparison for UI consistency

### Quality Gates

- Minimum 70% code coverage for unit tests
- 100% pass rate for critical priority test scenarios
- 95% pass rate for high priority test scenarios
- Zero critical or blocking bugs before production deployment
- Automated testing in CI/CD pipeline (GitHub Actions)

### Key Test Areas

1. **Authentication & Authorization:** User registration, login, session management, RLS policies
2. **AI Text Parsing:** OpenRouter integration, error handling, various input formats
3. **Product Management:** Shopping cart operations, product catalog, order processing
4. **UI/UX Quality:** Responsive design, accessibility (WCAG), component behavior
5. **Performance:** API response times, page load speeds, AI processing efficiency

## Project Scope

### In Scope (MVP)

- **User Accounts:** Registration, login, and password reset.
- **Order Creation:** Intelligent parsing of pasted product lists.
- **Product Catalog:** Manual product search and selection.
- **Shopping Cart:** Add, modify, and remove products.
- **Order Finalization:** Offline order submission with email notifications.
- **Order History:** View a record of past orders.

### Out of Scope (MVP)

- Online payments and integrations with payment gateways.
- External system integrations (API connections with suppliers or warehouses).
- Product recommendations and recurring orders.
- Advanced account management (multiple roles or business accounts).
- Administrative panel for product management (optional future enhancement).

## Project Status

The project is currently in the MVP development phase. Core features such as user accounts, order creation, and shopping cart management are under active development. Future updates will focus on enhancing the user experience and expanding integrations.

## License

This project is licensed under the terms outlined in the [LICENSE](./LICENSE) file.
