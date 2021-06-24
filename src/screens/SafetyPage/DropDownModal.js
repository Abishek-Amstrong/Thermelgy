import React from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {Modal, Button} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { font } from 'config/config';

export default ({open, onClose}) => {
  const dropdown_one = [
    {label: 'dd-one', value: 'dd-one'},
    {label: 'dd-two', value: 'dd-two'},
    {label: 'dd-three', value: 'dd-three'},
  ];
  return (
    <Modal
      visible={open}
      onDismiss={onClose}
      contentContainerStyle={styles.modalContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.divider} />
        <View style={styles.dropDownContainer}>
          <Text style={styles.dropDownLabel}>Dropdown 1</Text>
          <DropDownPicker items={dropdown_one} />
        </View>
        <View style={[styles.dropDownContainer, {paddingBottom: 100}]}>
          <Text style={styles.dropDownLabel}>Dropdown 1</Text>
          <DropDownPicker style={{height: 45}} items={dropdown_one} />
        </View>
      </ScrollView>
      <Button
        color="#70B349"
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonLabel}>
        Sense
      </Button>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  container: {
    backgroundColor: 'white',
    paddingVertical: 50,
    paddingHorizontal: 35,
    height: 500,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative',
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
