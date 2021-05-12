export default class AppError {
  public readonly message: string;
  private readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    this.message = message;
    this.statusCode = statusCode;
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  getMessage(): string {
    return this.message;
  }
}
