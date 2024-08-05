const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  tableNo: {
    type: String,
    required: true,
  },
  orderTime: {
    type: String,
    required: true,
  },
  foods: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Order', OrderSchema);
