import React, {useEffect} from 'react';
import {DatabaseManager} from '../utilities/databaseManager';
import axios from 'axios';
import {navigate} from '../utilities/helpers/navigationRef';
import {APP_CONFIG} from '../config/appConfig';
import {
  USER_DATA,
  setUserData,
  resetUserData,
} from '../utilities/helpers/authConst';
import {Alert} from 'react-native';

const instance = axios.create({
  baseURL: APP_CONFIG.BASE_URL,
});

// Binding Authorization Token
instance.interceptors.request.use(
  config => {
    if (USER_DATA && USER_DATA.access_token) {
      config.headers.Authorization = `Bearer ${USER_DATA.access_token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

// Check error state and handling token expiry
instance.interceptors.response.use(
  response => {
    return response.data;
  },
  err => {
    return new Promise(async (resolve, reject) => {
      if (err.config && err.response && err.response.status === 401) {
        let retryResponse = await getTokenFromRefreshToken(err.config);
        return resolve(retryResponse);
      } else if (err.response.status === 404 || err.response.status === 500) {
        Alert.alert(
          'Error Occured',
          'Please Contact Admin',
          [
            {
              text: 'OK',
              onPress: async () => {
                navigate('Home');
              },
            },
          ],
          {cancelable: false},
        );
        // await DatabaseManager.deleteUserRecords();
        // resetUserData();
        // navigate('Login');
      }
      let error = '';
      if (
        err &&
        err.hasOwnProperty('response') &&
        err.response.hasOwnProperty('request') &&
        err.response.request.hasOwnProperty('_response')
      ) {
        error = err.response.request._response;
      }
      return reject(error);
    });
  },
);

const getTokenFromRefreshToken = async request => {
  try {
    return await instance
      .post('/api/login/refresh', {refresh_token: USER_DATA.refresh_token})
      .then(async res => {
        const {data} = res;
        const userDetails = await DatabaseManager.fetchUserRecords();
        await DatabaseManager.deleteUserRecords();
        let user = userDetails ? userDetails[0] : {};
        if (
          user &&
          user.hasOwnProperty('access_token') &&
          user.access_token != ''
        ) {
          user.access_token = data.access_token;
          user.refresh_token = data.refresh_token;
          await DatabaseManager.insertUserRecords(user);
        }
        USER_DATA.access_token = data.access_token;
        USER_DATA.refresh_token = data.refresh_token;
        setUserData(USER_DATA);
        return instance(request);
      })
      .catch(async err => {
        const error = JSON.parse(err) ? JSON.parse(err) : err;
        if (
          (error && error.hasOwnProperty('status') && error.status === 422) ||
          (error &&
            error.hasOwnProperty('response') &&
            error.response.status === 422)
        ) {
          createAlert();
        }
        await DatabaseManager.deleteUserRecords();
        resetUserData();
        navigate('Login');
        return {message: 'Session Expired'};
      });
  } catch (err) {
    if (err.response.status === 422) {
      createAlert();
    }
    await DatabaseManager.deleteUserRecords();
    resetUserData();
    navigate('Login');
    return {message: 'Session Expired'};
  }
};

const createAlert = () => {
  Alert.alert('Session Expired', 'Please try again', [{text: 'OK'}], {
    cancelable: false,
  });
};

export default instance;
