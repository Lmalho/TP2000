const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        _id: Schema.Types.ObjectId,
        username : {
            type: String,            
            required: [true, 'Order username is required']
        },
        beverage: {
            type: Schema.Types.ObjectId,
            ref: 'beverages',
            required: [true, 'A beverage id is required']
        },
        drinkSize: {
            type: String,            
            required: [true, 'Order size is required'],
            enum : ['Small', 'Medium', 'Large']
        },
        status: {
            type: String,
            enum: ['In Queue', 'In Progress', 'Completed']     
        }
    },
    { timestamps: true }
);

orderSchema.set('collection', 'orders');

module.exports = mongoose.model('orders', orderSchema);