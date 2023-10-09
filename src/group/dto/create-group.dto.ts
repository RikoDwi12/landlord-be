import { Group } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { SchemaDto } from 'src/@types/dto.types';
const createGroupBodySchema = z.object({
  name: z.string().nonempty(),
} satisfies SchemaDto<Group>);
export class CreateGroupBodyDto extends createZodDto(createGroupBodySchema) { }
