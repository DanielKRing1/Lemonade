import React, { useState, useEffect } from 'react';
import Animated, { Easing } from 'react-native-reanimated';

const MIN_TO_VAL = 0;
const MAX_TO_VAL = 1;

type OptionParams = {
    duration?: number;
    initIsMax?: boolean;
    hasListener?: boolean;
};
export const useOscillate = (min: number, max: number, { duration = 500, initIsMax = false, hasListener = true }: OptionParams) => {

    const [animation, setAnimation] = useState<Animated.Value<number>>(new Animated.Value(initIsMax ? MAX_TO_VAL : MIN_TO_VAL));
    const [willMax, setWillMax] = useState<boolean>(initIsMax);
    const [isMax, setIsMax] = useState<boolean>(initIsMax);
    // const [value, setValue] = useState<number>(initIsMax ? MAX_TO_VAL : MIN_TO_VAL);

    // if (hasListener) {
    //     animation.addListener(({ value: v }) => setValue(v));
    // }

    const oscillate = () => {
        Animated.timing(animation, {
            toValue: isMax ? MIN_TO_VAL : MAX_TO_VAL,
            duration,
            easing: Easing.in(Easing.ease),
        }).start(() => {
            setIsMax(prevIsMax => !prevIsMax);
        });

        setWillMax(prevWillMax => !prevWillMax);
    };

    const animateUp = () => {
        console.log('a');
        if (willMax) return;

        console.log('b');

        Animated.timing(animation, {
            toValue: MAX_TO_VAL,
            duration,
            easing: Easing.in(Easing.ease),
        }).start(() => {
            setIsMax(true);
        });

        setWillMax(true);
    };

    const animateDown = () => {
        if (!willMax) return;

        Animated.timing(animation, {
            toValue: MIN_TO_VAL,
            duration,
            easing: Easing.in(Easing.ease),
        }).start(() => {
            setIsMax(false);
        });

        setWillMax(false);
    };

    return {
        isMax,
        willMax,
        animation,
        // value,
        interpolation: animation.interpolate({
            inputRange: [MIN_TO_VAL, MAX_TO_VAL],
            outputRange: [min, max],
        }),
        min: MIN_TO_VAL,
        max: MAX_TO_VAL,
        animate: oscillate,
        animateUp,
        animateDown
    };
};