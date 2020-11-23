import React, { FC } from 'react';
import { Dimensions, Text, TextInput, TouchableHighlight } from 'react-native';
import styled from 'styled-components/native';

type AbsoluteButtonProps = {
    children: React.ReactNode;

    left: number;
    top: number;

    onPress: () => void;
};
export const AbsoluteButton: FC<AbsoluteButtonProps> = (props) => {
    const { children, left, top, onPress } = props;

    return (
        <StyledAbsoluteButton
            left={left}
            top={top}
            onPress={onPress}
        >
            {children}
        </StyledAbsoluteButton>
    );
};

type StyledAbsoluteButtonProps = {
    left: number;
    top: number;
};
const StyledAbsoluteButton = styled.TouchableHighlight<StyledAbsoluteButtonProps>`
    position: absolute;

    left: ${({ left }) => left * Dimensions.get('window').width};
    top: ${({ top }) => top * Dimensions.get('window').height};
`;