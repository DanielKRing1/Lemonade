// This class is an attempt to make a non-reusable (but simpler) daily input form

import React, {FC, useState} from 'react';

// Components
import {AbsoluteView} from '../..';
import {CycleButton} from './CycleButton';

// Hooks
import {useAttractiveColorAnimation, useOscillate, useIndexCycle} from '../../../hooks';

// Util/Constants
import {INPUT_MIN_HEIGHT, INPUT_MAX_HEIGHT, BUTTON_MIN_WIDTH, BUTTON_MAX_WIDTH, SIZE_ITERPOLATION_MS, COLOR_INTERPOLATION_MS} from './constants';

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
  const INPUT_FIELDS = [
    {
      placeholder: 'Add entities',
      handleChangeInput: (newInput: any) => {},
    },
    {
      placeholder: 'Add rating',
      handleChangeInput: (newInput: any) => {},
    },
    {
      placeholder: 'Add mood',
      handleChangeInput: (newInput: any) => {},
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

  // TODO Call this method
  // TODO Add ScrollableFlatList
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
  const handleButtonPress = () => {
    handleFocus();
    animateColor();

    incActiveIndex();
  };

  const handleSubmit = () => {
    console.log('Submit');
  };

  return (
    <AbsoluteView>
      <DailyInputCycle activeIndex={activeIndex} placeholder={INPUT_FIELDS[activeIndex].placeholder} handleChangeInput={INPUT_FIELDS[activeIndex].handleChangeInput} />

      <CycleButton color={color} animation={animation} min={min} max={max} minWidth={BUTTON_MIN_WIDTH} maxWidth={BUTTON_MAX_WIDTH} onPress={handleButtonPress} />
    </AbsoluteView>
  );
};

type DailyInputCycleProps = {
  activeIndex: number;
  placeholder: string;
  enumList?: Array<any>;
  handleChangeInput: (newInput: any) => void;
};
const DailyInputCycle: FC<DailyInputCycleProps> = (props) => {
  const {activeIndex, placeholder, enumList, handleChangeInput} = props;

  return !!enumList ? (
    // Dropdown
    <h1></h1>
  ) : (
    // Input
    <h1></h1>
  );
};
