const mongoose = require('mongoose');
const Settings = require('../models/settings');
const Beverage = require('../models/beverage');
const Order = require('../models/orders');

const testsUtil = {
    setSettings: async (reservoir, allowedBeverages) => {
        let settings = new Settings({
            _id: mongoose.Types.ObjectId(),
            reservoir: reservoir,
            drinkSize: [
                {
                    size: "Small",
                    volume: 100
                },
                {
                    size: "Medium",
                    "volume": 250
                },
                {
                    size: "Large",
                    volume: 400
                }
            ],
            allowedBeverages : allowedBeverages
        }
        )
        await settings.save();
    },

    createBeverage: async () => {
        //Create a beverage
        let beverage = new Beverage({
            _id: mongoose.Types.ObjectId(),
            name: "Green Tea",
            type: "Tea",
            temperature: 80,
            garnish: "Orange"
        })
        await beverage.save();
        return beverage._id.toString();
    }, 

    createOrderWithStatus: async (status) => {
        //Create a Order
        let order = new Order({
            _id: mongoose.Types.ObjectId(),            
            username : 'John', 
            beverage : '612170860cd5522428f1b3d1',
            drinkSize : 'Medium',
            status : status
        })
        await order.save();
        return order._id.toString();
    }, 

    getOrderStatus: async(id) => {
        let order = await Order.findById(id).exec();
        return order.status;
    },

    getSettingsReservoir: async() => {
        let settings = await Settings.find().exec();
        return settings[0].reservoir;
    }

}

module.exports = testsUtil;
