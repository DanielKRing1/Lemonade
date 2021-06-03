import React from 'react';
import {Dimensions, Text, View, StyleSheet} from 'react-native';

// 3rd party libs
import styled from 'styled-components/native';
import Animated, {withTiming, Easing, useAnimatedStyle, useSharedValue} from 'react-native-reanimated';

// Hooks
import {useActiveIndexWIdle, useComponentSize} from '../../hooks';

export default function App() {
  // Init
  console.log('calling');
  const {size: sizeLeft, onLayout: onLayoutLeft} = useComponentSize();
  const {size: sizeRight, onLayout: onLayoutRight} = useComponentSize();

  const ACTIVE_VAL_DIM = {
    width: Dimensions.get('window').width / 200,
    height: Dimensions.get('window').height / 200,
  };
  const INACTIVE_VAL_DIM = {
    width: 0.5,
    height: 0.5,
  };
  const IDLE_VAL_DIM = {
    width: 1,
    height: 1,
  };
  const ACTIVE_VAL_POS = [
    {
      translateX: -sizeLeft.width / 2,
      translateY: 0,
    },
    {
      translateX: sizeRight.width / 2,
      translateY: 0,
    },
  ];
  const INACTIVE_VAL_POS = [
    {
      translateX: -sizeLeft.width / 2,
      translateY: 0,
    },
    {
      translateX: sizeRight.width / 2,
      translateY: 0,
    },
  ];
  const IDLE_VAL_POS = [
    {
      translateX: -sizeLeft.width / 2,
      translateY: 0,
    },
    {
      translateX: sizeRight.width / 2,
      translateY: 0,
    },
  ];
  const {activeIndex: activeIndexDim, updateIndex: updateIndexDim, getIndexValue: getIndexValueDim, setToIdle: setToIdleDim} = useActiveIndexWIdle(ACTIVE_VAL_DIM, INACTIVE_VAL_DIM, IDLE_VAL_DIM);
  const {activeIndex: activeIndexPos, updateIndex: updateIndexPos, getIndexValue: getIndexValuePos, setToIdle: setToIdlePos} = useActiveIndexWIdle(ACTIVE_VAL_POS, INACTIVE_VAL_POS, IDLE_VAL_POS);

  const setToIdle = () => {
    setToIdleDim();
    setToIdlePos();
  };
  const updateIndex = (index: number) => {
    updateIndexDim(index);
    updateIndexPos(index);
  };

  const handlePress = (index) => {
    if (index === activeIndexDim) {
      setToIdle();
    } else {
      updateIndex(index);
    }
  };

  return (
    <CenterView>
      <FlexRow>
        <Card
          handlePress={() => handlePress(0)}
          w={getIndexValueDim(0).width}
          h={getIndexValueDim(0).height}
          x={getIndexValuePos(0).translateX}
          y={getIndexValuePos(0).translateY}
          onLayout={onLayoutLeft}>
          <Text>Hi</Text>
        </Card>

        <Card
          handlePress={() => handlePress(1)}
          w={getIndexValueDim(1).width}
          h={getIndexValueDim(1).height}
          x={getIndexValuePos(1).translateX}
          y={getIndexValuePos(1).translateY}
          onLayout={onLayoutRight}>
          <Text>Hi</Text>
        </Card>
      </FlexRow>
    </CenterView>
  );
}

const CenterView = styled.View`
  margin: 0 0 0 100px;
`;

const Card = (props) => {
  const {children, handlePress, w, h, x = 0, y = 0, onLayout} = props;

  // console.log(`Box width: ${w}, height: ${h}`);
  // console.log(`Box translate x: ${x}, translate y: ${y}`);

  const width = useSharedValue(w);
  const height = useSharedValue(h);
  const widthReverse = useSharedValue(1 / w);
  const heightReverse = useSharedValue(1 / h);

  const translateX = useSharedValue(x);
  const translateY = useSharedValue(y);

  React.useEffect(() => {
    width.value = withTiming(w, {
      duration: 250,
      easing: Easing.inOut(Easing.exp),
    });
    height.value = withTiming(h, {
      duration: 250,
      easing: Easing.inOut(Easing.exp),
    });
    widthReverse.value = withTiming(1 / w, {
      duration: 250,
      easing: Easing.inOut(Easing.exp),
    });
    heightReverse.value = withTiming(1 / h, {
      duration: 250,
      easing: Easing.inOut(Easing.exp),
    });

    translateX.value = withTiming(x, {
      duration: 250,
      easing: Easing.inOut(Easing.exp),
    });
    translateY.value = withTiming(y, {
      duration: 250,
      easing: Easing.inOut(Easing.exp),
    });
  }, [w, h, x, y, width, height, widthReverse.value, heightReverse.value, translateX.value, translateY.value]);

  const customSpringStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scaleX: width.value,
        },
        {
          scaleY: height.value,
        },
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  }, [w, h, x, y]);

  const customSpringStyles2 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scaleX: widthReverse.value,
        },
        {
          scaleY: heightReverse.value,
        },
      ],
    };
  }, [w, h, x, y]);

  var styles = StyleSheet.create({
    negateTranslations: {
      transform: [{translateX: -x}, {translateY: -y}],
    },
  });

  return (
    <View style={styles.negateTranslations}>
      <StyledContainer style={[customSpringStyles]} onLayout={onLayout}>
        <Animated.View style={[customSpringStyles2]}>
          <StyledTouchableNativeFeedback onPress={handlePress}>
            <View>{children}</View>
          </StyledTouchableNativeFeedback>
        </Animated.View>
      </StyledContainer>
    </View>
  );
};

const StyledContainer = styled(Animated.View)`
  display: flex;
  align-self: flex-start;

  background-color: white;
  border-radius: 10px;

  border-width: 10px;
  border-color: yellow;

  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.8,
  shadow-radius: 2px;

  elevation: 5px;
`;

const StyledTouchableNativeFeedback = styled.TouchableOpacity`
  width: 100%;
  height: 50%;
  padding: 10px;

  background-color: White;
  border-radius: 10px;
`;

const FlexRow = styled.View`
  display: flex;
  flex-direction: row;
`;
