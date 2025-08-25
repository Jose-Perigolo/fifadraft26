import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Add connection pooling for serverless
  ...(process.env.NODE_ENV === 'production' && {
    __internal: {
      engine: {
        connectionLimit: 1,
      },
    },
  }),
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
