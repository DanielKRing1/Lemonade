/**
 * @format
 */
import 'react-native-gesture-handler';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { Navigation } from '@react-navigation/native';

import { withAuthenticator } from 'aws-amplify-react-native';

import { AppRegistry, Platform } from 'react-native';

// Configure Aws Amplify
import Amplify from 'aws-amplify';
import amplifyConfig from './config/aws/amplify-config';
Amplify.configure(amplifyConfig);

// import AppNav from './src/scenes/Auth/navigator';
import AppNav from './src/scenes/AppNav';
import { name as appName } from './app.json';

// Platform specific setup
switch (Platform.OS) {
    case 'android':
        break;
    case 'ios':
        break;

    default:
        break;
};

// Register app
// const App = withAuthenticator(AppNav);
const App = AppNav;

AppRegistry.registerComponent(appName, () => App);
