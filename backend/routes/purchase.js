const express = require('express');
const router = express.Router();

const purchaseController = require('../controllers/purchase');
const authenticatemiddleware = require('../middleware/auth');

router.get('/premium-membership',authenticatemiddleware.authenticate,purchaseController.purchasePremium);

router.post('/update-transactionstatus',authenticatemiddleware.authenticate,purchaseController.updateTransactionStatus);

module.exports = router;

