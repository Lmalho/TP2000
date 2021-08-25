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
            // Validate the body against the schema
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
            res.status(500).json({ message: err.message });
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
        try {
            const order = mongoose.isValidObjectId(req.params.orderId) ? await Order.findById(req.params.orderId) : null
            if (order) {
                res.status(200)
                    .json({
                        id: order._id,
                        username: order.username,
                        beverage: order.beverage._id.toString(),
                        drinkSize: order.drinkSize,
                        status: order.status
                    })
            }
            else {
                res.status(400).json({
                    message: "No order found with that id"
                });
            }
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    completeById: async (req, res) => {
        try {
            if (!mongoose.isValidObjectId(req.params.orderId)) {
                res.status(404)
                throw new Error(`No order found with id ${req.params.orderId}`);
            }
            let query = {
                _id: req.params.orderId,
                status: 'In Progress'
            }
            let order = await Order.findOneAndUpdate(query, { $set: { status: 'Completed' } }, { new: true });
            if (order) {
                if (!order.errors) {
                    orderControllerUtil.startNextOrder();
                    res.status(200)
                        .json({
                            message: `Order with id ${req.params.orderId} was completed`
                        })
                }
            }
            else {
                res.status(400).json({
                    message: `No order in progress found with id ${req.params.orderId}`
                });
            }
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = orderController;