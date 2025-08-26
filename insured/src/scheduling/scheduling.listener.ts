import type { Message } from '@aws-sdk/client-sqs';
import { Inject, Injectable } from '@nestjs/common';
import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs';
import { SchedulingService } from './scheduling.service';

@Injectable()
export class SchedulingListener {
    constructor(
        @Inject(SchedulingService)
        private readonly schedulingService: SchedulingService
    ) { }

    @SqsMessageHandler('sqs', false)
    public async handleMessage(message: any) {
        if (message.body) {
            const data = JSON.parse(message.body).detail;
            if (!data) {
                throw new Error('Message body is undefined');
            }
            await this.schedulingService.update({
                insuredId: data.insuredId,
                scheduleId: data.scheduleId,
                countryISO: data.countryISO,
            });
        }
    }

    @SqsConsumerEventHandler('sqs', 'processing_error')
    public onProcessingError(error: Error, message: Message) {
        console.log('onProcessingError', error, message)
    }
}