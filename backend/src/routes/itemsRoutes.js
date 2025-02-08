const express = require('express');
const itemController = require('../controllers/itemsController');
const router = express.Router();

router.get('/', itemController.getItems);
router.get('/:id', itemController.getItemById);
router.get('/key/:key', itemController.getItemByKey);
router.post('/', itemController.createItem);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;