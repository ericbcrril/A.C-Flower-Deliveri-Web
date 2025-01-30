import axios from 'axios';
import { BASE_URL, handleError, handleResponse } from './response';
import sanitizeStrings from './sanitizeStrings';
import { deleteCookie } from './handleCookies';
/**
 * Obtener todos los elementos.
 * @param {string} collectionName - El nombre de la colección en la base de datos.
 * @returns {Promise<any>} Una promesa que se resuelve con la respuesta del servidor.
 */
export const getItems = async (collectionName ) => {
  try {
    const response = await axios.get(`${BASE_URL}/${collectionName}`);
    return handleResponse(response); 
  } catch (error) {
    handleError(error);
  }
};

/**
 * Obtener un elemento por ID.
 * @param {string} collectionName - El nombre de la colección en la base de datos.
 * @param {string} id - El ID del elemento con el que se va a trabajar.
 * @returns {Promise<any>} Una promesa que se resuelve con la respuesta del servidor.
 */
export const getItemsById = async (collectionName , id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${collectionName}/getById/${id}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * Crear un nuevo elemento.
 * @param {string} collectionName - El nombre de la colección en la base de datos.
 * @param {object} data - Los datos que enviaras al backend.
 * @returns {Promise<any>} Una promesa que se resuelve con la respuesta del servidor.
 */
export const createItems = async (collectionName , data) => {
  try {
    const response = await axios.post(`${BASE_URL}/${collectionName}`, data);
    console.log(response);
    
    //alert("Registro creado exitosamente");
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * Actualizar un elemento por ID.
 * @param {string} collectionName - El nombre de la colección en la base de datos.
 * @param {string} id - El ID del elemento con el que se va a trabajar.
 * @param {object} data - Los datos que enviaras al backend.
 * @returns {Promise<any>} Una promesa que se resuelve con la respuesta del servidor.
 */
export const updateItems = async (collectionName , id, data) => {
  try {
    const response = await axios.put(`${BASE_URL}/${collectionName}/${id}`, data, { withCredentials: true });
    //alert("Registro actualizado exitosamente");
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * Eliminar un elemento por ID.
 * @param {string} collectionName - El nombre de la colección en la base de datos.
 * @param {string} id - El ID del elemento con el que se va a trabajar.
 * @returns {Promise<any>} Una promesa que se resuelve con la respuesta del servidor.
 */
export const deleteItems = async (collectionName , id) => {
  let result = window.confirm("¿Estás seguro de eliminar este registro?");
  if(result){
    try {
      const response = await axios.delete(`${BASE_URL}/${collectionName}/${id}`, { withCredentials: true });
      alert("Registro eliminado");
      return handleResponse(response);
    } catch (error) {
      handleError(error);
      alert("Error al eliminar el registro");
    }
  }else{alert("Operacion cancelada");}
};

//Registrar un usuario
export const userRegistered = async (collectionName, event) => {
  event.preventDefault();
  let phone = event.target.codigo.value+event.target.cellPhone.value;
  
  const data = {
    name: sanitizeStrings(event.target.name.value, 2),
    lastName: sanitizeStrings(event.target.lastName.value, 2),
    user: sanitizeStrings(event.target.user.value, 2),
    password: sanitizeStrings(event.target.password.value, 1),
    confirmPassword: sanitizeStrings(event.target.confirmPassword.value, 1),
    email: sanitizeStrings(event.target.email.value, 4),
    cellPhone: sanitizeStrings(phone, 3),
    type: true,
  }
  console.log(data)
  //console.log(collectionName)
  if(data.password !== data.confirmPassword){
      return 'Las contraseñas no coinciden';
  }
  try {
    const response = await axios.post(`${BASE_URL}/${collectionName}/register`, data);
    //alert("Registro creado exitosamente");
    handleResponse(response);
    return '';
  } catch (error) {
    handleError(error);
    return error.response.data.error;
  }
};

//obtener usuario
export const getUser = async (collectionName , user) => {
  try {
    const response = await axios.get(`${BASE_URL}/${collectionName}/getUser/${user}`, { withCredentials: true });
    handleResponse(response);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

//login
export const userLogin = async (event) =>{
  event.preventDefault();
  const data = {
    user: sanitizeStrings(event.target.user.value, 2),
    password: sanitizeStrings(event.target.password.value, 1),
  }
  try {
    const response = await axios.post(`${BASE_URL}/accounts/login`, data, { withCredentials: true });
    handleResponse(response);
    return {error: '', user: response.data.user, token: response.data.aToken};
  } catch(error){
    handleError(error);
    return {error: error?.response?.data?.error};
  }

}

//logout
export const userLogout = async () =>{
  try {
    const response = await axios.post(`${BASE_URL}/accounts/logout/`, '', { withCredentials: true });
    window.location.reload();
    handleResponse(response);
    alert('Sesion Terminada');
    return {error: ''};
  } catch(error){
    handleError(error);
    return {error: error.response.data.error};
  }

}

//Validar token
export const validateToken = async (data) => {
  try {
    //console.log(data);
    let response = await axios.get(`${BASE_URL}/accounts/authenticateToken/`, { withCredentials: true })
    handleResponse(response);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}