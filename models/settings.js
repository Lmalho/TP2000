const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingsSchema = new Schema(
    {
        _id: Schema.Types.ObjectId,
        reservoir: Number,
        drinkSize: [
            { size: String, volume: Number }
        ]
    },
    { timestamps: true }
);

settingsSchema.set('collection', 'settings');

module.exports = mongoose.model('settings', settingsSchema);