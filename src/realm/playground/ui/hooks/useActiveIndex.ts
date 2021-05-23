const useActiveIndex = (activeValue: any | any[], inactiveValue: any | any[]) => {
  const DEFAULT_INDEX: number = -1;

  const [activeIndex, setActiveIndex] = React.useState<number>(DEFAULT_INDEX);

  const updateIndex = (index: number): void => {
    if (index !== activeIndex) setActiveIndex(index);
  };

  const getIndexValue = (index: number): any => {
    if (index === activeIndex) return Array.isArray(activeValue) ? activeValue[index] : activeValue;
    else return Array.isArray(inactiveValue) ? inactiveValue[index] : inactiveValue;
  };

  return {
    activeIndex,
    updateIndex,
    getIndexValue,
  };
};
