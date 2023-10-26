import { ApiProperty } from '@nestjs/swagger';

// Dummy Dto agar di swagger bisa upload multiple file
export class CreateMediaBodyDto {
  @ApiProperty({
    type: 'array',
    name: 'files[]',
    required: true,
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  files!: Express.Multer.File[];
}
