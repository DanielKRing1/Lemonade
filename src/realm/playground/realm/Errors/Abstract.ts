import {MyError} from './Error';

export const NotImplementedError: ErrorGenerator = (params = {}) => {
  const error = new MyError(ErrorCode.AbstractClass, `This method (${NotImplementedError.caller}) has not been implemented`);

  return error;
};
