var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Defining message schema.
 * conversationId {Schema.Types.ObjectId}- from conversation.
 * body {string}-from req.body.body.
 * author {Schema.Types.ObjectId}.
 */
var MessageSchema = new Schema({
        conversationId: {
            type: Schema.Types.ObjectId
        },
        body: {
            type: String
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    });
//exports Message model
module.exports = mongoose.model('Message', MessageSchema);