import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  RefreshControl,
  Dimensions,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Button} from 'react-native-elements';
import {LineChart} from 'react-native-chart-kit';
import messaging from '@react-native-firebase/messaging';
import moment from 'moment';

import {DatabaseManager} from 'utilities/databaseManager';
import LoaderContext from 'context/LoaderContext';
import api from 'api/Api';
import generateEnergyPayload from 'utilities/helpers/generateEnergyPayload';
import NavModal from 'common/NavModal';
import Notifications from './Notifications';

import Graphone from 'assets/images/graphone.svg';
import Graphtwo from 'assets/images/graphtwo.svg';
import Graphthree from 'assets/images/graphthree.svg';
import Bellicon from 'assets/images/notification.svg';
import Bolt from 'assets/images/flash-white.svg';
import {font} from 'config/config';

const energyType = [
  {label: 'Energy', value: 'energy'},
  {label: 'Power', value: 'power'},
  {label: 'Current', value: 'current'},
  {label: 'Power Factor', value: 'power-factor'},
  {label: 'Voltage', value: 'voltage'},
];

function getLabel(item) {
  switch (item) {
    case 'energy':
      return 'kWh';
    case 'power':
      return 'kW';
    case 'current':
      return 'A';
    case 'power-factor':
      return 'Φ';
    case 'voltage':
      return 'V';
  }
}

