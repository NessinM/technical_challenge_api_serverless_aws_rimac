import { APIGatewayProxyHandler } from "aws-lambda";
import { AppointmentRepository } from "../../../infrastructure/repositories/appointmentRepository";

const appointmentRepository = new AppointmentRepository();

export const get: APIGatewayProxyHandler = async (event) => {
  const { insuredId = "" } = event.pathParameters ?? {};

  if (!insuredId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing insuredId" }),
    };
  }

  try {
    const result = await appointmentRepository.getByInsuredId(insuredId);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error("Error querying appointments:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
