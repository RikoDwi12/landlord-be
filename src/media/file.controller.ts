import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  Res,
  Patch,
  Body,
} from '@nestjs/common';  dasd
import { success } from '../http';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CurrentUser, JwtGuard } from 'src/auth';
import type { Response } from 'express';
import { FileService } from './file.service';
import type { User } from '@prisma/client';
import { RenameMediaBodyDto } from './dto/update-media.dto';
import { AuthorizationGuard, MediaPolicy, UsePolicy } from 'src/authorization';

@UseGuards(JwtGuard, AuthorizationGuard)
@UsePolicy(MediaPolicy)
@ApiBearerAuth()
@Controller('file')
export class FileController {
  constructor(private readonly file: FileService) {}
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: 'object',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return success(this.file.upload(file));
  }

  @Get('tmp/:filename')
  streamTmpFile(
    @Res() response: Response,
    @Param('filename') filename: string,
    @CurrentUser() user: User,
  ) {
    return this.file.streamTmpFile(response, user, filename);
  }

  @Patch('media')
  async renameMedia(@Body() body: RenameMediaBodyDto) {
    return success(await this.file.renameMedia(body));
  }
}
