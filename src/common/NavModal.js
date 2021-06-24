import React from 'react';
import {Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Portal, Modal, Card} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ThermelgyLogo from 'assets/images/ThermelgyLogoOption-02.png';
import Graph from 'assets/images/dark_home.svg';
import Test from 'assets/images/checklist-red.svg';
import Safety from 'assets/images/menuone.svg';
import Notes from 'assets/images/menuthree.svg';
import Chiller from 'assets/images/Machines.svg';
import Bolt from 'assets/images/bolt.svg';

import routes from 'navigation/routes';

const options = {
  report: {
    image: Graph,
    label: 'Home',
    route: routes.report,
  },
  graph: {
    image: Bolt,
    label: 'tMY Smart Energy',
    route: routes.graph,
  },
  safety: {
    image: Safety,
    label: 'tMY Safe Premises',
    route: routes.safety,
  },
  incidents: {
    image: Notes,
    label: 'Incidents',
    route: routes.feedback,
  },
  feedback: {
    image: Test,
    label: 'Safe Check',
    route: routes.test,
  },
  chiller: {
    image: Chiller,
    label: 'Machines',
    route: routes.chiller,
  },
  settings: {
    image: props => (
      <Ionicons
        color="#FF860E"
        style={styles.headerIcon}
        name="settings-outline"
        size={25}
        {...props}
      />
    ),
    label: 'Settings',
    route: routes.settings,
  },
};

const NavModal = ({exclude, navigation, open, onDismiss}) => {
  return (
    <Portal>
      <Modal visible={open} onDismiss={onDismiss} style={styles.modal}>
        <Card style={styles.card}>
          <Card.Content>
            <Image
              resizeMode="contain"
              style={styles.logo}
              source={ThermelgyLogo}
            />
          </Card.Content>
          <Card.Content style={styles.container}>
            {Object.keys(options)
              .filter(v => exclude !== v)
              .map((key, idx) => (
                <TouchableOpacity
                  key={key + '-' + idx}
                  style={styles.item}
                  onPress={() => navigation.navigate(options[key].route)}>
                  {options[key].image({
                    width: 30,
                    height: 30,
                  })}
                  <Text style={styles.label}>{options[key].label}</Text>
                </TouchableOpacity>
              ))}
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 40,
    width: 100,
    marginBottom: 10,
  },
  card: {
    borderRadius: 15,
    backgroundColor: 'white',
  },
  modal: {
    paddingHorizontal: 30,
  },
  cardImage: {
    width: 200,
    height: 200,
  },
  label: {
    fontSize: 11,
    marginTop: 5,
    textAlign: 'center',
  },
  item: {
    width: 80,
    height: 80,
    marginLeft: 5,
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    width: 330,
    flexWrap: 'wrap',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

export default NavModal;
