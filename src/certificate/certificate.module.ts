import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { IndonesiaModule } from 'src/indonesia/indonesia.module';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [IndonesiaModule, MediaModule],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModule {}
