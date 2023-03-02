const express = require('express');
const db = require('./config/db');
const createTable = require('./database/createTable');
const userRoutes = require('./routes/userRoute');
const loginRoute = require('./routes/loginRoute');
const productRoute = require('./routes/productRoute');
const orderRoute = require('./routes/orderRoute')
const authMiddleware = require('./middlewares/auth');

require('dotenv/config')

const app = express();

const PORT = 4000 || process.env.PORT;

// const crypto = require('crypto');
// console.log(crypto.randomBytes(64).toString('hex'));


app.use(express.json());
app.use('/pharmacy',  userRoutes);
app.use('/pharmacy',  productRoute);
app.use('/pharmacy', loginRoute);
app.use('/pharmacy', orderRoute);



// Create database table on server startup
createTable();


app.listen(PORT, ()=>{
    console.log(`Server Connected to Port: ${PORT} successfully`);
})