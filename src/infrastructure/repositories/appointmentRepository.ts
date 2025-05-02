import { Appointment } from "../../domain/entities/appointment";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.APPOINTMENTS_TABLE || "AppointmentsTable";

export class AppointmentRepository {
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

  async updateStatus(insuredId: string, scheduleId: string) {
    const params = {
      TableName: process.env.APPOINTMENTS_TABLE!,
      Key: {
        insuredId,
        scheduleId,
      },
      UpdateExpression: "SET #status = :completed",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":completed": "completed",
      },
    };

    const result = await dynamoDb.update(params).promise();

    return result.$response.data;
  }
}
