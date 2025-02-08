// Función para codificar en Base64
function encodeBase64(value) {
    return btoa(value); // Codifica en Base64
}

// Función para decodificar de Base64 con manejo de errores
function decodeBase64(value) {
    try {
        return atob(value); // Decodifica de Base64
    } catch (error) {
        deleteAllCookies();
        window.location.reload();
    }
}

// Función para guardar una cookie
export function setCookie(name, value, days = 7, path = '/', secure = false, sameSite = 'Lax') {
    let expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000); // Establecer la expiración en días
    let cookieValue = encodeURIComponent(encodeBase64(value)); // Codifica el valor en Base64
    let cookieString = `${name}=${cookieValue}; expires=${expires.toUTCString()}; path=${path}; SameSite=${sameSite}`;
    
    if (secure) {
        cookieString += "; Secure";
    }

    document.cookie = cookieString;
    //console.log(`Cookie "${name}" guardada.`);
}

// Función para leer una cookie
export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return decodeBase64(decodeURIComponent(parts.pop().split(';').shift())); // Decodifica de Base64
    }
    return null;
}

// Función para eliminar una cookie
export function deleteCookie(name, path = '/') {
    document.cookie = `${name}=; expires=Thu, 01 Jan 2000 00:00:00 UTC; path=${path};`;
    //console.log(`Cookie "${name}" eliminada.`);
}
// Función para eliminar todas las cookies
export function deleteAllCookies() {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const cookieName = cookie.split("=")[0];
        deleteCookie(cookieName);
    }
    //console.log("Todas las cookies han sido eliminadas.");
}

// Función para recuperar el 'user' y el 'token' de la cookie
/*export function getUserAndTokenFromCookie() {
    // Obtener el valor de la cookie 'user'
    const cookieValue = getCookie('user');
    
    if (cookieValue) {
        // Usamos una expresión regular para separar el 'user' y 'token' entre el '-' y ';'
        const regex = /^(.*?)-(.*?);$/;  // La expresión regular busca todo antes del '-' y todo después
        const match = cookieValue.match(regex);

        if (match && match[1] && match[2]) {
            // match[1] contiene el 'user' y match[2] el 'token'
            const user = match[1];
            const token = match[2];
            
            //console.log('Cookie encontrada', user, token);
            
            return { user, token }; // Devuelve un objeto con el 'user' y el 'token'
        } else {
            alert('Token no válido o no encontrado.');
            //deleteAllCookies();
            window.location.reload();
            return null; // Devuelve valores predeterminados si no se encuentra el token
        }
    } else {
        console.log('Cookie no encontrada.');
        return null; // Devuelve valores predeterminados si no se encuentra la cookie
    }
}*/
