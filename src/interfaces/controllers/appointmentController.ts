// src/interfaces/controllers/appointmentController.ts
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AppointmentFactory } from '../../domain/entities/appointmentFactory';
import { AppointmentRepository } from '../../infrastructure/repositories/appointmentRepository';
import { SNS } from 'aws-sdk';

// Crear instancia de SNS
const sns = new SNS();
const appointmentRepository = new AppointmentRepository();

// Lambda handler para registrar una cita
export const createAppointmentHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Parsear el cuerpo de la solicitud
    const { insuredId, countryISO, scheduleId } = JSON.parse(event.body || '{}');

    // Crear la cita usando el factory
    const appointment = AppointmentFactory.create(insuredId, countryISO, scheduleId);

    // Guardar la cita en DynamoDB
    await appointmentRepository.save(appointment);

    // Publicar un mensaje en SNS (con countryISO como filtro)
    const params = {
      Message: JSON.stringify({
        scheduleId: appointment.scheduleId.value,
        insuredId: appointment.insuredId.value,
        countryISO: appointment.countryISO.value,
        status: appointment.status,
      }),
      TopicArn: process.env.APPOINTMENT_TOPIC_ARN,  // ARN del SNS Topic
      MessageAttributes: {
        countryISO: {
          DataType: 'String',
          StringValue: appointment.countryISO.value,
        },
      },
    };

    await sns.publish(params).promise();

    // Responder con un código 201 (Cita creada)
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Appointment created successfully',
        appointment,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error creating appointment',
        error: error.message,
      }),
    };
  }
};
