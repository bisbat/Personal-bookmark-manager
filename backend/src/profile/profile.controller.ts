import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller()
export class MeController {
  @Get('me')
  getMe(@CurrentUser() user: { sub: string }) {
    return { sub: user.sub };
  }
}