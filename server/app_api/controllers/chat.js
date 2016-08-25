var mongoose = require('mongoose');
var User = mongoose.model('User');
var Message = mongoose.model('Message');
var Conversation = mongoose.model('Conversation');
/**
 *send message
 * @param req-req.params.conversationId,req.body.composedMessage.
 * @param res-400 + error or 200 + message.
 */
/*
exports.sendReply = function (req, res) {

    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function (err, user) {

                var reply = new Message({
                    conversationId: req.params.conversationId,
                    body: req.body.composedMessage,
                    author: user.id
                });

                reply.save(function (err, sentReply) {
                    if (err) {
                        res.status(400).json({error: err});
                    }

                    res.status(200).json({message: 'Reply successfully sent!'});
                });

            });
    }


}
*/
/**
 *Returns conversation by req.params.conversationId.
 * @param req
 * @param res

 */
exports.getConversation = function(req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function(err, user) {

                Message.find({
                        conversationId: req.params.conversationId
                    })
                    .select('createdAt body author')
                    .sort('-createdAt')
                    .populate({
                        path: 'author',
                        select: 'profile.firstName profile.lastName'
                    })
                    .exec(function(err, messages) {
                        if (err) {
                            res.status(400).send({
                                message: 'cannot be find'
                            });
                        } else {
                            res.status(200).json({
                                conversation: messages
                            });
                        }


                    });

            });
    }


};
/**
 * Returns all  participants by req.params.conversationId .
 * @param req
 * @param res
 */
exports.getConversationParticipants = function(req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function(err, user) {

                Conversation.findOne({
                        _id: req.params.conversationId
                    })
                    .select('participants')
                    .exec(function(err, participants) {
                        if (err) {
                            res.send({
                                error: err
                            });

                        }


                        var stack = [];



                        User.find({
                            _id: {
                                $in: participants.participants
                            }
                        }, 'name position', function(err, name) {
                            res.json(name);
                        });


                    });

            });
    }


};
