var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlProject = require('../controllers/project');
var ctrlAuth = require('../controllers/authentication');
var ctrlChat = require('../controllers/chat');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);
router.get('/frontEnd', auth, ctrlProfile.getFrontEnd);
router.get('/backEnd', auth, ctrlProfile.getBackEnd);
router.get('/fullStack', auth, ctrlProfile.getFullstack);
router.put('/profile', auth, ctrlProfile.updateProfile);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

//projects
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
router.post('/send/:conversationId', auth, ctrlChat.sendReply);
router.get('/chat/:conversationId', auth, ctrlChat.getConversation);
router.get('/chat/participants/:conversationId', auth, ctrlChat.getConversationParticipants);

module.exports = router;
