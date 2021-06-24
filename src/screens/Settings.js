import React, {useState, useReducer, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Button} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AS from '@react-native-community/async-storage';
import Toast from 'react-native-easy-toast';

import api from 'api/Api';
import routes from 'navigation/routes';
import {font, storageItems} from 'config/config';
import NavModal from 'common/NavModal';
import {
  chiller as chillerData,
  heatPump as heatPumpData,
} from 'common/settingsData';

const chillerOptions = Object.keys(chillerData).map(v => ({
  label: String(v),
  value: String(v),
}));
const heatPumpOptions = Object.keys(heatPumpData).map(v => ({
  label: String(v),
  value: String(v),
}));

function Settings({navigation}) {
  const [options, setOptions] = useState({});
  const [modal, setModal] = useState(false);
  const [tab, setActiveTab] = React.useState('heat');
  const [loading, setLoading] = useState(false);
  const [chiller, setChiller] = useState('1');
  const [heatPump, setHeatPump] = useState('1');
  const toast = useRef(null);
  const [selected, setSelected] = useReducer(
    (initialState, updatedState) => ({...initialState, ...updatedState}),
    {
      room_type: null,
      room_no: null,
    },
  );

  const fetchDropDownOptions = async () => {
    setLoading(true);
    const result = await api.post('/api/genericApi', {
      api_name: 'getroomtypes',
    });
    setOptions({...result.data});
    const selectedValues = await AS.getItem(storageItems.roomOptions);
    setSelected(JSON.parse(selectedValues));
    setLoading(false);
  };

  const updateRoomTypeAndNumber = async () => {
    setLoading(true);
    if (selected.room_type && selected.room_no) {
      const payload = {
        api_name: 'setroomconfig',
        data: {
          client_id: 'Hablis',
          machine_id: 'IAQ01',
          room_type: selected.room_type,
          room_no: selected.room_no,
        },
      };
      await api.post('/api/genericApi', payload);
      toast.current.show('configuration updated!');
      await AS.setItem(storageItems.roomOptions, JSON.stringify(selected));
      navigation.navigate(routes.safety);
    } else {
      toast.current.show('selected both room type and number!');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDropDownOptions();
  }, []);

  const roomOneOptions = Object.keys(options)?.map(v => ({label: v, value: v}));
  const roomTwoOptions = options[selected.room_type]?.map(v => ({
    label: v,
    value: v,
  }));

  const renderContent = type => {
    switch (type) {
      case 'iaq':
        return (
          <>
            <View style={styles.optionContainer}>
              <View style={styles.dropDownContainer}>
                <Text style={styles.dropDownLabel}>Room Type</Text>
                <DropDownPicker
                  containerStyle={{height: 50}}
                  disabled={loading}
                  defaultValue={selected.room_type}
                  onChangeItem={({value}) =>
                    setSelected({room_type: value, room_no: null})
                  }
                  items={roomOneOptions || []}
                />
              </View>
              <View style={[styles.dropDownContainer, {paddingBottom: 100}]}>
                <Text style={styles.dropDownLabel}>Room</Text>
                <DropDownPicker
                  containerStyle={{height: 50}}
                  defaultValue={selected.room_no}
                  disabled={loading}
                  onChangeItem={({value}) => setSelected({room_no: value})}
                  items={roomTwoOptions || []}
                />
              </View>
            </View>
            <Button
              color="#70B349"
              mode="contained"
              disabled={loading}
              onPress={updateRoomTypeAndNumber}
              style={styles.button}
              labelStyle={styles.buttonLabel}>
              Sense
            </Button>
          </>
        );

      case 'heat':
        return (
          <View style={styles.optionContainer}>
            <View style={styles.dropDownContainer}>
              <Text style={styles.dropDownLabel}>Machine ID</Text>
              <DropDownPicker
                containerStyle={{height: 50}}
                defaultValue={heatPump}
                onChangeItem={opt => setHeatPump(opt.value)}
                items={heatPumpOptions}
              />
            </View>
            <View style={styles.dataContainer}>
              <View style={styles.dataItem}>
                <Text style={styles.dataTitle}>Capactiy, kW</Text>
                <Text style={styles.dataValue}>
                  {heatPumpData[heatPump].capacity}
                </Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataTitle}>Rated COP</Text>
                <Text style={styles.dataValue}>
                  {heatPumpData[heatPump].ratedCop}
                </Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataTitle}>Rated Temp, C</Text>
                <Text style={styles.dataValue}>
                  {heatPumpData[heatPump].ratedTemp}
                </Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataTitle}>Circ Pump, kW</Text>
                <Text style={styles.dataValue}>
                  {heatPumpData[heatPump].circPump}
                </Text>
              </View>
              <View
                style={[
                  styles.dataItem,
                  {borderBottomWidth: 0, marginBottom: 0},
                ]}>
                <Text style={styles.dataTitle}>Application</Text>
                <Text style={styles.dataValue}>Washing Application</Text>
              </View>
            </View>
          </View>
        );

      case 'chill':
        return (
          <View style={styles.optionContainer}>
            <View style={styles.dropDownContainer}>
              <Text style={styles.dropDownLabel}>Machine Number</Text>
              <DropDownPicker
                containerStyle={{height: 50}}
                defaultValue={chiller}
                onChangeItem={opt => setChiller(opt.value)}
                items={chillerOptions}
              />
            </View>
            <View style={styles.dataContainer}>
              <View style={styles.dataItem}>
                <Text style={styles.dataTitle}>Chiller Capactiy, TR</Text>
                <Text style={styles.dataValue}>
                  {chillerData[chiller].chillerCapacity}
                </Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataTitle}>Rate ikW/TR</Text>
                <Text style={styles.dataValue}>
                  {chillerData[chiller].ratedIkw}
                </Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataTitle}>Cooling source</Text>
                <Text style={styles.dataValue}>
                  {chillerData[chiller].coolingSource}
                </Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataTitle}>Primary Pump, kW</Text>
                <Text style={styles.dataValue}>
                  {chillerData[chiller].primaryPump}
                </Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataTitle}>Secondary Pump, kW</Text>
                <Text style={styles.dataValue}>
                  {chillerData[chiller].secondaryPump}
                </Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataTitle}>Condenser Pump, kW</Text>
                <Text style={styles.dataValue}>
                  {chillerData[chiller].condenserPump}
                </Text>
              </View>
              <View
                style={[
                  styles.dataItem,
                  {borderBottomWidth: 0, marginBottom: 0},
                ]}>
                <Text style={styles.dataTitle}>Cooling Tower, kW</Text>
                <Text style={styles.dataValue}>
                  {chillerData[chiller].coolingTower}
                </Text>
              </View>
            </View>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <NavModal
        exclude="settings"
        navigation={navigation}
        open={modal}
        onDismiss={() => setModal(false)}
      />
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
        <Ionicons
          color="#70B349"
          style={styles.headerIcon}
          onPress={() => setModal(true)}
          name="settings-outline"
          size={25}
        />
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('iaq')}>
          <Text style={tab === 'iaq' ? styles.activeTab : {}}>IAQ Room</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('heat')}>
          <Text style={tab === 'heat' ? styles.activeTab : {}}>Heat Pump</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('chill')}>
          <Text style={tab === 'chill' ? styles.activeTab : {}}>Chiller</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scroll}>{renderContent(tab)}</ScrollView>
      <Toast ref={toastref => (toast.current = toastref)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scroll: {
    padding: 40,
    backgroundColor: '#FAFAFA',
  },
  header: {
    height: 100,
    width: '100%',
    backgroundColor: 'white',
    display: 'flex',
    paddingHorizontal: 20,
    paddingTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerIcon: {
    textAlignVertical: 'center',
  },
  headerText: {
    width: '60%',
    textAlign: 'right',
    textAlignVertical: 'center',
  },
  optionContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: '#FAFAFA',
    position: 'relative',
  },
  activeTab: {
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    paddingBottom: 10,
  },
  dataTitle: {
    color: '#96999C',
    fontSize: 15,
    marginBottom: 5,
    ...font.nunitoRegular,
  },
  dataValue: {
    fontSize: 18,
    marginBottom: 5,
    ...font.nunitoBold,
  },
  tabContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  dataContainer: {
    backgroundColor: 'white',
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  dataItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#70707040',
    paddingBottom: 10,
    marginBottom: 15,
  },
  dropDownContainer: {
    marginBottom: 25,
  },
  dropDownLabel: {
    marginBottom: 10,
    ...font.nunitoRegular,
  },
  button: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  buttonLabel: {
    textTransform: 'capitalize',
    ...font.nunitoRegular,
    color: 'white',
  },
});

export default Settings;
