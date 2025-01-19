export const BASE_URL = 'http://localhost:5000/api'; // Reemplaza con la URL base de tu API
/**
 * 
 * @param {any} response -El resultado de tu consulta al backend.
 * @returns 
 */
export const handleResponse = (response) => {
    const { status, statusText, data } = response;
  
    if (status >= 200 && status < 300) {
      // Respuesta exitosa
      return data;
    } else if (status >= 300 && status < 400) {
      // Redirección
      throw new Error('Redirección no soportada');
    } else if (status >= 400 && status < 500) {
      // Error del cliente
      switch (status) {
        case 400:
          throw new Error('Solicitud incorrecta: ' + (statusText || 'Bad Request'));
        case 401:
          throw new Error('No autorizado: ' + (statusText || 'Unauthorized'));
        case 403:
          throw new Error('Prohibido: ' + (statusText || 'Forbidden'));
        case 404:
          throw new Error('No encontrado: ' + (statusText || 'Not Found'));
        default:
          throw new Error('Error del cliente: ' + (statusText || 'Client Error'));
      }
    } else if (status >= 500 && status < 600) {
      // Error del servidor
      switch (status) {
        case 500:
          throw new Error('Error interno del servidor: ' + (statusText || 'Internal Server Error'));
        case 502:
          throw new Error('Bad Gateway: ' + (statusText || 'Bad Gateway'));
        case 503:
          throw new Error('Servicio no disponible: ' + (statusText || 'Service Unavailable'));
        case 504:
          throw new Error('Tiempo de espera agotado: ' + (statusText || 'Gateway Timeout'));
        default:
          throw new Error('Error del servidor: ' + (statusText || 'Server Error'));
      }
    } else {
      // Otros casos
      throw new Error('Respuesta inesperada: ' + (statusText || 'Unexpected Response'));
    }
  };

  // Función para manejar errores
  export const handleError = (error) => {
    console.error('¡La llamada a la API falló! 😢', error);
    return error;
  };
  