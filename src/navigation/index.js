import {createSwitchNavigator} from 'react-navigation';

import {SafetyPage, Dashboard, Settings, Login, Chiller, Report} from 'screens';
import {TestNavigation} from './TestNavigation';
import {FeedbackNavigation} from './FeedbackNavigation';
import {checkAuth} from 'utilities/helpers/authResolver';

const navigationOptions = {
  headerShown: false,
};

const RootNavigator = createSwitchNavigator({
  ResolveAuth: checkAuth,
  // Welcome: {
  //   screen: WelcomeNavigation
  // },
  Login: {
    screen: Login,
    navigationOptions,
  },
  Report: {
    screen: Report,
    navigationOptions,
  },
  Test: {
    screen: TestNavigation,
  },
  Feedback: {
    screen: FeedbackNavigation,
  },
  Graph: {
    screen: Dashboard,
    navigationOptions,
  },
  SafetyPage: {
    screen: SafetyPage,
    navigationOptions,
  },
  Chiller: {
    screen: Chiller,
    navigationOptions,
  },
  Settings: {
    screen: Settings,
    navigationOptions,
  },
});

export default RootNavigator;
