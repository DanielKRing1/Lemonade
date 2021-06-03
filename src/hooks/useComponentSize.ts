import {useCallback, useState} from 'react';
import {LayoutChangeEvent} from 'react-native';

type Size = {
  width: number;
  height: number;
};

export const useComponentSize = () => {
  const [size, setSize] = useState<Size>({width: 0, height: 0});

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    setSize({width, height});
  }, []);

  return [size, onLayout];
};
