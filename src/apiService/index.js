//Es dentro de esta carpeta de apiService en donde meteré todas las conexiones que hagamos con el backend, para que quede más limpio.
import axios from "axios";
import { BroadcastChannel } from "broadcast-channel";

const logOutChannel = new BroadcastChannel('logOut');



const API = 'http://localhost:9000'



export const registerRequest = async (user) => {
    console.log("Usuario por registrar: ", user)
    try{
        const response = await axios.post(`${API}/users/register`, user)
        const token = response.data.token ;
        if(token){
        return window.localStorage.setItem('token', token); //Con esto estamos guardando en el LocalStorage el token del usuario.
        }
        console.log("USER No válido");
    } catch(error) {
        console.log(error);
    }
    
};

export const loginRequest = async (user) => {
    //console.log("Usuario login: ", user)
    try {
        const response = await axios.post(`${API}/users/login`, user)
        console.log('esta es la response a login');
        const token = response.data.token ;
        if(token){
        window.localStorage.setItem('token', token);
        return true //Con esto estamos guardando en el LocalStorage el token del usuario.
        }
        console.log("USER No válido");
    
    } catch(error) {
        console.log('Esto es el error al login: ', error);
        return false
    }
};

//LOG OUT DE USUARIO ------------->
export const logUserOut = () => {
    logOutChannel.postMessage('LogOut')
    window.localStorage.removeItem('token');
    window.location.href = window.location.origin + '/'
};

export const logOutAllTabs = () => {
    logOutChannel.onmessage = () => {
        logUserOut();
        logOutChannel.close();
    }
};


//myHousePanel: hay que enviar el id del usuario a través del token, para autenticación en el back

    
export const getMyHousePanel = async (token) => {
    try {
        const response = await axios.get(`${API}/rooms/`, {headers: {Authorization: localStorage.getItem('token')}})
        console.log('Que es response: ', response);
    } catch (error) {
        console.log('Este es el error: ', error)
    }
};

//getAllRooms: hay que enviar el id de la casa de la que necesito las habitaciones a parte del token
export const getAllRooms = async () => {
    console.log("Se piden habitaciones:")
    const { data } = await axios.get(`${API}/rooms/`, {headers: {Authorization: localStorage.getItem('token')}});
    console.log(data)
    return data;
};

//postNewRoom: hay que enviar el id de la casa en la que creo la habitación a parte del token
export const postNewRoom = async (name, type, image) => {
    const response = await axios.post(`${API}/rooms/`, name, type, image ); // {headers: {Authorization: localStorage.getItem('token')}}
    console.log('Esta es la respuesta al post: ', response);
    getAllRooms()
    return;
};

//postNewRoom: hay que enviar el id de la room de la que quiero el listado de devices a parte del token
export const getAllDevices = async () => {
    const { data } = await axios.get(`${API}/devices/`, {headers: {Authorization: localStorage.getItem('token')}});
    return data;
};

//postNewDevice: hay que enviar el id de la room en la que creo el device a parte del token
export const postNewDevice = async () => {
    const { data } = await axios.post(`${API}/devices/`, {headers: {Authorization: localStorage.getItem('token')}}/*datos del post{nameDevice, typeDevice}*/)
    getAllDevices(); //llamamos de nuevo al get nada más postear para que se realice una sincronización y recibamos el nuevo device.
    return data;
}
//postNewHouse:
export const postNewHouse = async () => {
    const {data} = await axios.post(`${API}/houses/`, {headers: {Authorization: localStorage.getItem('token')}})
    return data;
}
