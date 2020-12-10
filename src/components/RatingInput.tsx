import React, {FC} from 'react';
import {TouchableOpacity, Image, View} from 'react-native';
import styled from 'styled-components/native';

import {CUP_FULL} from '../images';

type RatingOption = {
  rating: number;
  image: any;
};
const RATING_OPTIONS: Array<RatingOption> = [
  {rating: 0, image: CUP_FULL},
  {
    rating: 3.3,
    image: CUP_FULL,
  },
  {
    rating: 6.6,
    image: CUP_FULL,
  },
  {
    rating: 10,
    image: CUP_FULL,
  },
];

type RatingProps = {
  handleRate: (rating: number) => void;
};
export const RatingInput: FC<RatingProps> = (props) => {
  const {handleRate} = props;

  return (
    <StyledContainer>
      {RATING_OPTIONS.map(({rating, image}) => (
        <TouchableOpacity onPress={() => handleRate(rating)}>
          <Image source={image} />
        </TouchableOpacity>
      ))}
    </StyledContainer>
  );
};

const StyledContainer = styled.View`
  flex: 1;
  flexdirection: row;
  justifycontent: space-evenly;
  alignitems: center;
`;
