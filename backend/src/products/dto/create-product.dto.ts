import { IsString, IsNumber, IsInt, IsOptional, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'IP15P-256' })
  @IsString()
  sku: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 999.99 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stockQuantity: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  categoryId: number;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}