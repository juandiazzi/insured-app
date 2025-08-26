import { Module } from '@nestjs/common';
import { SchedulingModule } from './scheduling/scheduling.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule } from '@ssut/nestjs-sqs';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    SqsModule.register({
      consumers: [
        {
          name: 'sqs',
          queueUrl: process.env.SQS_QUEUE_URL ?? '',
          region: process.env.SQS_REGION ?? '',
        },
      ],
      producers: [],
    }),
    SchedulingModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
