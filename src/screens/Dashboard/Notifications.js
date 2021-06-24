import React from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {Portal, Modal, Card} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import api from 'api/Api';
import Bellicon from 'assets/images/notification-blue.svg';
import {font} from 'config/config';

const Notifications = ({notification, setNotification}) => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  const getNotificationData = async noLoading => {
    if (!noLoading) {
      setLoading(true);
    }
    let payload = {
      api_name: 'getAllFsDataByDate',
      data: {
        os_type: 'mobile',
        client_id: 'Hablis',
        date: moment().format('YYYY-MM-DD'),
      },
    };
    const result = await api.post('/api/genericApi', payload);
    setLoading(false);
    setData(result.data);
  };

  const resolveNotification = async updatedTime => {
    let payload = {
      api_name: 'setNotificationInactive',
      data: {
        client_id: 'Hablis',
        updatedTime,
        status: 'closed',
      },
    };

    await api.post('/api/genericApi', payload);
    getNotificationData(true);
  };

  React.useEffect(() => {
    getNotificationData();
  }, []);

  return (
    <Portal>
      <Modal
        visible={notification}
        onDismiss={() => setNotification(false)}
        style={styles.modal}>
        <View style={styles.notificationsContainer}>
          <View style={styles.header}>
            <View style={styles.headerNotify}>
              <Bellicon style={styles.icon} />
              <Text>Notifications</Text>
            </View>
            <Ionicons
              onPress={() => setNotification(false)}
              color="#012560"
              name="close"
              size={20}
            />
          </View>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={getNotificationData}
              />
            }>
            {loading && (
              <View style={styles.loadingContainer}>
                <Text style={font.nunitoRegular}>Loading...</Text>
              </View>
            )}
            {!loading &&
              data.map(({title, message, updatedTime}) => (
                <Card elevation={2} style={styles.notificationCard}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.titleStyle}>{title}</Text>
                    <Ionicons
                      onPress={() => resolveNotification(updatedTime)}
                      style={styles.removeIcon}
                      size={20}
                      name="remove"
                      color="#079F0C"
                    />
                  </View>
                  <Card.Content>
                    <Text style={styles.notiContent}>
                      {message.replace(/ALERT:/, '')}
                    </Text>
                  </Card.Content>
                </Card>
              ))}
          </ScrollView>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 40,
    height: 24,
    width: 28,
    marginRight: 15,
  },
  modal: {
    justifyContent: 'flex-end',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
  },
  headerNotify: {
    display: 'flex',
    flexDirection: 'row',
  },
  notificationCard: {
    backgroundColor: '#F8F4F4',
    marginVertical: 15,
    marginHorizontal: 15,
  },
  notificationsContainer: {
    backgroundColor: 'white',
    height: 500,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  removeIcon: {
    backgroundColor: 'white',
    width: 22,
    height: 22,
    borderRadius: 50,
    paddingRight: 0,
    paddingLeft: 2,
    elevation: 2,
  },
  titleStyle: {
    fontSize: 18,
    ...font.nunitoSemiBold,
  },
  notiContent: {
    fontSize: 12,
    ...font.nunitoRegular,
  },
});

export default Notifications;
