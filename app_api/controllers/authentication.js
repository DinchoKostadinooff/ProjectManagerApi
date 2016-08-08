var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var validateEmail= function (email) {
  if (email.length == 0) return false;
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  return re.test(email);
}

module.exports.register = function(req, res) {

  if(!req.body.name || !req.body.email || !req.body.password || !req.body.position) {
    sendJSONresponse(res, 400, {
      "message": "All fields are required"
     });
     return;
  }

  if(req.body.name.length<=5){
    sendJSONresponse(res, 400, {
      "message": "name must be more than 5 symbols"
    });
    return;
  }

  if(req.body.name.length>=50){
    sendJSONresponse(res, 400, {
      "message": "name cannot be more than 50 symbols"
    });
    return;
  }

  if(req.body.email.length<=5){
    sendJSONresponse(res, 400, {
      "message": "email must be more than 5 symbols"
    });
    return;
  }

  if(req.body.email.length>=50){
    sendJSONresponse(res, 400, {
      "message": "email cannot be more than 50 symbols"
    });
    return;
  }

  if(!validateEmail(req.body.email)){
    sendJSONresponse(res, 400, {
      "message": "emaill error"
    });
    return;
  }

  if(req.body.position.length<=5){
    sendJSONresponse(res, 400, {
      "message": "position must be more than 5 symbols"
    });
    return;
  }

  if(req.body.position.length>=50){
    sendJSONresponse(res, 400, {
      "message": "position cannot be more than 50 symbols"
    });
    return;
  }

  if(req.body.password.length<=5){
    sendJSONresponse(res, 400, {
      "message": "password must be more than 5 symbols"
    });
    return;
  }

  if(req.body.password.length>=50){
    sendJSONresponse(res, 400, {
      "message": "password cannot be more than 50 symbols"
    });
    return;
  }

  User.findOne({ name:req.body.name}, function (err, name){
    if(err){
      sendJSONresponse(res, 400, {
        "message": err
      });
    }

    if(name){
      sendJSONresponse(res, 400, {
        "message": "name exist"
      });
    }else{
      User.findOne({email: req.body.email }, function (err, email) {
        if(err){
          sendJSONresponse(res, 400, {
            "message": err
          });
        }

        if(email){
          sendJSONresponse(res, 400, {
            "message": "email exist"
          });
        }else{
          var user = new User();

          user.name = req.body.name;
          user.email = req.body.email;
          user.position = req.body.position;
          user.setPassword(req.body.password);

          user.save(function(err) {
            var token;
            token = user.generateJwt();
            res.status(200);
            res.json({
              "token" : token
            });
          });
        }
      });

    }
  });
};

module.exports.login = function(req, res) {

   if(!req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields are required"
    });
    return;
  }

  if(req.body.email.length<=5){
    sendJSONresponse(res, 400, {
      "message": "email must be more than 5 symbols"
    });
    return;
  }

  if(req.body.email.length>=50){
    sendJSONresponse(res, 400, {
      "message": "email cannot be more than 50 symbols"
    });
    return;
  }

  if(!validateEmail(req.body.email)){
    sendJSONresponse(res, 400, {
      "message": "emaill error"
    });
    return;
  }

  if(req.body.password.length<=5){
    sendJSONresponse(res, 400, {
      "message": "password must be more than 5 symbols"
    });
    return;
  }

  if(req.body.password.length>=50){
    sendJSONresponse(res, 400, {
      "message": "password cannot be more than 50 symbols"
    });
    return;
  }

  passport.authenticate('local', function(err, user, info){
    var token;


    if (err) {
      res.status(404).json(err);
      return;
    }


    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      res.status(401).json(info);
    }
  })(req, res);

}