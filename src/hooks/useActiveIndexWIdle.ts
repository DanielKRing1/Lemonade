import {useActiveIndex} from './';

export const useActiveIndexWIdle = (activeValue: any | any[], inactiveValue: any | any[], idleValue: any | any[]) => {
  const IDLE_INDEX: number = -1;

  const {activeIndex, updateIndex, getIndexValue} = useActiveIndex(activeValue, inactiveValue);

  const setToIdle = () => {
    updateIndex(IDLE_INDEX);
  };

  const getIndexValueWIdle = (index: number) => {
    if (activeIndex === IDLE_INDEX) return Array.isArray(idleValue) ? idleValue[index] : idleValue;
    else return getIndexValue(index);
  };

  return {
    activeIndex,
    updateIndex,
    getIndexValue: getIndexValueWIdle,
    setToIdle,
  };
};
