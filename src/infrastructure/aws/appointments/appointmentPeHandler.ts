// src/infrastructure/aws/appointments/appointmentPeHandler.ts
import { SQSEvent } from 'aws-lambda';
import { PrismaClient } from '@prisma/client';
import { SNS } from 'aws-sdk';

const prisma = new PrismaClient();
const sns = new SNS();

export const processAppointmentPe = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const message = JSON.parse(record.body);

    // Insertar en RDS (MySQL)
    await prisma.appointment.create({
      data: {
        scheduleId: message.scheduleId,
        insuredId: message.insuredId,
        countryISO: message.countryISO,
        status: message.status,
        timestamp: new Date(),
      },
    });

    // Publicar evento en EventBridge
    await sns.publish({
      Message: JSON.stringify({
        scheduleId: message.scheduleId,
        status: 'completed',
      }),
      TopicArn: process.env.APPOINTMENT_EVENT_TOPIC_ARN, // ARN de EventBridge
    }).promise();
  }
};
