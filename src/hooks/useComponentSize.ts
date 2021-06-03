// Init
const [sizeLeft, onLayoutLeft] = useComponentSize();
const [sizeRight, onLayoutRight] = useComponentSize();
  
// Use
<LeftCard handlePress={() => handlePress(0)} w={getIndexValue(0).width} h={getIndexValue(0).height} x={sizeLeft.width / 2} onLayout={onLayoutLeft}>

  const useComponentSize = () => {
  const [size, setSize] = React.useState({width: 0, height: 0});

// Apply
  const onLayout = React.useCallback(event => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  return [size, onLayout];
};