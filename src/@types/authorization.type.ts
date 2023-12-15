import type { PureAbility } from '@casl/ability';
import type { PrismaQuery, Subjects } from '@casl/prisma';
import type { PrismaModels } from './prisma.types';

export type AbilityAction = 'create' | 'read' | 'update' | 'delete' | 'manage';

export type AppAbility = PureAbility<
  [AbilityAction, Subjects<PrismaModels>],
  PrismaQuery<PrismaModels>
>;
