import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashedPassword123',
  role: 'ADMIN',
  avatar: 'http://example.com/avatar.jpg',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('findByEmail()', () => {
    it('should find user by email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByEmail('john@example.com');
      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
    });
  });

  describe('findById()', () => {
    it('should find user by id with select options', async () => {
      const selectedUser = {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        avatar: mockUser.avatar,
      };
      mockPrismaService.user.findUnique.mockResolvedValue(selectedUser);

      const result = await service.findById(1);
      expect(result).toEqual(selectedUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { id: true, name: true, email: true, role: true, avatar: true },
      });
    });
  });

  describe('create()', () => {
    it('should create a new user', async () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.create(data);
      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({ data });
    });
  });

  describe('getProfile()', () => {
    it('should return user profile if found', async () => {
      const profileUser = {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        avatar: mockUser.avatar,
        isActive: mockUser.isActive,
        createdAt: mockUser.createdAt,
      };
      mockPrismaService.user.findUnique.mockResolvedValue(profileUser);

      const result = await service.getProfile(1);
      expect(result).toEqual(profileUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          isActive: true,
          createdAt: true,
        },
      });
    });

    it('should throw NotFoundException if user profile not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile()', () => {
    it('should update user name and return selected fields', async () => {
      const dto = { name: 'Updated Name' };
      const updatedUser = {
        id: mockUser.id,
        name: 'Updated Name',
        email: mockUser.email,
        role: mockUser.role,
        avatar: mockUser.avatar,
      };
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(1, dto);
      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: dto.name },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
        },
      });
    });
  });

  describe('updateAvatar()', () => {
    it('should update user avatar and return selected fields', async () => {
      const newAvatarUrl = 'http://example.com/new-avatar.jpg';
      const updatedUser = {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        avatar: newAvatarUrl,
      };
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateAvatar(1, newAvatarUrl);
      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { avatar: newAvatarUrl },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
        },
      });
    });
  });

  describe('changePassword()', () => {
    const dto = {
      currentPassword: 'password123',
      newPassword: 'newPassword123',
    };

    it('should change password successfully when current password is correct', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword123');
      mockPrismaService.user.update.mockResolvedValue({});

      const result = await service.changePassword(1, dto);
      expect(result).toEqual({ message: 'Password changed successfully' });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        dto.currentPassword,
        mockUser.password,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.newPassword, 10);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { password: 'newHashedPassword123' },
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.changePassword(999, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if current password is incorrect', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.changePassword(1, dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
