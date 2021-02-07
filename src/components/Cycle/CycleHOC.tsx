import React, {FC, useRef, useState} from 'react';
import {NativeSyntheticEvent, TextInputSubmitEditingEventData, Dimensions, Button, Text, TextInput, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components/native';

import {AbsoluteView, ExpandableInput} from '..';
import {CycleInput} from '../../components/Cycle/CycleInput';
import {CycleButton} from '../../components/Cycle/CycleButton';
import {useAttractiveColorAnimation, useOscillate} from '../../hooks';

import {W, H} from '../../constants';

const INPUT_MIN_HEIGHT = 0.2 * H;
const INPUT_MAX_HEIGHT = 0.4 * H;

const BUTTON_MIN_WIDTH = 60;
const BUTTON_MAX_WIDTH = 180;

export interface ChildProps {
  isFocused: boolean;
  onScrollUp: () => void;
  onScrollDown: () => void;
}

type CycleProps = {
  placeholder: string;
  input: string;
  handleChangeInput: (text: string) => void;
  onCycle: () => void;
  onSubmit: () => void;
};
export const withCycleContainer = <T extends object>(WrappedComponent: FC<T & CycleProps & ChildProps>) => (props: T & CycleProps) => {
  const {placeholder, input, handleChangeInput, onCycle, onSubmit} = props;

  const {willMax: willFocus, isMax: isFocused, animation, min, max, animateUp: animateFocus, animateDown: animateBlur} = useOscillate(INPUT_MIN_HEIGHT, INPUT_MAX_HEIGHT, {
    duration: 150,
    initIsMax: true,
  });

  const {color, animate: animateColor} = useAttractiveColorAnimation(100);

  const handleFocus = () => {
    if (willFocus) return;

    console.log('focus');

    animateFocus();
  };
  const handleBlur = () => {
    if (!willFocus) return;

    console.log('blur');

    animateBlur();
  };

  const handleButtonPress = () => {
    handleFocus();
    animateColor();

    textInputRef.current._component.clear();
    onCycle();
  };

  const handleSubmit = () => {
    console.log('Submit');
  };

  const textInputRef = useRef(null);

  return (
    <StyledView>
      <CycleInput
        textInputRef={textInputRef}
        placeholder={placeholder}
        input={input}
        onChangeInput={handleChangeInput}
        onSubmit={handleSubmit}
        color={color}
        isFocused={willFocus}
        animation={animation}
        hasShadow={isFocused || willFocus}
        animateFocus={animateFocus}
        animateBlur={animateBlur}
        min={min}
        max={max}
        minHeight={INPUT_MIN_HEIGHT}
        maxHeight={INPUT_MAX_HEIGHT}>
        <WrappedComponent {...props} isFocused={isFocused} onScrollUp={handleFocus} onScrollDown={handleBlur} />
      </CycleInput>

      <CycleButton color={color} animation={animation} min={min} max={max} minWidth={BUTTON_MIN_WIDTH} maxWidth={BUTTON_MAX_WIDTH} onCycle={handleButtonPress} />

      {/* <Button onPress={onSubmit} /> */}
    </StyledView>
  );
};

const StyledView = styled(AbsoluteView)``;
