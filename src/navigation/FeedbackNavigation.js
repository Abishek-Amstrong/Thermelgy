import {createStackNavigator} from 'react-navigation-stack';

import Feedback from 'screens/Login/Feedback';
import IncidentList from 'screens/IncidentList';

export const FeedbackNavigation = createStackNavigator(
  {
    IncidentList: {
      screen: IncidentList,
      navigationOptions: {
        headerShown: false,
      },
    },
    SingleFeedback: {
      screen: Feedback,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    detachInactiveScreens: true,
  },
);
