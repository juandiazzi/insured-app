import { IsString, IsNumber, IsDateString, Length, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSchedulingDto {
    @ApiProperty({
        example: '01234',
        description: 'Código del asegurado de 5 dígitos',
        minLength: 5,
        maxLength: 5,
    })
    @IsString()
    @Length(5, 5)
    insuredId: string;

    @ApiProperty({
        example: 100,
        description: 'Identificador del espacio para agendar la cita',
    })
    @IsNumber()
    scheduleId: number;

    @ApiProperty({
        example: 'PE',
        description: 'Identificador de país, solo puede ser "PE"',
        minLength: 2,
        maxLength: 2,
        enum: ['PE'],
    })
    @IsString()
    @Length(2, 2)
    @IsIn(['PE'])
    countryISO: string;

    @ApiProperty({
        example: 4,
        description: 'Identificador del centro médico',
    })
    @IsNumber()
    centerId: number;

    @ApiProperty({
        example: 3,
        description: 'Identificador de la especialidad',
    })
    @IsNumber()
    specialtyId: number;

    @ApiProperty({
        example: 4,
        description: 'Identificador del médico',
    })
    @IsNumber()
    medicId: number;

    @ApiProperty({
        example: '2024-09-30T12:30:00Z',
        description: 'Fecha y hora de la cita',
        type: String,
    })
    @IsDateString()
    appointmentDate: Date;
}