/**
 * Created by dincho.kostadinov on 26.7.2016 г..
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Project = mongoose.model('Project');
var Conversation = mongoose.model('Conversation');
var Message = mongoose.model('Message');


var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.createProject = function(req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });

    } else {

        User
            .findById(req.payload._id)
            .exec(function(err, user) {

                if (err) {
                    res.status(400).json(err);
                }

                Project.findOne({
                    title: req.body.title
                }, function(err, title) {
                    if (err) {
                        sendJSONresponse(res, 400, {
                            "message": err
                        });
                    }
                    if (!req.body.title || !req.body.description) {
                        sendJSONresponse(res, 400, {
                            "message": "title and description are required!"
                        });
                        return;
                    }
                    if (req.body.title.length <= 5) {
                        sendJSONresponse(res, 400, {
                            "message": "title must be more than 5 symbols"
                        });
                        return;
                    }

                    if (req.body.title.length >= 50) {
                        sendJSONresponse(res, 400, {
                            "message": "title cannot be more than 50 symbols"
                        });
                        return;
                    }
                    if (req.body.description.length <= 5) {
                        sendJSONresponse(res, 400, {
                            "message": "title must be more than 5 symbols"
                        });
                        return;
                    }

                    if (req.body.description.length >= 600) {
                        sendJSONresponse(res, 400, {
                            "message": "description cannot be more than 600 symbols"
                        });
                        return;
                    }

                    if (title) {
                        sendJSONresponse(res, 400, {
                            "message": "project exist"
                        });
                    } else {

                        var project = new Project();

                        project.title = req.body.title;
                        project.owner = user.id;
                        project.description = req.body.description;

                        if (req.body.adminUsers) {
                            project.adminUsers = req.body.adminUsers.split(',');
                        }
                        if (req.body.standardUsers) {
                            project.standardUsers = req.body.standardUsers.split(',');
                        }



                        project.save(function(err) {
                            if (err) {
                                res.status(400).json(err);
                            }

                            var conversation = new Conversation({
                                participants: [user.id],
                                projectId: project.id
                            });

                            project.adminUsers.forEach(function(id) {
                                conversation.participants.push(id)
                            });

                            project.standardUsers.forEach(function(id) {
                                conversation.participants.push(id)
                            });

                            conversation.save(function(err, newConversation) {
                                if (err) {
                                    res.send({
                                        error: err
                                    });

                                }

                                const message = new Message({
                                    conversationId: newConversation._id,
                                    author: user.id
                                });

                                message.save(function(err, newMessage) {
                                    if (err) {
                                        res.send({
                                            error: err
                                        });

                                    }

                                    res.status(200).json({
                                        message: 'Conversation started!',
                                        conversationId: conversation._id,
                                        projectId: conversation.projectId
                                    });

                                });
                            });
                        })







                    }
                });
            })
    }
}

module.exports.updateProject = function(req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });

    } else {

        User
            .findById(req.payload._id)
            .exec(function(err, user) {

                if (err) {
                    res.status(400).json(err);
                }


                Project.findById(req.params.id, function(err, project) {
                    if (err) {
                        sendJSONresponse(res, 400, {
                            "message": err
                        });
                    }

                    function isAdmin() {
                        var result;
                        project.adminUsers.forEach(function(id) {

                            if (id === user.id) {
                                result = true
                            } else {
                                result = false
                            }
                        })
                        return result;
                    }


                    if (project) {
                        if (project.owner === user.id || isAdmin()) {
                            project.title = req.body.title || project.title;
                            project.description = req.body.description || project.description;
                            project.status = req.body.status || project.status;

                            if (req.body.adminUsers) {

                                project.adminUsers = req.body.adminUsers.split(',');

                            }
                            if (req.body.standardUsers) {

                                project.standardUsers = req.body.standardUsers.split(',');

                            }


                            project.save(function(err) {
                                if (err) {
                                    res.status(400).json(err);
                                } else {

                                    Conversation.findOne({projectId: project.id}, function (err, conversation) {
                                        if (err) {
                                            res.status(400).json(err);
                                        }


                                        conversation.participants = [user.id];
                                        conversation.projectId = project.id;

                                        project.adminUsers.forEach(function (id) {
                                            conversation.participants.push(id)
                                        });

                                        project.standardUsers.forEach(function (id) {
                                            conversation.participants.push(id)
                                        });

                                        conversation.save(function (err, newConversation) {
                                            if (err) {
                                                res.send({
                                                    error: err
                                                });

                                            }

                                            var message = new Message({
                                                conversationId: newConversation._id,
                                                author: user.id
                                            });

                                            message.save(function (err, newMessage) {
                                                if (err) {
                                                    res.send({
                                                        error: err
                                                    });

                                                }

                                                res.status(200).json({
                                                    message: 'project and conversation Updated!',
                                                    conversation: conversation,
                                                    project: project
                                                });

                                            });

                                        });



                                    });

                                }

                            });

                        } else {
                            sendJSONresponse(res, 400, {
                                "message": 'only projectOwner or projectAdmin can update project data!'
                            });
                        }

                    } else {
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
            "message": "UnauthorizedError: private profile"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function(err, user) {
                Project.find({
                    owner: user.id
                }, function(err, projects) {
                    if (err) {
                        sendJSONresponse(res, 400, {
                            "message": err
                        });
                    }
                    if (projects) {
                        res.status(200).json(projects);
                    }
                })
            });
    }

};

module.exports.getAdminProjects = function(req, res) {

    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function(err, user) {
                Project.find({
                    adminUsers: user.id
                }, 'title description', function(err, projects) {
                    if (err) {
                        sendJSONresponse(res, 400, {
                            "message": err
                        });
                    }
                    if (projects) {
                        res.status(200).json(projects);
                    }
                })
            });
    }

};


module.exports.getDeveloperProjects = function(req, res) {

    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function(err, user) {
                Project.find({
                    standardUsers: user.id
                }, 'title description', function(err, projects) {
                    if (err) {
                        sendJSONresponse(res, 400, {
                            "message": err
                        });
                    }
                    if (projects) {
                        res.status(200).json(projects);
                    }
                })
            });
    }

};

module.exports.deleteMyProject = function(req, res) {

    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function(err, user) {
                if (err) {
                    sendJSONresponse(res, 400, {
                        "message": 'err' + err
                    });
                    return;
                }
                Project.findOne({
                    _id: req.params.id
                }, function(err, project) {
                    if (project) {
                        if (project.owner === user.id) {
                            Project.remove({
                                _id: project.id
                            }, function(err) {
                                if (!err) {
                                    res.status(200).json('project deleted');

                                } else {
                                    sendJSONresponse(res, 400, {
                                        "message": 'cannot find'
                                    });
                                }
                            });
                        } else {
                            sendJSONresponse(res, 400, {
                                "message": 'only project owner can delete project!'
                            });
                        }
                    } else {
                        sendJSONresponse(res, 400, {
                            "message": 'cannot find project with this id'
                        });
                    }

                });

            });
    }

};

module.exports.getProjectDetails = function(req, res) {

    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function(err, user) {
                Project.findById(req.params.id, function(err, project) {
                    if (err) {
                        sendJSONresponse(res, 400, {
                            "message": 'cannot find project'
                        });
                    }
                    if (project) {
                        res.status(200).json(project);
                    }
                })
            });
    }

};

module.exports.getConversationId = function(req, res) {

    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function(err, user) {
                Conversation.findOne({
                    projectId: req.params.id
                }, function(err, conversation) {
                    if (err) {
                        sendJSONresponse(res, 400, {
                            "message": err
                        });
                    }
                    if (conversation) {
                        res.status(200).json({
                            id: conversation.id
                        });
                    }
                })
            });
    }

};

