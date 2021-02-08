import React, {FC, createContext, useContext} from 'react';
import Animated from 'react-native-reanimated';

// Hooks
import {useAttractiveColorAnimation, useOscillate, useIndexCycle} from '../../../hooks';

// Util/Constants
import {INPUT_MIN_HEIGHT, INPUT_MAX_HEIGHT, INPUT_MIN_WIDTH, INPUT_MAX_WIDTH, BUTTON_MIN_WIDTH, BUTTON_MAX_WIDTH, SIZE_ITERPOLATION_MS, COLOR_INTERPOLATION_MS} from './constants';

type ColorContextValue = {color: Animated.Node<number>; animateColor: () => void};
export const ColorContext = createContext<ColorContextValue | null>(null);

type ColorProviderProps = {
  children?: React.ReactNode;
};
export const ColorProvider: FC<ColorProviderProps> = (props) => {
  const {children} = props;

  const {color, animate: animateColor} = useAttractiveColorAnimation(COLOR_INTERPOLATION_MS);

  return <ColorContext.Provider value={{color, animateColor}}>{children}</ColorContext.Provider>;
};

// TODO Separate these Contexts into individual files
type DailyInputContextValue = {willFocus: boolean; isFocused: boolean; animation: Animated.Node<number>; min: number; max: number; animateFocus: () => void; animateBlur: () => void};
export const DailyInputContext = createContext<DailyInputContextValue | null>(null);

type DailyInputProviderProps = {
  children?: React.ReactNode;
};
export const DailyInputProvider: FC<DailyInputProviderProps> = (props) => {
  const {children} = props;

  const {willMax: willFocus, isMax: isFocused, animation, min, max, animateUp: animateFocus, animateDown: animateBlur} = useOscillate(INPUT_MIN_HEIGHT, INPUT_MAX_HEIGHT, {
    duration: SIZE_ITERPOLATION_MS,
    initIsMax: true,
  });

  return <DailyInputContext.Provider value={{willFocus, isFocused, animation, min, max, animateFocus, animateBlur}}>{children}</DailyInputContext.Provider>;
};
