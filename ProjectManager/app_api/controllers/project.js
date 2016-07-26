/**
 * Created by dincho.kostadinov on 26.7.2016 г..
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Project= mongoose.model('Project');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.createProject = function(req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            "message" : "UnauthorizedError: private profile"
        });

    } else {

        User
            .findById(req.payload._id)
            .exec(function(err, user) {

                if (err) {
                    res.status(400).json(err);
                }

                Project.findOne({ title:req.body.title}, function (err, title){
                    if(err){
                        sendJSONresponse(res, 400, {
                            "message": err
                        });
                    }
                    if(!req.body.title || !req.body.description) {
                        sendJSONresponse(res, 400, {
                            "message": "title and description are required!"
                        });
                        return;
                    }
                    if(req.body.title.length<=5){
                        sendJSONresponse(res, 400, {
                            "message": "title must be more than 5 symbols"
                        });
                        return;
                    }

                    if(req.body.title.length>=50){
                        sendJSONresponse(res, 400, {
                            "message": "title cannot be more than 50 symbols"
                        });
                        return;
                    }
                    if(req.body.description.length<=5){
                        sendJSONresponse(res, 400, {
                            "message": "title must be more than 5 symbols"
                        });
                        return;
                    }

                    if(req.body.description.length>=600){
                        sendJSONresponse(res, 400, {
                            "message": "description cannot be more than 600 symbols"
                        });
                        return;
                    }

                    if(title){
                        sendJSONresponse(res, 400, {
                            "message": "project exist"
                        });
                    }else{

                                var project = new Project();

                                project.title = req.body.title;
                                project.owner = user.id;
                                project.description = req.body.description;

                                project.save(function(err) {
                                    if (err) {
                                        res.status(400).json(err);
                                    }

                                    res.status(201);
                                    res.json({
                                        project:project
                                    });
                                });


                    }
                });
            })
    }
}


