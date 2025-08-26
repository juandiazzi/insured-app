import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { configure as serverlessExpress } from '@codegenie/serverless-express';
import { AppModule } from './app.module';
import { SchedulingListener } from './scheduling/scheduling.listener';
import { SchedulingService } from './scheduling/scheduling.service';

let cached: any;
let nestApp: any;

async function bootstrap() {
    nestApp = await NestFactory.create(AppModule, new ExpressAdapter());
    await nestApp.init();
    return serverlessExpress({
        app: nestApp.getHttpAdapter().getInstance(),
    });
}

export const handler = async (event, context) => {
    cached ||= await bootstrap();

    if (event.Records && event.Records[0].eventSource === "aws:sqs") {
        const schedulingService = nestApp.get(SchedulingService);
        const listener = new SchedulingListener(schedulingService);

        for (const record of event.Records) {
            await listener.handleMessage(record);
        }
        return { statusCode: 200 };
    }

    return cached(event, context);
};
