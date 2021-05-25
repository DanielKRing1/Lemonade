import React, {FunctionComponent} from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Home} from './Input';

import {AppTabParamList, Screen} from './Types';

const Tabs = createBottomTabNavigator<AppTabParamList>();

const Navigator: FunctionComponent = (props) => {
  return (
    <NavigationContainer>
      <Tabs.Navigator initialRouteName={Screen.Home}>
        <Tabs.Screen name={Screen.Home} component={Home} />
      </Tabs.Navigator>
    </NavigationContainer>
  );
};
export default Navigator;
