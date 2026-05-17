import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Kiểm tra email đã tồn tại chưa
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Tạo user
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    // Trả về token ngay sau khi register
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      message: 'Register successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  async login(dto: LoginDto) {
    // Tìm user
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // So sánh password
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  private generateToken(id: number, email: string, role: string) {
    return this.jwtService.sign({ sub: id, email, role });
  }
}