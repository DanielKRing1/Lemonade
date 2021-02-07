// This Hook provides state and setState
//  But setState only allows state to be set to a provided set of enum values
import {useState} from 'react';

export const useStateEnum = (initialValue: any, enumSet: Set<any>) => {
  const ERROR = `New state not included in enum: ${enumSet.values()}`;

  const [_state, _setState] = useState(initialValue);
  const [error, setError] = useState<string>('');

  const setState = (newValue: any) => {
    if (enumSet.has(newValue)) _setState(newValue);
    else setError(ERROR);
  };

  return {
    state: _state,
    setState,
    error,
  };
};
