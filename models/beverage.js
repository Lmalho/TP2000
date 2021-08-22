const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const beverageSchema = new Schema(
    {
        _id: Schema.Types.ObjectId,
        name: { type: String, required : [true, 'Beverage name is required'] },
        type: {type: String, required : [true, 'Beverage type is required'] },
        temperature: {type: Number, required : [true, 'Beverage temperature is required'] },
        garnish: String
    },
    { timestamps: true }
);
beverageSchema.index({ name: 1, type: -1 });
beverageSchema.set('collection', 'beverages');
module.exports = mongoose.model('beverages', beverageSchema);