import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

// ─── MOCK BCRYPT toàn bộ module ───────────────────────
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword123'),
  compare: jest.fn().mockResolvedValue(true),
}));
import * as bcrypt from 'bcrypt';

// ─── MOCK DATA ────────────────────────────────────────
const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@gmail.com',
  password: 'hashedPassword123',
  role: 'ADMIN',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ─── MOCK SERVICES ────────────────────────────────────
const mockUsersService = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('test-secret'),
};

const mockPrismaService = {
  refreshToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
};

// ─── TEST SUITE ───────────────────────────────────────
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();

    // Reset bcrypt mocks về default sau mỗi test
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  });

  // ─── REGISTER ─────────────────────────────────────────
  describe('register()', () => {
    const registerDto = {
      name: 'Test User',
      email: 'test@gmail.com',
      password: 'password123',
    };

    it('should register successfully', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);
      mockPrismaService.refreshToken.create.mockResolvedValue({});

      const result = await service.register(registerDto);

      expect(result.message).toBe('Register successful');
      expect(result.user.email).toBe(registerDto.email);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw ConflictException if email exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should hash password before saving', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);
      mockPrismaService.refreshToken.create.mockResolvedValue({});

      await service.register(registerDto);

      // bcrypt.hash phải được gọi với password gốc
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
    });
  });

  // ─── LOGIN ────────────────────────────────────────────
  describe('login()', () => {
    const loginDto = {
      email: 'test@gmail.com',
      password: 'password123',
    };

    it('should login successfully with correct credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrismaService.refreshToken.create.mockResolvedValue({});

      const result = await service.login(loginDto);

      expect(result.message).toBe('Login successful');
      expect(result.accessToken).toBeDefined();
      expect(result.user.email).toBe(loginDto.email);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password wrong', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // password sai

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // ─── REFRESH ──────────────────────────────────────────
  describe('refresh()', () => {
    it('should refresh token successfully', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      mockPrismaService.refreshToken.findUnique.mockResolvedValue({
        id: 1,
        token: 'valid-refresh-token',
        expiresAt: futureDate,
        user: mockUser,
      });
      mockPrismaService.refreshToken.delete.mockResolvedValue({});
      mockPrismaService.refreshToken.create.mockResolvedValue({});

      const result = await service.refresh('valid-refresh-token');

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw UnauthorizedException if token not found', async () => {
      mockPrismaService.refreshToken.findUnique.mockResolvedValue(null);

      await expect(service.refresh('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token expired', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      mockPrismaService.refreshToken.findUnique.mockResolvedValue({
        id: 1,
        token: 'expired-token',
        expiresAt: pastDate,
        user: mockUser,
      });
      mockPrismaService.refreshToken.delete.mockResolvedValue({});

      await expect(service.refresh('expired-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // ─── LOGOUT ───────────────────────────────────────────
  describe('logout()', () => {
    it('should logout successfully', async () => {
      mockPrismaService.refreshToken.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.logout('some-refresh-token');

      expect(result.message).toBe('Logged out successfully');
      expect(mockPrismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { token: 'some-refresh-token' },
      });
    });
  });
});
