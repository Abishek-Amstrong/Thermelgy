import React, { useState, useEffect, createContext, useCallback, useRef, Fragment } from 'react';
import Toast from 'react-native-easy-toast';
import {NativeModules, View} from 'react-native';

const { StatusBarManager} = NativeModules;
const STATUSBAR_HEIGHT = StatusBarManager.HEIGHT;



const ToastContext = createContext();

export default ToastContext;

export const  ToastContextProvider = ({children})=>{
    const [toastData, setToastData] = useState({message:'',duration:0});
    const [overlay, setOverlay] = useState(false);
    useEffect(()=>{
        if(toastData.message != ''){
            setOverlay(true);
            const duration = toastData.hasOwnProperty('duration')?toastData.duration:3500;
            __toast.show(toastData.message,duration);
            setToastData({message:'',duration:0});
            setTimeout(()=>{
                setOverlay(false)
            }, duration + 1800)
            return;
        }
    },[toastData]);


    const addToast = useCallback((toastData)=>{
        setToastData(toastData)
    },[setToastData]);


    return(
        
        <ToastContext.Provider value={addToast}>
            {children}
            {overlay?<View style={bgStyles}></View>:null}
            <Toast ref={ref => { __toast = ref }}
            style={styles}
              position='center'
            //   positionValue={STATUSBAR_HEIGHT}
              fadeInDuration={750}
              fadeOutDuration={1000}
              opacity={0.8}
              textStyle={{fontWeight: 'bold',color: '#252525',
              fontFamily:'Poppins-Bold',}}
              
            />
            
        </ToastContext.Provider>
        
        
    )
}

const bgStyles = {
    backgroundColor:'#000',
    height:'100%',
    width:'100%',
    flex:1,
    position: 'absolute',
    opacity: 0.5
}
const styles = 
    {
    width:'80%',
    minHeight:70,
    justifyContent: "center",
    alignItems: 'center',
    opacity: 1,
    backgroundColor: "#fff",  
    position: 'relative',
    borderRadius:2
}
 