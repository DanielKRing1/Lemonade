export class EndPoint {
  static readonly BASE_URL = 'http://localhost:3000';

  static readonly CREATE_USER = `${EndPoint.BASE_URL}create-user`;
  static readonly RATE_DAY = `${EndPoint.BASE_URL}/rate-day`;
}
