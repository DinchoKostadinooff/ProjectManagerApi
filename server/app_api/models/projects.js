var mongoose = require('mongoose');
/**
 * Defining project schema.
 * title {string}- from req.body.title.Title is unique and required.
 * owner {string}-creator's id.Owner is required
 * description {string}. Description is required.
 * status{Boolean}. default value is true.
 * adminUsers{array}.Project's admins
 * standardUsers{array}. Project's developers.
 * conversationId{string}. Project's conversation.
 * createdAt{date}.Deafult value Date.now.
 */
var projectSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    adminUsers: [],
    standardUsers: [],
    conversationId: {
        type: String
    },
    createdAt: {type: Date, default: Date.now}

});

//exports Project model.
module.exports = mongoose.model('Project', projectSchema);
