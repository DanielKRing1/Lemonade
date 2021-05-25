import React, {FC} from 'react';
import {Dimensions, Text, TouchableOpacity, View, StyleSheet} from 'react-native';

// 3rd party libs
import styled from 'styled-components/native';
import Animated, {withTiming, Easing, useAnimatedStyle, useSharedValue} from 'react-native-reanimated';

// Hooks
import {useActiveIndexWIdle} from '../../hooks';

export default function App() {
  console.log('abbbbc');
  console.log(Dimensions.get('window').width);
  const ACTIVE_VAL_DIM = {
    width: Dimensions.get('window').width / 100,
    height: Dimensions.get('window').height / 100,
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
      translateX: 10,
      translateY: 10,
    },
    {
      translateX: -10,
      translateY: 10,
    },
  ];
  const INACTIVE_VAL_POS = [
    {
      translateX: -20,
      translateY: -20,
    },
    {
      translateX: 20,
      translateY: -20,
    },
  ];
  const IDLE_VAL_POS = {
    translateX: 0,
    translateY: 0,
  };
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
    } else updateIndex(index);
  };

  console.log('this');
  console.log(getIndexValueDim(1));

  return (
    <View>
      <FlexRow>
        <Card handlePress={() => handlePress(0)} w={getIndexValue(0).width} h={getIndexValue(0).height}>
          <Text>Hi</Text>
        </Card>
        <Card handlePress={() => handlePress(1)} w={getIndexValue(1).width} h={getIndexValue(1).height}>
          <Text>Hi</Text>
        </Card>
      </FlexRow>
    </View>
  );
}

const Card = (props) => {
  const {children, handlePress, w, h} = props;

  console.log(`Box width: ${w}, height: ${h}`);

  const width = useSharedValue(w);
  const height = useSharedValue(h);

  const width2 = useSharedValue(1 / w);
  const height2 = useSharedValue(1 / h);

  React.useEffect(() => {
    console.log('useEffect');
    console.log(width);
    console.log(height);

    width.value = withTiming(w, {
      duration: 250,
      easing: Easing.inOut(Easing.exp),
    });

    height.value = withTiming(h, {
      duration: 250,
      easing: Easing.inOut(Easing.exp),
    });

    width2.value = withTiming(1 / w, {
      duration: 250,
      easing: Easing.inOut(Easing.exp),
    });

    height2.value = withTiming(1 / h, {
      duration: 250,
      easing: Easing.inOut(Easing.exp),
    });
  }, [w, h]);
  const customSpringStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scaleX: width.value,
        },
        {
          scaleY: height.value,
        },
      ],
    };
  });

  const customSpringStyles2 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scaleX: width2.value,
        },
        {
          scaleY: height2.value,
        },
      ],
    };
  });

  return (
    <StyledContainer style={[customSpringStyles]}>
      <Animated.View style={[customSpringStyles2]}>
        <StyledTouchableNativeFeedback onPress={handlePress}>
          <View>{children}</View>
        </StyledTouchableNativeFeedback>
      </Animated.View>
    </StyledContainer>
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
