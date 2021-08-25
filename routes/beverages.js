const express = require('express');
const beverageController = require('../controller/beveragesController');
const beveragesRouter = express.Router();


beveragesRouter.get('/', beverageController.get);

beveragesRouter.post('/', beverageController.post)

beveragesRouter.route('/:beverageId').get(beverageController.getById)

beveragesRouter.put('/:beverageId', beverageController.putById);

beveragesRouter.delete('/:beverageId', beverageController.deleteById);

module.exports = beveragesRouter;