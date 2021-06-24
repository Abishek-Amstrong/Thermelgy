import React, { createContext, useState, useCallback} from 'react';


const  AuthContext = createContext();

export default AuthContext;


export const AuthContextProvider = ({children})=>{
    const [userData,setUserData] = useState(null);

    const getData = ()=>{
        return userData;
    }

    const setUser = useCallback((data)=>{
        setUserData(data);
    },[setUserData]);

    return(<AuthContext.Provider value={{setUser,getData}}>
        {children}
    </AuthContext.Provider>)

}