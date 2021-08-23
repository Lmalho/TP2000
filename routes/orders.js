const express = require('express');
const orderController = require('../controller/ordersController');
const ordersRouter = express.Router();

ordersRouter.get('/', orderController.get);

ordersRouter.post('/', orderController.post)

ordersRouter.route('/:orderId').get(orderController.getById)

ordersRouter.put('/:orderId', orderController.putById);

module.exports = ordersRouter;