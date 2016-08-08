/**
 * Created by pc on 5.8.2016 г..
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
        conversationId: {
            type: Schema.Types.ObjectId
            //required: true
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

module.exports = mongoose.model('Message', MessageSchema);