import { ConflictException, Injectable, Controller } from '@nestjs/common';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';
import { SchedulingRepository } from './scheduling.repository';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

@Injectable()
export class SchedulingService {
  private readonly snsClient = new SNSClient({ region: "us-east-2" });
  private readonly topicArn = "arn:aws:sns:us-east-2:222964727514:AppointmentTopic";

  constructor(
    private readonly schedulingRepository: SchedulingRepository,
  ) { }

  async create(createSchedulingDto: CreateSchedulingDto) {
    try {
      const { insuredId, scheduleId, countryISO } = createSchedulingDto;

      const document = await this.schedulingRepository.findByScheduleId(scheduleId);
      if (document && document.status.S === "AVAILABLE") {
        const result = await this.schedulingRepository.updateStatus(scheduleId, 'PENDING');
        if (!result) {
          throw new ConflictException("El espacio no está disponible para agendar.");
        }
        if (result.status.S === "PENDING") {
          this.snsClient.send(new PublishCommand({
            TopicArn: this.topicArn,
            Message: JSON.stringify({
              insuredId: insuredId,
              scheduleId: scheduleId,
              countryISO: countryISO,
              centerId: result.centerId.N,
              specialtyId: result.specialtyId.N,
              medicId: result.medicId.N,
              appointmentDate: result.dateTimeISO.S,
            }),
            MessageAttributes: {
              countryISO: {
                DataType: "String",
                StringValue: createSchedulingDto.countryISO,
              }
            },
          }));
          return { message: "Cita en espera" };
        }
      }
      return { message: "Cita ya se encuentra registrada" };

    } catch (error: any) {
      if (error.message === "ERR001") {
        throw new ConflictException("La cita ya se encuentra registrada para este asegurado y espacio.");
      }
      if (error.message === "ERR002") {
        throw new ConflictException("El espacio no está disponible para agendar.");
      }
      if (error.message === "ERR003") {
        throw new ConflictException("No existe el slot o no está disponible");
      }
      throw error;
    }
  }

  async findAll() {
    return this.schedulingRepository.findAll();
  }

  async findOne(id: number) {
    const result = await this.schedulingRepository.findByScheduleId(id);
    if (!result) throw new Error('No existe el slot');
    if (result!.status.S === "AVAILABLE") return { message: 'Cita disponible' };
    if (result!.status.S === "PENDING") return { message: 'Cita en espera' };
    if (result!.status.S === "SCHEDULED") return { message: 'Cita programada' };
    return;
  }

  async update(updateSchedulingDto: UpdateSchedulingDto) {
    try {
      const { scheduleId } = updateSchedulingDto;
      const result = await this.schedulingRepository.updateStatus(scheduleId!, 'SCHEDULED');
      if (!result) {
        throw new ConflictException("El espacio no está disponible para agendar.");
      }
      return;
    } catch (error: any) {
      throw error;
    }
  }

  async remove(id: number) {
    return `This action removes a #${id} scheduling`;
  }
}
