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

- **Frontend:** Astro, React, TailwindCSS, shadcn/ui
- **Backend:** Supabase (PostgreSQL-based BaaS)
- **AI:** OpenRouter for text parsing
- **Hosting:** DigitalOcean with Docker
- **CI/CD:** GitHub Actions
- **Development Tools:** ESLint, Prettier, Husky, lint-staged

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
- `npm run lint` – Runs ESLint to check for code quality issues.
- `npm run lint:fix` – Automatically fixes linting issues.
- `npm run format` – Formats the code using Prettier.

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
