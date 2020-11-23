import React from 'react';
import styled from 'styled-components/native';

type SpaceProps = {
  height: string;
};
export const Space = styled.View<SpaceProps>`
  height: ${({height}) => height || '30px'};
`;
