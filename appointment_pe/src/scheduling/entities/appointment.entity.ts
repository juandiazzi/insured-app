import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 10 })
    insuredId: string;

    @Column()
    scheduleId: number;

    @Column({ length: 2 })
    countryISO: string;

    @Column()
    centerId: number;

    @Column()
    specialtyId: number;

    @Column()
    medicId: number;

    @Column()
    appointmentDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}