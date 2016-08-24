var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Schema defines how chat messages will be stored in MongoDB
 * participants {Schema.Types.ObjectId}-Participants from Project.
 * projectId{string}-Project id.
 */

var ConversationSchema = new Schema({
    participants: [{type: Schema.Types.ObjectId, ref: 'User'}],
    projectId: {
        type: String
    }
});
//exports Conversation model.
module.exports = mongoose.model('Conversation', ConversationSchema);