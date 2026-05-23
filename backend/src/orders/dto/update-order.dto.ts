import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  // Chỉ cho phép update customer info và status
  // KHÔNG update product list — business rule!

  @ApiProperty({ required: false, example: 1 })
  @IsInt()
  @IsOptional()
  customerId?: number;

  @ApiProperty({
    required: false,
    enum: ['PENDING', 'PAID', 'COMPLETED', 'CANCELLED'],
  })
  @IsEnum(['PENDING', 'PAID', 'COMPLETED', 'CANCELLED'])
  @IsOptional()
  status?: 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note?: string;
}
