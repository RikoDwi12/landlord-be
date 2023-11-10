import { Group } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { SchemaDto } from '../../@types/dto.types';
const createGroupBodySchema = z.object({
  name: z.string().nonempty(),
} satisfies SchemaDto<Group>);
export class CreateGroupBodyDto extends createZodDto(createGroupBodySchema) { }
