
import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // width:'100%',
    // minHeight:'100%'
  },
  action: {
    flexDirection: 'row',
    backgroundColor: "#fff",
    // borderBottomColor: "#D3D3D3",
    borderBottomColor:'rgba(146, 146, 146, 0.5)',
    borderBottomWidth: 2,
    fontFamily: 'ssfprodisplay-regular',
    borderRadius: 1,
    height: 60,
    marginVertical: 10,
    alignItems: 'center',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  textSign: {
    fontFamily:'avenirltstd-heavy',
    fontSize: 17,
    fontWeight: 'bold',
    alignItems:'center'
  },
  bgimageContainertop: {
    // paddingBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: 'auto',
  },
  loginBtnWrapper: {
    marginTop: 50,
    marginBottom: 60,
  },
  loginBtn: {
    width: "100%",
    backgroundColor: "#5790a8",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  disableBtnStyle:{
    backgroundColor: "#adcbd8",
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    // color: '#05375a',
    height: 50,
    fontFamily:'sfprodisplay-regular',
    fontSize:17,
    letterSpacing:0.6,
    color:'#252525',
  },
  form:{
    marginHorizontal:15
  },
  label:{
    //   fontFamily: "Roboto-Regular",
    width:100,
    paddingLeft:15,
    fontFamily:'sfprodisplay-regular',
    fontSize:17,
    // fontSize:5.3 * vw,
    letterSpacing:0.6,
    color:'#252525'
  },
  viewIcon:{
    paddingHorizontal:10
  },
  focus:{
    borderBottomColor:'#4A99B2',
    borderBottomWidth:1.5
  },
  error:{
    borderBottomColor:'#d44420',
    borderBottomWidth:1.5
  }
});