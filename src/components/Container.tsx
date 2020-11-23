import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';

type ContainerProps = {
  children?: React.ReactNode;
  isLoading: boolean;
};
export const Container: FunctionComponent<ContainerProps> = (props) => {
  const {children, isLoading} = props;

  return (
    <>
      {isLoading && <Loader />}
      <OpacityContainer isLoading={isLoading}>{children}</OpacityContainer>
    </>
  );
};

const Loader = styled.View``;

type OpacityContainerProps = {
  isLoading: boolean;
};
const OpacityContainer = styled.View<OpacityContainerProps>`
  ${({isLoading}) => (isLoading ? '* { opacity: 0.5 }' : '')};
`;