function Graph(props) {
  const loader = useContext(LoaderContext);
  const [notification, setNotification] = useState(false);
  const [initialmachine, setInitialMachine] = useState([]);
  const [loading, setLoading] = useState(false);
  const [machine, setMachine] = useState([]);
  const [machineTypearr, setMachineTypeArr] = useState([]);
  const [machineType, setMachineType] = useState(null);
  const [machineIdArr, setMachineIdArr] = useState([]);
  const [machineId, setMachineId] = useState(null);
  const [buttonValue, setButtonValue] = useState('ea_hourly');
  const [status, setStatus] = useState(false);
  const [chartLabel, setChartLabel] = useState(['MON']);
  const [chartData, setChartData] = useState([1]);
  const [a1, setA1] = useState([]);
  const [a2, setA2] = useState(0);
  const [a3, setA3] = useState({});
  const machineTypeDropdown = React.useRef();
  const machineIdDropDown = React.useRef();
  const energyTypeDropDown = React.useRef();

  const [selectedEnergyType, setSelectedEnergyType] = useState('power');
  let yAxisInterval = 1;

  // API 1(Electricity Consumption)
  const electricityConsump = async () => {
    let payload = {
      api_name: 'card_data',
      data: {
        time_range: 'ea_daily',
        client_id: 'Hablis',
        machine_id: 'EBM',
        field: ['electricalEnergy'],
      },
    };
    const result = await api.post('/api/genericApi', payload);

    let localA1 = [];
    result.data.electricalEnergy.map((item, index) => {
      if (index < 2) {
        localA1.push(item);
      }
    });
    setA1(localA1);
  };

  // API 2(Machine Count)
  const machineCount = async () => {
    let payload = {
      api_name: 'machine_card',
      data: {
        client_name: 'Hablis',
      },
    };
    const result = await api.post('/api/genericApi', payload);
    setA2(result.total_machine_count);
  };
  // API 3(Chiller Performance)
  const chillerPer = async () => {
    let payload = {
      api_name: 'chiller_cards',
      data: {
        client_id: 'Hablis',
        time_range1: 'ea_daily',
        time_range2: 'daily',
        time_range3: 'hourly_secondary',
        machine_id1: 'CH170',
        machine_id2: 'CH01',
      },
    };

    const result = await api.post('/api/genericApi', payload);
    setA3(result.data);
  };

  function closeDropdowns(choice) {
    if (choice) {
      switch (choice) {
        case 'machineTypeDropdown':
          machineIdDropDown.current.close();
          energyTypeDropDown.current.close();
          break;
        case 'machineIdDropDown':
          machineTypeDropdown.current.close();
          energyTypeDropDown.current.close();
          break;
        case 'energyTypeDropDown':
          machineTypeDropdown.current.close();
          machineIdDropDown.current.close();
          break;
      }
    } else {
      machineTypeDropdown.current.close();
      machineIdDropDown.current.close();
      energyTypeDropDown.current.close();
    }
  }

  function subscribeToTopic() {
    messaging().subscribeToTopic('Hablis');
  }

  async function fetchDashboardData() {
    setLoading(true);
    try {
      await electricityConsump();
      await machineCount();
      await chillerPer();
    } catch (error) {}
    setLoading(false);
  }
  // API for Dashboard A1,A2,A3
  useEffect(() => {
    fetchDashboardData();
    subscribeToTopic();
  }, []);

  useEffect(() => {
    let machineIds = [];
    if (machineType != null) {
      machine[machineType].id.map((item, index) => {
        let machineIdobj = {};
        machineIdobj.label = item;
        machineIdobj.value = index;
        machineIds.push(machineIdobj);
      });
      setMachineIdArr(machineIds);
      setMachineId(0);
    }
  }, [machineType]);
  useEffect(() => {
    let machineArr = [],
      machineType = [];
    Object.keys(initialmachine).map(item => {
      let machineObj = {};
      machineObj.type = initialmachine[item].device.type;
      machineObj.id = initialmachine[item].device.id;
      machineArr.push(machineObj);
    });
    // console.log('Values', machineArr);
    if (machineArr.length > 0) {
      machineArr.map((item, index) => {
        let machineObj = {};
        if (index === 0) {
          setMachineType(machineObj.value);
        }
        machineObj.label = item.type;
        machineObj.value = index;
        machineType.push(machineObj);
      });

      setMachineTypeArr(machineType);
      setMachineType(0);
    }
    setMachine(machineArr);
  }, [initialmachine]);
  useEffect(() => {
    let userDetails, machineTypes;
    async function machineTypesFun() {
      userDetails = await DatabaseManager.fetchUserRecords();
      machineTypes = userDetails[0].machine_type;
      setInitialMachine(machineTypes);
    }
    machineTypesFun();
  }, []);
  const chartDataFun = async payload => {
    let label_chart = [],
      data_chart = [];
    const result = await api.post('/api/genericApi', payload);
    loader.setLoader(false);
    let outputResult = result.data.datasets[0].data;
    if (payload.data.time_range === 'ea_monthly') {
      outputResult.forEach((val, idx) => {
        label_chart.push(moment(val[0]).format('MMM').toUpperCase());
        data_chart.push(Number(val[1]) ? Number(val[1]) : 0);
      });
    } else if (payload.data.time_range === 'ea_daily') {
      outputResult.forEach((item, idx) => {
        if (idx < 7) {
          label_chart.push(moment(item[0]).format('ddd').toUpperCase());
          data_chart.push(Number(item[1]));
        }
      });
    } else {
      outputResult.reverse().forEach((item, idx) => {
        if (idx < 7) {
          label_chart.push(moment(item[0]).utc().format('HH:mm'));

          data_chart.push(Number(item[1]));
        }
      });
      label_chart = label_chart.reverse();
      data_chart = data_chart.reverse();
    }

    if (label_chart.length && data_chart.length) {
      setChartLabel(label_chart);
      setChartData(data_chart);
    }
  };

  useEffect(() => {
    closeDropdowns();
  }, [buttonValue, machineType, machineId, selectedEnergyType, status]);

  useEffect(() => {
    if (machineId != null && machineType != null) {
      console.log(
        machineIdArr[machineId].label,
        machineTypearr[machineType].label,
      );
      let payload = {
        data: {
          time_range: buttonValue,
          client_id: 'Hablis',
          machine_type: machineTypearr[machineType].label,
          machine_id: machineIdArr[machineId].label,
          threshold: 1,
        },
      };

      payload = generateEnergyPayload(payload, selectedEnergyType);

      chartDataFun(payload);
    } else {
      loader.setLoader(true);
      let payload = {
        data: {
          time_range: buttonValue,
          client_id: 'Hablis',
          machine_type: 'EB main',
          machine_id: 'EBM',
        },
      };
      payload = generateEnergyPayload(payload, selectedEnergyType);
      chartDataFun(payload);
    }
  }, [buttonValue, machineType, machineId, selectedEnergyType]);

  yAxisInterval = selectedEnergyType === 'power-factor' ? 0.3 : 1;

  return (
    <View style={styles.container}>
      {notification && (
        <Notifications
          notification={notification}
          setNotification={setNotification}
        />
      )}
      <NavModal
        exclude="graph"
        navigation={props.navigation}
        open={status}
        onDismiss={() => setStatus(false)}
      />
      <StatusBar backgroundColor="rgba(1,37,96,1)" barStyle="light-content" />
      <ScrollView
        style={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchDashboardData} />
        }>
        <View style={styles.rect}>
          <View style={styles.thermelgyRow}>
            <Text style={styles.title}>tMY Smart Energy</Text>
            <View style={styles.iconContainer}>
              <Bellicon
                style={styles.icon}
                onPress={() => setNotification(true)}
              />
              <Bolt
                style={styles.icon2}
                onPress={() => {
                  setStatus(true);
                }}
              />
            </View>
          </View>

          <View style={styles.pickerRow}>
            <DropDownPicker
              containerStyle={{height: 35}}
              onOpen={() => closeDropdowns('machineTypeDropdown')}
              controller={instance => (machineTypeDropdown.current = instance)}
              style={[styles.button4Row, {width: 110}]}
              labelStyle={styles.labelStyle}
              itemStyle={styles.itemStyle}
              items={machineTypearr}
              placeholder="Machine Type"
              // onChangeItem={item => {
              //   setMachineType(item.value),
              //     setMachineId(null),
              //     setMachineIdArr([]);
              // }}
              onChangeItem={item => {
                setMachineType(item.value);
                setMachineId(null);
              }}
              defaultValue={machineType}
            />
            <DropDownPicker
              style={[styles.button4Row, {width: 110}]}
              onOpen={() => closeDropdowns('machineIdDropDown')}
              controller={instance => (machineIdDropDown.current = instance)}
              containerStyle={{height: 35}}
              labelStyle={styles.labelStyle}
              items={machineIdArr}
              placeholder="Machine Id"
              defaultValue={machineId}
              onChangeItem={item => setMachineId(item.value)}
            />
            <DropDownPicker
              arrowColor="white"
              onOpen={() => closeDropdowns('energyTypeDropDown')}
              controller={instance => (energyTypeDropDown.current = instance)}
              containerStyle={{height: 35}}
              style={[styles.button4Row, styles.energyDropdown]}
              labelStyle={styles.labelStyle}
              items={energyType}
              defaultValue={selectedEnergyType}
              onChangeItem={item => {
                setSelectedEnergyType(item.value);
              }}
              // style={[styles.button4Row, styles.energyDropdown, {zIndex: 10}]}
            />
          </View>
          <View>
            {/* <Text style={styles.ipsum}>{overallConsumption} kWh</Text> */}
            <Text style={styles.overallConsumption} />
            <Text style={styles.overallConsumption}>
              {energyType.find(v => v.value === selectedEnergyType).label} - ({' '}
              {getLabel(selectedEnergyType)} )
            </Text>
            <LineChart
              data={{
                labels: chartLabel,
                datasets: [
                  {
                    data: chartData,
                  },
                ],
              }}
              width={Dimensions.get('window').width} // from react-native
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              yAxisInterval={yAxisInterval} // optional, defaults to 1
              withVerticalLines={false}
              withHorizontalLines={false}
              chartConfig={{
                useShadowColorFromDataset: false,
                withInnerLines: false,
                withOuterLines: false,
                withVerticalLines: true,
                withHorizontalLines: true,
                backgroundColor: '#012560',
                backgroundGradientFrom: '#012560',
                backgroundGradientTo: '#012560',
                decimalPlaces:
                  buttonValue === 'ea_monthly' &&
                  selectedEnergyType !== 'power-factor'
                    ? 0
                    : 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                withShadow: false,
                fillShadowGradient: '#FFF',

                propsForDots: {
                  r: '5',
                  strokeWidth: '5',
                  stroke: '#FFFFFF',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
          <View style={styles.button5Row}>
            <Button
              title="Hourly"
              onPress={() => setButtonValue('ea_hourly')}
              titleStyle={[
                styles.centerButtonTitleStyle,
                buttonValue === 'ea_hourly' ? styles.selectedTitle : {},
              ]}
              buttonStyle={[
                styles.centerButton,
                buttonValue === 'ea_hourly' ? styles.selectedButton : {},
              ]}
            />

            <Button
              title="Daily"
              onPress={() => setButtonValue('ea_daily')}
              titleStyle={[
                styles.centerButtonTitleStyle,
                buttonValue === 'ea_daily' ? styles.selectedTitle : {},
              ]}
              buttonStyle={[
                styles.centerButton,
                buttonValue === 'ea_daily' ? styles.selectedButton : {},
              ]}
            />
            <Button
              title="Monthly"
              onPress={() => setButtonValue('ea_monthly')}
              titleStyle={[
                styles.centerButtonTitleStyle,
                buttonValue === 'ea_monthly' ? styles.selectedTitle : {},
              ]}
              buttonStyle={[
                styles.centerButton,
                buttonValue === 'ea_monthly' ? styles.selectedButton : {},
              ]}
            />
          </View>
          {/* <View style={styles.button5Row}>
          <TouchableOpacity style={styles.button5}>
          <Text style={[styles.textSign, {
                                        color: '#000'
                                    }]}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button6}>
          <Text style={[styles.textSign, {
                                        color: '#000'
                                    }]}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button7}>
          <Text style={[styles.textSign, {
                                        color: '#000'
                                    }]}>Yearly</Text>
          </TouchableOpacity>
        </View> */}
          <View style={styles.rect2}>
            <View style={styles.group}>
              <View style={styles.rect3}>
                <View style={styles.icon5Row}>
                  <Graphone style={styles.icon3} />
                  <View style={styles.loremIpsumColumn}>
                    <Text style={styles.loremIpsum}>
                      Total Electrical Consumption
                    </Text>
                    {a1.length > 1 && (
                      <View style={styles.loremIpsum3Row}>
                        <Text style={styles.loremIpsum3}>
                          Today ( as of now ) - {a1[0]} kWh
                          {'\n'}Yesterday - {a1[1]} kWh
                        </Text>
                        {/* <Text style={styles.today4173KWh}>
                            Today - {a1[1]} kWh
                          </Text> */}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                borderBottomWidth: 0.5,
                backgroundColor: '#FFFFFF50',
                height: 2,
                marginLeft: 10,
                marginRight: 10,
                width: '95%',
              }}
            />
            <View style={styles.group}>
              <View style={styles.rect4}>
                <View style={styles.icon5Row}>
                  <Graphtwo style={styles.icon3} />
                  <View style={styles.loremIpsum}>
                    <Text style={styles.text}>Total Machine Count</Text>
                    <Text style={styles.text2}>{a2}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                borderBottomWidth: 0.5,
                backgroundColor: '#FFFFFF50',
                height: 2,
                marginLeft: 10,
                marginRight: 10,
                width: '95%',
              }}
            />
            {a3 && (
              <View style={styles.group}>
                <View style={styles.rect5}>
                  <View style={styles.icon5Row}>
                    <Graphthree style={styles.icon3} />
                    <View style={styles.loremIpsum}>
                      <Text style={styles.text3}>Chiller Performance Data</Text>
                      <Text style={styles.electricalEnergy}>
                        Electrical Energy -{' '}
                        {Math.round(a3.ChillerElectricalEnergyDaily)} kWh
                      </Text>
                      <View style={styles.text4Row}>
                        <Text style={styles.text4}>
                          Total Load - {Math.round(a3.DayTotalLoad)} TR
                        </Text>
                        <Text style={styles.today4173KWh3}>
                          ikW/TR - {a3.DayPerformance}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

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
    height: 24,
    width: 28,
    marginTop: 2,
  },
  scroll: {
    backgroundColor: 'rgba(1,37,96,1)',
  },
  icon2: {
    color: 'rgba(254,254,254,1)',
    fontSize: 40,
    height: 24,
    width: 28,
    marginLeft: 16,
  },
  tinyLogo: {},
  title: {
    ...font.nunitoRegular,
    fontSize: 20,
    color: 'white',
    textAlignVertical: 'center',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  thermelgyRow: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    marginTop: 50,
    paddingHorizontal: 20,
    marginRight: 11,
    alignContent: 'center',
    display: 'flex',
    justifyContent: 'space-between',
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
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    height: 30,
    width: '100%',
    marginTop: 33,
    // marginRight: 19,
  },
  labelStyle: {
    fontSize: 10,
    color: 'black',
  },
  button4Row: {
    height: 600,
    width: 110,
    backgroundColor: '#FFF',
    paddingLeft: 5,
    paddingTop: 0,
    paddingBottom: 0,
  },
  energyDropdown: {
    backgroundColor: '#D63535',
    width: 110,
  },
  ipsum: {
    ...font.nunitoExtraBoldItalic,
    color: 'rgba(255,255,255,1)',
    fontSize: 24,
    marginTop: 40,
    marginLeft: 20,
  },
  overallConsumption: {
    ...font.nunitoRegular,
    color: 'rgba(255,255,255,1)',
    marginTop: 5,
    marginBottom: 10,
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
    paddingBottom: 20,
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
    marginTop: 20,
    marginLeft: 5,
    paddingBottom: 50,
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
    ...font.nunitoSemiBold,
    color: '#012560',
    fontSize: 14,
    marginLeft: 5,
    marginTop: 10,
  },
  loremIpsum3: {
    ...font.nunitoBold,
    color: '#000000',
    fontSize: 15,
    marginLeft: 5,
  },
  today4173KWh: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loremIpsum3Row: {
    flexDirection: 'column',
    marginTop: 10,
    display: 'flex',
  },
  loremIpsumColumn: {
    width: '100%',
    marginBottom: 0,
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
    height: 90,
    backgroundColor: '#E6E6E6',
  },
  icon4: {
    color: 'rgba(82,101,155,1)',
    fontSize: 58,
  },
  text: {
    ...font.nunitoSemiBold,
    color: '#012560',
    fontSize: 14,
  },
  text2: {
    ...font.nunitoBoldItalic,
    color: '#121212',
    fontSize: 15,
    marginTop: 5,
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
    height: 90,
    backgroundColor: '#E6E6E6',
  },
  icon5: {
    color: 'rgba(213,116,79,1)',
    fontSize: 58,
  },
  text3: {
    ...font.nunitoSemiBold,
    color: '#012560',
    fontSize: 14,
  },
  electricalEnergy: {
    ...font.nunitoExtraBold,
    color: '#121212',
    marginTop: 15,
    marginLeft: 3,
    fontSize: 13,
  },
  text4: {
    ...font.nunitoExtraBold,
    color: '#121212',
    fontSize: 13,
  },
  today4173KWh3: {
    ...font.nunitoExtraBold,
    color: '#121212',
    fontSize: 13,
    marginLeft: 10,
  },
  text4Row: {
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
    width: 320,
    height: 200,
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingLeft: 20,
    paddingTop: 5,
  },
  menuContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginLeft: 20,
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
    marginLeft: 20,
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
  selectedButton: {
    backgroundColor: 'white',
  },
  selectedTitle: {
    color: '#012560',
  },
  centerButtonTitleStyle: {
    fontFamily: 'Nuntio-LightItalic',
    textAlign: 'center',
  },
});

export default Graph;
