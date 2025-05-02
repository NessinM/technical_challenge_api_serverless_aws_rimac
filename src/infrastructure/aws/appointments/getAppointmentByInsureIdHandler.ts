import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamo = new DynamoDB.DocumentClient();

export const get: APIGatewayProxyHandler = async (event) => {
  const { insuredId } = event.pathParameters ?? {};

  if (!insuredId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing insuredId' }),
    };
  }

  try {
    const result = await dynamo.query({
      TableName: process.env.APPOINTMENTS_TABLE!,
      KeyConditionExpression: 'insuredId = :id',
      ExpressionAttributeValues: {
        ':id': insuredId,
      },
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (err) {
    console.error('Error querying appointments:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
