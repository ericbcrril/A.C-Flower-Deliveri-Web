import emailjs from 'emailjs-com';
import axios from 'axios';
import { BASE_URL } from './response';

export const sendEmail = (data) => {

  const getUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/accounts/getAllUsers`, { withCredentials: true });
      // Filtra los usuarios que no sean del tipo "admin"
      return response.data.filter(user => user.type === false);
    } catch (error) {
      console.error('Error al obtener los usuarios', error);
      return []; // Retorna un array vacío si hay error
    }
  };

  const emailData = async () => {
    const users = await getUsers();
    if (users.length === 0) {
      console.error('No se encontraron destinatarios');
      return;
    }
    
    // Obtener los correos electrónicos de los usuarios
    const recipientsArray = users.map(user => user.email).join(',');

    const templateParams = {
      to_email: recipientsArray,
      userId: data.userId,
      receiver: data.receiver,
      date: data.date,
      time: data.time,
      address: data.address.address,
    };

    //console.log(templateParams);

    try {
      console.log(templateParams);
      
      await emailjs.init("mnXnb_0dAvcb0NoNm");
      await emailjs.send('service_cph7pjr' , 'template_f2hz68q', templateParams);
      console.log('Correo enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar el correo', error);
    }
  };

  emailData(); // Llamamos a la función asincrónica para enviar el correo

  return null;
};
