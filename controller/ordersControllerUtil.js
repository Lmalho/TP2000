const mongoose = require('mongoose');
const Settings = require('../models/settings');
const Order = require('../models/orders');


const orderControllerUtil = {
    //return if there's enough water in the reservoir
    checkReservoir: async (size) => {
        let settings = await Settings.find().exec();
        let reservoir = settings[0].reservoir;
        let drinkSizeVol = settings[0].drinkSize.filter(x => x.size == size)[0].volume;
        if (reservoir - drinkSizeVol > 0) {
            await orderControllerUtil.updateReservoir(reservoir, drinkSizeVol);
            return true;
        }
        else return false;
    },
    validateBeverage: async (order, beverage) => {
        //Check if the an order can be placed for beverage type
        let allowedBeverages = await orderControllerUtil.allowedBeverages();
        if (allowedBeverages && !allowedBeverages.includes(beverage.type)) {
            throw new Error(`Can only create orders for beverages of the following type: ${allowedBeverages.toString()}`);
        }
        //Check if there's enough water in the reservoir
        if (! await orderControllerUtil.checkReservoir(order.drinkSize)) {
            throw new Error('Not enough water in the reservoir for your order');
        }
    },
    //returns if there's an order with status "In Progress"
    anyInProgressOrders: async () => {
        let orders = await Order.find({ status: 'In Progress' }).exec();
        if (orders && orders.length > 0) {
            return true;
        }
        else return false;
    },
    allowedBeverages: async () => {
        let settings = await Settings.find().exec();
        return settings ? Array.from(settings[0].allowedBeverages) : null;
    },

    startNextOrder: async () => {
        let orders = await Order.find({ status: 'In Queue' })
            .sort({ _id: 1 })
            .exec();
        if (orders && orders.length > 0) {
            await Order.findByIdAndUpdate(orders[0]._id, { $set: { status: 'In Progress' } })
        }
    },
    //Update the amount of water in the reservoir
    updateReservoir: async (reservoir, vol) => {
        await Settings.findOneAndUpdate({}, { $set: { reservoir: reservoir - vol } }).exec();        
    }

}

module.exports = orderControllerUtil