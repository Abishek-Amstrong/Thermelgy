import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {useState, useContext, useRef} from 'react';
import {commonStyles} from '../../styles/Style';
import {DatabaseManager} from '../../utilities/databaseManager';
import {colors} from 'react-native-elements';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
// import emailLogo from "../../assets/images/login/lock.svg";
// import lockLogo from "../../assets/images/login/homelock.svg";
import Emaillogo from '../../assets/images/email.svg';
// import BackGround from '../../assets/images/mask.svg';
import Locklogo from '../../assets/images/lock.svg';
import routes from '../../navigation/routes';
const {width, height} = Dimensions.get('window');
import api from '../../api/Api';
import {Alert} from 'react-native';
import { font } from 'config/config';

const Login = props => {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [disableBtn, setDisableBtn] = useState(true);
  const [userFocus, setUserFocus] = useState(0);
  const [passwordFocus, setPasswordFocus] = useState(0);
  const [data, setData] = React.useState({
    email: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });
  const handleSubmitButton = () => {
    console.log('received...!');
    props.navigation.navigate(routes.safety);
  };

  const handleSubmitPress = async () => {
    if (!email) {
      setUserFocus(2);
      return;
    }
    if (!password) {
      setPasswordFocus(2);
      return;
    }
    //props.navigation.navigate('Graph')

    let payload = {
      api_name: 'login',
      data: {
        client_name: 'Hablis',
        password: password,
        email: email,
      },
    };
    console.log('PayLoad', payload);

    try {
      setDisableBtn(true);
      const result = await api.post('/api/genericApi', payload);

      if (result.status) {
        Object.keys(result.data).forEach(key => {
          console.log(
            'checking out key-value map----> ',
            key,
            result.data[key],
          );
        });
        await DatabaseManager.deleteUserRecords();
        await DatabaseManager.insertUserRecords({...result.data});
        const userDetails = await DatabaseManager.fetchUserRecords();
        // NOTE: db records throwing error
        console.log('Db records ------>', userDetails);
        setDisableBtn(false);
        props.navigation.navigate(routes.graph);
      } else {
        setUserFocus(2);
        setPasswordFocus(2);
        Alert.alert(
          'Thermelgy',
          'Invalid login credentials',
          [
            {
              text: 'OK',
              onPress: async () => {
                props.navigation.navigate('Home');
              },
            },
          ],
          {cancelable: false},
        );
      }
      setDisableBtn(false);
    } catch (err) {
      console.log('error out ---> ', err);
      setUserFocus(2);
      setPasswordFocus(2);
      setDisableBtn(false);
    }
  };
  const checkStatus = (field, state) => {
    if (field === 'email') {
      setUserFocus(state);
    }
    if (field === 'password') {
      setPasswordFocus(state);
    }
    if (email && password) {
      setDisableBtn(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* <BackGround style={styles.imagebg}>

      </BackGround> */}
      <ImageBackground
        source={require('../../assets/images/mask.png')}
        style={styles.imagebg}>
        <View style={styles.rect}>
          <ScrollView style={styles.scroll}>
            {/* <Text style={styles.thermalagy}>THERMALAGY</Text> */}
            {/* <LogoHome width={48} height={48} fill="#000" /> */}
            <Image
              style={styles.tinyLogo}
              source={require('../../assets/images/login/homelogo.png')}
            />
            <View style={styles.rect2}>
              <View style={styles.iconRow}>
                <Emaillogo width={30} height={30} style={{bottom: 10}} />
                <TextInput
                  placeholder="Email"
                  keyboardType="email-address"
                  onFocus={() => checkStatus('email', 1)}
                  onBlur={() => checkStatus('email', 0)}
                  onKeyPress={() => checkStatus('email', 0)}
                  autoCapitalize="none"
                  onChangeText={setEmail}
                  style={styles.placeholder}
                />
              </View>
              <View
                style={{
                  backgroundColor: 'black',
                  height: 0.5,
                  width: '90%',
                  bottom: 5,
                }}
              />
              <View style={styles.icon2Row}>
                <Locklogo width={30} height={30} />
                <TextInput
                  secureTextEntry={data.secureTextEntry}
                  placeholder="Password"
                  onFocus={() => checkStatus('password', 1)}
                  onBlur={() => checkStatus('password', 0)}
                  onKeyPress={() => checkStatus('', 0)}
                  autoCapitalize="none"
                  onChangeText={setPassword}
                  style={styles.textInput}
                />
              </View>
            </View>

            <Text style={styles.forgotPassword}>Forgot Password?</Text>

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleSubmitPress}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#fff',
                  },
                ]}>
                Sign In
              </Text>
            </TouchableOpacity>
            <Text style={styles.versionText}>Version 0.5</Text>
          </ScrollView>
        </View>

        <View style={styles.undefined} />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  versionText: {
    color: '#121212',
    marginTop: 50,
    textAlign: 'center',
    fontSize: 16,
    textAlignVertical: 'bottom',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imagebg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: width,
    height: height,
  },
  rect: {
    top: 0,
    left: 0,
    width: width,
    height: height,
    // position: "absolute",
    // backgroundColor: 'rgba(255,255,255,1)',
  },
  thermalagy: {
    fontFamily: 'roboto-700',
    color: '#121212',
    fontSize: 22,
    marginTop: 214,
    marginLeft: 115,
  },
  rect2: {
    alignItems: 'center',
    width: '75%',
    height: 150,
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 9,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },

    elevation: 5,
    shadowOpacity: 0.31,
    shadowRadius: 0,
    marginTop: 80,
    marginLeft: 50,
  },
  icon: {
    height: 50,
    width: 50,
    marginTop: 10,
  },
  placeholder: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    height: '100%',
    width: 175,
    marginLeft: 20,
    marginTop: -15,
    // bottom: 10,
  },
  iconRow: {
    height: 49,
    flexDirection: 'row',
    marginTop: 33,
    marginLeft: 30,
    marginRight: 34,
  },
  icon2: {
    color: 'rgba(0,0,0,1)',
    fontSize: 33,
    height: 36,
    width: 29,
    marginTop: 7,
  },
  textInput: {
    ...font.nunitoRegular,
    color: '#121212',
    height: 49,
    width: 175,
    marginLeft: 20,
    bottom: 5,
  },
  icon2Row: {
    marginTop: 12,
    height: 40,
    flexDirection: 'row',
    marginLeft: 25,
    marginRight: 34,
  },
  forgotPassword: {
    ...font.nunitoRegular,
    color: 'rgba(0,0,0,1)',
    marginTop: 21,
    textAlign: 'right',
    paddingRight: 35,
  },
  button: {
    color: 'red',
    marginTop: 20,
    padding: 20,
    backgroundColor: 'green',
  },
  tinyLogo: {
    marginTop: 150,
    width: '80%',
    alignSelf: 'center',
    height: 70,

    alignItems: 'center',
  },
  loginBtn: {
    marginLeft: 50,
    marginRight: 50,
    marginTop: 30,
    width: '75%',
    backgroundColor: '#012560',
    borderRadius: 10,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSign: {
    fontFamily: 'avenirltstd-heavy',
    fontSize: 17,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  undefined: {},
});

export default Login;
