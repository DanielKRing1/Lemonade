#Input data
  const data = [[
      { x: 1, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 5 },
      { x: 4, y: 4 },
      { x: 5, y: 6 }
  ]]

#Usage
      <StackedAreaChart
        data={data}
        colors={['Pink']}
      />

#Implementation
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import {Svg} from 'react-native-svg';
import { VictoryArea, VictoryStack } from 'victory-native';

export const StackedAreaChart = (props) => {
  const { data, colors } = props;

  console.log(data);

  return (
    <VictoryStack
      // animate={{easing: 'exp'}}
      animate={{
        easing: 'exp',
        duration: 1000,
        onLoad: { duration: 1 }
      }}
      colorScale={colors}
    >
      {
        data.map((dataSet) => (
          <VictoryArea
            data={dataSet}
          />
        ))
      }
    </VictoryStack>    
  )
}
