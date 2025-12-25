# Goinnovior Backend

A robust backend API built with Node.js, Express, TypeScript, and Prisma ORM, designed for a CMS and user management system with authentication, admin, and product management features.

## Features

- **User Authentication**: Local and Google OAuth2 login, JWT-based sessions, secure password handling.
- **Admin & User Management**: Register, login, and manage users and admins with role-based access.
- **CMS Module**: Manage banners and content for the frontend.
- **Product Management**: CRUD operations for products.
- **File Uploads**: Integrated with Cloudinary for media storage, using Multer for handling uploads.
- **Rate Limiting & Security**: Express session, rate limiting, CORS, and secure cookie handling.
- **Error Handling**: Centralized error and not-found middleware.
- **Prisma ORM**: PostgreSQL database with Prisma schema for users, admins, clients, products, and banners.

## Project Structure

```
Backend/
├── prisma/
│   └── schema/         # Prisma schema files (user, product, cms, enums)
│   └── migrations/     # Prisma migration files
├── src/
│   ├── app.ts          # Express app setup
│   ├── server.ts       # Server bootstrap and graceful shutdown
│   └── app/
│       ├── config/     # Configurations (env, cloudinary, passport, multer)
│       ├── errors/     # Custom error classes
│       ├── helpers/    # Utility functions (JWT, pagination, seeding, etc.)
│       ├── interfaces/ # TypeScript interfaces
│       ├── middlewares/# Auth, error, rate limiter, validation
│       ├── modules/    # Feature modules (User, Admin, Auth, CMS)
│       ├── routes/     # API route definitions
│       └── shared/     # Shared utilities (catchAsync, prisma client, etc.)
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── Readme.md           # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database
- Cloudinary account (for media uploads)
- Google OAuth credentials (for social login)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
EXPRESS_SESSION_SECRET=your_session_secret
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
JWT_SECRET=your_jwt_secret
EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=30d
RESET_PASS_TOKEN=your_reset_token_secret
RESET_PASS_TOKEN_EXPIRES_IN=1h
SALT_ROUND=10
```

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run database migrations and generate Prisma client:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/v1/auth/login` - User login (local)
- `GET /api/v1/auth/google` - Google OAuth login
- `POST /api/v1/user/register` - Register new user
- `GET /api/v1/cms/banner` - Get CMS banners
- `POST /api/v1/cms/banner` - Create new banner
- ...and more (see route files for full list)

## Scripts

- `npm run dev` - Start server in development mode
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled server


---

