export const USER_DATA = {
    access_token: '',
    refresh_token: '',
    user_id: '',
    first_name:'',
    last_name:'',
    client_name:''
}

export const setUserName= (data) => {
    USER_DATA.client_name = data.client_name;

    console.log("authconst",data.client_name)
}


export const setUserData = (data) => {
    USER_DATA.access_token = data.access_token;
    USER_DATA.refresh_token = data.refresh_token;
    USER_DATA.user_id = data.user_id;
    USER_DATA.first_name = data.first_name;
    USER_DATA.last_name = data.last_name;
}

export const resetUserData = ()=>{
    USER_DATA.access_token = '';
    USER_DATA.refresh_token ='';
    USER_DATA.user_id ='';
    USER_DATA.first_name = '';
    USER_DATA.last_name = '';
}