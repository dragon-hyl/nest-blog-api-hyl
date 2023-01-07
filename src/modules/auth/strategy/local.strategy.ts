import { AuthService } from '../auth.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { User } from '@/modules/user/entities/user.entity';
import { LoginUserDto } from '@/modules/auth/dto/auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * @description: 本地策略验证方法
   * @return {*} 用户实体
   */
  async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(username, password);
    if (user) {
      return user;
    } else {
      throw new BadRequestException('用户名或密码错误');
    }
  }
}
