import { z } from 'nestjs-zod/z';

export type SchemaDto<T, K = undefined> = Partial<
  Record<K extends string ? keyof T | K : keyof T, z.ZodType>
>;
export type QueryableDto =
  | 'search'
  | 'orderBy'
  | 'orderDirection'
  | 'limit'
  | 'page';
