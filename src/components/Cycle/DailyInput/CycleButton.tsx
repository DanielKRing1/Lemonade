import React, {FC, useContext, useState} from 'react';
import {Animated as RNAnimated, Dimensions, Button, Text, TextInput, TouchableOpacity, TouchableHighlight, View} from 'react-native';
import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import DropShadow from 'react-native-drop-shadow';

import {AbsoluteView} from '../../';
import {BoxShadowStyle, CircleStyle} from '../../../styles';

// Contexts
import {ColorContext, ColorProvider, DailyInputContext, DailyInputProvider} from './context';

// Util/Constants
import {INPUT_MIN_HEIGHT, INPUT_MAX_HEIGHT, INPUT_MIN_WIDTH, INPUT_MAX_WIDTH, BUTTON_MIN_WIDTH, BUTTON_MAX_WIDTH, SIZE_ITERPOLATION_MS, COLOR_INTERPOLATION_MS} from './constants';

type CycleButtonProps = {
  onPress: () => void;
};
export const CycleButton: FC<CycleButtonProps> = (props) => {
  const {onPress} = props;

  // CONTEXTS
  const {color, animateColor} = useContext(ColorContext);
  const {willFocus, isFocused, animation, min, max, animateFocus, animateBlur} = useContext(DailyInputContext);

  const buttonWidth = animation.interpolate({
    inputRange: [min, max],
    outputRange: [BUTTON_MIN_WIDTH, BUTTON_MAX_WIDTH],
  });

  return (
    <BottomAbsoluteView>
      <DropShadow
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.5,
          shadowRadius: 5,
        }}>
        <StyledCycleButton activeOpacity={1} style={{height: BUTTON_MIN_WIDTH, width: buttonWidth, backgroundColor: color}} onPress={onPress}>
          <Text>+</Text>
        </StyledCycleButton>
      </DropShadow>
    </BottomAbsoluteView>
  );
};

const BottomAbsoluteView = styled(AbsoluteView)`
  alignitems: flex-end;
  justifycontent: flex-end;
`;

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
type StyledCycleButtonProps = {};
const StyledCycleButton = styled(AnimatedTouchableOpacity)<StyledCycleButtonProps>`
  ${CircleStyle}

  justifyContent: center;

  marginright: 10;
  marginleft: 10;
`;
