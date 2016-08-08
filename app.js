var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var  http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

require('./app_api/models/db');
require('./app_api/config/passport');
var Message=require('./app_api/models/messages')
var Conversation=require('./app_api/models/conversation')


var routesApi = require('./app_api/routes/index');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'app_client')));


app.use(passport.initialize());

app.all("/api/*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    return next();
});


app.use('/api', routesApi);

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

//  Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = server;
server.listen(7777, function () {
    console.log(' app listening on port 7777!');
});
io.sockets.on('connection', function(socket){
    socket.on('subscribe', function(conversation) {
        console.log('joining conversation',conversation);
        socket.join(conversation);
    })

    socket.on('unsubscribe', function(conversation) {
        console.log('leaving conversation',conversation);
        socket.leave(conversation);
    })

    socket.on('send', function(data) {

        var message=new Message();
        message.conversationId=data.conversationId;
        message.body=data.body;
        message.author=data.author;
        io.sockets.in(data.conversationId).emit('message', data.body);
        message.save(function(err,message) {
            console.log(message.body)
        });

    });
});