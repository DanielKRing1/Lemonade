export class MyError extends Error {
  public code: ErrorCode;

  constructor(code: ErrorCode, message?: string) {
    super(message);

    this.code = code;
  }
}
