var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
/**
 * @type {*|middleware|exports}
 */
var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});
/**
 *
 * @type {exports}
 */
var ctrlProfile = require('../controllers/profile');
var ctrlProject = require('../controllers/project');
var ctrlAuth = require('../controllers/authentication');
var ctrlChat = require('../controllers/chat');
/**
 * Profile endpoints
 * /api/profile-returns user's details.
 * /api/frontEnd-returns front-end developers.
 * /api/backEnd-returns back-end developers.
 * /api/fullStack-returns full-stack developers.
 * /api/profile-update user's data.
 */
router.get('/profile', auth, ctrlProfile.profileRead);
router.get('/frontEnd', auth, ctrlProfile.getFrontEnd);
router.get('/backEnd', auth, ctrlProfile.getBackEnd);
router.get('/fullStack', auth, ctrlProfile.getFullstack);
router.put('/profile', auth, ctrlProfile.updateProfile);

/**
 * Authentication endpoints
 * api/register-register user.
 * api/login-login existing user.
 */
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
/**
 * Project endpoints
 * api/project-create project.
 * api/project/:id-update existing project.
 * api/myProjects-returns own projects.
 * api/admin/projects-returns admin's projects.
 * api/developer/projects-returns developer's projects.
 * api/project/:id-returns project's details
 * api/myProject/:id-delete project that user is admin or owner.
 */
router.post('/project', auth, ctrlProject.createProject);
router.put('/project/:id', auth, ctrlProject.updateProject);
router.get('/myProjects', auth, ctrlProject.getMyProject);
router.get('/admin/projects', auth, ctrlProject.getAdminProjects);
router.get('/developer/projects', auth, ctrlProject.getDeveloperProjects);
router.get('/project/:id', auth, ctrlProject.getProjectDetails);
router.delete('/myProject/:id', auth, ctrlProject.deleteMyProject);

//
router.get('/conversation/:id', auth, ctrlProject.getConversationId);

//chat
/**
 *api/send/:conversationId-send message to existing conversation.
 *api/chat/:conversationId-returns conversation.
 *api/chat/participants/:conversationId-returns participants in chat.
 */
//router.post('/send/:conversationId', auth, ctrlChat.sendReply);
router.get('/chat/:conversationId', auth, ctrlChat.getConversation);
router.get('/chat/participants/:conversationId', auth, ctrlChat.getConversationParticipants);

module.exports = router;
