/**
 * Created by pc on 5.8.2016 г..
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Schema defines how chat messages will be stored in MongoDB
const ConversationSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    projectId: {
        type: String
    }
});

module.exports = mongoose.model('Conversation', ConversationSchema);