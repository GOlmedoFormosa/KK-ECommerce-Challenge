import { ApiProperty } from '@nestjs/swagger';

export class ProductUpdateDto {
  @ApiProperty({ default: 'test update title', required: false })
  title?: string;
  @ApiProperty({ default: 'test update description', required: false })
  description?: string;
  @ApiProperty({ default: 4444, required: false })
  price?: number;
}
