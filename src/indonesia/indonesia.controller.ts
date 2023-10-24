import { Controller, Get, Query } from '@nestjs/common';
import { IndonesiaService } from './indonesia.service';
import { success } from '../http';
import { FindCityQueryDto } from './dto/find-city.dto';
import { FindDistrictQueryDto } from './dto/find-district.dto';
import { FindSubDistrictQueryDto } from './dto/find-subdistrict.dto';

@Controller('indonesia')
export class IndonesiaController {
  constructor(private readonly indonesiaService: IndonesiaService) { }

  @Get('province')
  async province() {
    return success(await this.indonesiaService.getProvinces());
  }

  @Get('city')
  async city(@Query() query: FindCityQueryDto) {
    return success(await this.indonesiaService.getCities(query));
  }

  @Get('district')
  async district(@Query() query: FindDistrictQueryDto) {
    return success(await this.indonesiaService.getDistricts(query));
  }

  @Get('subdistrict')
  async subdistrict(@Query() query: FindSubDistrictQueryDto) {
    return success(await this.indonesiaService.getSubDistricts(query));
  }
}
