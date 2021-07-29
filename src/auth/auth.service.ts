import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { compare, hash } from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { sign } from 'jsonwebtoken';
@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  //Register user
  async createUser(createUserDto: CreateUserDto) {
    const isEmailUsed = await this.userModel.findOne({
      email: createUserDto.email,
    });
    const isUsernameUsed = await this.userModel.findOne({
      username: createUserDto.username,
    });
    if (isEmailUsed) {
      throw new HttpException('Email занят!', 409);
      return;
    }
    if (isUsernameUsed) {
      throw new HttpException('Username занят!', 409);
      return;
    }
    const hashedPassword = await hash(createUserDto.password, 12);
    const newUser = {
      email: createUserDto.email,
      username: createUserDto.username,
      password: hashedPassword,
    };
    const user = await new this.userModel(newUser);
    return user.save();
  }

  //Login user
  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userModel.findOne({ email: loginUserDto.email });
    if (!user) {
      throw new HttpException('Пользователь не найден!', 400);
      return;
    }
    const isMatch = await compare(loginUserDto.password, user.password);
    if (!isMatch) {
      throw new HttpException('Неверный пароль!', 400);
      return;
    }
    const jwtSecret: string =
      'fhiahifhio3yi1yior31ihf1y90143941hf1whifhsaf13rf';
    const token = await sign({ userId: user.id }, jwtSecret, {
      expiresIn: '1h',
    });
    return { token, userId: user.id, username: user.username };
  }
}
