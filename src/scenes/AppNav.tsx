import React, { FunctionComponent } from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import store from '../redux/store';
import { Home } from './Input';

import { AppTabParamList, Screen } from './Types';

const Tabs = createBottomTabNavigator<AppTabParamList>();

const Navigator: FunctionComponent = (props) => {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Tabs.Navigator initialRouteName={Screen.Home}>
                    <Tabs.Screen name={Screen.Home} component={Home} />
                </Tabs.Navigator>
            </NavigationContainer>
        </Provider>
    );
};
export default Navigator;
