import React, { FC, useState } from 'react';
import { NativeSyntheticEvent, TextInputSubmitEditingEventData, Dimensions, Button, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';

import { AbsoluteView, ExpandableInput } from '..';
import { CycleInput } from '../../components/Cycle/CycleInput';
import { CycleButton } from '../../components/Cycle/CycleButton';
import { useAttractiveColorAnimation, useOscillate } from '../../hooks';

import { W, H } from '../../constants';


const INPUT_MIN_HEIGHT = 0.2 * H;
const INPUT_MAX_HEIGHT = 0.4 * H;

const BUTTON_MIN_WIDTH = 60;
const BUTTON_MAX_WIDTH = 180;

type CycleProps = {
    children: React.ReactNode;
    placeholder: string;
    input: string;
    handleChangeInput: (text: string) => void;
    onCycle: () => void;
    onSubmit: () => void;
};
export const Cycle: FC<CycleProps> = (props) => {
    const { children, placeholder, input, handleChangeInput, onCycle, onSubmit } = props;

    const { isMax: isFocused, animation, min, max, animateUp: animateFocus, animateDown: animateBlur } = useOscillate(INPUT_MIN_HEIGHT, INPUT_MAX_HEIGHT, {
        duration: 150,
        initIsMax: true
    });

    const { color, animate: animateColor } = useAttractiveColorAnimation(200);

    const handleFocus = () => {
        if (isFocused) return;

        console.log('focus');

        animateFocus();
    };
    const handleBlur = () => {
        if (!isFocused) return;

        console.log('blur');

        animateBlur();
    };

    const handleButtonPress = () => {
        handleFocus();
        animateColor();

        onCycle();
    };

    const handleSubmit = () => {
        console.log('Submit');
    };

    return (
        <StyledView>
            <CycleInput
                placeholder={placeholder}
                input={input}
                onChangeInput={handleChangeInput}
                onSubmit={handleSubmit}
                color={color}
                isFocused={isFocused}
                animation={animation}
                hasShadow={isFocused}
                animateFocus={animateFocus}
                animateBlur={animateBlur}
                min={min}
                max={max}
                minHeight={INPUT_MIN_HEIGHT}
                maxHeight={INPUT_MAX_HEIGHT}
            >
                {children}
            </CycleInput>

            <CycleButton
                color={color}
                animation={animation}
                min={min}
                max={max}
                minWidth={BUTTON_MIN_WIDTH}
                maxWidth={BUTTON_MAX_WIDTH}
                onCycle={handleButtonPress}
            />

            {/* <Button onPress={onSubmit} /> */}
        </StyledView>
    );
};

const StyledView = styled(AbsoluteView)`
`;