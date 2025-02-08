const express = require('express');
const router = express.Router();
const { validateToken } = require('../JWT');
const accountsController = require('../controllers/accountsController');

// Rutas de autenticación
router.post('/login', accountsController.login);
router.post('/loginByGoogle', accountsController.loginByGoogle);
router.post('/logout', accountsController.logout);
router.post('/register', accountsController.createItem);
router.get('/authenticateToken', accountsController.authenticateToken);

// Rutas de usuarios
router.get('/getAllUsers', validateToken, accountsController.getItems0);
router.get('/getUser/:token', validateToken, accountsController.getItemByKey);
router.get('/getById/:id', accountsController.getItemById);
router.put('/:id', validateToken, accountsController.updateItem);
router.delete('/:id', validateToken, accountsController.deleteItem);

module.exports = router;
