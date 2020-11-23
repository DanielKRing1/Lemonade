import React, { FC, useState } from 'react';
import {
    Button,
    Dimensions,
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';

import { useAttractiveColorAnimation } from '../hooks';


const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type InputCycleProps = {
    children: React.ReactNode;
};
const InputCycle: FC<InputCycleProps> = (props) => {
    const { children } = props;

    const [activeIndex, setActiveIndex] = useState<number>(0);

    const { color, animate: animateColor } = useAttractiveColorAnimation();

    const handleCycle = () => {

        const totalIndices = React.Children.count(children);
        setActiveIndex((prevIndex) => (prevIndex + 1) % totalIndices);

        animateColor();
    };

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={handleCycle}
        >
            {!!children && children[activeIndex]}
        </TouchableOpacity>

    )
}

const StyledCircle = styled(AnimatedTouchable)``;