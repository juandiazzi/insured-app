import { Module } from '@nestjs/common';
import { SchedulingModule } from './scheduling/scheduling.module';
import { SqsModule } from '@ssut/nestjs-sqs';

@Module({
  imports: [
    SqsModule.register({
      consumers: [
        {
          name: 'sqs',
          queueUrl: 'https://sqs.us-east-2.amazonaws.com/222964727514/sqs',
          region: 'us-east-2',
        },
      ],
      producers: [],
    }),
    SchedulingModule
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule { }
