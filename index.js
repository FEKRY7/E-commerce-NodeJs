const express = require('express');
const app = express();

const product = require('./src/Router/ProdectRouter.js');
const user = require('./src/Router/UsersRouter.js');
const cart = require('./src/Router/CartRouter.js');
const category = require('./src/Router/CategoryRouter.js');
const page = require('./src/Router/PageRouter.js');
const address = require('./src/Router/AddressRouter.js');
const order = require('./src/Router/OrderRouter.js');

const cors = require('cors');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const mongoConnection = require('./Database/dbConnection.js');
mongoConnection();

// Set up server to listen on specified port (default to 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './uploads')));

// Routes
app.use('/', product);
app.use('/api/user', user);
app.use('/api/cart', cart);
app.use('/api/category', category);
app.use('/api/page', page);
app.use('/api/address', address);
app.use('/api/order', order);


app.use((req, res, next) => {
  if (req.originalUrl === "/api/order/Webhook") {
    return next();
  }
  express.json()(req, res, next);
});

// 404 route
app.use('*', (req, res) => {
  res.status(404).json({ 'Msg': 'I Can\'t Found' });
});
