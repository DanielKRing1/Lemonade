#Input Data
    const data2 = [
      [
        { x: new Date(1506020447000), y: 2 },
        { x: new Date(1548097247000), y: 3 },
        { x: new Date(1579633247000), y: 5 },
        { x: new Date(1590087647000), y: 4 },
        { x: new Date(1621623647000), y: 6 }
      ],
      [
        { x: new Date(1506020447000), y: 3 },
        { x: new Date(1548097247000), y: 5 },
        { x: new Date(1579633247000), y: 4 },
        { x: new Date(1590087647000), y: 6 }
      ]
    ]

#Usage
      <LineChart
        data={data2}
        domain={{x: [new Date(1506020447000), new Date(1621623647000)], y: [0, 6]}}
        names={['Radish', 'Cucumber']}
        colors={['Pink', 'Red']}
        xAxisScale='time'
      />

#Implementation
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import {Svg} from 'react-native-svg';
import { VictoryAxis, VictoryChart, VictoryLegend, VictoryLine, VictoryTheme } from 'victory-native';

export const LineChart = (props) => {
  const { data, domain, interpolation='natural', names, colors, xAxisScale='linear' } = props;

  console.log(data);

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      // animate={{easing: 'exp'}}
      animate={{
        easing: 'exp',
        duration: 1000,
        onLoad: {
          duration: 1
        }
      }}
      domain={domain}
      scale={{x: xAxisScale}}
    >
      {
        data.map((dataSet, i) => (
          <VictoryLine
            style={{
              data: { stroke: colors[i] }
            }}
            data={dataSet}
            interpolation={interpolation}
          />
        ))
      }

      <VictoryLegend x={0} y={0}
        orientation="horizontal"
        gutter={20}
        style={{ border: { stroke: "black", opacity: 0.4 }, title: {fontSize: 20 } }}
        data={names.map((name, i) => ({ name, symbol: { fill: colors[i] } }))}
      />
    </VictoryChart>    
  )
}
