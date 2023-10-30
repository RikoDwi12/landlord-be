import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { success } from '../http';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, JwtGuard } from 'src/auth';
import type { Response } from 'express';
import { FileService } from './file.service';

@Controller('file')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class FileController {
  constructor(private readonly file: FileService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return success(this.file.upload(file));
  }

  @Get('tmp/:filename')
  streamTmpFile(
    @Res() response: Response,
    @Param('filename') filename: string,
    @CurrentUser('id') userId: number,
  ) {
    return this.file.streamTmpFile(response, userId, filename);
  }
}
