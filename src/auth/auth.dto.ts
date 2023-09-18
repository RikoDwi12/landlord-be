import { createZodDto } from 'nestjs-zod/dto';
import z from 'nestjs-zod/z';

const LoginBodyShema = z.object({
  email: z.string().email(),
  password: z.string(),
});
type LoginBody = z.infer<typeof LoginBodyShema>;
let a: LoginBody;
a.email;

export class LoginBodyDto extends createZodDto(LoginBodyShema) {}
