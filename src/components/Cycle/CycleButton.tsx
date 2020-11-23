import React, { FC, useState } from 'react';
import { Animated as RNAnimated, Dimensions, Button, Text, TextInput, TouchableOpacity, TouchableHighlight, View } from 'react-native';
import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import DropShadow from "react-native-drop-shadow";

import { AbsoluteView } from '../';
import { BoxShadowStyle, CircleStyle } from '../../styles';


type CycleButtonProps = {
    color: Animated.Node<number>;

    animation: Animated.Value<number>;
    min: number;
    max: number;
    minWidth: number;
    maxWidth: number;

    onCycle: () => void;
};
export const CycleButton: FC<CycleButtonProps> = (props) => {

    const { color, animation, min, max, minWidth, maxWidth, onCycle } = props;

    const buttonWidth = animation.interpolate({
        inputRange: [min, max],
        outputRange: [minWidth, maxWidth],
    });

    return (
        <BottomAbsoluteView>
            <DropShadow
                style={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 5,
                }}
            >
                <StyledCycleButton
                    minWidth={minWidth}
                    activeOpacity={1}
                    style={{ width: buttonWidth, backgroundColor: color }}
                    onPress={onCycle}
                >
                    <Text>+</Text>
                </StyledCycleButton>
            </DropShadow>
        </BottomAbsoluteView>
    );
};

const BottomAbsoluteView = styled(AbsoluteView)`
    alignItems: flex-end;
    justifyContent: flex-end;
`;

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
type StyledCycleButtonProps = {
    minWidth: number;
};
const StyledCycleButton = styled(AnimatedTouchableOpacity) <StyledCycleButtonProps>`
    ${CircleStyle}

    justifyContent: center;

    marginRight: 10;
    marginLeft: 10;
    height: ${({ minWidth }) => minWidth};
`;