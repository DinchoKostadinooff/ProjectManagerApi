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

module.exports = router;
