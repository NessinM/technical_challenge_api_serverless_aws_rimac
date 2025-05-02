import { AppointmentRepository } from "../../infrastructure/repositories/appointmentRepository";
import { Appointment } from "../../domain/entities/appointment";

export class CreateAppointment {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(appointmentData: {
    insuredId: string;
    countryISO: string;
    scheduleId: number;
  }) {
    const appointment = new Appointment(
      appointmentData.insuredId,
      appointmentData.countryISO,
      appointmentData.scheduleId
    );
    await this.appointmentRepository.save(appointment);
    return appointment;
  }
}
