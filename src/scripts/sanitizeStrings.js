function sanitizeString(input, level = 1) {
    // Verifica que el valor proporcionado sea una cadena
    if (typeof input !== "string") {
        throw new Error("El valor proporcionado debe ser una cadena.");
    }

    // Nivel 1: Elimina espacios al inicio y al final
    let sanitized = input.trim();

    // Nivel 2: Elimina diacríticos (acentos, tildes) si el nivel es 2 o superior
    if (level >= 2) {
        sanitized = sanitized
            .normalize("NFD") // Descompone caracteres con diacríticos (ejemplo: "é" -> "e" + "´")
            .replace(/[\u0300-\u036f]/g, ""); // Elimina los diacríticos descompuestos
    }

    // Nivel 3: Elimina todos los espacios dentro de la cadena si el nivel es 3 o superior
    if (level >= 3) {
        sanitized = sanitized.replace(/\s+/g, ""); // Reemplaza todos los espacios por nada
    }

    // Nivel 4: Convierte todo el texto a minúsculas si el nivel es 4 o superior
    if (level >= 4) {
        sanitized = sanitized.toLowerCase();
    }

    return sanitized;
}

export default sanitizeString;