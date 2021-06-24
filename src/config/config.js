import {Platform} from 'react-native';
// export const monthNames = ["January", "February", "March", "April", "May", "June",
// "July", "August ", "September", "October", "November", "December"
// ];

export const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const storageItems = {
  roomOptions: 'room-options',
};

export const font = Platform.select({
  ios: {
    avenirHeavy: {
      fontFamily: 'avenir',
    },

    robotoRegular: {
      fontFamily: 'roboto-regular',
    },

    nunitoRegular: {
      fontFamily: 'nunito',
    },
    nunitoExtraBoldItalic: {
      fontFamily: 'nunito',
      fontWeight: '900',
      fontStyle: 'italic',
    },
    nunitoBold: {
      fontFamily: 'nunito',
    },
    nunitoSemiBold: {
      fontFamily: 'nunito',
    },
    nunitoBoldItalic: {
      fontFamily: 'nunito',
      fontStyle: 'italic',
      fontWeight: '800',
    },
    nunitoExtraBold: {
      fontFamily: 'nunito',
      fontWeight: '900',
    },
    nunitoLightItalic: {
      fontFamily: 'nunito',
      fontStyle: 'italic',
      fontWeight: '200',
    },
    nunitoExtraLight: {
      fontFamily: 'nunito',
      fontWeight: '100',
    },
    nunitoExtraLightItalic: {
      fontFamily: 'nunito',
      fontStyle: 'italic',
      fontWeight: '100',
    },
    nunitoRegularItalic: {
      fontFamily: 'nunito',
      fontStyle: 'italic',
    },
  },
  android: {
    robotoRegular: {
      fontFamily: 'roboto-regular',
    },

    avenirHeavy: {
      fontFamily: 'avenirltstd-heavy',
    },

    nunitoRegular: {
      fontFamily: 'Nunito-Regular',
    },
    nunitoExtraBoldItalic: {
      fontFamily: 'Nunito-ExtraBoldItalic',
    },
    nunitoBold: {
      fontFamily: 'Nunito-Bold',
    },
    nunitoSemiBold: {
      fontFamily: 'Nunito-SemiBold',
    },
    nunitoBoldItalic: {
      fontFamily: 'Nunito-BoldItalic',
    },
    nunitoExtraBold: {
      fontFamily: 'Nunito-ExtraBold',
    },
    nunitoLightItalic: {
      fontFamily: 'Nunito-LightItalic',
    },
    nunitoExtraLightItalic: {
      fontFamily: 'Nunito-ExtraLightItalic',
    },
    nunitoExtraLight: {
      fontFamily: 'Nunito-ExtraLight',
    },
    nunitoRegularItalic: {
      fontFamily: 'Nunito-RegularItalic',
    },
  },
});
