/**
 * Created by pc on 5.8.2016 г..
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Message = mongoose.model('Message');
var Conversation = mongoose.model('Conversation');
exports.sendReply = function(req, res, next) {

    if (!req.payload._id) {
        res.status(401).json({
            "message" : "UnauthorizedError: private profile"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function(err, user) {

                var reply = new Message({
                    conversationId: req.params.conversationId,
                    body:req.body.composedMessage,
                    author: user.id
                });

                reply.save(function(err, sentReply) {
                    if (err) {
                        res.send({ error: err });
                        return next(err);
                    }

                    res.status(200).json({ message: 'Reply successfully sent!' });
                });

            });
    }


}
exports.getConversation = function(req, res, next) {
    if (!req.payload._id) {
        res.status(401).json({
            "message" : "UnauthorizedError: private profile"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function(err, user) {

                Message.find({ conversationId: req.params.conversationId })
                    .select('createdAt body author')
                    .sort('-createdAt')
                    .populate({
                        path: 'author',
                        select: 'profile.firstName profile.lastName'
                    })
                    .exec(function(err, messages) {
                        if (err) {
                            res.send({ error: err });
                            return next(err);
                        }

                        res.status(200).json({ conversation: messages });
                    });

            });
    }


}
exports.getConversationParticipants = function(req, res, next) {
    if (!req.payload._id) {
        res.status(401).json({
            "message" : "UnauthorizedError: private profile"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function(err, user) {

                Conversation.findOne({_id: req.params.conversationId })
                    .select('participants')
                    .exec(function(err, participants) {
                        if (err) {
                            res.send({ error: err });
                            return next(err);
                        }


                        var stack=[];

                        console.log(participants.participants)

                       //  participants.participants.forEach(function(id) {

                         User.find({_id:{ $in:participants.participants}},'name', function (err, name) {
                                res.json(name)
                            })
                        //})




                    });

            });
    }


}