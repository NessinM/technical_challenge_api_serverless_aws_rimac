import { createAppointmentHandler } from '../controllers/appointmentController';

export const routes = [
  {
    method: 'POST',
    path: '/appointments',
    handler: createAppointmentHandler,
  },
];
