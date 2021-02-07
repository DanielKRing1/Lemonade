// This Hook provides an index starting at zero that will increment and loop through n values
import {useState} from 'react';

type Params = {
  initialIndex?: number;
  range: number;
};
export const useIndexCycle = (args: Params) => {
  const {initialIndex = 0, range} = args;

  const [index, setIndex] = useState<number>(initialIndex);

  const incIndex = () => setIndex((prevIndex) => (prevIndex + 1) % range);

  return {
    index,
    incIndex,
  };
};
