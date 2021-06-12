import 'react-native-gesture-handler';

import React from 'react';

// Redux store
import {Provider} from 'react-redux';
import store from '../redux/store';

// For registering app
import {AppRegistry, Platform} from 'react-native';
import {name as appName} from '../../app.json';

import AppNav from './AppNav';
import {FC} from 'react';
import {ClickListener} from '../components/Global/ClickListener';

// Platform specific setup
switch (Platform.OS) {
  case 'android':
    break;
  case 'ios':
    break;

  default:
    break;
}

// 1. Add Redux to React UI
const App: FC = (props) => (
  <ClickListener>
    <Provider store={store}>
      <AppNav />
    </Provider>
  </ClickListener>
);

// 2. Register app
AppRegistry.registerComponent(appName, () => App);
