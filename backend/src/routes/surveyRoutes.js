const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/survey');
const { validateToken } = require('../JWT');


/* check if the user already answered the survey */
router.get('/checkUser', validateToken, surveyController.checkuser);
/* register survey answears */ 
router.post('/survey', validateToken, surveyController.registerAnswer);

module.exports = router;