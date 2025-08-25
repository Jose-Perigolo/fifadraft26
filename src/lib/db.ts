import { PrismaClient } from '@prisma/client';

// For development, use a singleton
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// For production, create a new client for each request to avoid connection conflicts
export const prisma = process.env.NODE_ENV === 'production' 
  ? new PrismaClient({
      log: ['error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    })
  : globalForPrisma.prisma ?? new PrismaClient({
      log: ['query', 'error', 'warn'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
