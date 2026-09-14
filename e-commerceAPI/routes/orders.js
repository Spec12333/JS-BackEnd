const express = require('express');
const { readData, writeData } = require('../utils/fileDB');
const { authentication, authorization } = require('../middleware/authCheck');
const idGenerator = require('../utils/idGenerator');
const router = express.Router();


router.post('/', authentication, async (req, res) => {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res
        .status(400)
        .json({error : "Items must not be empty"});
    }

    const products = await readData('products.json');
    let total = 0;
    const orderItems = [];

    for (let item of items) {
        const product = products.find(product => product.id === Number(item.productId));
        
        if (!product) {
            return res
            .status(400)
            .json({error : `Product ${item.productId} doesnt exist on your order list`})
        }

        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
            return res
            .status(400)
            .json({ error: "Quantity must be a positive integer" });
        }

        if (product.stock < item.quantity) {
            return res 
            .status(400)
            .json({error : "There is not enough stock for this product"});
        }
        total += product.price * item.quantity;
        orderItems.push({
            productId : product.id,
            name : product.name,
            quantity : item.quantity,
            price : product.price
        })
    }
    items.forEach(item => {
        const product = products.find(p => p.id === Number(item.productId));
        product.stock -= item.quantity;
    });

    await writeData('products.json', products);
    const orders = await readData('orders.json');

    const newOrder = {
        id : idGenerator(),
        userId : req.user.id,
        items : orderItems,
        total : total,
        status : "pending",
        createdAt : new Date().toLocaleString('ru-RU', {
                timeZone: 'Asia/Yerevan'
            })
    }
    orders.push(newOrder);

    await writeData('orders.json', orders);
    res
    .status(201)
    .json(newOrder);
})

router.get('/', authentication, authorization('admin', 'customer'), async (req, res) => {
    const orders = await readData('orders.json');
    const userOrders = [];
    for (let order of orders) {
        if (order.userId === req.user.id) {
            userOrders.push(order)
        }
    }
    if (userOrders.length === 0) {
        return res
        .status(200)
        .json({success : "Your order list is empty"})
    }
    res
    .status(200)
    .json(userOrders)
})

router.get('/:id', authentication, authorization('admin', 'customer'), async (req, res) => {
    const orders = await readData('orders.json');
    const exists = orders.find(order => order.id === Number(req.params.id));
    if (!exists) {
        return res
        .status(404)
        .json({error : "The order is not found"});
    }
    if (exists.userId === req.user.id) {
        return res
        .status(200)
        .json(exists);
    }
    if (req.user.role === 'admin') {
        return res
        .status(200)
        .json(exists)
    }

    return res
    .status(403)
    .json({ error: "You do not have access to this order" });
})

router.patch('/:id', authentication, authorization('admin'), async (req, res) => {
    const orders = await readData('orders.json');

    const exists = orders.find(order => order.id === Number(req.params.id));
    if (!exists) {
        return res
        .status(404)
        .json({error : "The order is not found"});
    }
    
    if (!['pending', 'shipped', 'delivered'].includes(req.body.status)) {
        return res
        .status(400)
        .json({error : "Invalid order status"})
    }

    if (exists.status === 'pending') {
        if (req.body.status === 'delivered') {
            return res
            .status(403)
            .json({error : "You cannot maka pending delivered"});
        }
        exists.status = req.body.status;
    } else if (exists.status === 'shipped') {
        if (req.body.status === 'pending') {
            return res
            .status(403)
            .json({error : "You cannot make shipped pending"});
        }
        exists.status = req.body.status;
    }

    await writeData('orders.json', orders);
    res
    .status(200)
    .json({success : "Changed status successfully"});
})

module.exports = router;