type ErrorGeneratorParams = {
  message?: string;
};
type ErrorGenerator = (params: ErrorGeneratorParams) => Error;

declare enum ErrorCodeEnum {
  AbstractClass = 10,

  NotInCache = 20,
}
