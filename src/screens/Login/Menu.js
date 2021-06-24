import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import React, {useState, useContext, useRef, useEffect} from 'react';

import Graphone from '../../assets/images/graphone.svg';
import Graphtwo from '../../assets/images/graphtwo.svg';
import Graphthree from '../../assets/images/graphthree.svg';
import {Dimensions, Image} from 'react-native';

import Bellicon from '../../assets/images/notification.svg';
import Homeicon from '../../assets/images/home.svg';
import Menuone from '../../assets/images/menuone.svg';
import Menutwo from '../../assets/images/menutwo.svg';
import Menuthree from '../../assets/images/menuthree.svg';
import {Button} from 'react-native-elements';

import {LineChart} from 'react-native-chart-kit';
import { font } from 'config/config';

const Graph = props => {
  const [value, setValue] = useState('Item 1');
  const [status, setStatus] = useState(false);
  const [items1, setItems1] = useState([
    {label: 'Item 1', value: 'item1'},
    {label: 'Machine Type', value: 'item2', selected: true},
  ]);
  const [items2, setItems2] = useState([
    {label: 'Item 1', value: 'item1'},
    {label: 'Machine ID', value: 'item2', selected: true},
  ]);
  const [items3, setItems3] = useState([
    {label: 'Item 1', value: 'item1'},
    {label: 'Energy', value: 'item2', selected: true},
  ]);
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
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.rect6}>
          <View style={styles.icon8Row}>
            <Menuone style={styles.icon8} />
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleSubmitButtonone}>
              <Text style={styles.loremIpsum7}>tMY Safe Premises</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.icon8Row}>
            <Menutwo name="500px-with-circle" style={styles.icon8} />
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleSubmitButtontwo}>
              <Text style={styles.loremIpsum9}>Feedback</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.icon8Row}>
            <Menuthree name="500px-with-circle" style={styles.icon8} />
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleSubmitButtonthree}>
              <Text style={styles.loremIpsum9}>Notes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rect: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(1,37,96,1)',
    shadowColor: 'rgba(1,37,96,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 0,
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  thermelgy: {
    fontFamily: 'black-ops-one-regular',
    color: 'rgba(255,255,255,1)',
    fontSize: 18,
    textAlign: 'left',
    marginTop: 13,
  },
  icon: {
    color: 'rgba(255,255,255,1)',
    fontSize: 40,
    height: 44,
    width: 28,
    marginLeft: 180,
    marginTop: 2,
  },
  icon2: {
    color: 'rgba(254,254,254,1)',
    fontSize: 40,
    height: 44,
    width: 28,
    marginLeft: 16,
  },
  thermelgyRow: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    marginTop: 43,
    marginLeft: 22,
    marginRight: 11,
    alignContent: 'center',
  },
  button4: {
    width: 84,
    height: 34,
    backgroundColor: 'rgba(1,37,96,1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,1)',
    borderRadius: 5,
    borderStyle: 'solid',
  },
  button3: {
    width: 84,
    height: 34,
    backgroundColor: 'rgba(1,37,96,1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,1)',
    borderRadius: 5,
    borderStyle: 'solid',
    marginLeft: 30,
  },
  button2: {
    width: 84,
    height: 34,
    backgroundColor: 'rgba(1,37,96,1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,1)',
    borderRadius: 5,
    borderStyle: 'solid',
    marginLeft: 32,
  },
  pickerRow: {
    height: 30,
    width: '100%',
    flexDirection: 'row',
    marginTop: 33,
    marginLeft: 22,
    marginRight: 19,
  },
  button4Row: {
    height: 700,
    width: 100,
    marginRight: 10,
    marginLeft: 10,
    backgroundColor: '#FFF',
  },
  ipsum: {
    fontFamily: 'roboto-700',
    color: 'rgba(255,255,255,1)',
    lineHeight: 22,
    fontSize: 24,
    marginTop: 55,
    marginLeft: 22,
  },
  overallConsumption: {
    fontFamily: 'roboto-regular',
    color: 'rgba(255,255,255,1)',
    marginTop: 14,
    marginLeft: 22,
  },
  button5: {
    width: 84,
    height: 38,
    backgroundColor: '#E6E6E6',
  },
  button6: {
    width: 84,
    height: 38,
    backgroundColor: '#E6E6E6',
    marginLeft: 30,
  },
  button7: {
    width: 84,
    height: 38,
    backgroundColor: '#E6E6E6',
    marginLeft: 32,
  },
  button5Row: {
    height: 38,
    flexDirection: 'row',
    marginTop: 50,
    marginLeft: 22,
    marginRight: 39,
    justifyContent: 'space-between',
  },
  rect2: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E6E6E6',
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
    borderRadius: 38,
    marginTop: 27,
  },
  group: {
    width: '100%',
    height: 100,
    marginTop: 32,
    marginLeft: 5,
  },
  rect3: {
    width: 322,
    height: 78,
    backgroundColor: '#E6E6E6',
  },
  icon3: {
    width: 35,
    height: 35,
    color: 'rgba(155,82,82,1)',
    fontSize: 58,
  },
  loremIpsum: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    fontSize: 18,
    marginLeft: 1,
  },
  loremIpsum3: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    fontSize: 12,
  },
  today4173KWh: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    fontSize: 12,
    marginLeft: 19,
  },
  loremIpsum3Row: {
    height: 14,
    flexDirection: 'row',
    marginTop: 18,
  },
  loremIpsumColumn: {
    width: '100%',
    marginLeft: 10,
    marginBottom: 12,
  },
  icon3Row: {
    height: 65,
    flexDirection: 'row',
    marginTop: 7,
    marginLeft: 2,
    marginRight: 5,
  },
  group2: {
    width: 322,
    height: 78,
    marginTop: 12,
    marginLeft: 14,
  },
  rect4: {
    width: 322,
    height: 78,
    backgroundColor: '#E6E6E6',
  },
  icon4: {
    color: 'rgba(82,101,155,1)',
    fontSize: 58,
  },
  text: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    fontSize: 18,
  },
  text2: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    fontSize: 12,
    marginTop: 18,
    marginLeft: 3,
  },
  textColumn: {
    width: 235,
    marginLeft: 17,
    marginBottom: 12,
  },
  icon4Row: {
    height: 65,
    flexDirection: 'row',
    marginTop: 7,
    marginLeft: 7,
    marginRight: 5,
  },
  group3: {
    width: 322,
    height: 78,
    marginTop: 16,
    marginLeft: 17,
  },
  rect5: {
    width: 322,
    height: 78,
    backgroundColor: '#E6E6E6',
  },
  icon5: {
    color: 'rgba(213,116,79,1)',
    fontSize: 58,
  },
  text3: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    fontSize: 18,
  },
  electricalEnergy: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    marginTop: 3,
    marginLeft: 3,
  },
  text4: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    fontSize: 12,
  },
  today4173KWh3: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    fontSize: 12,
    marginLeft: 17,
  },
  text4Row: {
    height: 14,
    flexDirection: 'row',
    marginTop: 7,
    marginRight: 1,
  },
  text3Column: {
    width: 234,
    marginLeft: 16,
    marginBottom: 4,
  },
  icon5Row: {
    height: '100%',
    flexDirection: 'row',
    marginTop: 1,
    marginLeft: 1,
    marginRight: 4,
  },
  textSign: {
    fontFamily: 'avenirltstd-heavy',
    fontSize: 12,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 10,
    width: 80,
  },
  rect6: {
    top: 70,
    left: 60,
    width: 300,
    height: 200,
    position: 'absolute',
    backgroundColor: '#FFF',
  },
  icon6Row: {
    height: 46,
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 11,
    marginRight: 134,
  },
  icon7: {
    color: 'rgba(128,128,128,1)',
    fontSize: 40,
    height: 46,
    width: 40,
  },
  loremIpsum7: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    marginLeft: 33,
    marginTop: 18,
  },
  icon7Row: {
    height: 46,
    flexDirection: 'row',
    marginTop: 12,
    marginLeft: 8,
  },
  icon8: {
    color: 'rgba(128,128,128,1)',
    fontSize: 40,
    height: 46,
    width: 40,
    marginTop: 16,
  },
  loremIpsum9: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    marginLeft: 29,
    marginTop: 14,
  },
  icon8Row: {
    height: 46,
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 8,
  },
  button2Stack: {
    top: 0,
    left: 31,
    width: 300,
    height: 180,
    position: 'absolute',
  },
  centerButton: {
    // borderRadius: 6,
    height: 40,
    width: 85,
    // alignSelf: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    // elevation: 0
    // color: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 3,
  },
  centerButtonTitleStyle: {
    ...font.nunitoLightItalic,
    textAlign: 'center',
  },
});

export default Graph;
