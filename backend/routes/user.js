const express= require('express');
const userController= require('../controllers/user');
const expenseController= require('../controllers/expenses');
const auth= require('../middlewares/auth');

const router= express.Router();

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.post('/addexpense', auth.authenticate, expenseController.addExpense);

router.get('/download', auth.authenticate, expenseController.downloadExpenses);

router.get('/getexpense', auth.authenticate, expenseController.getAllExpenses);

router.delete('/deleteexpense/:expenseId', auth.authenticate, expenseController.deleteExpense);

module.exports = router;