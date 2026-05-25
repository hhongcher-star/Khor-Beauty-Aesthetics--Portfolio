# Backend API Deployment

Production startup must not run `prisma db push` or seed data automatically.

Use this flow for production releases:

```bash
npm ci
npm run db:generate
npm run build
npm run db:migrate:deploy
npm start
```

Seed data is manual only:

```bash
npm run db:seed
```

Required environment variables:

```bash
DATABASE_URL
JWT_SECRET
PORT
CORS_ORIGINS
NODE_ENV
```

TODO: migrate admin authentication from localStorage JWT to httpOnly secure cookies with CSRF protection.
