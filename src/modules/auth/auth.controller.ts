import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

import { LoginUserDto } from '@/modules/auth/dto/auth.dto';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';

@Controller('auth')
@ApiTags('用户认证模块')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户注册
   * @param body
   * @returns
   */
  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @HttpCode(HttpStatus.OK)
  async register(@Body() body: CreateUserDto) {
    return await this.authService.register(body);
  }

  /**
   * 用户登录
   * @param body 登录信息
   */
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  async login(@Body() loginData: LoginUserDto) {
    return await this.authService.certificate(loginData);
  }
}
