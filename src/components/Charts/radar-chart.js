// Input data
  const maxima = {
    cat: 14 / 48,
    dog: 14 / 48,
    fish: 14 / 48,
    bird: 14 / 48,
    turtle: 14 / 48,
  }
  const data2 = [
    {cat: 10 / 48, dog: 14 / 48, fish: 5 / 48, bird: 11 / 48, turtle: 8 / 48}
  ]
  const colors2 = [
    '#eedcab'
  ]


// Usage
      <Radar
        maxima={maxima}
        data={data2}
        tickCount={3}
        radius={1000}
        innerRadius={100}
        colors={colors2}
      />

// Implementation
import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import  { VictoryChart, VictoryArea, VictoryGroup, VictoryTheme, VictoryPolarAxis, VictoryLabel } from 'victory-native';

export const Radar = (props) => {
  const { radius, innerRadius, maxima, data: rawData, tickCount, colors } = props;

  // Format data as { x: ..., y: ...} for Victory Chart
  // And normalize the data between 0 and 1 by dividing by the maxima
  const formatData = (data) => Object.keys(data).map((category) => ({x: category, y: data[category] / maxima[category]}));

  const [data, setData] = React.useState(rawData.map(() => formatData(maxima)));

  React.useEffect(() => {
    setData(rawData.map((dataSet) => formatData(dataSet))); // Setting the data that we want to display
  }, [rawData]);

  console.log(data);
  
  return(
    <View>
	  	<VictoryChart polar
        animate={{
                duration: 500,
                easing: "exp"
        }}
        theme={VictoryTheme.material}
        domain={{ y: [ 0, 1 ] }}
      >
        <VictoryGroup colorScale={colors}
          style={{ data: { fillOpacity: 0.2, strokeWidth: 2 } }}
        >
          {data.map((dataSet, i) => {
            return <VictoryArea key={i} data={dataSet}/>;
          })}
        </VictoryGroup>

      {
        Object.keys(maxima).map((category, i) => {
          return (
            <VictoryPolarAxis key={i} dependentAxis
              style={{
                axisLabel: { padding: 10 }, 
                axis: { stroke: "none" },
                grid: { stroke: "grey", strokeWidth: 0.25, opacity: 0.5 }
              }}
              tickLabelComponent={
              	<VictoryLabel labelPlacement="vertical"/>
              }
              labelPlacement="perpendicular"
              axisValue={i + 1}
              label={category}
              // Can change fill color depending on the active data set
              axisLabelComponent={<VictoryLabel style={[{ fill: "" }]}/>}
              tickCount={tickCount}
              // Divide ticks evenly between 0 and 1
              tickValues={[...new Array(tickCount)].map((val, i) => 1 / tickCount * (i + 1))}
              // Normalize the tickValue to the correct range by multiplying by maxima
              // Round to at most 2 decimal places, and do not display final tick (maxima)
              tickFormat={(t, i) => i !== tickCount - 1 ? +(maxima[category] * t).toFixed(2) : ''}
            />
          );
        })
      }
      
        <VictoryPolarAxis
          labelPlacement="parallel"
          tickFormat={() => ""}
          style={{
          	axis: { stroke: "none" },
            grid: { stroke: "grey", opacity: 0.5 }
          }}
        />
        
      </VictoryChart>
    </View>
  )
}
