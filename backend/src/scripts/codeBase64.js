const secretKey = process.env.ACCESS_TOKEN_SECRET;

// Función auxiliar para encriptar/desencriptar mediante XOR
function xorEncryptDecrypt(text) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
      // Se utiliza el operador XOR entre el código del carácter y el código de la clave (cíclica)
      result += String.fromCharCode(
        text.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length)
      );
    }
    return result;
  }
  
  // Función para codificar en Base64 usando la secret key
  function encodeBase64(value) {
    // Primero se encripta el valor con XOR utilizando la clave secreta
    const encryptedValue = xorEncryptDecrypt(value);
    // Luego se codifica el resultado en Base64
    return btoa(encryptedValue);
  }
  
  // Función para decodificar de Base64 usando la secret key con manejo de errores
  function decodeBase64(value) {
    try {
      // Se decodifica el valor de Base64
      const decodedValue = atob(value);
      // Se desencripta aplicando XOR con la misma clave secreta
      return xorEncryptDecrypt(decodedValue);
    } catch (error) {
      // En caso de error se eliminan las cookies y se recarga la página
      console.log('Error al decodificar Base64');
      return {error: 'error al decodificar'};
    }
  }
  
  module.exports = { encodeBase64, decodeBase64 };
  