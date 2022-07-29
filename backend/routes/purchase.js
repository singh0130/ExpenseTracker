const express= require('express');

const purchaseController= require('../controllers/purchase');

const auth= require('../middlewares/auth');

const router= express.Router();

router.get('/premiummembership', auth.authenticate, purchaseController.purchasePremium);

router.post('/updatetransaction', auth.authenticate, purchaseController.transactionStatus);

module.exports = router;