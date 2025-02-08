// backend/controllers/itemController.js
const accounts = require('../models/accounts');
const bcrypt = require('bcryptjs');
const { createToken, validateToken } = require('../JWT');
const { decode, verify } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
const { signedCookie } = require('cookie-parser');
const { printf } = require('../../functions');
const { findById } = require('../models/orders');
const mongoose = require('mongoose');
const {encodeBase64, decodeBase64} = require('../scripts/codeBase64');
const { genUserName } = require('../../functions');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Obtener todos los registros de una colección
exports.getItems = async (req, res) => {
    //printf('log', 'Iniciando solicitud para obtener todos los items');
    //console.log('Cookies recibidas:', req.token);

    try {
        const accessToken = req.token['access-token'];

        if (!accessToken) {
            //printf('error', 'No se encontró el token en la cookie');
            return res.status(400).json({ error: 'No se encontró el token' });
        }

        // Verificar y decodificar el token
        verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                //printf('error', 'Token inválido');
                return res.status(403).json({ error: 'Token inválido' });
            }

            const user = decoded.user.user; // Suponiendo que el token contiene el nombre de usuario
            //printf('log', `Usuario decodificado del token: ${user}`);

            if (!user) {
                //printf('error', 'Faltan datos de usuario en el token');
                return res.status(400).json({ error: 'Faltan datos de usuario en el token' });
            }

            const account = await accounts.findOne({ user: user });
            if (!account) {
                //printf('error', `Usuario no encontrado: ${user}`);
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            //printf('log', `Cuenta encontrada con ID: ${account._id}`);
            res.json({
                name: account.name,
                lastName: account.lastName,
                user: account.user,
                email: account.email,
                cellPhone: account.cellPhone,
            });
        });
    } catch (error) {
        console.error(error);
        //printf('error', 'Error interno del servidor al obtener los items');
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
exports.getItems0 = async (req, res) => {
    //printf('log', 'Iniciando solicitud para obtener todos los items');
    try {
           const account = await accounts.find().select('name lastName user email cellPhone type');
            res.json(account);
        }catch (error) {
        console.error(error);
        printf('error', 'Error interno del servidor al obtener los items');
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener un registro por su ID
exports.getItemById = async (req, res) => {
    const id = req.params.id;
    //printf('log', `Iniciando solicitud para obtener el item con ID: ${id}`);
    try {
        const account = await accounts.findById(id);
        if (!account) {
            printf('error', `Registro no encontrado con ID: ${id}`);
            return res.status(404).json({ mensaje: 'Registro no encontrado' });
        }
        //printf('log', `Cuenta encontrada con ID: ${id}`);
        res.json({
            name: account.name,
            lastName: account.lastName,
            user: account.user,
            email: account.email,
            cellPhone: account.cellPhone,
            type: account.type
        });
    } catch (error) {
        console.error(error.message);
        printf('error', 'Error del servidor al buscar por ID');
        res.status(500).send('Error del servidor');
        res.json({error: 'No se pudo obtener la cuenta'});
    }
};

//Obtener registro por la clave, (Por un campo en este caso se uso el campo key)
exports.getItemByKey = async (req, res) => {
    //printf('log', `Iniciando solicitud para obtener un item`);
    try {
      let encodedKey = req.cookies['user'];
      const key = decodeBase64(encodedKey); // Obtener la clave desde los parámetros de la solicitud
      //console.log('recibo la llave', key);

      if(key.error){
        res.clearCookie('access-token');
        res.clearCookie('user');
        res.clearCookie('userId');
        return res.status(404).json({ mensaje: 'Registro no encontrado' });
      }

      const item = await accounts.findOne({ user: key }); // Buscar una registro por su clave en la base de datos
      
      
      if (!item) {
       // printf('error', `Registro no encontrado con ID`);
        return res.status(404).json({ mensaje: 'Registro no encontrado' });
      }
      //printf('log', `Registro encontrado ${item}`);
      res.json(item); // Devolver el registro encontrado como respuesta JSON
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error del servidor');
    }
  };

// Iniciar Sesión
exports.login = async (req, res) => {
    //printf('log', 'Iniciando solicitud de inicio de sesión');
    try {
        const { user, password } = req.body;

        if (!user || !password) {
            printf('error', 'Faltan datos de usuario o contraseña');
            return res.status(400).json({ error: 'Faltan datos de usuario o contraseña' });
        }

        let account = await accounts.findOne({ user: user });

        if (!account) {
            account = await accounts.findOne({ email: user });
            if (!account) {
                printf('error', `Usuario no encontrado: ${user}`);
                return res.status(404).json({ error: 'Usuario o Contraseña incorrectos' });
            }
        }

        const bdPassword = account.password;

        bcrypt.compare(password, bdPassword).then((match) => {
            if (!match) {
                printf('error', `Usuario o contraseña incorrectos para: ${user}`);
                return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
            } else {
                const accessToken = createToken(account);
                printf('success', `Generado token de acceso para usuario con ID: ${account._id}`);
                res.cookie('access-token', accessToken, {
                    httpOnly: true,
                    maxAge: 86400000,
                    sameSite: 'Strict',
                    secure: true
                });
                res.cookie('userId', encodeBase64(account._id.toString()), {
                    httpOnly: true,
                    maxAge: 86400000,
                    sameSite: 'Strict',
                    secure: true
                });
                res.cookie('user', encodeBase64(user), {
                    httpOnly: true,
                    maxAge: 86400000,
                    sameSite: 'Strict',
                    secure: true
                });
                res.json({
                    aToken: accessToken,
                    user: user
                });
            }
        });
    } catch (error) {
        console.error(error);
        printf('error', 'Error interno del servidor al iniciar sesión');
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


exports.loginByGoogle = async (req, res) => {
  try {
    const { clientId, credential } = req.body;

    //console.log('data\n'+clientId+'\n'+credential);
    

    // Verificar y decodificar el token de ID
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    //console.log(payload);

    const userData = {
        user: '',
        name: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
        cellPhone: '',
        type: true
    }

    let account = await accounts.findOne({ email: userData.email });
    if (!account) {
        const existingUser = await accounts.findOne({ $or: [{ email: userData.email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Error al crear usuario' });
        }

        const newAccount = new accounts({
            name: userData.name,
            lastName: userData.lastName,
            user: genUserName(),
            password: '',
            email: userData.email,
            cellPhone: '',
            type: true,
        });

        await newAccount.save();
        printf('success', `Usuario registrado con éxito con ID: ${newAccount._id}`);
        account = newAccount;
    }

    const accessToken = createToken(account);
                printf('success', `Generado token de acceso para usuario con ID: ${account._id}`);
                res.cookie('access-token', accessToken, {
                    httpOnly: true,
                    maxAge: 86400000,
                    sameSite: 'Strict',
                    secure: true
                });
                res.cookie('userId', encodeBase64(account._id.toString()), {
                    httpOnly: true,
                    maxAge: 86400000,
                    sameSite: 'Strict',
                    secure: true
                });
                res.cookie('user', encodeBase64(account.user), {
                    httpOnly: true,
                    maxAge: 86400000,
                    sameSite: 'Strict',
                    secure: true
                });
                res.json({
                    aToken: accessToken,
                    user: account.email
                });

  } catch (error) {
    console.error('Error al acceder con google');
    res.status(401).json({ message: 'Token inválido' });
  }
};


// Cerrar sesión
exports.logout = async (req, res) => {
    const token = req.cookies['access-token'] ;
    //printf('log', `Recibo el token para cerrar sesión: ${token}`);

    if (!token) {
        printf('error', 'Token no proporcionado');
        return res.status(400).json({ message: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        res.clearCookie('access-token');
        res.clearCookie('user');
        res.clearCookie('userId');
        printf('success', `Sesión cerrada con éxito para usuario con ID: ${decoded.user.user}`);
        res.status(200).json({ message: 'Sesión cerrada con éxito' });
    } catch (error) {
        printf('error', 'Token inválido al cerrar sesión');
        res.status(401).json({ message: 'Token inválido' });
    }
};

// Crear un nuevo registro
exports.createItem = async (req, res) => {
    //printf('log', 'Iniciando solicitud para crear un nuevo item');
    try {
        const { name, lastName, email, cellPhone, user, password, type } = req.body;

        const existingUser = await accounts.findOne({ $or: [{ email: email }, { user: user }] });
        if (existingUser) {
            printf('error', `El usuario o email ya existen: ${user} - ID relacionado: ${existingUser._id}`);
            return res.status(400).json({ error: 'El usuario o email ya existen' });
        }

        const hash = await bcrypt.hash(password, 10);
        const newAccount = new accounts({
            name: name,
            lastName: lastName,
            user: user,
            password: hash,
            email: email,
            cellPhone: cellPhone,
            type: type,
        });

        await newAccount.save();
        printf('success', `Usuario registrado con éxito con ID: ${newAccount._id}`);
        res.json(newAccount);
        return null;
    } catch (error) {
        console.error(error.message);
        printf('error', 'Error al crear un nuevo usuario');
        res.status(500).send('Error del servidor');
    }
};

// Actualizar un registro
exports.updateItem = async (req, res) => {
    const itemId = req.params.id;
    //printf('log', `Iniciando solicitud para actualizar el item con ID: ${itemId}`);
    try {
        const { name, lastName, user, email, cellPhone } = req.body;
        const updatedAccount = await accounts.findByIdAndUpdate(
            itemId,
            { name, lastName, user, email, cellPhone },
            { new: true }
        );
        if (!updatedAccount) {
            printf('error', `Registro no encontrado con ID: ${itemId}`);
            return res.status(404).json({ mensaje: 'Registro no encontrado' });
        }
        res.clearCookie('user')
        res.cookie('user', encodeBase64(user), {
            httpOnly: true,
            maxAge: 86400000,
            sameSite: 'Strict'
        });
        printf('success', `Cuenta actualizada con éxito con ID: ${itemId}`);
        res.json(updatedAccount);
    } catch (error) {
        console.error(error.message);
        printf('error', 'Error al actualizar registro');
        res.status(500).send('Error del servidor');
    }
};

// Eliminar un registro
exports.deleteItem = async (req, res) => {
    const itemId = req.params.id;
    printf('log', `Iniciando solicitud para eliminar el item con ID: ${itemId}`);
    try {
        const deletedAccount = await accounts.findByIdAndDelete(itemId);
        if (!deletedAccount) {
            printf('error', `Registro no encontrado con ID: ${itemId}`);
            return res.status(404).json({ mensaje: 'Registro no encontrado' });
        }
        printf('success', `Cuenta eliminada con éxito con ID: ${itemId}`);
        res.json({ mensaje: 'Registro eliminado exitosamente' });
    } catch (error) {
        console.error(error.message);
        printf('error', 'Error al eliminar registro');
        res.status(500).send('Error del servidor');
    }
};

// Verificar token
exports.authenticateToken = async (req, res) => {
    try {
        let encodedUserc = req.cookies['user'];
    let encodedUserId = req.cookies['userId'];


    const token = req.cookies['access-token'] ;
    const userc = decodeBase64(encodedUserc);
    const userId = decodeBase64(encodedUserId);

    if(userc.error || userId.error){
        res.clearCookie('access-token');
        res.clearCookie('user');
        res.clearCookie('userId');
        return res.status(404).json({ message: 'Datos de usuario incorrectos' });
      }

    const userData = await accounts.findById(userId)

    //printf('log', `${userData}`);

    if (token == null) {
        printf('error', 'Token no proporcionado');
        return res.status(401).json({ success: false, message: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            //printf('error', 'Token no válido');
            return res.status(403).json({ isValid: false, message: 'Token no válido' });
        }

        req.user = user;
        //printf('log', 'Token válido');
        return res.json({ user: userc, id: userData.id, isValid: true, message: 'Token válido' });
    });
    } catch (error) {
        console.error(error.message);
        printf('error', 'Error al verificar token');
        res.status(500).send('Error del servidor');
    }
};
