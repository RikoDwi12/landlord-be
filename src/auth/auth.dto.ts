import { createZodDto } from 'nestjs-zod/dto';
import { z } from 'nestjs-zod/z';

const LoginBodyShema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class LoginBodyDto extends createZodDto(LoginBodyShema) {}
