import { Module } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { SchedulingController } from './scheduling.controller';
import { SchedulingRepository } from './scheduling.repository';
import { SchedulingListener } from './scheduling.listener';

@Module({
  controllers: [SchedulingController],
  providers: [
    SchedulingService,
    SchedulingRepository,
    SchedulingListener,
  ],
})
export class SchedulingModule { }
