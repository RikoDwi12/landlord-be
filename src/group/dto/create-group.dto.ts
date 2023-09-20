import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
const createGroupBodySchema = z.object({
  name: z.string().nonempty(),
});
export class CreateGroupBodyDto extends createZodDto(createGroupBodySchema) { }
