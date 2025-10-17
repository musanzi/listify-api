# Listify API

A backend API built with NestJS, TypeORM and MySQL for the Listify application.

This repository contains the server implementation (REST API) for managing users, roles, products, categories and galleries.

## Quick overview

- Framework: NestJS
- ORM: TypeORM
- Database: MySQL (mysql2 driver)
- Language: TypeScript

## Requirements

- Node.js (>=18 recommended)
- pnpm (this project uses pnpm; npm or yarn may work but commands below use pnpm)
- MySQL server (or compatible, e.g., MariaDB)

## Getting started

1. Clone the repo and install dependencies

```bash
git clone https://github.com/musanzi/listify-api.git
cd listify-api
pnpm install
```

2. Create an environment file

Copy the example or create a `.env` file at the repository root. At minimum you should set database connection values, for example:

```env
NODE_ENV=development
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=changeme
DB_DATABASE=listify_dev
```

This project uses `@nestjs/config` and the TypeORM config located at `src/core/database/orm.config.ts`.

3. Run database migrations

Build first (migrations run against compiled code) then run migrations:

```bash
pnpm build
pnpm db:up
```

To generate a new migration (example):

```bash
pnpm db:migrate --name=add_users_table
```

4. Start the app

Start in development mode with watcher:

```bash
pnpm start:dev
```

Or run the production build:

```bash
pnpm build
pnpm start:prod
```

The server listens on the port configured in `src/main.ts` (usually via env or default 3000).

## Available scripts

- pnpm start — start the app (Nest start)
- pnpm start:dev — start with watch
- pnpm start:debug — start in debug mode
- pnpm start:prod — run built app (node dist/main)
- pnpm build — build TypeScript
- pnpm format — run Prettier
- pnpm lint — run ESLint and auto-fix
- pnpm db:up — run TypeORM migrations
- pnpm db:down — revert migrations
- pnpm db:migrate --name=<name> — generate a migration

See `package.json` for the full list.

## Testing

This repository includes Jest and Supertest for tests. To run tests:

```bash
pnpm test
```

(If `test` script is not defined in package.json you can run `pnpm jest` or add a script.)

## Linting & Formatting

- Format code: `pnpm format`
- Lint and auto-fix: `pnpm lint`

Husky is configured to run commit hooks (see `.husky/`). Commitlint is also configured to enforce conventional commit messages.

## Project structure (high level)

src/

- main.ts — application entry
- app.module.ts — root module
- core/database — TypeORM configuration, migrations and base entities
- features/ — domain modules (users, products, categories, galleries, roles)

## Database migrations & seeders

Migrations are located in `src/core/database/migrations`. The project uses TypeORM CLI via scripts in `package.json`.

If you need to run seeders you can create a small script under `src/core/database/seeders` and run it with ts-node or include a pnpm script.

## Environment & Configuration

Use `.env` files or your deployment provider's secret mechanism. Configuration uses `@nestjs/config` and the values are consumed from `orm.config.ts` and other modules.

## Contributing

- Follow the existing code style (Prettier + ESLint).
- Write unit tests for new features and run them locally.
- Use conventional commits to make the changelog/history easier to follow.

## Common troubleshooting

- Migration errors: ensure `pnpm build` was run before running migrations, and that `DB_*` env values are correct.
- Type errors during build: run `pnpm build` locally and follow TypeScript diagnostics.

## Next steps / suggestions

- Add a `docker-compose.yml` for local dev (DB + app) to simplify onboarding.
- Add a `seed` script to populate initial data for dev/testing.
- Add e2e tests and CI configuration (GitHub Actions) to run tests and lint on PRs.
