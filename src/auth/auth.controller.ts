import { Body, Controller, Post } from '@nestjs/common';
import { LoginBodyDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post('login')
  async login(@Body() body: LoginBodyDto) {
    const token = await this.authService.login(body);
    return { token };
  }
}
