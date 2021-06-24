import {useLayoutEffect} from 'react';

import {setUserData, setUserName} from 'utilities/helpers/authConst';
import routes from 'navigation/routes';
import {DatabaseManager} from '../databaseManager';

export const checkAuth = props => {
  useLayoutEffect(() => {
    // DatabaseManager.deleteUserRecords();
    checkSignIn(props);
  }, []);

  const checkSignIn = async props => {
    const userDetails = await DatabaseManager.fetchUserRecords();
    const user = userDetails ? userDetails[0] : {};

    if (userDetails.length !== 0) {
      if (user.client_name && true) {
        setUserName(user);
        setUserData(userDetails[0]);
        props.navigation.navigate(routes.report);
      } else {
        props.navigation.navigate(routes.login);
      }
    } else {
      props.navigation.navigate(routes.login);
      console.log('Empty Object');
    }
  };
  return null;
};
