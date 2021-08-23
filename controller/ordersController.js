const mongoose = require('mongoose');
const Order = require('../models/orders');
const orderControllerUtil = require('./ordersControllerUtil');
const Beverage = require('../models/beverage');


const orderController = {
    post: async (req, res) => {
        try {
            //Check if the beverageId is valid
            const beverage = mongoose.isValidObjectId(req.body.beverage) ? await Beverage.findById(req.body.beverage) : null;
            if (!beverage) throw new Error(`${req.body.beverage} is not a valid beverage ID`);
            //If there's an order In Progress the new order goes to the Queue
            let status = await orderControllerUtil.anyInProgressOrders() ? 'In Queue' : 'In Progress';
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                username: req.body.username ? req.body.username : '',
                beverage: req.body.beverage ? req.body.beverage : '',
                drinkSize: req.body.drinkSize ? req.body.drinkSize : '',
                status: status
            })
            let validation = order.validateSync();
            if (validation) {
                res.status(400).json({
                    message: validation.toString()
                });
            }
            else {
                //Validate Beverage
                await orderControllerUtil.validateBeverage(order, beverage)
                    .catch(err => {
                        res.status(400)
                        throw new Error(err);
                    });
                const newOrder = await order.save();
                res.status(201)
                    .json({
                        message: 'New order created',
                        order: {
                            id: newOrder._id,
                            username: newOrder.username,
                            beverage: {
                                id: beverage._id.toString(),
                                name: beverage.name
                            },
                            drinkSize: newOrder.drinkSize,
                            status: newOrder.status
                        }
                    })
            }
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    get: async (req, res) => {
        try {
            await Order
                .find()
                .exec()
                .then(orders => {
                    res.status(200)
                        .json(
                            {
                                count: orders.length,
                                orders: orders.map(order => {
                                    return {
                                        id: order._id,
                                        username: order.username,
                                        beverage: order.beverage._id.toString(),
                                        drinkSize: order.drinkSize,
                                        status: order.status
                                    }
                                })
                            });
                })
                .catch(err => {
                    res.status(500).json({ message: err.message });
                })
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getById: async (req, res) => {

    },

    putById: async (req, res) => {

    }
}

module.exports = orderController;