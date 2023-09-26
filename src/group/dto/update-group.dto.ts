import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
const updateGroupBodySchema = z.object({
  name: z.string().nonempty(),
});
export class UpdateGroupBodyDto extends createZodDto(updateGroupBodySchema) {}
