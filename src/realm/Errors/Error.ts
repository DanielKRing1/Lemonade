export class MyError extends Error {
  public code: ErrorCodeEnum;

  constructor(code: ErrorCodeEnum, message?: string) {
    super(message);

    this.code = code;
  }
}
