import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {UsersService} from "./users.service";
import {randomBytes, scrypt as _scrypt} from "crypto";
import {promisify} from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password:string) {
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email is in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer; // buffer - type returned from scrypt
    const result = salt + '.' + hash.toString('hex');
    const user = await this.usersService.create(email, result);

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password');
    }

    return user;
  }

}
