# ISIP — Industrial Safety Intelligence Platform (Backend)

Real-time industrial safety monitoring backend with REST APIs, WebSocket support, and PostgreSQL.

## Tech Stack

- **Runtime**: Node.js (ESM)
- **Framework**: Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Passport.js (Local + JWT)
- **Real-time**: Socket.IO
- **Validation**: Zod
- **Docs**: Swagger UI

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file and configure DATABASE_URL
cp .env.example .env

# 3. Generate Prisma Client
npm run prisma:generate

# 4. Run database migrations
npm run prisma:migrate

# 5. (Optional) Seed the database
npm run prisma:seed

# 6. Start development server
npm run dev
```

## API Documentation

Swagger UI is available at: `http://localhost:5000/api-docs`

## API Endpoints

| Module     | Base Path        | Methods                          |
|------------|------------------|----------------------------------|
| Auth       | `/api/auth`      | POST register, login, logout, me |
| Users      | `/api/users`     | GET, POST, PUT, DELETE           |
| Dashboard  | `/api/dashboard` | GET (KPIs)                       |
| Zones      | `/api/zones`     | GET, POST, PUT, DELETE           |
| Equipment  | `/api/equipment` | GET, POST, PUT, DELETE           |
| Sensors    | `/api/sensors`   | GET, POST, PUT, DELETE           |
| Workers    | `/api/workers`   | GET, POST, PUT, DELETE           |
| Permits    | `/api/permits`   | GET, POST, PUT, DELETE           |
| Alerts     | `/api/alerts`    | GET, POST, PUT, DELETE           |
| Timeline   | `/api/timeline`  | GET, POST, PUT, DELETE           |
| Reports    | `/api/reports`   | GET, POST, PUT, DELETE           |

## Project Structure

```
backend/
├── prisma/              # Database schema and migrations
├── src/
│   ├── app.js           # Express application setup
│   ├── server.js        # HTTP server + Socket.IO
│   ├── config/          # Configuration modules
│   ├── modules/         # Feature modules (routes, controllers, services, repos)
│   ├── middlewares/      # Express middlewares
│   ├── utils/           # Shared utilities
│   └── socket/          # Socket.IO infrastructure
```
