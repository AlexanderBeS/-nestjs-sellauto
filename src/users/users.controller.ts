import {
  Body, Controller, Post, Get,
  Param, Query, Delete, Patch,
  NotFoundException, UseInterceptors, ClassSerializerInterceptor,
  Session,
  UseGuards
} from '@nestjs/common';
import {CreateUserDto} from "./dtos/create-user.dto";
import {UpdateUserDto} from "./dtos/update-user.dto";
import {UsersService} from "./users.service";
import {Serialize} from "../interceptors/serialize.interceptor";
import {UserDto} from "./dtos/user.dto";
import {AuthService} from "./auth.service";
import {CurrentUser} from "./decorators/current-user.decorator";
import {User} from "./user.entity";
import {AuthGuard} from "../guards/auth.guard";
//import {CurrentUserInterceptor} from "./interceptors/current-user.interceptor";

@Controller('auth')
@Serialize(UserDto) // для каждого роута контроллера
//@UseInterceptors(CurrentUserInterceptor)
export class UsersController {

  constructor(private usersService: UsersService, private authService: AuthService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Get('/me')
  me(@Session() session: any) {
    return this.usersService.findOne(session.userId);
  }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  //@UseInterceptors(new SerializeInterceptor(UserDto))
  //@Serialize(UserDto)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    console.log('Handler is running');
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
