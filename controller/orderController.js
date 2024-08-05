const Order = require('../model/order');
const jwt = require('jsonwebtoken');

const createOrder = async (req, res) => {
  try {
    const { customerName, tableNo, orderTime, foods } = req.body;
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'ragasiyam'); 
    const userEmail = decoded.email;

    const newOrder = new Order({
      customerName,
      tableNo,
      orderTime,
      foods,
      userEmail,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderTime: -1 }); 
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'ragasiyam');
    const userEmail = decoded.email;

    const deletedOrder = await Order.findOneAndDelete({
      _id: id,
      userEmail
    });

    if (deletedOrder) {
      res.status(200).json({ message: 'Order successfully deleted', deletedOrder });
    } else {
      res.status(404).json({ message: 'Order not found or not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getUserOrders = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'ragasiyam');
    const userEmail = decoded.email;
    
    const orders = await Order.find({ userEmail }).sort({ orderTime: -1 }); 
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'ragasiyam');
    const userEmail = decoded.email;

    const { userEmail: email, orderTime, ...fieldsToUpdate } = req.body;

    if (email || orderTime) {
      return res.status(400).json({ message: 'Cannot update userEmail or orderTime' });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, userEmail },
      fieldsToUpdate,
      { new: true } 
    );

    if (updatedOrder) {
      res.status(200).json({ message: 'Order successfully updated', updatedOrder });;
    } else {
      res.status(404).json({ message: 'Order not found or not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getAllOrders, deleteOrder, getUserOrders, updateOrder };
