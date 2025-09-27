# Auth Backend

Authentication backend built with NestJS, GraphQL, and Supabase.

## Environment Variables

Before running the project, you need to set up the following environment variables. Create a `.env` file in the root directory with:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=3000
```

## Project setup

```bash
pnpm install
```

## Project compile

```bash
# development
pnpm run start

# watch mode
pnpm run start:dev

# production mode
pnpm run start:prod
```
