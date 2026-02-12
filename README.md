# Project Overview

A next js boilerplate app


# Development Setup

To set up the development environment for this project, follow these steps:
1. Create a copy of `.env.example` and rename it to `.env`. Fill in the necessary environment variables.
2. Install the required dependencies using PNPM:
   ```bash
   pnpm install
   ```
3. Set up the database by running the following commands:
   ```bash
   pnpm run db:generate
   pnpm run db:migrate
   ```
4. Start the development server:
   ```bash
   pnpm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000` to view the application.
