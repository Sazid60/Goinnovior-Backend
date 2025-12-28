# Goinnovior Backend

A robust backend API built with Node.js, Express, TypeScript, and Prisma ORM, designed for a CMS and user management system with authentication, admin, and product management features.


### Live Link : [Gonnivior E-Commerce Frontend](https://gonnivior-frontend.vercel.app/)
### Frontend Repo : [Gonnivior E-Commerce Frontend](https://github.com/Sazid60/Goinnovior-Frontend.git)


#### Admin Login Credential

- ADMIN_EMAIL= admin@gmail.com
- ADMIN_PASSWORD= Admin@12345

## Features

- **User Authentication & Authorization**:
  - Local (email/password) and Google OAuth2 login
  - JWT-based sessions with secure cookie storage
  - Refresh token rotation and access token renewal
  - Role-based access control (Admin, User)
- **User & Admin Management**:
  - Register, login, and manage users and admins
  - Profile update, password hashing, and validation
  - Admin-only endpoints for user management
- **CMS Module**:
  - Manage banners and content for the frontend
  - CRUD operations for CMS banners
- **Product Management**:
  - Full CRUD for products (create, read, update, delete)
  - Pagination and filtering support
- **File Uploads**:
  - Integrated with Cloudinary for media storage
  - Multer middleware for handling file uploads
- **Security & Rate Limiting**:
  - Express session and secure cookie handling
  - Rate limiting middleware to prevent abuse
  - CORS configuration for frontend integration
- **Error Handling**:
  - Centralized error and not-found middleware
  - Consistent API error responses
- **Prisma ORM & PostgreSQL**:
  - Prisma schema for users, admins, clients, products, banners
  - Transactional operations and migrations
- **API Structure**:
  - RESTful endpoints grouped by modules (User, Auth, CMS, Admin)
  - Modular route and controller structure
- **Developer Experience**:
  - TypeScript types and interfaces for safety
  - Utility helpers for JWT, pagination, seeding, etc.
  - Environment-based configuration

## Main Modules Overview

- **Auth Module**: Handles login, registration, Google OAuth, token refresh, and user info endpoints.
- **User Module**: User registration, profile management, and user-specific endpoints.
- **Admin Module**: Admin registration, login, and privileged user management.
- **CMS Module**: Banner/content CRUD for frontend display.
- **Product Module**: Product CRUD, listing, and filtering.

## API Highlights

- **Authentication**: `/api/v1/auth/login`, `/api/v1/auth/google`, `/api/v1/auth/refresh-token`, `/api/v1/auth/me`
- **User**: `/api/v1/user/register`, `/api/v1/user/profile`, `/api/v1/user/update`
- **Admin**: `/api/v1/admin/register`, `/api/v1/admin/login`, `/api/v1/admin/users`
- **CMS**: `/api/v1/cms/banner`, `/api/v1/cms/banner/:id`
- **Product**: `/api/v1/cms/product`, `/api/v1/cms/product/:id`

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


