const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const beverageSchema = new Schema(
    {
        _id: Schema.Types.ObjectId,
        name: {
            type: String,
            cast: '{VALUE} is not a valid string',
            required: [true, 'Beverage name is required']
        },
        type: {
            type: String,
            cast: '{VALUE} is not a valid string',
            required: [true, 'Beverage type is required']
        },
        temperature: {
            type: Number,
            cast: '{VALUE} is not a valid number',
            required: [true, 'Beverage temperature is required']
        },
        garnish: {
            type: String,
            cast: '{VALUE} is not a valid string'
        }
    },
    { timestamps: true }
);
beverageSchema.index({ name: 1, type: -1 });
beverageSchema.set('collection', 'beverages');
module.exports = mongoose.model('beverages', beverageSchema);