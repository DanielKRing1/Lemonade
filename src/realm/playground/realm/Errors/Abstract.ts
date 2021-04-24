import {MyError} from './Error';

export const InstantiateAbstractError = (params: {className: string}): Error => {
  const error = new MyError(ErrorCodeEnum.AbstractClass, `This class (${params.className}) is abstract and cannot be instantiated directly`);

  return error;
};

export const NotImplementedError = (params = {}): Error => {
  const error = new MyError(ErrorCodeEnum.AbstractClass, `This method (${NotImplementedError.caller}) has not been implemented`);

  return error;
};
