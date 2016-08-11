/**
 * Created by dincho.kostadinov on 26.7.2016 г..
 */
var mongoose = require('mongoose');

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
    createdAt: { type: Date, default: Date.now },

});



mongoose.model('Project', projectSchema);
