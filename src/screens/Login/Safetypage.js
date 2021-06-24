import React, {useRef, useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  Platform,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import moment from 'moment';
import {Modal, Provider, Portal, Button} from 'react-native-paper';
import Emaillogo from '../../assets/images/email.svg';
import {setUserData, USER_DATA} from '../../utilities/helpers/authConst';
import api from '../../api/Api';
import Homeicon from '../../assets/images/dark_home.svg';
import Safetytwo from '../../assets/images/safetytwo.svg';
import SliderMarker from '../../assets/images/slider_marker.svg';
import {Svg, Rect, Path} from 'react-native-svg';
import LoaderContext from '../../context/LoaderContext';
import Menu from './Menu';
import Menuone from '../../assets/images/menuone.svg';
import Smile from '../../assets/images/smile.png';
import Sad from '../../assets/images/sad.png';
import Flat from '../../assets/images/flat.png';
import Menutwo from '../../assets/images/menutwo.svg';
import Menuthree from '../../assets/images/menuthree.svg';
import PmOne from '../../assets/images/pm_one.svg';
import PmTwo from '../../assets/images/pm_two.svg';
import {Slider} from 'react-native-elements';
import {
  SliderHuePicker,
  SliderSaturationPicker,
  SliderValuePicker,
} from 'react-native-slider-color-picker';
import tinycolor from 'tinycolor2';

const {width} = Dimensions.get('window');
import {font} from '../../config/config';

import routes from '../../navigation/routes';

const Safetypage = props => {
  const getOrientation = () =>
    Dimensions.get('window').width < Dimensions.get('window').height
      ? 'portrait'
      : 'landscape';
  const [value] = useState(120);
  const setValue = () => false;
  const loader = useContext(LoaderContext);
  const [color, setColor] = useState('#FF7700');

  const [weatherdata, setWeatherdata] = useState({
    temperature: '',
    humidity: '',
    voc: '',
    PM1: null,
    PM2_5: null,
    PM10: null,
    timeStamp: null,
  });
  const [status, setStatus] = useState(false);
  const [orientation, setOrientation] = useState(getOrientation());
  const changeColor = (colorHsvOrRgb, resType) => {
    if (resType === 'end') {
      setColor(tinycolor(colorHsvOrRgb).toHexString());
    }
  };
  //const[payload,setPayload] = useState('{"api_name": "add_checklist","data": {"client_id": "Hablis","content": [{"key": "question1","value": "y"},{"key": "question2","value": "n"}]}}');
  const handleSubmitButtonone = () => {
    console.log('received...!');
    props.navigation.navigate(routes.graph);
  };
  const handleSubmitButtontwo = () => {
    console.log('received...!');
    props.navigation.navigate('Test');
  };
  const handleSubmitButtonthree = () => {
    console.log('received...!');
    props.navigation.navigate(routes.feedback);
  };

  useEffect(() => {
    getWeatherData();

    Dimensions.addEventListener('change', () => {
      setOrientation(getOrientation());
    });
  }, []);

  let payload = {
    api_name: 'realtime',
    data: {
      time_range: 'minute',
      client_id: 'Hablis',
      machine_id: 'IAQ01',
    },
  };

  const getWeatherData = () => {
    loader.setLoader(true);
    api
      .post('/api/genericApi', payload)
      .then(res => {
        console.log('A1Response-----', res);
        if (res.data && res.data.length) {
          setWeatherdata({
            PM1: res.data[0].PMS1003.PM1,
            PM2_5: res.data[0].PMS1003.PM2_5,
            PM10: res.data[0].PMS1003.PM10,
            humidity: res.data[0].BME680.Humidity,
            voc: res.data[0].BME680.GasScore,
            temperature: res.data[0].BME680.Temperature,
            timeStamp: res.data[0].timestamp,
          });
          setValue(res.data[0].BME680.IAQ);
        }
        // setWeatherdata(res);
        console.log('Final-----', weatherdata);
        loader.setLoader(false);
      })
      .catch(err => {
        loader.setLoader(false);
      });
  };

  const getColor = iaqValue => {
    iaqValue = Number(iaqValue);
    switch (true) {
      case iaqValue < 75:
        return 'rgba(112,179,73,1)';
      case iaqValue >= 75 && iaqValue < 150:
        return 'rgba(112,179,73,1)';
      case iaqValue >= 150 && iaqValue < 250:
        return '#faaf39';
      case iaqValue >= 250 && iaqValue < 350:
        return '#FF5275';
      case iaqValue >= 350 && iaqValue <= 500:
        return '#FF5275';
    }
  };

  const getMessage = iaqValue => {
    iaqValue = Number(iaqValue);

    switch (true) {
      case iaqValue < 75:
        return "You're breathing safe";
      case iaqValue >= 75 && iaqValue < 150:
        return "You're breathing safe";
      case iaqValue >= 150 && iaqValue < 250:
        return "You're breathing with minor risk";
      case iaqValue >= 250 && iaqValue < 350:
        return "You're breathing is in high risk";
      case iaqValue >= 350 && iaqValue <= 500:
        return "You're breathing is in high risk";
    }
  };

  const getFontColor = vocValue => {
    vocValue = Number(vocValue);
    switch (true) {
      case vocValue >= 41:
        return 'rgba(112,179,73,1)';
      case vocValue >= 21:
        return '#DBB728';
      case vocValue > 0:
        return '#FF0000';
    }
  };

  const getImage = vocValue => {
    vocValue = Number(vocValue);
    switch (true) {
      case vocValue >= 41:
        return Smile;
      case vocValue >= 21:
        return Flat;
      case vocValue >= 0:
        return Sad;
    }
  };

  const backgroundColor = getColor(value);
  const message = getMessage(value);
  const fontColor = getFontColor(weatherdata.voc);
  const smileyImage = getImage(weatherdata.voc);

  let maxValue;
  if (orientation === 'portrait') {
    maxValue = value <= 200 ? 700 : value >= 400 ? 600 : 650;
  } else {
    maxValue = value <= 200 ? 700 : value <= 300 ? 650 : 600;
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Provider>
        <Portal>
          <Modal
            visible={status}
            onDismiss={() => setStatus(false)}
            contentContainerStyle={styles.menuContainer}>
            <View style={styles.rect66}>
              <TouchableOpacity onPress={handleSubmitButtonone}>
                <View style={[styles.icon88Row, styles.loginBtn]}>
                  <Homeicon style={styles.icon88} />
                  <Text style={styles.loremIpsum7}>tMY Smart energy</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmitButtontwo}>
                <View style={[styles.icon88Row, styles.loginBtn]}>
                  <Menutwo name="500px-with-circle" style={styles.icon88} />
                  <Text style={styles.loremIpsum9}>
                    tMY Safe Premises - Readiness Index
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmitButtonthree}>
                <View style={[styles.icon88Row, styles.loginBtn]}>
                  <Menuthree name="500px-with-circle" style={styles.icon88} />
                  <Text style={styles.loremIpsum9}>Incidents</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
        <View style={styles.container}>
          <ScrollView style={styles.scroll}>
            <View style={[styles.rect, {backgroundColor}]}>
              <View style={styles.rectTop}>
                <Text style={styles.tMySafePremises}>tMY Safe Premises</Text>
                <TouchableOpacity
                  onPress={() => {
                    //console.warn('onPress rect');
                    setStatus(true);
                  }}>
                  <Image
                    style={styles.tinyLogotop}
                    source={require('../../assets/images/Path117.png')}
                    onPress={() => {
                      //console.warn('onPress rect');
                      setStatus(true);
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.rectTop2}>
                <Image
                  style={styles.tinyLogotop2}
                  source={require('../../assets/images/Group103.png')}
                />
                <View>
                  <Text style={styles.iaq45}>IAQ - {value}</Text>
                  <Text style={styles.loremIpsum2}>Comfort Index</Text>
                  <Text style={styles.loremIpsum2}>{message}</Text>
                </View>
              </View>
              <View>
                <View style={styles.scaleContainer}>
                  {[1, 2, 3, 4, 5].map(v => (
                    <>
                      <View style={styles.smallScale} />
                      {/* <View style={styles.smallScale} /> */}
                      <View style={styles.smallScale} />
                      <View style={styles.largeScale} />
                    </>
                  ))}
                </View>
                <Slider
                  value={value}
                  disabled
                  // onValueChange={value => setValue(value)}
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="#FFFFFF"
                  minimunValue={0}
                  maximumValue={maxValue}
                  style={{
                    width: '100%',
                    marginTop: 5,
                    marginLeft: 30,
                    paddingRight: 60,
                    borderRadius: 10,
                  }}
                  trackStyle={{
                    height: 10,
                    width: '100%',
                    borderRadius: 5,
                  }}
                  thumbStyle={{
                    height: 25,
                    width: 25,
                    backgroundColor: 'white',
                    borderColor: '#DB5C64',
                    borderWidth: 5,
                  }}

                  // trackStyle={{height: 15, width: 100}}
                />
                <View style={[styles.scaleContainer, styles.numberScale]}>
                  <Text
                    style={[
                      styles.scaleLabel,
                      {marginLeft: orientation === 'portrait' ? 10 : 10},
                    ]}>
                    1
                  </Text>
                  <Text
                    style={[
                      styles.scaleLabel,
                      {marginLeft: orientation === 'portrait' ? 20 : 55},
                    ]}>
                    100
                  </Text>
                  <Text
                    style={[
                      styles.scaleLabel,
                      {marginLeft: orientation === 'portrait' ? 30 : 100},
                    ]}>
                    200
                  </Text>
                  <Text
                    style={[
                      styles.scaleLabel,
                      {marginLeft: orientation === 'portrait' ? 40 : 100},
                    ]}>
                    300
                  </Text>
                  <Text
                    style={[
                      styles.scaleLabel,
                      {marginLeft: orientation === 'portrait' ? 40 : 100},
                    ]}>
                    400
                  </Text>
                  <Text
                    style={[
                      styles.scaleLabel,
                      {marginLeft: orientation === 'portrait' ? 40 : 110},
                    ]}>
                    500
                  </Text>
                </View>
              </View>
              <View style={styles.refreshContainer}>
                <Button
                  icon="reload"
                  color="white"
                  onPress={getWeatherData}
                  mode="outlined"
                  style={{
                    height: 40,
                    width: 130,
                    borderColor: 'white',
                  }}
                  labelStyle={{
                    ...font.nunitoExtraLightItalic,
                    textTransform: 'capitalize',
                  }}>
                  Refresh
                </Button>
              </View>
              <View style={styles.rect2}>
                <View style={styles.rect6Row}>
                  <View style={styles.rect6}>
                    <View style={styles.tempCloud}>
                      <Image
                        style={styles.tinyLogo}
                        source={require('../../assets/images/Path75.png')}
                      />
                      <View>
                        <Text style={styles.labelStyle}>VOC</Text>
                      </View>
                    </View>
                    <View style={styles.tempClouddiv}>
                      <Image source={smileyImage} style={styles.smileLogo} />
                      <Text
                        style={[
                          styles.tempCloudtext,
                          styles.valueFont,
                          {color: fontColor, fontSize: 30},
                        ]}>
                        {weatherdata.voc}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rect7Column}>
                    <View style={styles.rect7}>
                      <View style={styles.tempCloud}>
                        <Image
                          style={styles.tinyLogo}
                          source={require('../../assets/images/Group69.png')}
                        />
                        <Text style={styles.labelStyle}>Relative Humidity</Text>
                      </View>
                      <View style={styles.humidityDrop}>
                        <Text style={styles.valueFont}>
                          {weatherdata.humidity} %
                        </Text>
                      </View>
                    </View>
                    {/* <View style={styles.rect7}>
                  <Text style={styles.text}>55 %</Text>
                </View>
                <View style={styles.rect8}>
                  <Text style={styles.text2}>45</Text>
                </View> */}
                    <View style={styles.rect8}>
                      <View style={styles.tempCloud}>
                        <Image
                          style={styles.tinyLogo}
                          source={require('../../assets/images/Group68.png')}
                        />
                        <Text style={styles.labelStyle}>Temperature</Text>
                      </View>
                      <View style={styles.humidityDrop}>
                        <Text style={styles.valueFont}>
                          {weatherdata.temperature} C
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.rect3Row}>
                  <View style={styles.rect3}>
                    <View style={styles.particleMatter}>
                      <Image
                        style={styles.tinyLogo}
                        source={require('../../assets/images/pm_one.png')}
                      />
                      <Text style={styles.labelStyle}>
                        &nbsp;&nbsp;PM{''}
                        {''}1
                      </Text>
                    </View>
                    <View style={styles.humidityDrop}>
                      <Text style={styles.valueFont}>{weatherdata.PM1}</Text>
                    </View>
                  </View>
                  <View style={styles.rect4}>
                    <View style={styles.particleMatter}>
                      <Image
                        style={styles.tinyLogo}
                        source={require('../../assets/images/pm_two.png')}
                      />
                      <Text style={styles.labelStyle}>
                        &nbsp;&nbsp;PM{''}
                        {''}2.5
                      </Text>
                    </View>
                    <View style={styles.humidityDrop}>
                      <Text style={styles.valueFont}>{weatherdata.PM2_5}</Text>
                    </View>
                  </View>
                  <View style={styles.rect5}>
                    <View style={styles.particleMatter}>
                      <Image
                        style={styles.tinyLogo}
                        source={require('../../assets/images/Group70.png')}
                      />
                      <Text style={styles.labelStyle}>
                        &nbsp;&nbsp;PM{''}
                        {''}10
                      </Text>
                    </View>
                    <View style={styles.humidityDrop}>
                      <Text style={styles.valueFont}>{weatherdata.PM10}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.timeStamp}>
                  Last Updated on {moment().format('DD-MMM,YY hh:mm:ss')}
                </Text>
                <View style={styles.logoRow}>
                  <View style={styles.logoRow1}>
                    <View style={{paddingTop: 10, paddingRight: 10}}>
                      <Image
                        // style={styles.}
                        source={require('../../assets/images/Hablis_Logo.png')}
                      />
                    </View>
                    <View
                      style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                        height: '70%',
                      }}>
                      <View style={styles.verticleLine} />
                    </View>
                    <View style={{paddingTop: 3}}>
                      <Image
                        // style={styles.tinyLogo}
                        source={require('../../assets/images/ThermelgyLogoOption-02.png')}
                      />
                    </View>
                  </View>
                  {/* <Image
                // style={styles.tinyLogo}
                source={require('../../assets/images/login/homelogo.png')}
              /> */}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Provider>
    </>
  );
};

