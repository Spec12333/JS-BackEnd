const express = require("express");
const { readData, writeData } = require("../utils/fileDB");
const { authentication, authorization } = require('../middleware/authCheck')
const router = express.Router();
const idGenerator = require('../utils/idGenerator')

router.get('/', async (req, res) => {
    let products = await readData('products.json');
    
    const {category, sort} = req.query;
    if (category) {
        products = products.filter(product => product.category === category);
    }
    if (sort === 'price') {
        products = [...products].sort((a, b) => a.price - b.price);
    }
    res.json(products);
})

router.get('/:id', async (req, res) => {
    const products = await readData('products.json');
    const productId = req.params.id;

    const product = products.find(product => product.id === productId);
    if (!product) {
        return res
        .status(404)
        .json({error : "product doesnt exist"});
    }
    res.json(product);
})

router.post('/', authentication, authorization('admin'),async (req, res) =>  {
    const {name, price, category, stock} = req.body;

    if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
        return res.status(400).json({error : "Price must be a positive number"});
    }
    
    if (stock !== undefined && (!Number.isInteger(stock) || stock < 0)) {
        return res.status(400).json({error : "Stock must be a non-negative integer"});
    }

    if (!name || price === undefined || price === null) {
        return res
        .status(400)
        .json({error : "Name and Price are required"});
    }

    const products = await readData('products.json');
    const newProduct = {
        id : idGenerator(),
        name : name,
        price : price,
        category : category || "Other",
        stock : stock ?? 0
    }
    products.push(newProduct);
    await writeData('products.json', products);

    res
    .status(201)
    .json({
        message: "New product added",
        product: newProduct
    });
})

router.put('/:id', authentication, authorization('admin'),async (req, res) => {
    const products = await readData('products.json');
    const productIndex = products.findIndex(product => product.id === req.params.id);
    if (productIndex === -1) {
        return res
        .status(404)
        .json({error : "Products is not found"});
    }

    products[productIndex] = {...products[productIndex], ...req.body, id : products[productIndex].id}
    await writeData('products.json', products);
    res
    .status(200)
    .json({success : "Successfully updated",
        product : products[productIndex]
    })
})

router.delete('/:id', authentication, authorization('admin'), async (req, res) => {
    let products = await readData('products.json');
    const exists = products.some(product => product.id === req.params.id);
    if (!exists) {
        return res
        .status(404)
        .json({error : "The product doesnt exist to remove it"});
    }

    products = products.filter(product => product.id !== req.params.id);
    await writeData('products.json', products)
    return res
    .status(204)
    .end()
})

module.exports = router;