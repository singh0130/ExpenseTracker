const express = require('express');

const forgotPasswordController= require('../controllers/forgotpassword');

const router= express.Router();

router.get('/updatepassword/:resetpasswordid', forgotPasswordController.updatePassword);

router.get('/resetpassword/:id', forgotPasswordController.resetPassword);

router.post('/forgotpassword', forgotPasswordController.forgotpassword);

module.exports = router;