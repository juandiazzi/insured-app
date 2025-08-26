import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';

@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) { }

  @Post()
  create(@Body() createSchedulingDto: CreateSchedulingDto) {
    return this.schedulingService.create(createSchedulingDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulingService.findOne(+id);
  }

}
