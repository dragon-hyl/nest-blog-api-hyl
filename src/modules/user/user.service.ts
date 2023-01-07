import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { RegisterDto } from '@/modules/auth/dto/auth.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { encryptPassword, makeSalt } from 'src/utils/cryptogram';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * 注册用户
   * @param createUseerDto 注册用户体
   * @returns
   */
  async register(createUseerDto: CreateUserDto) {
    const { username, email, password } = createUseerDto;

    if (await this.usersRepository.findOneBy({ username })) {
      // 检查用户名是否重复
      throw new BadRequestException('用户名已经存在');
    } else if (await this.usersRepository.findOneBy({ email })) {
      // email 是否存在
      throw new BadRequestException('邮箱已存在');
    } else {
      // 加盐加密
      const salt = makeSalt();
      const hashPwd = encryptPassword(password, salt);

      Object.keys(createUseerDto).forEach((item) => {
        if (item === 'password') createUseerDto[item] = hashPwd;
      });
      const reqBody = Object.assign({ salt }, createUseerDto);

      return this.usersRepository.save(reqBody);
    }
  }

  /**
   * 根据 username 查找用户
   * @param username
   * @returns
   */
  async findOneByName(username: string) {
    // return this.usersRepository.findOne({ where: { username } });
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username=:username', { username })
      .getOne();

    return user;
  }

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  // findAll() {
  //   return `This action returns all user`;
  // }

  /**
   * 根据用户的 uuid 来获取用户信息
   * @param id
   * @returns
   */
  findOne(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
