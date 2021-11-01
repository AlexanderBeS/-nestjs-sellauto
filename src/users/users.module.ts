import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from "./user.entity";
import {AuthService} from "./auth.service";
import {CurrentUserInterceptor} from "./interceptors/current-user.interceptor";

@Module({
  imports: [TypeOrmModule.forFeature([User])], //связываем этот модуль с entity
  controllers: [UsersController],
  providers: [UsersService, AuthService, CurrentUserInterceptor]
})
export class UsersModule {}
