// Input data
  const data = [
    {x: 'cat', y: 10},
    {x: 'dog', y: 14},
    {x: 'fish', y: 5},
    {x: 'bird', y: 11},
    {x: 'turtle', y: 8},
  ]
  const colors = [
    '#ffffff',
    '#fefffe',
    '#ffbbff',
    '#fffccc',
    '#aaafff'
  ]


// Usage
      <Pie
        data={data}
        radius={115}
        innerRadius={95}
        colors={colors}
      />

// Implementation
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import Svg from 'react-native-svg';
import { VictoryContainer, VictoryChart, VictoryPie } from 'victory-native';

export const Pie = (props) => {
  const { radius, selectedRadius, innerRadius, data: rawData, colors } = props;

  const NO_SELECTED_INDEX = -1;
  const [selectedIndex, setSelectedIndex] = React.useState(NO_SELECTED_INDEX);
  const [data, setData] = React.useState(
    rawData.map((datum, i) =>
      i === 0 ? { ...datum, y: 1 } : { ...datum, y: 0 }
    )
  );

  const handleClick = () => {
    console.log('Clicked!');
  };

  React.useEffect(() => {
    setData(rawData); // Setting the data that we want to display
  }, [rawData]);

  return (
      <VictoryPie
      containerComponent={<VictoryContainer responsive={false}/>}
      //  standalone={false}
        animate={{ easing: 'exp' }}
        data={data}
        radius={(datum) =>
          datum.index === selectedIndex ? radius * 1.25 : radius
        }
        // innerRadius={innerRadius}
        colorScale={colors}

        events={[
          {
            target: 'data',
            eventHandlers: {
              onPressIn: () => {
                console.log('in');
                return [
                  {
                    target: 'data',
                    mutation: dataProps => {
                        console.log('item selected is',dataProps.index)
                          return {}
                    }
                  }
                ]
              },
              onPressOut: () => {
                console.log('out');
              }
            }
          }
        ]}
      />
  );
};