const styles = StyleSheet.create({
  scaleContainer: {
    height: 60,
    width: '83%',
    marginTop: 40,
    marginBottom: -40,
    marginLeft: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'flex-end',
  },
  numberScale: {
    marginBottom: 0,
    marginTop: 5,
    justifyContent: 'flex-start',
  },
  scaleLabel: {
    color: 'white',
    ...font.nunitoRegular,
  },
  smallScale: {
    height: 12,
    width: 3,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 10,
  },
  largeScale: {
    height: 23,
    borderRadius: 10,
    width: 3,
    backgroundColor: 'white',
  },
  labelStyle: {
    ...font.nunitoRegular,
    marginLeft: 10,
  },
  valueFont: {
    ...font.nunitoBoldItalic,
    color: 'black',
    fontSize: 23,
  },
  refreshContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
  rect: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(112,179,73,1)',
    marginBottom: 20,
  },
  tMySafePremises: {
    ...font.nunitoRegular,
    color: 'rgba(255,255,255,1)',
    fontSize: 16,
    marginTop: 60,
    marginLeft: 100,
    justifyContent: 'center',
    textAlign: 'center',
  },
  iaq45: {
    ...font.nunitoExtraBoldItalic,
    color: 'rgba(255,255,255,1)',
    fontSize: 24,
    marginTop: 10,
    marginLeft: 30,
  },
  loremIpsum2: {
    ...font.nunitoExtraLight,
    color: 'rgba(255,255,255,1)',
    fontSize: 13,
    marginTop: 10,
    marginLeft: 30,
  },
  timeStamp: {
    marginTop: 40,
    color: 'black',
    ...font.nunitoRegularItalic,
    textAlign: 'center',
  },
  rect2: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(250,250,250,1)',
    // borderRadius: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 30,
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  rect6: {
    width: 150,
    height: 230,
    backgroundColor: 'rgba(210,218,255,1)',
    borderRadius: 25,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  smileLogo: {},
  tempClouddiv: {
    paddingLeft: 20,
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
  },
  tempCloudtext: {
    color: '#000000',
    backgroundColor: '#D2DAFF',
    // backgroundColor: 'red',
    // width: 50,
    height: 50,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingLeft: 10,
    marginLeft: -10,
    marginTop: 10,
    borderRadius: 50,
  },
  rect7: {
    width: '100%',
    height: 105,
    backgroundColor: 'rgba(255,82,117,1)',
    borderRadius: 25,
  },
  text: {
    ...font.nunitoBoldItalic,
    color: '#121212',
    fontSize: 30,
    marginTop: 35,
    marginLeft: 15,
  },
  rect8: {
    width: '100%',
    height: 105,
    backgroundColor: 'rgba(247,231,203,1)',
    borderRadius: 25,
    marginTop: 22,
  },
  text2: {
    ...font.nunitoBoldItalic,
    color: '#121212',
    fontSize: 30,
    marginTop: 31,
    marginLeft: 16,
  },
  rect7Column: {
    flex: 1,
    marginLeft: 16,
  },
  rect6Row: {
    // height: 200,
    flexDirection: 'row',
    marginTop: 43,
    marginLeft: 15,
    marginRight: 15,
  },
  rect3: {
    width: 105,
    height: 105,
    backgroundColor: 'rgba(179,255,160,1)',
    borderRadius: 23,
  },
  text3: {
    ...font.nunitoBoldItalic,
    color: '#121212',
    fontSize: 24,
    marginTop: 45,
    marginLeft: 22,
  },
  rect4: {
    width: 105,
    height: 105,
    backgroundColor: 'rgba(245,208,115,1)',
    borderRadius: 23,
    marginLeft: 16,
  },
  text4: {
    ...font.nunitoBoldItalic,
    color: '#121212',
    fontSize: 24,
    marginTop: 45,
    marginLeft: 21,
  },
  rect5: {
    width: 105,
    height: 105,
    backgroundColor: 'rgba(255,103,47,1)',
    borderRadius: 23,
    marginLeft: 18,
  },
  text5: {
    ...font.nunitoBoldItalic,
    color: '#121212',
    fontSize: 24,
    marginTop: 45,
    marginLeft: 24,
  },
  rect3Row: {
    justifyContent: 'space-evenly',
    height: 90,
    flexDirection: 'row',
    marginTop: 25,
    marginLeft: 25,
    marginRight: 25,
  },
  tempCloud: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingTop: 20,
  },
  humidityDrop: {
    paddingLeft: 15,
    paddingTop: 8,
  },
  particleMatter: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingTop: 20,
  },
  logoRow: {
    marginTop: 30,
    height: '100%',
  },
  logoRow1: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingLeft: 15,
  },
  verticleLine: {
    height: '40%',
    width: 3,
    backgroundColor: '#909090',
  },
  icon: {
    color: '#FFF',
    fontSize: 40,
    height: 20,
    width: 10,
    marginLeft: 10,
    marginTop: 2,
  },
  rectTop: {
    width: '100%',
    height: 120,
    flexDirection: 'row',
    marginTop: 2,
    display: 'flex',
  },
  tinyLogotop: {
    marginTop: 60,
    marginLeft: '40%',
    alignItems: 'center',
  },
  tinyLogotop2: {
    height: 70,
    width: 70,
    marginTop: 10,
    marginLeft: 40,
    alignItems: 'center',
  },
  rectTop2: {
    height: 100,
    flexDirection: 'row',
    marginTop: 1,
    marginLeft: 10,
    marginRight: 19,
  },
  sliderstyle: {
    width: '100%',
    ...font.nunitoBoldItalic,
    color: 'rgba(255,255,255,1)',
    backgroundColor: 'white',
    fontSize: 24,
    marginTop: 60,
    marginLeft: 0,
    marginRight: 200,
  },
  thumb: {
    width: 20,
    height: 20,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.35,
  },
  menuContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rect66: {
    width: 310,
    paddingVertical: 25,
    borderRadius: 15,
    height: 200,
    backgroundColor: '#FFF',
  },
  icon88Row: {
    height: 46,
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 8,
  },
  icon88: {
    color: 'rgba(128,128,128,1)',
    fontSize: 40,
    height: 46,
    width: 40,
    marginRight: 20,
    marginLeft: 10,
    marginTop: 4,
  },
});

export default Safetypage;
