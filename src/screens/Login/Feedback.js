import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import Imagepicklogo from 'assets/images/imagepicker.svg';
import Noteslogo from 'assets/images/notes.svg';
import Cameralogo from 'assets/images/camerapicker.svg';
import ImagePicker from 'react-native-image-crop-picker';
import api from 'api/Api';
import NavModal from 'common/NavModal';
import routes from 'navigation/routes';
import {font} from 'config/config';

// import Menuthree from 'assets/images/menuthree.svg';

const issueCategoryItems = [
  {
    label: 'Comfort',
    value: 'Comfort',
  },
  {
    label: 'AC',
    value: 'AC',
  },
  {
    label: 'Electrical',
    value: 'Electrical',
  },
  {
    label: 'Plumbing',
    value: 'Plumbing',
  },
  {
    label: 'Carpeting',
    value: 'Carpeting',
  },
  {
    label: 'Polishing',
    value: 'Polishing',
  },
  {
    label: 'Machines',
    value: 'Machines',
  },
];

const initialData = {
  client_id: 'Hablis',
  note_name: null,
  note_description: null,
};

function Feedback(props) {
  const [inputData, setData] = useState(initialData);
  const [image, setImage] = useState(null);
  const [item, setItem] = React.useState(null);
  const [clickstatus, setclickStatus] = useState(false);
  const categoryDropdownRef = React.useRef(null);
  const handleSubmitButton = async () => {
    categoryDropdownRef.current.close();
    const data = new FormData();
    data.append('api_name', 'add_notes');
    data.append('client_id', inputData.client_id);
    data.append('note_name', inputData.note_name);
    data.append('note_description', inputData.note_description);
    data.append('issue_type', item);
    if (image) {
      data.append('note_attachment', image);
    }
    const result = await api.post('/api/genericApi', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!image && result) {
      alert('Incident recorded successfully!');
      resetForm();
    } else if (result.status === true) {
      alert('Incident recorded successfully!');
      resetForm();
    }
  };
  function resetForm() {
    categoryDropdownRef.current.close();
    setData(initialData);
    setItem(null);
    setImage(null);
  }
  function openCamera() {
    categoryDropdownRef.current.close();
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(img => {
      setImage({
        uri: Platform.select({
          android: img.path,
          ios: img.path.replace('file://', ''),
        }),
        type: img.mime,
        name: `image-${Math.random() * 9999}`,
      });
    });
  }
  function opengallery() {
    categoryDropdownRef.current.close();
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(img => {
      setImage({
        uri: Platform.select({
          android: img.path,
          ios: img.path.replace('file://', ''),
        }),
        type: img.mime,
        name: `image-${Math.random() * 9999}`,
      });
    });
  }

  const handleSubmitButtonone = () => {
    console.log('received...!');
    props.navigation.navigate('Safetypage');
  };
  const handleSubmitButtontwo = () => {
    console.log('received...!');
    props.navigation.navigate('Test');
  };
  const handleSubmitButtonthree = () => {
    console.log('received...!');
    props.navigation.navigate(routes.graph);
  };
  return (
    <View style={styles.container}>
      <NavModal
        exclude="incidents"
        navigation={props.navigation}
        open={clickstatus}
        onDismiss={() => setclickStatus(false)}
      />
      <ScrollView style={styles.scroll}>
        <View style={styles.rect}>
          <View style={styles.notesRow}>
            <Text style={styles.notes}>Incidents</Text>
          </View>
          <View style={styles.iconRowTop}>
            <Noteslogo
              width={30}
              height={32}
              onPress={() => {
                // console.warn('onPress rect');
                setclickStatus(true);
              }}
            />
          </View>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.name}>Name</Text>
          <TextInput
            placeholder="Incident's name"
            onFocus={() => {
              categoryDropdownRef.current.close();
            }}
            style={styles.placeholder}
            value={inputData.note_name}
            onChangeText={value => setData({...inputData, note_name: value})}
          />
          <Text style={styles.name}>Type</Text>
          <DropDownPicker
            defaultValue={item}
            onChangeItem={itm => setItem(itm.value)}
            controller={instance => (categoryDropdownRef.current = instance)}
            items={issueCategoryItems}
          />
          <Text style={styles.description}>Description</Text>
          <TextInput
            placeholder="Your incident's description"
            multiline
            onFocus={() => {
              categoryDropdownRef.current.close();
            }}
            style={styles.textInput}
            value={inputData.note_description}
            onChangeText={value =>
              setData({...inputData, note_description: value})
            }
          />
          <Text style={styles.attachImage}>Attach Image</Text>

          <View style={styles.rect22Row}>
            <View style={styles.rect22}>
              <TouchableOpacity
                style={styles.buttonStyle1}
                activeOpacity={0.5}
                onPress={opengallery}>
                <Imagepicklogo width={35} height={35} style={styles.icon} />
              </TouchableOpacity>
            </View>
            <View style={styles.rect3}>
              <TouchableOpacity
                style={styles.buttonStyle2}
                activeOpacity={0.5}
                onPress={openCamera}>
                <Cameralogo width={35} height={35} style={styles.icon22} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.button4Row}>
        <TouchableOpacity style={styles.button4} onPress={resetForm}>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  menuContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rect: {
    width: '100%',
    height: 100,
    backgroundColor: 'rgba(255,255,255,1)',

    flexDirection: 'row',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  notes: {
    ...font.nunitoRegular,
    color: '#121212',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 0,
  },
  icon3: {
    color: 'rgba(128,128,128,1)',
    fontSize: 40,
    height: 46,
    width: 40,
    marginLeft: 104,
  },
  notesRow: {
    height: 46,
    flexDirection: 'row',
    flex: 1,
    marginRight: 23,
    paddingLeft: 155,
    marginTop: 50,
  },
  name: {
    ...font.nunitoRegular,
    color: '#121212',
    fontSize: 16,
    marginTop: 30,
    marginBottom: 5,
  },
  placeholder: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    height: 62,
    width: '100%',
    backgroundColor: '#fff',
    marginTop: 10,
    borderColor: 'gray',
    borderWidth: 0.5,
  },
  description: {
    ...font.nunitoRegular,
    color: '#121212',
    fontSize: 16,
    marginTop: 35,
  },
  textInput: {
    fontFamily: 'roboto-regular',
    color: '#121212',
    height: 170,
    width: '100%',
    backgroundColor: '#fff',
    marginTop: 10,
    borderColor: 'gray',
    textAlignVertical: 'top',
    borderWidth: 0.5,
  },
  attachImage: {
    ...font.nunitoRegular,
    color: '#121212',
    fontSize: 16,
    marginTop: 30,
  },
  icon: {
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    color: 'rgba(128,128,128,1)',
    fontSize: 40,
    marginLeft: 20,
  },
  iconRow: {
    height: 46,
    flexDirection: 'row',
    marginTop: 29,
    marginLeft: 56,
    marginRight: 191,
    justifyContent: 'space-between',
  },
  button4Row: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
  },
  textSign: {
    fontFamily: 'avenirltstd-heavy',
    fontSize: 17,
    marginTop: 15,
    textAlign: 'center',
    alignItems: 'center',
  },
  bottomSign: {
    fontFamily: 'avenirltstd-heavy',
    marginTop: 15,
    marginLeft: 70,
    fontSize: 17,

    alignItems: 'center',
  },
  button5: {
    flexDirection: 'row',
    width: '50%',
    height: 55,
    backgroundColor: 'rgba(112,179,73,1)',
    borderWidth: 0.5,
    borderColor: '#000',
  },
  button4: {
    flexDirection: 'row',
    width: '50%',
    height: 55,
    backgroundColor: '#FFF',
    borderWidth: 0.5,
    borderColor: '#000',
  },
  iconRowTop: {
    marginTop: 40,
    marginRight: 20,
  },
  rect2: {
    width: 75,
    height: 66,
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 15,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 5,
    shadowOpacity: 0.31,
    shadowRadius: 0,
  },
  rect3: {
    display: 'flex',
    width: 75,
    height: 65,
    paddingTop: 5,
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 15,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 5,
    shadowOpacity: 0.31,
    shadowRadius: 0,
    marginLeft: 58,
  },
  icon2: {
    color: 'rgba(128,128,128,1)',
    fontSize: 40,
    height: 46,
    width: 40,
    // marginLeft: 50,
    // marginTop: 10,
    marginLeft: 17,
  },
  rect2Row: {
    height: 66,
    flexDirection: 'row',
    marginTop: 27,
    marginLeft: 54,
    marginRight: 113,
  },
  rect2Row: {
    height: 66,
    flexDirection: 'row',
    marginTop: 27,
    marginLeft: 54,
    marginRight: 113,
  },
  rect66: {
    width: 310,
    height: 200,
    backgroundColor: '#FFF',
    paddingVertical: 20,
    borderRadius: 15,
    paddingHorizontal: 20,
  },
  icon88Row: {
    height: 46,
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 8,
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
  icon22: {
    justifyContent: 'center',
    marginLeft: 20,
    color: 'rgba(128,128,128,1)',
    fontSize: 40,
  },
  rect22: {
    display: 'flex',
    justifyContent: 'center',
    width: 75,
    height: 65,
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 15,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 5,
    shadowOpacity: 0.31,
    shadowRadius: 0,
  },
  rect22Row: {
    height: 66,
    flexDirection: 'row',
    marginTop: 15,
    marginRight: 113,
    marginBottom: 20,
  },
  buttonStyle1: {
    justifyContent: 'center',
    marginTop: 0,
  },
  buttonStyle2: {
    justifyContent: 'center',
    marginTop: 10,
  },
  formContainer: {
    paddingHorizontal: 30,
  },
});

export default Feedback;
