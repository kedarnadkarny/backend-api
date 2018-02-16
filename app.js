const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/users')

//' + process.env.MONGO_ATLAS_PW + '
mongoose.connect(
    //'mongodb://node-backend:node-backend@cluster-test-shard-00-00-e3q6p.mongodb.net:27017,cluster-test-shard-00-01-e3q6p.mongodb.net:27017,cluster-test-shard-00-02-e3q6p.mongodb.net:27017/admin?replicaSet=Cluster-test-shard-0&ssl=true', 
    'mongodb://node-backend:' + process.env.MONGO_ATLAS_PW + '@cluster-test-shard-00-00-e3q6p.mongodb.net:27017,cluster-test-shard-00-01-e3q6p.mongodb.net:27017,cluster-test-shard-00-02-e3q6p.mongodb.net:27017/test?ssl=true&replicaSet=Cluster-test-shard-0&authSource=admin',
    {
        useMongoClient: true
    }
)
mongoose.Promise = global.Promise

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Origin", "*",
        "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes)

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;