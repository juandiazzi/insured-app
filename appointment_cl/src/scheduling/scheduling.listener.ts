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

    @SqsMessageHandler('sqs-cl', false)
    public async handleMessage(message: any) {
        const data = JSON.parse(JSON.parse(message.body)?.Message);
        if (!data) {
            throw new Error('Message body is undefined');
        }

        await this.schedulingService.create({
            insuredId: data.insuredId,
            scheduleId: data.scheduleId,
            countryISO: data.countryISO,
            centerId: data.centerId,
            specialtyId: data.specialtyId,
            medicId: data.medicId,
            appointmentDate: data.appointmentDate,
        });
    }

    @SqsConsumerEventHandler('sqs-cl', 'processing_error')
    public onProcessingError(error: Error, message: Message) {
        console.log('onProcessingError', error, message)
    }
}