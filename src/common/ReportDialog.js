import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Portal, Modal, Card} from 'react-native-paper';

import api from 'api/Api';
import FeelingGood from 'assets/images/feeling-good.svg';
import WarmCool from 'assets/images/warm-cool.svg';
import Nose from 'assets/images/nose.svg';
import Submitted from 'assets/images/submitted.svg';
import {font} from 'config/config';

const ReportDialog = ({open, onDismiss, roomNo, roomType}) => {
  const [reported, setReported] = React.useState(false);

  const reportStatus = async type => {
    const payload = {
      api_name: 'iaq_feedback',
      data: {
        client_id: 'Hablis',
        room_type: roomType,
        room_no: roomNo,
        feedback_type: type,
      },
    };

    await api.post('/api/genericApi', payload);
    setReported(true);
    setTimeout(() => {
      onDismiss();
    }, 1500);
  };

  return (
    <Portal>
      <Modal visible={open} onDismiss={onDismiss} style={styles.modal}>
        <View
          style={[
            styles.notificationsContainer,
            reported ? {height: 100} : {},
          ]}>
          <View style={styles.notificationCard}>
            {reported && (
              <View style={styles.loadingContainer}>
                <Submitted />
                <Text
                  style={{...font.nunitoRegular, fontSize: 22, marginLeft: 15}}>
                  Report Submitted
                </Text>
              </View>
            )}
            {!reported && (
              <>
                <Text style={styles.ambienceText}>How is the ambience?</Text>
                <TouchableOpacity onPress={() => reportStatus('Stale Smell')}>
                  <Card.Content style={[styles.cardContent, styles.cardBorder]}>
                    <Nose />
                    <Text style={styles.notiContent}>Stale Smell</Text>
                  </Card.Content>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => reportStatus('Feeling Good')}>
                  <Card.Content style={[styles.cardContent, styles.cardBorder]}>
                    <FeelingGood />
                    <Text style={styles.notiContent}>Feeling Good</Text>
                  </Card.Content>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => reportStatus('Warm/Cool')}>
                  <Card.Content style={styles.cardContent}>
                    <WarmCool />
                    <Text style={styles.notiContent}>Warm / Cool</Text>
                  </Card.Content>
                </TouchableOpacity>
              </>
            )}
          </View>
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
  cardBorder: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: 'lightgrey',
    paddingBottom: 20,
    paddingTop: 0,
  },
  ambienceText: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    ...font.nunitoRegular,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
    alignContent: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
  },
  headerNotify: {
    display: 'flex',
    flexDirection: 'row',
  },
  notificationCard: {
    //     backgroundColor: '#F8F4F4',
    marginVertical: 20,
    marginHorizontal: 15,
  },
  notificationsContainer: {
    backgroundColor: 'white',
    height: 280,
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
    fontSize: 22,
    marginLeft: 20,
    ...font.nunitoRegular,
  },
});

export default ReportDialog;
