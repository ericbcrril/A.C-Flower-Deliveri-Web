const express = require('express');
const controller = require('../controllers/ordersController');
const router = express.Router();

router.get('/', controller.getItems);
router.get('/:id', controller.getItemById);
router.get('/key/:key', controller.getItemByKey);
router.post('/', controller.createItem);
router.post('/bouquet/', controller.createOrderBouquet);
router.put('/:id', controller.updateItem);
router.delete('/:id', controller.deleteItem);

module.exports = router;