// transaction.js -- Router for the transaction

const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (res.locals.loggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
}

// GET route for getting transactions
router.get('/transaction', isLoggedIn, async (req, res) => {
  res.locals.group = false;
  let transactions;

  if (req.query.groupBy === 'category') {
    transactions = await Transaction.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
    ]);
    res.locals.group = true;
  } else {
    const sortBy = req.query.sortBy || 'userId';
    const sortOptions = { [sortBy]: 1 };
    transactions = await Transaction.find({ userId: req.user._id }).sort(sortOptions);
  }

  res.render('transaction', { transactions });
});

// POST route for creating a new transaction
router.post('/transaction', isLoggedIn, async (req, res) => {
  const newTransaction = new Transaction({
    description: req.body.description,
    amount: req.body.amount,
    category: req.body.category,
    date: req.body.date,
    userId: req.user._id,
  });

  await newTransaction.save();
  res.redirect('/transaction');
});

// GET route for removing a transaction
router.get('/transaction/remove/:transactionId', isLoggedIn, async (req, res) => {
  await Transaction.deleteOne({ _id: req.params.transactionId });
  res.redirect('/transaction');
});

// GET route for editing a transaction
router.get('/transaction/edit/:transactionId', isLoggedIn, async (req, res) => {
  const item = await Transaction.findById(req.params.transactionId);
  res.render('editTransaction', { item });
});

// POST route for updating a transaction
router.post('/transaction/update', isLoggedIn, async (req, res) => {
  const { description, amount, category, date, itemId } = req.body;
  await Transaction.findOneAndUpdate(
    { _id: itemId },
    { $set: { description, amount, category, date } },
  );
  res.redirect('/transaction');
});

module.exports = router;
