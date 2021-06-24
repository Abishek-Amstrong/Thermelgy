import React from 'react';
import {View, StyleSheet, Text, StatusBar, Image, Linking} from 'react-native';
import {Button} from 'react-native-paper';

import api from 'api/Api';
import Notifications from 'screens/Dashboard/Notifications';
import Bellicon from 'assets/images/notification.svg';
import Homeicon from 'assets/images/home.svg';
import Logo from 'assets/images/logo.png';
import NavModal from 'common/NavModal';
import {font} from 'config/config';
import moment from 'moment';

const Report = props => {
  const [open, setOpen] = React.useState(false);
  const [notification, setNotification] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({});

  const rowList = Array.isArray(data?.dcrReport_data)
    ? data.dcrReport_data
    : [];

  const getReportData = async () => {
    setLoading(true);
    const payload = {
      api_name: 'latest_dcr_report',
      data: {
        client_id: 'Hablis',
      },
    };
    const result = await api.post('/api/genericApi', payload);
    setData(result.data);
    setLoading(false);
  };

  const downloadDocumentation = () => {
    if (data?.downloadLink) {
      Linking.openURL(data?.downloadLink);
    }
  };

  React.useEffect(() => {
    getReportData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {notification && (
        <Notifications
          notification={notification}
          setNotification={setNotification}
        />
      )}
      <NavModal
        exclude="report"
        navigation={props.navigation}
        open={open}
        onDismiss={() => setOpen(false)}
      />
      <View style={styles.headerContent}>
        <View style={styles.thermelgyRow}>
          <Image source={Logo} style={styles.logo} />
          <Text style={styles.title}>ThermelgyAI Insights</Text>
          <View style={styles.iconContainer}>
            <Bellicon
              style={styles.icon}
              onPress={() => setNotification(true)}
            />
            <Homeicon style={styles.icon2} onPress={() => setOpen(true)} />
          </View>
        </View>
        <View style={styles.reportDetails}>
          <Text style={styles.reportText}>DCR Report</Text>
          <Text style={styles.monthText}>
            {moment(data?.date).format('MMM DD, YYYY')}
          </Text>
        </View>
      </View>
      <View>
        <View style={styles.tableHeader}>
          <Text
            style={[
              styles.headerText,
              {flex: 2, textAlign: 'left', paddingLeft: 20},
            ]}>
            Items
          </Text>
          <Text style={styles.headerText}>Budget</Text>
          <Text style={styles.headerText}>Actual</Text>
          <Text style={styles.headerText}>MTD</Text>
        </View>
        {rowList.map((row, idx) =>
          !row.name.includes('Total Expenses') ? (
            <View style={styles.tableRow} key={row.columnName + '-' + idx}>
              <Text
                style={[
                  styles.headerText,
                  {flex: 2, textAlign: 'left', paddingLeft: 20},
                ]}>
                {row.name}
              </Text>
              <Text style={styles.headerText}>{row.budget}</Text>
              <Text style={styles.headerText}>{row.actual}</Text>
              <Text style={styles.headerText}>{row.mtd}</Text>
            </View>
          ) : (
            <View
              style={[styles.tableRow, {backgroundColor: '#F1F1F1'}]}
              key={row.columnName + '-' + idx}>
              <Text
                style={[
                  styles.headerText,
                  {flex: 2, textAlign: 'left', paddingLeft: 20},
                ]}>
                {row.name}
              </Text>
              <Text style={[styles.headerText, font.nunitoBold]}>
                {row.budget}
              </Text>
              <Text style={[styles.headerText, font.nunitoBold]}>
                {row.actual}
              </Text>
              <Text style={[styles.headerText, font.nunitoBold]}>
                {row.mtd}
              </Text>
            </View>
          ),
        )}
      </View>
      <View style={styles.downloadContainer}>
        <Button
          icon="download"
          color="#70B349"
          onPress={downloadDocumentation}
          style={{paddingVertical: 2}}
          labelStyle={styles.labelStyle}
          mode="contained">
          Download Report
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -10,
    backgroundColor: 'white',
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
  },
  title: {
    ...font.nunitoRegular,
    fontSize: 18,
    color: 'white',
    textAlignVertical: 'center',
  },
  headerContent: {
    height: 220,
    backgroundColor: '#012560',
  },
  logo: {
    width: 30,
    height: 30,
  },
  icon: {
    color: 'rgba(255,255,255,1)',
    fontSize: 40,
    height: 24,
    width: 28,
    marginTop: 2,
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
    alignItems: 'center',
    alignContent: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  icon2: {
    color: 'rgba(254,254,254,1)',
    fontSize: 40,
    height: 24,
    width: 28,
    marginLeft: 16,
  },
  reportDetails: {
    paddingLeft: 30,
    marginTop: 30,
  },
  reportText: {
    color: '#FFFFFF',
    fontSize: 14,
    ...font.nunitoExtraLight,
  },
  monthText: {
    color: 'white',
    fontSize: 22,
    marginTop: 5,
    ...font.nunitoBold,
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
    height: 50,
    alignItems: 'center',
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 50,
    alignItems: 'center',
  },
  downloadContainer: {
    paddingHorizontal: 25,
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  labelStyle: {
    ...font.nunitoRegular,
    textTransform: 'capitalize',
    fontSize: 18,
    color: 'white',
  },
});

export default Report;
