import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'electronics', required: false })
  @IsString()
  @IsOptional()
  slug?: string; // nếu không truyền thì auto generate từ name

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsInt()
  @IsOptional()
  parentId?: number;
}