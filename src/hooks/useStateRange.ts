// This Hook provides state and setState for numbers
//  But setState only allows state to be set to a value within a provided number range
import {useState} from 'react';

export const useStateRange = (initialValue: number, min: number, max: number) => {
  const ERROR = `New state does not fall within range`;

  initialValue = initialValue >= min && initialValue <= max ? initialValue : min;
  const [_state, _setState] = useState<number>(initialValue);
  const [error, setError] = useState<string>('');

  const setState = (newValue: number) => {
    if (newValue >= min && newValue <= max) _setState(newValue);
    else setError(ERROR);
  };

  return {
    state: _state,
    setState,
    error,
  };
};
