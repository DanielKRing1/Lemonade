// This class is an attempt to make a non-reusable (but simpler) daily input form

import React, {FC, useRef, useState} from 'react';
import styled from 'styled-components';
import Animated from 'react-native-reanimated';

// Components
import DropShadow from 'react-native-drop-shadow';
import {AbsoluteView, ExpandableInput} from '../..';
import {CycleButton} from './CycleButton';

// Hooks
import {useAttractiveColorAnimation, useOscillate, useIndexCycle} from '../../../hooks';

// Util/Constants
import {INPUT_MIN_HEIGHT, INPUT_MAX_HEIGHT, INPUT_MIN_WIDTH, INPUT_MAX_WIDTH, BUTTON_MIN_WIDTH, BUTTON_MAX_WIDTH, SIZE_ITERPOLATION_MS, COLOR_INTERPOLATION_MS} from './constants';

// TODO Put this in .d.ts
type AnimationParams = {
  min: number;
  max: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
};

type DailyInputProps = {
  trendProperties: Array<string>;
};

export const DailyInput: FC<DailyInputProps> = (props) => {
  const {trendProperties} = props;

  // HOOKS
  const {willMax: willFocus, isMax: isFocused, animation, min, max, animateUp: animateFocus, animateDown: animateBlur} = useOscillate(INPUT_MIN_HEIGHT, INPUT_MAX_HEIGHT, {
    duration: SIZE_ITERPOLATION_MS,
    initIsMax: true,
  });

  const {color, animate: animateColor} = useAttractiveColorAnimation(COLOR_INTERPOLATION_MS);

  // INPUT UI FIELDS
  const [entity, setEntity] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [mood, setMood] = useState<string>('');

  const INPUT_FIELDS = [
    {
      placeholder: 'Add entities',
      value: entity,
      handleChangeInput: setEntity,
      handleSubmit: (finalInput: any) => {},
    },
    {
      placeholder: 'Add rating',
      value: rating,
      handleChangeInput: setRating,
      handleSubmit: (finalInput: any) => {},
    },
    {
      placeholder: 'Add mood',
      value: mood,
      handleChangeInput: setMood,
      handleSubmit: (finalInput: any) => {},
    },
  ];

  const {index: activeIndex, incIndex: incActiveIndex} = useIndexCycle({range: INPUT_FIELDS.length});

  // SCROLL HANDLERS
  const handleFocus = () => {
    console.log('DailyInput handleFocus');
    animateFocus();
  };
  const handleBlur = () => {
    console.log('DailyInput handleBlur');
    animateBlur();
  };

  // TODO Add ScrollableFlatList
  // TODO Call this method
  const SCROLL_THRESHOLD = 10;
  const [scrollOffset, setScrollOffset] = useState<number>(0);

  const handleScrollOffsetChange = (newOffset: number) => {
    const scrollDelta = newOffset - scrollOffset;
    if (scrollDelta > SCROLL_THRESHOLD && isFocused) {
      setScrollOffset(newOffset);
      handleBlur();
    } else if (scrollDelta < -SCROLL_THRESHOLD && !isFocused) {
      setScrollOffset(newOffset);
      handleFocus();
    }
  };

  // BUTTON HANDLER
  const textInputRef = useRef(null);

  const handleButtonPress = () => {
    handleFocus();
    animateColor();

    if (textInputRef !== null && textInputRef.current !== null) textInputRef!.current!._component!.clear();
    incActiveIndex();
  };

  const handleSubmit = () => {
    console.log('Submit');
  };

  return (
    <AbsoluteView>
      <DailyInputCycle
        placeholder={INPUT_FIELDS[activeIndex].placeholder}
        value={INPUT_FIELDS[activeIndex].value}
        textInputRef={textInputRef}
        handleChangeInput={INPUT_FIELDS[activeIndex].handleChangeInput}
        handleSubmit={INPUT_FIELDS[activeIndex].handleSubmit}
        color={color}
        animation={animation}
        animationParams={{min, max}}
        hasShadow={willFocus || isFocused}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
      />

      <CycleButton color={color} animation={animation} animationParams={{min, max, minWidth: BUTTON_MIN_WIDTH, maxWidth: BUTTON_MAX_WIDTH}} onPress={handleButtonPress} />
    </AbsoluteView>
  );
};

type DailyInputCycleProps = {
  placeholder: string;
  value: string;
  textInputRef: any;

  enumList?: Array<any>;
  handleChangeInput: (newInput: any) => void;
  handleSubmit: (finalInput: any) => void;

  // TODO Add color, animation, animationParams, animateFocus/Blur, will/isFocused to Context
  color: Animated.Node<number>;
  animation: Animated.Value<number>;
  animationParams: AnimationParams;
  hasShadow: boolean;

  handleFocus: () => void;
  handleBlur: () => void;
};
const DailyInputCycle: FC<DailyInputCycleProps> = (props) => {
  const {placeholder, value, textInputRef, enumList, handleChangeInput, handleSubmit, color, animation, animationParams, hasShadow, handleFocus, handleBlur} = props;
  const {min, max} = animationParams;

  const inputHeight = animation.interpolate({
    inputRange: [min, max],
    outputRange: [INPUT_MIN_HEIGHT, INPUT_MAX_HEIGHT],
  });

  const inputWidth = animation.interpolate({
    inputRange: [min, max],
    outputRange: [INPUT_MIN_WIDTH, INPUT_MAX_WIDTH],
  });

  return (
    <TopAbsoluteView>
      <DropShadow
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: hasShadow ? 0.5 : 0,
          shadowRadius: 5,
        }}>
        {!!enumList ? (
          // Dropdown
          <h1></h1>
        ) : (
          // Input
          <StyledExpandableInput
            ref={textInputRef}
            textAlign="center"
            style={{height: inputHeight, width: inputWidth, borderColor: color}}
            placeholder={placeholder}
            value={value}
            onChangeText={handleChangeInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={handleSubmit}
          />
        )}
      </DropShadow>
    </TopAbsoluteView>
  );
};

const TopAbsoluteView = styled(AbsoluteView)`
  position: relative;

  alignself: flex-start;
  alignitems: center;
  justifycontent: flex-start;

  backgroundcolor: transparent;
`;

const StyledExpandableInput = styled(ExpandableInput)`
  borderwidth: 2;

  backgroundcolor: white;

  padding-right: 5;
  padding-left: 5;
`;
