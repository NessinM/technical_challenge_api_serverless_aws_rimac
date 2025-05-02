import { SQSEvent } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamo = new DynamoDB.DocumentClient();

export const updateStatus = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const body = JSON.parse(record.body);

    const detail = body.detail;
    const { scheduleId, insuredId } = detail;

    // Actualizar estado en DynamoDB
    await dynamo.update({
      TableName: process.env.APPOINTMENTS_TABLE!,
      Key: {
        insuredId,
        scheduleId,
      },
      UpdateExpression: 'SET #status = :completed',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':completed': 'completed',
      },
    }).promise();
  }

  return { statusCode: 200 };
};
