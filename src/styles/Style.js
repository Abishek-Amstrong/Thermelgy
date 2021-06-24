import {StyleSheet} from 'react-native';


export const APP_BG_COLOR = '#f9f9f9';
export const APP_HEADER_BG_COLOR = '#f9f9f9';

export const commonStyles = StyleSheet.create({
  rootContainer: {
      width: '100%',
      minHeight: '100%',
      backgroundColor: '#f9f9f9',
  }
});

export const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});