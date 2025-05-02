import { SQSEvent } from "aws-lambda";
import { AppointmentRepository } from "../../repositories/appointmentRepository";

const appointmentRepository = new AppointmentRepository();

export const updateStatus = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const body = JSON.parse(record.body);

    const detail = body.detail;
    const { scheduleId, insuredId } = detail;

    await appointmentRepository.updateStatus(insuredId, scheduleId);
  }

  return {
    statusCode: 200,
  };
};
