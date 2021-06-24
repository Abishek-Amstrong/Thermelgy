import {createStackNavigator} from 'react-navigation-stack';
import Test from 'screens/Login/Test';

export const TestNavigation = createStackNavigator({
  Test: {
    screen: Test,
    navigationOptions: {
      headerShown: false,
    },
  },
});
