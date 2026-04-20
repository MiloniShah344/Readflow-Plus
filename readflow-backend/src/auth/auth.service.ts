/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user already exists
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // Create user
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    // Generate token
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
      message: 'Account created successfully! Welcome to ReadFlow+',
    };
  }

  async login(dto: LoginDto) {
    // Find user
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
      message: 'Welcome back to ReadFlow+!',
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();
    return this.sanitizeUser(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    // Use findByIdWithPassword to get the hashed password
    const user = await this.usersService.findByIdWithPassword(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const valid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!valid) throw new BadRequestException('Current password is incorrect');

    if (dto.oldPassword === dto.newPassword) {
      throw new BadRequestException(
        'New password must be different from your current password',
      );
    }

    const hashed = await bcrypt.hash(dto.newPassword, 12);
    await this.usersService.update(userId, { password: hashed });

    return { message: 'Password changed successfully' };
  }

  private generateToken(user: User): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
  }

  private sanitizeUser(user: User) {
    const { password, books, readingLogs, ...result } = user;
    return JSON.parse(JSON.stringify(result));
  }
}
