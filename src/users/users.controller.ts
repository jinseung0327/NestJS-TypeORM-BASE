import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/oneId/:id')
  getOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post('/add')
  createUser(@Body() user: CreateUserDTO): Promise<User> {
    return this.userService.create(user);
  }

  @Patch('/updt/:id')
  updateOne(@Param('id') id: string, @Body() user: UpdateUserDTO) {
    return this.userService.update(id, user);
  }

  @Delete('/del/:id')
  deleteOne(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }
}
