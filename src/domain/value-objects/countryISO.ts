export class CountryISO {
  constructor(public value: string) {
    if (!value || value.length !== 2) {
      throw new Error('CountryISO must be a valid 2-letter ISO code');
    }
  }
}
