import { Injectable, Logger } from '@nestjs/common';
import { encryptPassword } from 'src/utils/cryptogram';

import { UserService } from './../user/user.service';
import { JwtService } from '@nestjs/jwt';

import { LoginUserDto } from '@/modules/auth/dto/auth.dto';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 验证用户登录信息和密码
   * @param
   */
  async validateUser(username: string, password: string) {
    console.log('用户登录参数', username, password);

    const data = await this.usersService.findOneByName(username);

    console.log(data);

    const user = JSON.parse(JSON.stringify(data || {}));

    console.log(user);

    const { password: PWD, salt } = user;
    const hashPassword = encryptPassword(password, salt);

    console.log(hashPassword);

    if (user && hashPassword === PWD) {
      return user;
    } else {
      return null;
    }
  }

  /**
   * 登录签发TOKEN
   * @param user
   * @returns token
   */
  async certificate(user: any) {
    const payload = {
      id: user.id,
      username: user.username,
      password: user.password,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  /**
   * 用户注册
   * @param createUserDto
   * @returns
   */
  async register(createUserDto: CreateUserDto) {
    return await this.usersService.register(createUserDto);
  }
}
