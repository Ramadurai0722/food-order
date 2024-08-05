const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT||4000;

app.use(bodyParser.json());

//  CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(morgan('dev'));

// MongoDB connection
const dbPassword = 'ra11092002hul';
const dbURI = 'mongodb+srv://Admin:' + dbPassword + '@cluster0.zr2isau.mongodb.net/Food-Order';

mongoose.connect(dbURI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error', err);
  });


// use routes
const userRoute = require('./route/userRoute');
app.use('/users', userRoute);

const orderRoutes = require('./route/orderRoute');
app.use('/order', orderRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
