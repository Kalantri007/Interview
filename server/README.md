<h1 align="center">Red Planet Staffing Server</h1>

This is the server application for Red Planet Staffing, the leading staffing marketplace on Mars. Built with NestJS and Prisma, it provides a robust API for managing workers, workplaces, and shifts.

## Technologies

- [TypeScript](https://www.typescriptlang.org/)
- [NestJS](https://docs.nestjs.com/)
- [Prisma](https://www.prisma.io/docs/concepts/components/prisma-client)

## Getting Started

### Setup

```bash
# Install dependencies
npm install

# Create and migrate the database, and then apply seed data located at `./prisma/seed`
npx prisma migrate dev --name init

# Drop and re-seed the database
npx prisma migrate reset

# Start the server in watch mode with hot-reloading
npm run start:dev
```

## API Reference

### Workers

- `POST /workers`: Create a worker
  - Body: [`createWorkerSchema`](./src/modules/workers/workers.schemas.ts)
- `GET /workers/:id`: Get worker by ID
  - Params: `:id` - Worker ID
- `GET /workers`: List all workers
- `GET /workers/claims`: Get worker claims
  - Query: `workerId` - Worker ID

### Workplaces

- `POST /workplaces`: Create a workplace
  - Body: [`createWorkplaceSchema`](./src/modules/workplaces/workplaces.schemas.ts)
- `GET /workplaces/:id`: Get workplace by ID
  - Params: `:id` - Workplace ID
- `GET /workplaces`: List all workplaces

### Shifts

- `POST /shifts`: Create a shift
  - Body: [`createShiftSchema`](./src/modules/shifts/shifts.schemas.ts)
- `GET /shifts/:id`: Get shift by ID
  - Params: `:id` - Shift ID
- `POST /shifts/:id/claim`: Claim a shift
  - Params: `:id` - Shift ID
  - Body: `workerId` - Worker ID
- `POST /shifts/:id/cancel`: Cancel a claimed shift
  - Params: `:id` - Shift ID
- `GET /shifts`: List all shifts
