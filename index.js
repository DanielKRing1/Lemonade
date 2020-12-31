// 1. Update method for Activity/Category Querent
// 2. Update for Sequential Querent
// 3. Allow only mood to be input
// 4. Allow mood + activities + intensity input
// 5. Call update for mood + activity + intensity inputs
// 6. Record daily moods and mood + activity + instensity
// 7. Predict outcome mood and intensities
// 8. Compute and store predictions with 'actual' for each day
// 9. Suggest activities to be happy
// 10. Suggest activities for any mood
// 11. Allow hashtags added to categories

// FEATURES
// 1. User enters activities, can add 'app defined' category hashtag later
// 2. Each entered activity is added to 'user defined' list
// 3. New activities prompt user whether they meant some 'close activity', if not then add activity to 'user defined' list
// 4. Sequential data but also Relatively Sequential, based on DayParts

// To genericize TrendTrackers, prompt user for set of 'Entities' and 'Moods'
// Create Schemas, and store as Json string
// Load strings as objects and use to start Realm Tables
// Entity Schema has each Mood as a '[mood]Rating'
// List of moods is stored as properties ([mood]Rating) in Entity Table
// List of Activities is stored as entries in Activities Table

// User updates Entities or moods, update Schema migrate to new Tables

/**
 * @format
 */
import 'react-native-gesture-handler';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {Navigation} from '@react-navigation/native';

import {withAuthenticator} from 'aws-amplify-react-native';

import {AppRegistry, Platform} from 'react-native';

// Configure Aws Amplify
import Amplify from 'aws-amplify';
import amplifyConfig from './config/aws/amplify-config';
Amplify.configure(amplifyConfig);

// import AppNav from './src/scenes/Auth/navigator';
import AppNav from './src/scenes/AppNav';
import {name as appName} from './app.json';

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
// const App = withAuthenticator(AppNav);
const App = AppNav;

AppRegistry.registerComponent(appName, () => App);
