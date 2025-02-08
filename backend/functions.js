/*
Rojo: \x1b[31m
Verde: \x1b[32m
Amarillo: \x1b[33m
Azul: \x1b[34m
Magenta: \x1b[35m
Cyan: \x1b[36m
Blanco: \x1b[37m
Reset (para volver al color por defecto): \x1b[0m
*/
exports.printf = (type, message) => {

    let color;
    switch(type){
      case 'log':
        color = '\x1b[34m';
      break;
      case 'error':
        color = '\x1b[31m';
      break;
      case 'success':
        color = '\x1b[32m';
      break;
      case 'warn':
        color = '\x1b[33m';
      break;
      default:
        color = '\x1b[37m';
    }
  
    console.log(`${color}${message}`);
  
  }

  require('dotenv').config();

  exports.sendEmailOrder = async (data) => {

    const userEmail = process.env.EMAIL_USER;
    const passEmail = process.env.EMAIL_PASS;

    // services/emailService.js
    const nodemailer = require('nodemailer');
    const User = require('./src/models/accounts'); // Importa tu modelo

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for port 465, false for other ports
      auth: {
        user: userEmail,
        pass: passEmail,
      },
    });

    transporter.verify().then(() => {
          console.log('Listo para enviar emails');
    });

    try {
      
      // Obtener los correos electrónicos de los usuarios que NO sean admins (type === false)
      const users = await User.find({ type: false }, 'email'); 

      if (!users || users.length === 0) {
        console.error('No se encontraron destinatarios');
        return;
      }

      // Convertir los emails en una lista separada por comas
      const recipientsArray = users.map(user => user.email).join(',');

      // Configurar los parámetros del correo
      const mailOptions = {
        from: `"AC Flowers Delivery" <${userEmail}>`,
        to: recipientsArray,
        subject: 'Nuevo Pedido AC Flowers Delivery',
        html: `
       <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Pedido Nuevo de A.C Flowers Delivery</title>
          <style>
            /* Estilos generales para email */
            body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { -ms-interpolation-mode: bicubic; }
          </style>
        </head>
        <body style="background-color: #f9f9f9; margin: 0; padding: 0;">
          <center>
            <!-- Contenedor principal -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center">
                  <!-- Contenedor del email -->
                  <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff;">
                    <!-- Encabezado -->
                    <tr>
                      <td align="center" style="padding: 20px; background-color: #f9f9f9;">
                        <h1 style="margin: 0; color: #583896; font-family: 'Roboto', sans-serif; font-size: 24px;">Pedido Nuevo de A.C Flowers Delivery</h1>
                      </td>
                    </tr>
                    <!-- Contenido -->
                    <tr>
                      <td style="padding: 20px; font-family: 'Roboto', sans-serif; color: #333333; font-size: 16px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="padding: 10px; font-weight: bold; color: #231440;">ID de Usuario:</td>
                            <td style="padding: 10px;">${data.userId}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px; font-weight: bold; color: #231440;">Destinatario:</td>
                            <td style="padding: 10px;">${data.receiver}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px; font-weight: bold; color: #231440;">Fecha de Entrega:</td>
                            <td style="padding: 10px;">${data.date}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px; font-weight: bold; color: #231440;">Hora de Entrega:</td>
                            <td style="padding: 10px;">${data.time}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px; font-weight: bold; color: #231440;">Dirección de Entrega:</td>
                            <td style="padding: 10px;">${data.address.address}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px; font-weight: bold; color: #231440;">Más información:</td>
                            <td style="padding: 10px;"><a href="http://acflowersdelivery.com" target="_blank" style="color: #2c6e49; text-decoration: none;">acflowersdelivery.com</a></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <!-- Pie de página -->
                    <tr>
                      <td align="center" style="padding: 10px; background-color: #231440; color: #ffffff; font-family: 'Roboto', sans-serif; font-size: 14px;">
                        <p style="margin: 0;">¡Gracias por tu atención!</p>
                        <p style="margin: 0;">A.C Flowers Delivery</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </center>
        </body>
        </html>
      `,
      };

      // Enviar el correo
      await transporter.sendMail(mailOptions);
      console.log('Correo enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar el correo', error.message);
    }

  }

  exports.genUserName = () => {
    // Generar un número aleatorio de 8 dígitos
    const aleatorio = Math.floor(Math.random() * 90000000) + 10000000;
  
    // Combinar la fecha, hora y número aleatorio para formar el nombre de usuario
    const nombreUsuario = `user${aleatorio}`;
  
    return nombreUsuario;
  }
  