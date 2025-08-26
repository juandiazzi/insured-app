import { Injectable } from '@nestjs/common';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

@Injectable()
export class SchedulingService {
  private eventBridge = new EventBridgeClient({ region: 'us-east-2' });

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) { }

  async create(createSchedulingDto: CreateSchedulingDto) {
    const appointment = this.appointmentRepository.create(createSchedulingDto);
    const savedAppointment = await this.appointmentRepository.save(appointment);
    await this.eventBridge.send(new PutEventsCommand({
      Entries: [
        {
          Source: 'appointment.service',
          DetailType: 'AppointmentCreated',
          Detail: JSON.stringify(savedAppointment),
          EventBusName: 'appointment-bus',
        },
      ],
    }));
    return savedAppointment;
  }

  async findAll() {
    return await this.appointmentRepository.find();
  }

  async findOne(id: number) {
    return `This action returns a #${id} scheduling`;
  }

  async update(id: number, updateSchedulingDto: UpdateSchedulingDto) {
    return `This action updates a #${id} scheduling`;
  }

  async remove(id: number) {
    return `This action removes a #${id} scheduling`;
  }
}
