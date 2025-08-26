export class Schedule {
    scheduleId: string;
    centerId: string;
    specialtyId: string;
    medicId: string;
    date: Date;
}

export class Appointment {
    insuredId: string;
    scheduleId: Schedule;
    countryISO: string;

    static newInstanceFromDynamoDBObject(data: any): Appointment {
        const result = new Appointment();
        result.insuredId = data.insuredId?.S ?? null;
        result.countryISO = data.countryISO?.S ?? null;
        return result;
    }
}
