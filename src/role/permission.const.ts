import { Prisma } from '@prisma/client';

export const modules = Object.keys(Prisma.ModelName) as (keyof typeof Prisma.ModelName)[]

export type AvailableModule = (typeof modules)[number];

export const PERMISSIONS = [
  '*',
  ...modules
    .map((module) => [
      `${module}.*` as const,
      `${module}.create` as const,
      `${module}.read` as const,
      `${module}.update` as const,
      `${module}.delete` as const,
    ])
    .flat(),

  // tambahkan permission di sini yang bukan CRUD
] as const;

export type Permission = (typeof PERMISSIONS)[number];
