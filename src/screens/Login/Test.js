import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';

import LoaderContext from 'context/LoaderContext';
import Feedbacklogo from 'assets/images/checklist-red.svg';
import {questions} from 'common/questions';

import {font} from 'config/config';
import api from 'api/Api';
import NavModal from 'common/NavModal';

const {width} = Dimensions.get('window');

const Test = props => {
  const loader = useContext(LoaderContext);
  const [response, setResponse] = useState([]);
  const [status, setStatus] = useState(false);
  let [disableBtn, setDisableBtn] = useState(false);
  const [backgroundColor, setbackgroundColor] = useState('rgba(112,179,73,1)');

  const handleSubmitButton = async () => {
    let inputData = {};
    inputData.api_name = 'add_checklist';
    inputData.data = {};
    inputData.data.client_id = 'Hablis';

    let outputResponse = [];
    response.map(item => {
      let outPut = {};
      if (item.value != null) {
        outPut.key = item.label;
        outPut.value = item.value;
        outputResponse.push(outPut);
      }
    });

    inputData.data.content = outputResponse;

    const result = await api.post('/api/genericApi', inputData);

    console.log(result);
    if (result.status) {
      Alert.alert(
        'Thermelgy',
        'Details Updated',
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
      props.navigation.navigate('Graph');
    }
  };

  const formatquestions = () => {
    let ques = [];
    for (let i = 0; i < questions.length; i++) {
      ques.push({label: questions[i].label, value: null, key: i + 1});
    }
    return ques;
  };
  useEffect(() => {
    //loader.setLoader(true);
    setResponse(formatquestions());
    //loader.setLoader(false);
  }, []);

  const resetResponse = () => {
    setResponse(formatquestions());
  };

  const updateResponse = (questionNo, ans) => {
    //setDisableBtn(true);
    // console.log(questionNo, ans);
    let upDated = response;
    upDated[questionNo].value = ans;
    setResponse([...upDated]);
    // console.log('output', response);
  };

  return (
    <View style={styles.container}>
      <NavModal
        exclude="feedback"
        navigation={props.navigation}
        open={status}
        onDismiss={() => setStatus(false)}
      />
      <ScrollView style={styles.scroll}>
        <View style={styles.rect}>
          <View style={styles.rect2}>
            {/* <ArrowBack width={30} height={32} /> */}
            <View style={styles.feedbackRow}>
              <Text style={styles.feedback}>Safe Check</Text>
            </View>

            <View style={styles.iconRow}>
              <TouchableOpacity
                onPress={() => {
                  //console.warn('onPress rect');
                  setStatus(true);
                }}>
                <Feedbacklogo width={26} height={30} />
              </TouchableOpacity>
            </View>
          </View>

          {response.map((item, index) => {
            return (
              <View style={styles.group}>
                <View style={styles.rect6}>
                  <View style={styles.loremIpsumRow}>
                    <Text style={styles.loremIpsum}>{index + 1}</Text>
                    <Text style={styles.text}>{item.label}?</Text>
                  </View>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        item.value === 'no'
                          ? {
                              backgroundColor: 'yellow',
                            }
                          : {},
                      ]}
                      onPress={() => updateResponse(index, 'no')}>
                      <Text style={styles.textSign}>No</Text>
                    </TouchableOpacity>
                    {/* style={[styles.button1,(disableBtn ? styles.button1 : styles.button11)]} */}
                    <TouchableOpacity
                      style={[
                        disableBtn ? styles.button1 : styles.button11,
                        item.value === 'yes'
                          ? {
                              backgroundColor: 'yellow',
                            }
                          : {},
                      ]}
                      onPress={() => updateResponse(index, 'yes')}
                      disabled={disableBtn}>
                      <Text style={styles.textSign}>Yes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.bottomrow}>
        <TouchableOpacity style={styles.button4} onPress={resetResponse}>
          <Text
            style={[
              styles.bottomSign,
              {
                color: '#000',
              },
            ]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button5} onPress={handleSubmitButton}>
          <Text
            style={[
              styles.bottomSign,
              {
                color: '#FFF',
              },
            ]}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(250,250,250,1)',
  },
  rect: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(220,215,215,1)',
  },
  scroll: {
    paddingBottom: 30,
  },
  rect2: {
    marginBottom: 15,
    width: '100%',
    height: 110,
    paddingTop: 20,
    backgroundColor: 'rgba(255,255,255,1)',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: 'row',
  },
  feedback: {
    ...font.nunitoRegular,
    color: '#121212',
    fontSize: 18,
    textAlignVertical: 'center',
    // width: 74,
    // height: 40,
    marginTop: 20,
    textAlign: 'center',
  },
  icon: {
    color: 'rgba(139,52,52,1)',
    fontSize: 40,
    height: 44,
    width: 33,
    marginLeft: 80,
  },
  feedbackRow: {
    flexDirection: 'row',
    flex: 2,
    paddingRight: 100,
    // paddingLeft: 100,
    justifyContent: 'flex-end',
    paddingBottom: 15,
  },
  group: {
    width: width,
    flexDirection: 'row',
    flex: 1,
    // height: '14%',
    backgroundColor: 'rgba(219,92,100,1)',
    marginTop: 10,
  },
  rect3: {
    width: 375,
    height: 148,
    backgroundColor: 'rgba(255,255,255,1)',
  },
  loremIpsum: {
    ...font.robotoRegular,
    color: '#121212',
  },
  text: {
    ...font.nunitoRegular,
    color: '#121212',
    marginLeft: 20,
  },
  loremIpsumRow: {
    // height: 38,
    flexDirection: 'row',
    marginTop: 26,
    marginLeft: 23,
    marginRight: 58,
  },
  button: {
    width: 100,
    height: 35,
    backgroundColor: 'rgba(219,92,100,1)',
  },
  button1: {
    width: 100,
    height: 35,
    backgroundColor: 'rgba(112,179,73,1)',
    marginLeft: 10,
  },
  button11: {
    width: 100,
    height: 35,
    backgroundColor: '#8FBC8F',
    marginLeft: 10,
  },
  bottomSign: {
    ...font.avenirHeavy,
    marginTop: 10,
    marginLeft: 70,
    fontSize: 17,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  buttonRow: {
    paddingBottom: 20,
    flexDirection: 'row',
    marginTop: 30,
    marginLeft: 51,
    marginRight: 102,
  },
  group2: {
    width: 375,
    height: 148,
    backgroundColor: 'rgba(219,92,100,1)',
    marginTop: 15,
  },
  rect4: {
    width: 375,
    height: 148,
    backgroundColor: 'rgba(255,255,255,1)',
  },
  text2: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    fontSize: 16,
    letterSpacing: 2,
  },
  text3: {
    ...font.nunitoRegular,
    color: '#121212',
    marginLeft: 11,
  },
  text2Row: {
    height: 20,
    flexDirection: 'row',
    marginTop: 26,
    marginLeft: 23,
    marginRight: 48,
  },
  textSign: {
    ...font.avenirHeavy,
    fontSize: 17,
    marginTop: 5,
    textAlign: 'center',
    alignItems: 'center',
  },
  button2: {
    width: 100,
    height: 40,
    backgroundColor: 'rgba(219,92,100,1)',
  },
  button3: {
    width: 100,
    height: 40,
    backgroundColor: 'rgba(112,179,73,1)',
    marginLeft: 22,
  },
  button2Row: {
    height: 40,
    flexDirection: 'row',
    marginTop: 39,
    marginLeft: 51,
    marginRight: 102,
  },
  group3: {
    width: 375,
    height: 148,
    backgroundColor: 'rgba(219,92,100,1)',
    marginTop: 15,
  },
  rect5: {
    width: 375,
    height: 148,
    backgroundColor: 'rgba(255,255,255,1)',
  },
  text4: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    fontSize: 16,
    letterSpacing: 2,
  },
  text5: {
    ...font.nunitoRegular,
    color: '#121212',
    marginLeft: 11,
  },
  text4Row: {
    height: 38,
    flexDirection: 'row',
    marginTop: 26,
    marginLeft: 23,
    marginRight: 63,
  },
  button4: {
    flexDirection: 'row',
    width: '50%',
    height: 50,
    backgroundColor: '#FFF',
    borderWidth: 0.5,
    borderColor: '#000',
  },
  button5: {
    flexDirection: 'row',
    width: '50%',
    height: 50,
    backgroundColor: 'rgba(112,179,73,1)',
    borderWidth: 0.5,
    borderColor: '#000',
  },
  button4Row: {
    height: 50,
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 51,
    marginRight: 102,
  },
  bottomrow: {
    flexDirection: 'row',
    height: 50,
  },
  group4: {
    width: 375,
    height: 148,
    backgroundColor: 'rgba(219,92,100,1)',
    marginTop: 12,
  },
  rect6: {
    width: width,
    // height: 300,
    backgroundColor: 'rgba(255,255,255,1)',
  },
  text6: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    fontSize: 16,
    letterSpacing: 2,
  },
  text7: {
    ...font.nunitoRegular,
    color: '#121212',
    marginLeft: 11,
  },
  text6Row: {
    height: 38,
    flexDirection: 'row',
    marginTop: 26,
    marginLeft: 23,
    marginRight: 70,
  },
  button6: {
    width: 100,
    height: 40,
    backgroundColor: 'rgba(219,92,100,1)',
  },
  button7: {
    width: 100,
    height: 40,
    backgroundColor: 'rgba(112,179,73,1)',
    marginLeft: 22,
  },
  button6Row: {
    height: 40,
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 51,
    marginRight: 102,
  },
  iconRow: {
    marginTop: 30,
    marginRight: 20,
  },
  rectTop3: {
    width: '100%',
    height: 220,
    justifyContent: 'center',
    marginTop: 3,
    marginLeft: 10,
    marginRight: 19,
  },
  rect66: {
    width: 300,
    height: 190,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
  },
  icon88Row: {
    height: 46,
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 8,
  },
  menuContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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

export default Test;
