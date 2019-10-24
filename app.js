var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const listings = require("./routes/listings")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.get('/listings', listings.findListings);
app.get('/listings/:id', listings.findByID);
app.get('/listings/title/:title', listings.findByTitle);
app.get('/listings/category/:category', listings.findByCategory);

app.put('/listings/:id/love', listings.incrementHeart);

app.put('/listings/:id/changetitle', listings.changeTitle);
app.put('/listings/:id/changedesc', listings.changeDescription);
app.put('/listings/:id/changefeatured', listings.changeFeatured);

app.post('/listings',listings.addListing);
app.post('/listings/search', listings.searchListings);

app.delete('/listings/:id', listings.deleteListingByID);
app.delete('/listings/title/:title', listings.deleteListingByTitle);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
