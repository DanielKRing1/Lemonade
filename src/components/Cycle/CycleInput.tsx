import React, { FC, useState } from 'react';
import { Animated as RNAnimated, Dimensions, Button, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import DropShadow from "react-native-drop-shadow";

import { AbsoluteView, ExpandableInput } from '../';
import { BoxShadowStyle } from '../../styles';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const INPUT_MIN_HEIGHT = 0.075 * SCREEN_HEIGHT;
const INPUT_MAX_HEIGHT = 0.15 * SCREEN_HEIGHT;
const INPUT_MIN_WIDTH = 1 * SCREEN_WIDTH;
const INPUT_MAX_WIDTH = 0.9 * SCREEN_WIDTH;

type TextInputFields = {
    placeholder: string;
    onSubmit: (text: string) => void;
};

type CycleInputProps = {
    textInputRef: any;
    children: React.ReactNode;

    placeholder: string;
    input: string;
    onChangeInput: (text: string) => void;
    onSubmit: () => void;

    color: Animated.Node<number>;

    isFocused: boolean;
    animation: Animated.Value<number>;
    hasShadow: boolean;
    animateFocus: () => void;
    animateBlur: () => void;

    min: number;
    max: number;
    minHeight: number;
    maxHeight: number;
};
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const CycleInput: FC<CycleInputProps> = (props) => {

    const { textInputRef, children, placeholder, input, onChangeInput, onSubmit, color, isFocused, animation, hasShadow, animateFocus, animateBlur, min, max, minHeight, maxHeight } = props;

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

    const inputHeight = animation.interpolate({
        inputRange: [min, max],
        outputRange: [INPUT_MIN_HEIGHT, INPUT_MAX_HEIGHT]
    });

    const inputWidth = animation.interpolate({
        inputRange: [min, max],
        outputRange: [INPUT_MIN_WIDTH, INPUT_MAX_WIDTH]
    });

    return (
        <TopAbsoluteView>
            <DropShadow
                style={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 10,
                    },
                    shadowOpacity: hasShadow ? 0.5 : 0,
                    shadowRadius: 5,
                }}
            >
                <StyledExpandableInput
                    ref={textInputRef}
                    textAlign='center'
                    style={{ height: inputHeight, width: inputWidth, borderColor: color }}
                    placeholder={placeholder}
                    value={input}
                    onChangeText={onChangeInput}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onSubmitEditing={onSubmit}
                />
            </DropShadow>

            {children}
        </TopAbsoluteView>
    );
};

const TopAbsoluteView = styled(AbsoluteView)`
    position: relative;

    alignSelf: flex-start;
    alignItems: center;
    justifyContent: flex-start;

    backgroundColor: transparent;
`;

type StyledExpandableInputProps = {

};
const StyledExpandableInput = styled(ExpandableInput) <StyledExpandableInputProps>`
    borderWidth: 2;

    backgroundColor: white;

    padding-right: 5;
    padding-left: 5;
`;
