import { IsIn, IsInt, IsString, Length, Matches, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSchedulingDto {
    @ApiProperty({ example: '01234', description: 'Código del asegurado (5 dígitos)' })
    @IsString()
    @Transform(({ value }) => String(value).trim())
    @Length(5, 5, { message: 'insuredId debe tener exactamente 5 caracteres' })
    insuredId: string;

    @ApiProperty({ example: 100, description: 'Identificador del slot/espacio a agendar' })
    @Type(() => Number)
    @IsInt({ message: 'scheduleId debe ser un entero' })
    @Min(1, { message: 'scheduleId debe ser mayor o igual a 1' })
    scheduleId: number;

    @ApiProperty({ example: 'PE', description: 'Identificador de país (PE | CL)' })
    @IsString()
    @Transform(({ value }) => String(value).trim().toUpperCase())
    @IsIn(['PE', 'CL'], { message: 'countryISO solo puede ser PE o CL' })
    countryISO: 'PE' | 'CL';
}
