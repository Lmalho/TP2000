const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

//Connect to DB

mongoose.connect(process.env.mongoDB,
    { useNewUrlParser: true , useUnifiedTopology: true})
     .then(() => {
         console.log('DB connected');
         
     })
     .catch((err) => {
         console.log(err.message);
     });

app.use(morgan(process.env.morganLogLevel));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Route Import

var beveragesRouter = require('./routes/beverages');
var ordersRouter = require('./routes/orders');

//Routes

app.use('/beverages', beveragesRouter);
app.use('/orders', ordersRouter);

//Not valid route was found, throw a 404 error
app.use(( req, res, next) => {
    const error = new Error('Not found');
    res.status(404);
    next(error);
})

//Error handling 

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});

module.exports = app;