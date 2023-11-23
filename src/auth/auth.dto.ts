import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

const LoginBodyShema = extendApi(
  z.object({
    email: z.string().email(),
    password: z.string(),
  }),
  {
    example: {
      email: 'leon@mail.com',
      password: 'password',
    },
  },
);

export class LoginBodyDto extends createZodDto(LoginBodyShema) {}
