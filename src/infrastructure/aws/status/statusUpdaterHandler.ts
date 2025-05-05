import { SQSEvent } from "aws-lambda";
import { AppointmentRepository } from "../../repositories/appointmentRepository";

const appointmentRepository = new AppointmentRepository();

export const updateStatus = async (event: SQSEvent) => {
  console.log('event -> updateStatus >>>>>>>>>>>>>>>>>>: ')
  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    console.log('body -> updateStatus : ', body)

    const detail = body.detail;
    console.log('detail -> updateStatus : ', detail)
    const { scheduleId } = detail;

    await appointmentRepository.updateStatus(scheduleId);
  }

  return {
    statusCode: 200,
  };
};
