// src/domain/value-objects/scheduleId.ts
export class ScheduleId {
  constructor(public value: number) {
    if (!value) {
      throw new Error('ScheduleId cannot be empty');
    }
  }
}
