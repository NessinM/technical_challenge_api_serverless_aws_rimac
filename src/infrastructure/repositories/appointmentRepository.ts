// src/infrastructure/repositories/appointmentRepository.ts
import { Appointment } from "../../domain/entities/appointment";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.APPOINTMENTS_TABLE || "AppointmentsTable";

export class AppointmentRepository {
  // Guardar la cita en DynamoDB
  async save(appointment: Appointment): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        insuredId: appointment.insuredId.value,
        scheduleId: appointment.scheduleId.value,
        countryISO: appointment.countryISO.value,
        status: appointment.status,
        timestamp: appointment.timestamp,
      },
    };

    await dynamoDb.put(params).promise();
  }

  // Obtener citas por asegurado
  async getByInsuredId(insuredId: string): Promise<Appointment[]> {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "insuredId = :insuredId",
      ExpressionAttributeValues: {
        ":insuredId": insuredId,
      },
    };

    const result = await dynamoDb.query(params).promise();
    return result.Items as Appointment[];
  }
}
