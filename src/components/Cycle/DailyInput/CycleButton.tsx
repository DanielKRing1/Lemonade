import React, {FC, useState} from 'react';
import {Animated as RNAnimated, Dimensions, Button, Text, TextInput, TouchableOpacity, TouchableHighlight, View} from 'react-native';
import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import DropShadow from 'react-native-drop-shadow';

import {AbsoluteView} from '../../';
import {BoxShadowStyle, CircleStyle} from '../../../styles';

type AnimationParams = {
  min: number;
  max: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
};

type CycleButtonProps = {
  color: Animated.Node<number>;

  animation: Animated.Value<number>;
  animationParams: AnimationParams;

  onPress: () => void;
};
export const CycleButton: FC<CycleButtonProps> = (props) => {
  const {color, animation, animationParams, onPress} = props;
  const {min, max, minWidth = 0, maxWidth = 0} = animationParams;

  const buttonWidth = animation.interpolate({
    inputRange: [min, max],
    outputRange: [minWidth, maxWidth],
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
        <StyledCycleButton activeOpacity={1} style={{height: minWidth, width: buttonWidth, backgroundColor: color}} onPress={onPress}>
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
