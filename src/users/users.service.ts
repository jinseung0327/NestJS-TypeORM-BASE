import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(user: CreateUserDTO): Promise<User> {
    const { password, ...rest } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      ...rest,
      password: hashedPassword,
    });
    return await this.userRepository.save(newUser);
  }

  async update(id: string, user: UpdateUserDTO): Promise<User> {
    const existingUser = await this.findOne(id);
    const updatedUser = { ...existingUser, ...user };
    return await this.userRepository.save(updatedUser);
  }

  async delete(id: string): Promise<void> {
    const existingUser = await this.findOne(id);
    await this.userRepository.delete(existingUser);
  }
}
