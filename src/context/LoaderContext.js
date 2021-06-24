import React, { createContext, useState, useCallback } from 'react';
import { ActivityIndicator, StyleSheet, View,Platform } from 'react-native';

const LoaderContext = createContext();

export default LoaderContext;


export const LoaderContextProvider = ({ children }) => {
    const [animate, setAnimate] = useState(false);

    const setLoader = useCallback((state) => {
        setAnimate(state);
    }, [animate]);

    return (<LoaderContext.Provider value={{ setLoader }}>
        {children}
        {(animate) ? <View  style={styles.conatiner}>
            <ActivityIndicator
                animating={animate}
                color="#214e61"
                // size = '19%'
                size = {Platform.OS === 'ios'?'large':'19%'}
                style={styles.activityIndicator}
            />
        </View> : null
        }
    </LoaderContext.Provider>)

}

const styles = StyleSheet.create({
    conatiner: {
        alignItems: 'center',
          height: '100%',
          justifyContent:'center',
          position:'absolute',
        // margin: "auto",
        width: '100%',
    },
    activityIndicator: {
        width:'100%',
        height:'100%',
        backgroundColor:'rgba(0,0,0,0.3)'
    },
});