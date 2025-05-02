import { Appointment } from './appointment';
import { InsuredId } from '../value-objects/insuredId';
import { CountryISO } from '../value-objects/countryISO';
import { ScheduleId } from '../value-objects/scheduleId';

export class AppointmentFactory {
  static create(insuredId: string, countryISO: string, scheduleId: number): Appointment {
    return new Appointment(
      new InsuredId(insuredId),
      new CountryISO(countryISO),
      new ScheduleId(scheduleId)
    );
  }
}
