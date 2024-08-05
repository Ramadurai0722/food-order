const express = require('express');
const { createOrder, getAllOrders, deleteOrder, getUserOrders, updateOrder } = require('../controller/orderController');

const router = express.Router();

router.post('/create', createOrder);
router.get('/getall', getAllOrders); 
router.get('/my-orders', getUserOrders);
router.patch('/update/:orderId', updateOrder);
router.delete('/delete/:id', deleteOrder);

module.exports = router;
