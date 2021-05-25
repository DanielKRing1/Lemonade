#Usage
        <HeatMap
          height='100%'
          width='100%'
          animMs={1500}
          gutter={{x: 5, y: 5}}
          cellHeight={10}
          cellWidth={10}
          colCount={4}
          data={data}
          onDayPressed={(index) => console.log(index)}
        />


#Implementation
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import Animated, {
  withTiming,
  Easing,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import styled from 'styled-components/native';

export const HeatMap = (props) => {
  const {height, width, animMs, gutter, cellHeight, cellWidth, colCount, data, onDayPressed} = props;

  // 1. Start opacity at 0
  const scaleYScaler = useSharedValue(0);
  const opacityScaler = useSharedValue(0);
  const borderRadiusScaler = useSharedValue(0);

  // 2. Animate opacity value from 0 to 1
  React.useEffect(() => {
    scaleYScaler.value = withTiming(1, {
      duration: animMs,
      easing: Easing.inOut(Easing.exp),
    });
    opacityScaler.value = withTiming(1, {
      duration: animMs,
      easing: Easing.inOut(Easing.cubic),
    });
    borderRadiusScaler.value = withTiming(1, {
      duration: animMs,
      easing: Easing.inOut(Easing.exp),
    });
  }, []);

  // 3. Create animation styles for opacity
  const fadeInOpacityStyles = useAnimatedStyle(() => {
    return {
      borderRadius: (1 - borderRadiusScaler.value) * 20,
      opacity: opacityScaler.value,
      transform: [
        // {
        //   scaleX: opacityScaler.value,
        // },
        {
          scaleY: scaleYScaler.value,
        },
      ],
    };
  });
  
  const rows = data.reduce((acc, cur, i) => {
    if(i % colCount === 0) acc.push([]);

    const curRowIndex = Math.floor(i / colCount);
    const curRow = acc[curRowIndex];


    // console.log(i);
    // console.log(`Cur row index: ${curRowIndex}`)
    // console.log(cur);
    // console.log(acc);

    curRow.push(cur);

    return acc;
  }, []);

  console.log(rows);

  const finalRowIndex = rows.length - 1;

  return (
    // 4. Apply animation styles to Animated.View
    <StyledContainer style={[fadeInOpacityStyles]}>
      {
        rows.map((row, i) => (
          <FlexRow margin={i < finalRowIndex ? `0px 0px ${gutter.y}px 0px` : '0px'}>
            {
              row.map((cell, j) => <FunctionalCell height={cellHeight} width={cellWidth} margin={j < colCount - 1 ? `0px ${gutter.x}px 0px 0px` : '0px'} cell={cell} onDayPressed={() => onDayPressed(i * colCount + j)}/>)
            }
          </FlexRow>
        ))
      }
    </StyledContainer>
  )
}

const StyledContainer = styled(Animated.View)`
  display: flex;
  alignSelf: flex-start;
  
  backgroundColor: #abcabc;
  overflow: hidden;
`;

const FunctionalCell = (props) => {
  const {height, width, margin, cell, onDayPressed} = props;
  const {color, opacity, label} = cell;

  const handlePress = () => {
    onDayPressed();
  }

  return (
    <View>
      <Cell onPress={handlePress} height={height} width={width} margin={margin} color={color} opacity={opacity}/>
    </View>
  )
}

const FlexRow = styled.View`
  display: flex;
  flexDirection: row;

  margin: ${props => props.margin};
`;

const Cell = styled.TouchableOpacity`
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  margin: ${props => props.margin};

  backgroundColor: ${props => props.color};
  opacity: ${props => props.opacity};
`;
