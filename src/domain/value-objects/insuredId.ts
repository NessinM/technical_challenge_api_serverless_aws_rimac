export class InsuredId {
  constructor(public value: string) {
    if (!value) {
      throw new Error('InsuredId cannot be empty');
    }
  }
}
