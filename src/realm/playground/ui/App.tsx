import 'react-native-gesture-handler';
import {Navigation} from '@react-navigation/native';

import {AppRegistry, Platform} from 'react-native';
import {name as appName} from '../../../../app.json';

import AppNav from './AppNav';

// Platform specific setup
switch (Platform.OS) {
  case 'android':
    break;
  case 'ios':
    break;

  default:
    break;
}

// Register app
const App = AppNav;
AppRegistry.registerComponent(appName, () => App);
