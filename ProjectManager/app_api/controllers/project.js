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

                                if(req.body.adminUsers){
                                    project.adminUsers = req.body.adminUsers.split(',');
                                }
                                if(req.body.adminUsers){
                                    project.standardUsers=req.body.standardUsers.split(',');
                                }



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

module.exports.updateProject = function(req, res) {
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

                if(!req.params.id) {
                    sendJSONresponse(res, 400, {
                        "message": "id is required!"
                    });
                    return;
                }

                Project.findById(req.params.id, function (err, project){
                    if(err){
                        sendJSONresponse(res, 400, {
                            "message": err
                        });
                    }

                    if(project){
                        if(project.owner===user.id){
                            project.title = req.body.title || project.title;
                            project.description = req.body.description || project.description;
                            project.status = req.body.status || project.status;

                            if(req.body.adminUsers){

                                    req.body.adminUsers.split(',').forEach(function (id) {

                                        User.findById(id, function (err, item){

                                           if(item){

                                           }
                                        });

                                    })


                            }

                            if(req.body.standardUsers){

                                req.body.standardUsers.split(',').forEach(function (id) {
                                    User.findById(id, function (err, item){

                                        if(item){

                                            project.standardUsers=item.id ;



                                        }
                                    });
                                })

                            }




                            project.save(function(err) {
                                if (err){
                                    res.status(400).json(err);
                                }else{

                                    res.status(200);
                                    res.json(project);
                                }

                            });

                        }else{
                            sendJSONresponse(res, 400, {
                                "message": 'only projectOwner can update project data!'
                            });
                        }

                    }else{
                        sendJSONresponse(res, 400, {
                            "message": 'cannot find project!'
                        });
                    }


                });
            })
    }
}

module.exports.getMyProject = function(req, res) {

    if (!req.payload._id) {
        res.status(401).json({
            "message" : "UnauthorizedError: private profile"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function(err, user) {
                Project.find({owner:user.id}, 'title description', function (err, projects) {
                   if(err){
                       sendJSONresponse(res, 400, {
                           "message": err
                       });
                   }
                   if(projects){
                       res.status(200).json(projects);
                   }
                })
            });
    }

};




