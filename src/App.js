import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import {createAppContainer} from 'react-navigation';
import messaging from '@react-native-firebase/messaging';
import {Provider as PaperProvider} from 'react-native-paper';

import {LoaderContextProvider} from './context/LoaderContext';
import RootNavigator from './navigation';
import {splashStyles} from './styles/Style';
import {DatabaseManager} from './utilities/databaseManager';
import {setNavigator} from './utilities/helpers/navigationRef';

const App = createAppContainer(RootNavigator);

export default () => {
  DatabaseManager.setDatabaseConfiguration();

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('authorization status:', authStatus);
    }
  }

  useEffect(() => {
    requestUserPermission();
    messaging()
      .getToken()
      .then(token => {
        console.log('token---> ', token);
      });
  }, []);

  return (
    <PaperProvider>
      <LoaderContextProvider>
        <StatusBar
          backgroundColor="transparent"
          translucent
          barStyle="dark-content"
        />
        {/* <SafeAreaView style={styles.bottomSafeArea}> */}
        <App
          ref={navigator => {
            setNavigator(navigator);
          }}
        />
        {/* </SafeAreaView> */}
      </LoaderContextProvider>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  bottomSafeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
