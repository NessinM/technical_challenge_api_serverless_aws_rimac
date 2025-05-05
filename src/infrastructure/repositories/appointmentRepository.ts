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
      FilterExpression: "insuredId = :insuredId",
      ExpressionAttributeValues: {
        ":insuredId": insuredId,
      },
    };

    const result = await dynamoDb.scan(params).promise();
    return result.Items as Appointment[];
  }

  async updateStatus(scheduleId: number) {
    console.log("Updating status for scheduleId:>>>>>>>>>>>", scheduleId);
    const params = {
      TableName: TABLE_NAME,
      Key: {
        scheduleId,
      },
      UpdateExpression: "SET #status = :completed",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":completed": "completed",
      },
      ReturnValues: "UPDATED_NEW",
    };

    try {
      const result = await dynamoDb.update(params).promise();
      console.log(`Successfully updated status for scheduleId: ${scheduleId}`);

      // Si la actualización fue exitosa, puedes devolver un mensaje con el resultado
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `Status updated to completed for scheduleId: ${scheduleId}`,
          updatedAttributes: result.Attributes, // Se pueden retornar los atributos actualizados
        }),
      };
    } catch (error) {
      console.error(
        `Error updating status for scheduleId: ${scheduleId}`,
        error
      );

      // En caso de error, retornar un mensaje adecuado con un statusCode 500
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: `Failed to update status for scheduleId: ${scheduleId}`,
          error: error.message, // Incluyendo detalles del error
        }),
      };
    }
  }
}
