import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { FindCityQueryDto } from './dto/find-city.dto';
import { FindDistrictQueryDto } from './dto/find-district.dto';
import { FindSubDistrictQueryDto } from './dto/find-subdistrict.dto';

@Injectable()
export class IndonesiaService {
  constructor(private readonly prisma: PrismaService) { }
  getProvinces() {
    return this.prisma.province.findMany();
  }

  getCities(query: FindCityQueryDto) {
    return this.prisma.city.findMany({
      where: {
        province_code: query.province_code,
      },
    });
  }

  getDistricts(query: FindDistrictQueryDto) {
    return this.prisma.district.findMany({
      where: {
        city_code: query.city_code,
      },
    });
  }

  getSubDistricts(query: FindSubDistrictQueryDto) {
    return this.prisma.subDistrict.findMany({
      where: {
        district_code: query.district_code,
      },
    });
  }
}
