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
import moment from 'moment';

import Notifications from 'screens/Dashboard/Notifications';
import Graphthree from 'assets/images/graphthree.svg';
import Bellicon from 'assets/images/notification.svg';
import ChillerSvg from 'assets/images/MachinesWhite.svg';
import {DatabaseManager} from 'utilities/databaseManager';
import LoaderContext from 'context/LoaderContext';
import api from 'api/Api';
import NavModal from 'common/NavModal';
import generateChillerPayload, {
  generateChartForChiller,
} from 'utilities/helpers/generateChillerPayload';
import {font} from 'config/config';

const subParamItems = {
  approach: [
    {label: 'Cond & Evap', value: 'cond_evap'},
    {label: 'Approach-C.T.', value: 'ct'},
  ],
  chiller_perf: [
    {label: 'Chiller Performance', value: 'perf'},
    {label: 'Chilled Water Deliver', value: 'cw_delivery'},
  ],
  ct_perf: [
    {label: 'Cooling Tower Efficiency', value: 'perf'},
    {label: 'Evaporation Loss & Blowdown', value: 'evap'},
  ],
  heat_pump: [
    {label: 'Input & Output Energy', value: 'io_energy'},
    {label: 'Heat Pump COP', value: 'cop'},
  ],
};

function Chiller(props) {
  const loader = useContext(LoaderContext);
  const [initialmachine, setInitialMachine] = useState([]);
  const [performanceParam, setPerformanceParam] = useState('cond_evap');
  const [loading, setLoading] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState(null);
  const [machine, setMachine] = useState([]);
  const [machineTypearr, setMachineTypeArr] = useState([]);
  const [machineType, setMachineType] = useState(null);
  const [machineIdArr, setMachineIdArr] = useState([]);
  const [machineId, setMachineId] = useState(null);
  const [buttonValue, setButtonValue] = useState('approach');
  const [status, setStatus] = useState(false);
  const [chartLabel, setChartLabel] = useState(['MON']);
  const [chartData, setChartData] = useState([
    {
      data: [1],
    },
  ]);
  const [chartLegends, setChartLegends] = useState([]);
  const [notification, setNotification] = React.useState(false);
  const [a1, setA1] = useState([]);
  const [a2, setA2] = useState(0);
  const [a3, setA3] = useState({});
  const machineIdDropDown = React.useRef();
  const energyParamDropDown = React.useRef();
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

  const closeDropdowns = except => {
    if (except) {
      if (except === 'energyParamDropDown') {
        machineIdDropDown.current.close();
      } else {
        energyParamDropDown.current.close();
      }
    } else {
      machineIdDropDown.current.close();
      energyParamDropDown.current.close();
    }
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

  console.log('machineId---> ', machineId);

  const getDeviceStatus = async () => {
    const payload = {
      api_name: 'realtime',
      data: {
        time_range: 'minute',
        client_id: 'Hablis',
        machine_id: 'CH01',
      },
    };
    const result = await api.post('/api/genericApi', payload);
    setDeviceStatus(result.data[0].Trane_Chiller.ChillerRunStat);
  };

  const fetchHeatPumpData = param => {
    if (loading) {
      return;
    }
    setButtonValue(param);
    fetchChartData();
  };

  const setPerformanceParamType = param => {
    if (loading) {
      return;
    }
    setButtonValue(param);
    setPerformanceParam(subParamItems[param][0].value);
    fetchChartData();
  };

  const renderDeviceStatus = status => {
    switch (status) {
      case 0:
        return (
          <Text
            style={[
              styles.status,
              {
                shadowColor: '#F9335B',
                backgroundColor: '#F9335B',
              },
            ]}>
            NOT RUNNING
          </Text>
        );
      case 1:
        return (
          <Text
            style={[
              styles.status,
              {
                shadowColor: '#3BD91A',
                backgroundColor: '#3BD91A',
              },
            ]}>
            STARTING
          </Text>
        );
      case 2:
        return (
          <Text
            style={[
              styles.status,
              {
                shadowColor: '#3BD91A',
                backgroundColor: '#3BD91A',
              },
            ]}>
            RUNNING
          </Text>
        );
      case 3:
        return (
          <Text
            style={[
              styles.status,
              {
                shadowColor: '#F9335B',
                backgroundColor: '#F9335B',
              },
            ]}>
            STOPPED
          </Text>
        );
      default:
        return (
          <Text
            style={[
              styles.status,
              {
                shadowColor: '#F9335B',
                backgroundColor: '#F9335B',
              },
            ]}>
            NOT RUNNING
          </Text>
        );
    }
  };

  const renderNotation = item => {
    switch (item) {
      case 'approach-cond_evap':
        return '°C';
      case 'approach-ct':
        return '°C';
      case 'chiller_perf-perf':
        return 'ikW/TR';
      case 'chiller_perf-cw_delivery':
        return '°C';
      case 'ct_perf-perf':
        return 'μ';
      case 'ct_perf-evap':
        return 'm³/h';
      case 'hourly-cop':
      case 'daily-cop':
      case 'monthly-cop':
        return 'COP';
      case 'hourly-io_energy':
      case 'daily-io_energy':
      case 'monthly-io_energy':
        return 'kWh';
    }
  };

  const fetchChartData = async () => {
    setLoading(true);
    loader.setLoader(true);
    const payload = generateChillerPayload(
      `${buttonValue}-${performanceParam}`,
    );
    console.log('processed-payload---> ', payload);
    const result = await api.post('/api/genericApi', payload);
    console.log('result---> ', result);
    const data = generateChartForChiller(result.data, buttonValue);

    setChartLegends(data.legend);
    setChartLabel(data.labels);
    setChartData(data.datasets);
    loader.setLoader(false);
    setTimeout(() => setLoading(false), 1000);
  };

  async function fetchDashboardData() {
    setLoading(true);
    // await electricityConsump();
    // await machineCount();
    await chillerPer();
    await fetchChartData();
    setLoading(false);
  }

  useEffect(() => {
    closeDropdowns();
  }, [status]);
  // API for Dashboard A1,A2,A3
  useEffect(() => {
    fetchChartData();
    fetchDashboardData();
    const deviceStatusInterval = setInterval(() => {
      getDeviceStatus();
    }, 5000);

    return () => {
      clearInterval(deviceStatusInterval);
    };
  }, []);

  useEffect(() => {
    closeDropdowns();
    fetchChartData();
  }, [performanceParam]);

  useEffect(() => {
    let machineIds = [];
    if (machineType != null) {
      machine[4].id.map((item, index) => {
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

  console.log('machineIdArr--> ', machineIdArr);

  return (
    <View style={styles.container}>
      {notification && (
        <Notifications
          notification={notification}
          setNotification={setNotification}
        />
      )}
      <NavModal
        exclude="chiller"
        navigation={props.navigation}
        open={status}
        onDismiss={() => setStatus(false)}
      />
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchDashboardData} />
        }>
        <View style={styles.rect}>
          <View style={styles.thermelgyRow}>
            {/* <Text style={styles.thermelgy}>THERMELGY</Text> */}
            <Text style={styles.title}>Machines</Text>
            <View style={styles.iconContainer}>
              <Bellicon
                style={styles.icon}
                onPress={() => setNotification(true)}
              />
              <ChillerSvg
                style={styles.icon2}
                onPress={() => {
                  //console.warn('onPress rect');
                  setStatus(true);
                }}
              />
            </View>
          </View>

          <View style={styles.pickerRow}>
            <DropDownPicker
              controller={instance => (machineIdDropDown.current = instance)}
              onOpen={() => closeDropdowns('machineIdDropDown')}
              style={[styles.button4Row, {width: 130}]}
              containerStyle={{height: 35}}
              labelStyle={styles.labelStyle}
              items={[...machineIdArr, {label: 'Heat pump', value: 1}]}
              placeholder="Machine Id"
              defaultValue={machineId}
              onChangeItem={item => {
                setMachineId(item.value);
                if (item.value === 1) {
                  setButtonValue('hourly');
                  setPerformanceParam('io_energy');
                } else {
                  setButtonValue('approach');
                  setPerformanceParam('cond_evap');
                }
              }}
            />
            <DropDownPicker
              style={[styles.button4Row, {width: 200}]}
              onOpen={() => closeDropdowns('energyParamDropDown')}
              controller={instance => (energyParamDropDown.current = instance)}
              containerStyle={{height: 35}}
              labelStyle={styles.labelStyle}
              items={
                machineId === 1
                  ? subParamItems.heat_pump
                  : subParamItems[buttonValue] || subParamItems.approach
              }
              defaultValue={performanceParam}
              onChangeItem={item => {
                if (!loading) {
                  setPerformanceParam(item.value);
                }
              }}
            />
          </View>
          <View
            style={{
              height: 300,
            }}>
            <View style={styles.dataPointContainer}>
              <Text style={styles.fieldText}>
                {renderNotation(`${buttonValue}-${performanceParam}`)}
              </Text>
              <View style={styles.statusContainer}>
                {renderDeviceStatus(deviceStatus)}
              </View>
            </View>
            {/* <Text style={styles.overallConsumption} /> */}
            {!loading && chartData.length === chartLegends.length && (
              <LineChart
                data={{
                  datasets: chartData,
                  labels: chartLabel,
                  legend: chartLegends,
                }}
                width={Dimensions.get('window').width} // from react-native
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                hideLegend={false}
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
                  decimalPlaces: 2, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  withShadow: false,
                  fillShadowGradient: '#FFF',

                  propsForDots: {
                    r: '3',
                    strokeWidth: '3',
                    stroke: '#FFFFFF',
                  },
                }}
                bezier
                style={{
                  marginLeft: -10,
                  // marginVertical: 8,
                  // borderRadius: 16,
                }}
              />
            )}
          </View>
          {machineId === 0 ? (
            <View style={styles.button5Row}>
              <Button
                title="Approach"
                onPress={() => setPerformanceParamType('approach')}
                titleStyle={[
                  styles.centerButtonTitleStyle,
                  buttonValue === 'approach' ? styles.selectedTitle : {},
                ]}
                buttonStyle={[
                  styles.centerButton,
                  buttonValue === 'approach' ? styles.selectedButton : {},
                ]}
              />

              <Button
                title="Chiller Perf."
                onPress={() => setPerformanceParamType('chiller_perf')}
                titleStyle={[
                  styles.centerButtonTitleStyle,
                  buttonValue === 'chiller_perf' ? styles.selectedTitle : {},
                ]}
                buttonStyle={[
                  styles.centerButton,
                  buttonValue === 'chiller_perf' ? styles.selectedButton : {},
                ]}
              />
              <Button
                title="C.T Perf."
                onPress={() => setPerformanceParamType('ct_perf')}
                titleStyle={[
                  styles.centerButtonTitleStyle,
                  buttonValue === 'ct_perf' ? styles.selectedTitle : {},
                ]}
                buttonStyle={[
                  styles.centerButton,
                  buttonValue === 'ct_perf' ? styles.selectedButton : {},
                ]}
              />
            </View>
          ) : (
            <View style={styles.button5Row}>
              <Button
                title="Hourly"
                onPress={() => fetchHeatPumpData('hourly')}
                titleStyle={[
                  styles.centerButtonTitleStyle,
                  buttonValue === 'hourly' ? styles.selectedTitle : {},
                ]}
                buttonStyle={[
                  styles.centerButton,
                  buttonValue === 'hourly' ? styles.selectedButton : {},
                ]}
              />

              <Button
                title="Daily"
                onPress={() => fetchHeatPumpData('daily')}
                titleStyle={[
                  styles.centerButtonTitleStyle,
                  buttonValue === 'daily' ? styles.selectedTitle : {},
                ]}
                buttonStyle={[
                  styles.centerButton,
                  buttonValue === 'daily' ? styles.selectedButton : {},
                ]}
              />
              <Button
                title="Monthly"
                onPress={() => fetchHeatPumpData('monthly')}
                titleStyle={[
                  styles.centerButtonTitleStyle,
                  buttonValue === 'monthly' ? styles.selectedTitle : {},
                ]}
                buttonStyle={[
                  styles.centerButton,
                  buttonValue === 'monthly' ? styles.selectedButton : {},
                ]}
              />
            </View>
          )}
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
          <View
            style={{
              height: 300,
              backgroundColor: 'white',
            }}
          />
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
  dataPointContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fieldText: {
    color: 'white',
    alignSelf: 'flex-start',
    paddingRight: 20,
    marginTop: 25,
    marginLeft: 25,
    marginBottom: 10,
    fontSize: 20,
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
  status: {
    fontSize: 10,
    width: 100,
    textAlign: 'center',
    color: 'white',
    paddingVertical: 5,
    paddingHorizontal: 13,
    borderRadius: 50,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusContainer: {
    display: 'flex',
    zIndex: -1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 20,
    marginTop: 25,
    marginBottom: 10,
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
    height: 40,
    flexDirection: 'row',
    marginTop: 50,
    marginLeft: 22,
    marginRight: 39,
    justifyContent: 'space-between',
  },
  rect2: {
    height: 500,
    // height: 200,
    // backgroundColor: '#E6E6E6',
    backgroundColor: 'white',
    shadowColor: 'rgba(0,0,0,1)',
    paddingBottom: 20,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
    height: '100%',
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
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
    backgroundColor: 'white',
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
    width: 95,
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

export default Chiller;
