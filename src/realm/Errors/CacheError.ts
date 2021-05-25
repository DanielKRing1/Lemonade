import {MyError} from './Error';

export const NotInCacheError: ErrorGenerator = (params) => {
  const {message} = params;

  const error = new MyError(ErrorCodeEnum.NotInCache, message);

  return error;
};
