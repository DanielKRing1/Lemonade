type ErrorGeneratorParams = {};
type ErrorGenerator = (params?: ErrorGeneratorParams) => Error;

export const NotImplementedError: ErrorGenerator = (params) => new Error(`This method (${NotImplementedError.caller}) has not been implemented`);
