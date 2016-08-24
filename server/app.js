var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var nodemailer = require('nodemailer');
require('./app_api/models/db');
require('./app_api/config/passport');
var Message = require('./app_api/models/messages');
var Project = require('./app_api/models/projects');
var User = require('./app_api/models/users');
var Conversation = require('./app_api/models/conversation');
var routesApi = require('./app_api/routes/index');
var transporter = nodemailer.createTransport('smtps://eaglemanager.stanga@gmail.com:eaglemanager123456@smtp.gmail.com');
var mailOptions;




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));


app.use(passport.initialize());

app.all("/api/*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    return next();
});


app.use('/api', routesApi);

app.use(function(req, res) {
    res.render('index');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

//  Catch unauthorised errors
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({
            "message": err.name + ": " + err.message
        });
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
server.listen(7777, function() {
    console.log(' app listening on port 7777!');
});
/**
 * listeners for chat and notifications
 */
io.sockets.on('connection', function(socket) {
    console.log("user connected!");

    socket.on('subscribe', function(conversation) {
        console.log('joining conversation');
        socket.join(conversation);
    });

    socket.on('unsubscribe', function(conversation) {
        console.log('leaving conversation');
        socket.leave(conversation);
    });

    socket.on('send', function(data) {
        var message = new Message();
        message.conversationId = data.conversationId;
        message.body = data.body;
        message.author = data.author;

        message.save(function(err, message) {
            console.log('Message saved!');
            socket.to(data.conversationId).emit('send', message);
        });

    });
    socket.on('disconnect', function() {
        console.log('user disconnected');

    });
    socket.on('notification', function(data) {
        Conversation.findOne({
            projectId: data.projectId
        }, function(err, con) {
            User.find({
                _id: {
                    $in: con.participants
                },
                position: data.keyword
            }, function(err, users) {
                socket.to(data.conversationId).emit('notification ' + data.projectId, {
                    users: users,
                    conversationId: con._id,
                    message: data.body,
                    position: data.keyword
                });
                var receivers = [];
                users.forEach(function(user) {
                    receivers.push(user.email);
                });



                mailOptions = {
                    from: '"Eager Manager" <eaglemanager.stanga@gmail.com>', // sender address
                    to: receivers, // list of receivers
                    subject: 'New message in conversation: ' + data.conversationName, // Subject line
                    html: '<div style="text-align:center;font-size:50px"><i>' + data.author + '</i><b>' + ' said: ' + data.body + '</b></div>' // html body
                };


                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {

                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });

            });

        });

    });

});
