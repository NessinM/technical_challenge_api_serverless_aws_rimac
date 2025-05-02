// src/domain/entities/appointment.ts
import { InsuredId } from '../value-objects/insuredId';
import { CountryISO } from '../value-objects/countryISO';
import { ScheduleId } from '../value-objects/scheduleId';

export class Appointment {
  constructor(
    public insuredId: InsuredId,  // Usamos InsuredId como un Value Object
    public countryISO: CountryISO,  // Usamos CountryISO como un Value Object
    public scheduleId: ScheduleId,  // Usamos ScheduleId como un Value Object
    public status: string = 'pending',  // Estado de la cita
    public timestamp: string = new Date().toISOString()  // Fecha de creación
  ) {}
}
