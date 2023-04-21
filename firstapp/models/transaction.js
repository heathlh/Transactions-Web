'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var TransactionSchema = Schema({
  description: String,
  amount: Number,
  category: String,
  date: { type: Date, default: Date.now },
  userId: {type:ObjectId, ref:'user' }
} );

TransactionSchema.virtual('formattedDate').get(function() {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  return this.date.toLocaleDateString('en-US', options);
});

module.exports = mongoose.model( 'TransactionItem', TransactionSchema );