import { DynamoDBClient, PutItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { Appointment } from "./entities/scheduling.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SchedulingRepository {
    private readonly tableName = "appointments";
    private readonly client: DynamoDBClient;

    constructor() {
        this.client = new DynamoDBClient({
            region: "us-east-2",
        });
    }

    async findAll() {
        const result: Appointment[] = []
        const command = new ScanCommand({
            TableName: this.tableName,
        })
        const response = await this.client.send(command);
        if (response.Items) {
            response.Items.forEach(item => {
                result.push(Appointment.newInstanceFromDynamoDBObject(item));
            });
        }
        return result;
    }

    async findOne(scheduleId: number) {
        const command = new ScanCommand({
            TableName: this.tableName,
            FilterExpression: "pk = :pk AND sk = :sk",
            ExpressionAttributeValues: {
                ":pk": { S: `SLOT#${scheduleId}` },
                ":sk": { S: "SLOT" }
            }
        });
        const response = await this.client.send(command);
        return response.Items?.[0] ?? null;
    }

    async findByScheduleId(scheduleId: number) {
        const pk = `SLOT#${scheduleId}`;
        const sk = "SLOT";
        const command = new ScanCommand({
            TableName: this.tableName,
            FilterExpression: "pk = :pk AND sk = :sk",
            ExpressionAttributeValues: {
                ":pk": { S: pk },
                ":sk": { S: sk }
            }
        });
        const response = await this.client.send(command);
        return response.Items?.[0] ?? null;
    }

    async updateStatus(scheduleId: number, status: string) {
        const slot = await this.findOne(scheduleId);
        if (!slot) {
            throw new Error("ERR003");
        }

        const command = new UpdateItemCommand({
            TableName: this.tableName,
            Key: {
                pk: { S: `SLOT#${scheduleId}` },
                sk: { S: "SLOT" }
            },
            UpdateExpression: "SET #status = :status",
            ExpressionAttributeNames: {
                "#status": "status"
            },
            ExpressionAttributeValues: {
                ":status": { S: status }
            },
            ReturnValues: "ALL_NEW"
        });

        try {
            const response = await this.client.send(command);
            return response.Attributes;
        } catch (error: any) {
            if (error.name === "ConditionalCheckFailedException") {
                throw new Error("ERR001");
            }
            throw error;
        }
    }

    async create(insuredId: string, scheduleId: number, countryISO: string) {
        const slot = await this.findOne(scheduleId);

        if (!slot || slot.status?.S !== "AVAILABLE") {
            throw new Error("ERR002");
        }

        const createdAt = new Date().toISOString();
        const command = new PutItemCommand({
            TableName: this.tableName,
            Item: {
                pk: { S: `SLOT#${scheduleId}` },
                sk: { S: `BOOKING#${insuredId}` },
                insuredId: { S: insuredId },
                countryISO: { S: countryISO },
                centerId: slot.centerId,
                specialtyId: slot.specialtyId,
                medicId: slot.medicId,
                dateTimeISO: slot.dateTimeISO,
                gsi2pk: { S: `INS#${insuredId}` },
                gsi2sk: slot.dateTimeISO,
                createdAt: { S: createdAt }
            },
            ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)"
        });
        try {
            const response = await this.client.send(command);
            return response;
        } catch (error: any) {
            if (error.name === "ConditionalCheckFailedException") {
                throw new Error("ERR001");
            }
            throw error;
        }
    }


}