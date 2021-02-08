import React, {useState, useEffect} from 'react';
// import { Animated, Easing } from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import randomcolor from 'randomcolor';
import tinycolor from 'tinycolor2';

const SHORT_ANIMATION_MS = 250;
const ANIMATION_MS = 500;

const getColor = (lb = 0, ub = 200, maxIterations = 50) => {
  let randColor;
  let brightness;

  // for (let i = 0; i < maxIterations; i++) {
  randColor = tinycolor(
    randomcolor({
      luminosity: Math.random() > 0.5 ? 'light' : 'bright',
    }),
  );

  //     brightness = randColor.getBrightness();
  //     if (brightness >= lb && brightness <= ub) break;
  // }

  // console.log(`Rand color: ${randColor.getBrightness()}`);
  // console.log(`Rand color: ${randColor.getLuminance()}`);

  return randColor;
};

// TODO Use useOscillate Hook
//  Add cb param to 'oscillate' method
export const useAttractiveColorAnimation = (duration = SHORT_ANIMATION_MS) => {
  const [colorNode, setColorNode] = useState(new Animated.Value<number>(0));

  const [currentColor, setCurrentColor] = useState(getColor());
  const [nextColor, setNextColor] = useState(tinycolor(getColor()).lighten(20));

  const animateColor = () => {
    Animated.timing(colorNode, {
      toValue: 100,
      duration: duration,
      easing: Easing.in(Easing.ease),
    }).start(() => {
      // Next color darkens and becomes current color
      const darkerColor = tinycolor(nextColor.toRgbString()).darken(20);
      setCurrentColor(darkerColor);

      Animated.timing(colorNode, {
        toValue: 0,
        duration: duration,
        easing: Easing.in(Easing.ease),
      }).start(() => {
        // Random color lightens and become next color
        const brightColor = getColor();

        const lightenedColor = brightColor.lighten(20);

        setNextColor(lightenedColor);
      });
    });
  };

  return {
    color: Animated.interpolateColors(colorNode, {
      inputRange: [0, 100],
      outputColorRange: [currentColor.toRgbString(), nextColor.toRgbString()],
    }),
    currentColor: currentColor.toRgbString(),
    nextColor: nextColor.toRgbString(),
    animate: animateColor,
  };
};
