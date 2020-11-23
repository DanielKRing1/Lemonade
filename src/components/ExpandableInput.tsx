import React, { FC, useState } from 'react';
import { NativeSyntheticEvent, TextInputSubmitEditingEventData, Dimensions, Button, TextInput, View } from 'react-native';
import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';

type StyledTextInputProps = {
};
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
export const ExpandableInput = styled(AnimatedTextInput) <StyledTextInputProps>``;