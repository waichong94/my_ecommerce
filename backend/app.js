var express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadRouter = require('./routes/upload');
var productsRouter = require('./routes/products');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

var dbUri = "mongodb+srv://user:kQbt1tKm3WF3Q5IH@cluster0.avq1wtv.mongodb.net/e-commerce"
mongoose.connect(dbUri)
.then((result) => {
    console.log('Connected to database.');
}).catch((err) => {
    console.log(err);
})

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/upload', uploadRouter);
app.use('/images', express.static('public/images'))

module.exports = app;
