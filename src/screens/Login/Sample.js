import React, {Component, useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import api from '../../api/Api';
import Safetytwo from '../../assets/images/safetytwo.svg';
import {Svg, Rect, Path} from 'react-native-svg';
import LoaderContext from '../../context/LoaderContext';
import Menuone from '../../assets/images/menuone.svg';
import Menutwo from '../../assets/images/menutwo.svg';
import Menuthree from '../../assets/images/menuthree.svg';
// import Slider from 'react-native-slider';
import {Slider} from 'react-native-elements';
import {font} from '../../config/config';

const {width} = Dimensions.get('window');

const Safetypage = props => {
  const loader = useContext(LoaderContext);
  // const [color, setColor] = useState('#FF7700');
  const [value, setValue] = useState(5);
  const [weatherdata, setWeatherdata] = useState({});
  const [status, setStatus] = useState(false);
  const handleSubmitButtonone = () => {
    console.log('received...!');
    props.navigation.navigate('Safetypage');
  };
  const handleSubmitButtontwo = () => {
    console.log('received...!');
    props.navigation.navigate('Test');
  };
  const handleSubmitButtonthree = () => {
    console.log('received...!');
    props.navigation.navigate('Feedback');
  };

  useEffect(() => {
    getWeatherData();
  }, []);
  useEffect(() => {
    console.log('State', status);
  }, [status]);
  useEffect(() => {
    console.log('useeffect', weatherdata);
  }, [weatherdata]);

  const getWeatherData = () => {
    let payload = {
      api_name: 'weatherMap',
      data: {
        city: 'chennai',
      },
    };
    loader.setLoader(true);
    api
      .post('/api/genericApi', payload)
      .then(res => {
        console.log('A1Response-----', res);
        setWeatherdata(res);
        console.log('Final-----', weatherdata);
        loader.setLoader(false);
      })
      .catch(err => {
        loader.setLoader(false);
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.rect}>
          <View style={styles.rectTop}>
            <Text style={styles.tMySafePremises}>tMY Safe Premises</Text>
            <TouchableOpacity
              onPress={() => {
                console.log('onPress rect');
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
              <Text style={styles.iaq45}>IAQ - 45</Text>
              <Text style={styles.loremIpsum2}>You are breathing safe</Text>
            </View>
          </View>
          <View style={styles.rectTop3}>
            <Slider
              value={value}
              onValueChange={value => setValue(value)}
              minimunValue={1}
              maximumValue={10}
              style={{
                width: '100%',
                marginTop: 30,
                paddingRight: 60,
              }}
              trackStyle={{height: '25%'}}
              thumbStyle={{
                height: 25,
                width: 25,
                backgroundColor: 'rgba(255,82,117,1)',
              }}

              // trackStyle={{height: 15, width: 100}}
            />
          </View>
          <View style={styles.rect2}>
            <View style={styles.rect6Row}>
              <View style={styles.rect6}>
                <View style={styles.tempCloud}>
                  <Image
                    style={styles.tinyLogo}
                    source={require('../../assets/images/Group68.png')}
                  />
                  <Text style={{}}>&nbsp;&nbsp;Temperature</Text>
                </View>
                <View style={styles.tempClouddiv}>
                  <Text style={styles.tempCloudtext}>
                    {weatherdata.temperature} C
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
                    <Text style={{}}>&nbsp;&nbsp;Relative Humidity</Text>
                  </View>
                  <View style={styles.humidityDrop}>
                    <Text
                      style={{
                        fontFamily: 'Nunito Sans, Block Italic',
                        color: '#000000',
                        fontSize: 25,
                      }}>
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
                      source={require('../../assets/images/Path75.png')}
                    />
                    <Text style={{}}>
                      &nbsp;&nbsp;Volatile Organic{'\n'}&nbsp; Compound
                    </Text>
                  </View>
                  <View style={styles.humidityDrop}>
                    <Text
                      style={{
                        fontFamily: 'Nunito Sans, Block Italic',
                        color: '#000000',
                        fontSize: 25,
                      }}>
                      45
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
                    source={require('../../assets/images/Group70.png')}
                  />
                  <Text style={{}}>
                    &nbsp;&nbsp;Particle{'\n'}&nbsp;&nbsp;Matter{''}
                    {''}1
                  </Text>
                </View>
                <View style={styles.humidityDrop}>
                  <Text
                    style={{
                      fontFamily: 'Nunito Sans, Block Italic',
                      color: '#000000',
                      fontSize: 25,
                    }}>
                    15
                  </Text>
                </View>
              </View>
              <View style={styles.rect4}>
                <View style={styles.particleMatter}>
                  <Image
                    style={styles.tinyLogo}
                    source={require('../../assets/images/Group70.png')}
                  />
                  <Text style={{}}>
                    &nbsp;&nbsp;Particle{'\n'}&nbsp;&nbsp;Matter{''}
                    {''}1
                  </Text>
                </View>
                <View style={styles.humidityDrop}>
                  <Text
                    style={{
                      fontFamily: 'Nunito Sans, Block Italic',
                      color: '#000000',
                      fontSize: 25,
                    }}>
                    35
                  </Text>
                </View>
              </View>
              <View style={styles.rect5}>
                <View style={styles.particleMatter}>
                  <Image
                    style={styles.tinyLogo}
                    source={require('../../assets/images/Group70.png')}
                  />
                  <Text style={{}}>
                    &nbsp;&nbsp;Particle{'\n'}&nbsp;&nbsp;Matter{''}
                    {''}1
                  </Text>
                </View>
                <View style={styles.humidityDrop}>
                  <Text
                    style={{
                      fontFamily: 'Nunito Sans, Block Italic',
                      color: '#000000',
                      fontSize: 25,
                    }}>
                    55
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.logoRow}>
              <View style={styles.logoRow1}>
                <View style={{paddingTop: 10, paddingRight: 10}}>
                  <Image
                    // style={styles.}
                    source={require('../../assets/images/Hablis_Logo.png')}
                  />
                </View>
                <View
                  style={{paddingLeft: 10, paddingRight: 10, height: '70%'}}>
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
          {status ? (
            <View style={styles.rect66}>
              <View style={styles.icon88Row}>
                <Menuone style={styles.icon88} />
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={handleSubmitButtonone}>
                  <Text style={styles.loremIpsum7}>tMY Safe Premises</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.icon88Row}>
                <Menutwo name="500px-with-circle" style={styles.icon88} />
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={handleSubmitButtontwo}>
                  <Text style={styles.loremIpsum9}>Feedback</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.icon88Row}>
                <Menuthree name="500px-with-circle" style={styles.icon88} />
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={handleSubmitButtonthree}>
                  <Text style={styles.loremIpsum9}>Notes</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
  rect: {
    width: '100%',
    height: 812,
    backgroundColor: 'rgba(112,179,73,1)',
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
    ...font.nunitoBoldItalic,
    color: 'rgba(255,255,255,1)',
    fontSize: 24,
    marginTop: 50,
    marginLeft: 30,
  },
  loremIpsum2: {
    ...font.nunitoRegular,
    color: 'rgba(255,255,255,1)',
    fontSize: 16,
    marginTop: 10,
    marginLeft: 30,
  },
  rect2: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(250,250,250,1)',
    // borderRadius: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 60,
  },
  rect6: {
    width: 166,
    height: 232,
    backgroundColor: 'rgba(210,218,255,1)',
    borderRadius: 25,
  },
  tempClouddiv: {
    paddingTop: 120,
    paddingLeft: 20,
  },
  tempCloudtext: {
    fontFamily: 'Nunito Sans, Block Italic',
    color: '#000000',
    fontSize: 30,
  },
  rect7: {
    width: 190,
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
    width: 190,
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
    width: 152,
    marginLeft: 16,
  },
  rect6Row: {
    height: 200,
    flexDirection: 'row',
    marginTop: 43,
    marginLeft: 22,
    marginRight: 19,
  },
  rect3: {
    width: 110,
    height: 110,
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
    width: 110,
    height: 110,
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
    width: 110,
    height: 110,
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
    marginTop: 50,
    marginLeft: 22,
    marginRight: 19,
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
    marginTop: 50,
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
    height: 60,
    flexDirection: 'row',
    marginTop: 2,
    marginLeft: 10,
    marginRight: 19,
  },
  tinyLogotop: {
    marginTop: 60,
    marginLeft: 80,
    alignItems: 'center',
  },
  tinyLogotop2: {
    height: 70,
    width: 70,
    marginTop: 50,
    marginLeft: 40,
    alignItems: 'center',
  },
  rectTop2: {
    width: '100%',
    height: 120,
    flexDirection: 'row',
    marginTop: 2,
    marginLeft: 10,
    marginRight: 19,
  },
  sliderstyle: {
    width: '100%',
    ...font.nunitoBoldItalic,
    color: 'rgba(255,255,255,1)',
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
  rectTop3: {
    flex: 1,
    paddingLeft: 100,
    // justifyContent: 'center',
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingTop: '10%',
  },
  rect66: {
    top: 70,
    left: 60,
    width: 300,
    height: 175,
    position: 'absolute',
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
    marginRight: 10,
    marginLeft: 10,
    marginTop: 4,
  },
});

export default Safetypage;
