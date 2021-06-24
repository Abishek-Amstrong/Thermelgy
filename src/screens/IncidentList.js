import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {Card, Button, Modal, Portal} from 'react-native-paper';
import {Agenda} from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import {USER_DATA} from 'utilities/helpers/authConst';
import Noteslogo from 'assets/images/notes.svg';
import NavModal from 'common/NavModal';
import routes from 'navigation/routes';
import api from 'api/Api';
import {font} from 'config/config';

const IncidentList = props => {
  const [status, setStatus] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [incidentList, setIncidentList] = React.useState([]);
  const [date, setDate] = React.useState(moment().format('YYYY-MM-DD'));
  const [imageUrl, setImageUrl] = React.useState(null);

  const fetchIncidents = selectedDate => {
    const formatDate = moment(selectedDate).format('DD-M-YYYY');
    setDate(selectedDate);
    setLoading(true);
    const payload = {
      api_name: 'get_notes',
      data: {
        client_id: 'Hablis',
        date: formatDate,
      },
    };
    api.post('/api/genericApi', payload).then(res => {
      setIncidentList(res.data);
      setLoading(false);
    });
  };

  const resolveIncident = async item => {
    const payload = {
      api_name: 'get_notes',
      data: {
        client_id: item.client_id,
        date: item.date,
        status: 'resolve',
      },
    };

    await api.post('/api/genericApi', payload);
    fetchIncidents(date);
  };

  useEffect(() => {
    fetchIncidents(date);
  }, []);

  const showImage = url => {
    setImageUrl(url);
  };

  return (
    <>
      <NavModal
        exclude="incidents"
        navigation={props.navigation}
        open={status}
        onDismiss={() => setStatus(false)}
      />
      {imageUrl && (
        <Portal>
          <Modal visible={true} onDismiss={() => setImageUrl(null)}>
            <Card>
              <Card.Content>
                <Image
                  resizeMode="contain"
                  style={{height: 500}}
                  source={{uri: imageUrl}}
                />
              </Card.Content>
            </Card>
            <Card.Actions>
              <Button
                color="#70B349"
                mode="contained"
                onPress={() => setImageUrl(null)}>
                CLOSE
              </Button>
            </Card.Actions>
          </Modal>
        </Portal>
      )}
      <View style={styles.header}>
        <Text style={styles.headerText}>Incidents</Text>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.plusContainer}
            onPress={() => props.navigation.navigate(routes.SingleFeedback)}>
            <Ionicons name="add" size={30} color="#012560" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 40,
            }}
            onPress={() => setStatus(true)}>
            <Noteslogo width={30} height={32} />
          </TouchableOpacity>
        </View>
      </View>
      <Agenda
        items={{
          [date]: incidentList,
        }}
        onDayPress={({dateString}) => {
          fetchIncidents(dateString);
        }}
        markedDates={{
          [date]: {marked: false},
        }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => fetchIncidents(date)}
          />
        }
        renderItem={(item, firstItemInDay) => {
          return (
            <Card style={styles.container}>
              <View style={styles.noteHeader}>
                <Text style={styles.noteName}>{item.note_name}</Text>
                {item.issue_type && (
                  <Text style={styles.statusLabel}>{item.issue_type}</Text>
                )}
              </View>
              <Card.Content>
                <Text
                  style={{
                    ...font.nunitoRegular,
                  }}>
                  {item.note_description}
                </Text>
              </Card.Content>
              {item.note_attachment_link && (
                <Card.Actions style={styles.cardActions}>
                  <Button
                    color="grey"
                    icon="image"
                    onPress={() => showImage(item.note_attachment_link)}
                    labelStyle={{
                      textTransform: 'capitalize',
                      color: 'grey',
                    }}>
                    View Image
                  </Button>
                  {item.status && item.status === 'resolve' ? (
                    <Button
                      color="#70B349"
                      icon="record"
                      mode="outlined"
                      labelStyle={{
                        textTransform: 'capitalize',
                      }}>
                      RESOLVED
                    </Button>
                  ) : (
                    <Button
                      color="#70B349"
                      mode="contained"
                      onPress={() => resolveIncident(item)}>
                      RESOLVE
                    </Button>
                  )}
                </Card.Actions>
              )}
            </Card>
          );
        }}
        // Agenda container style
        style={{}}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginRight: 15,
    paddingTop: 15,
    backgroundColor: 'white',
  },
  header: {
    height: 90,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 25,
    backgroundColor: 'white',
    paddingVertical: 40,
  },
  noteName: {
    fontSize: 17,
    color: '#012560',
    textTransform: 'capitalize',
    paddingLeft: 15,
    ...font.nunitoSemiBold,
  },
  noteHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cardActions: {
    justifyContent: 'space-between',
    paddingBottom: 15,
    paddingRight: 15,
    marginTop: 15,
  },
  statusLabel: {
    backgroundColor: '#012560',
    color: 'white',
    // width: 120,
    paddingHorizontal: 5,
    textAlign: 'center',
    fontSize: 12,
    paddingVertical: 5,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    alignSelf: 'flex-end',
  },
  headerText: {
    ...font.nunitoRegular,
    fontSize: 20,
    paddingTop: 5,
    textAlign: 'right',
    flex: 3,
    height: 50,
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 2,
    justifyContent: 'flex-end',
  },
  plusContainer: {
    marginRight: 10,
    height: 40,
  },
  tinyLogotop: {
    height: 20,
    width: 20,
  },
});

export default IncidentList;
