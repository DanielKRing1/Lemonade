type ErrorGeneratorParams = {
  message?: string;
};
type ErrorGenerator = (params: ErrorGeneratorParams) => Error;

declare enum ErrorCode {
  AbstractClass = 10,

  NotInCache = 20,
}
