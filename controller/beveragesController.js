const mongoose = require('mongoose');
const Beverage = require('../models/beverage');

const beverageController = {
    post: async (req, res) => {
        try {
            if(!req.body) throw new Error(`Invalid Request`);
            const existingBeverage = await Beverage.findOne({ name: req.body.name });
            if (existingBeverage) throw new Error(`A beverage with the name ${req.body.name} already exists.`);
            const beverage = new Beverage({
                _id: mongoose.Types.ObjectId(),
                name: req.body.name ? req.body.name : '',
                type: req.body.type ? req.body.type : '',
                temperature: req.body.temperature ? req.body.temperature : '',
                garnish: req.body.garnish ? req.body.garnish : ''
            })
            let validation = beverage.validateSync();
            if (validation) {
                res.status(400).json({
                    message: validation.toString()
                });
            }
            else {
                const newBeverage = await beverage.save();
                res.status(201)
                    .json({
                        message: 'New beverage created',
                        beverage: {
                            id: newBeverage._id,
                            name: newBeverage.name,
                            type: newBeverage.type,
                            temperature: newBeverage.temperature,
                            garnish: newBeverage.garnish
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
            await Beverage
                .find()
                .exec()
                .then(beverages => {
                    res.status(200)
                        .json(
                            {
                                count: beverages.length,
                                beverages: beverages.map(beverage => {
                                    return {
                                        id: beverage._id,
                                        name: beverage.name,
                                        type: beverage.type,
                                        temperature: beverage.temperature,
                                        garnish: beverage.garnish
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
            const beverage = mongoose.isValidObjectId(req.params.beverageId) ? await Beverage.findById(req.params.beverageId) : null
            if (beverage) {
                res.status(200)
                    .json({
                        id: beverage._id,
                        name: beverage.name,
                        type: beverage.type,
                        temperature: beverage.temperature,
                        garnish: beverage.garnish
                    })
            }
            else {
                res.status(400).json({
                    message: "No beverage found with that id"
                });
            }
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    putById: async (req, res) => {
        try {
            if (!mongoose.isValidObjectId(req.params.beverageId)) throw new Error("No beverage found with that id");
            const existingBeverage = await Beverage.findOne({ name: req.body.name });
            if (existingBeverage) throw new Error(`A beverage with the name ${req.body.name} already exists.`);

            const beverage = await Beverage.findByIdAndUpdate(req.params.beverageId, { $set: req.body }, { new: true }) ;
            if (beverage) {
                if (!beverage.errors) {
                    res.status(200)
                        .json({
                            message: `Beverage with id ${req.params.beverageId} was updated`,
                            beverage: {
                                id: beverage._id,
                                name: beverage.name,
                                type: beverage.type,
                                temperature: beverage.temperature,
                                garnish: beverage.garnish
                            }
                        })
                }
                else {
                    res.status(400).json({
                        message: errors.message
                    });
                }
            }
            else {
                res.status(400).json({
                    message: "No beverage found with that id"
                });
            }
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    deleteById: async (req, res) => {
        try {
            const beverage = mongoose.isValidObjectId(req.params.beverageId) ? await Beverage.findByIdAndDelete(req.params.beverageId) : null
            if (beverage) {
                res.status(200)
                    .json({
                        message: `Beverage with id ${req.params.beverageId} was removed`
                    })
            }
            else {
                res.status(400).json({
                    message: "No beverage found with that id"
                });
            }
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = beverageController;