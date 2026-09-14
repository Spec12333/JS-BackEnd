const express = require('express')
const authRoute = require('./routes/auth');
const productsRoute = require('./routes/products');
const orderRoute = require('./routes/orders');

const app = express();
const PORT = 8000;

app.use(express.json())
app.use('/auth', authRoute);
app.use('/products', productsRoute);
app.use('/orders', orderRoute);

app.use((err, req, res, next) => {
    console.error(err.message);
    res
    .status(500)
    .json({error : "Internal server error"});
})
app.listen(PORT, () => {
    console.log(`Server is listening on Port ${PORT}`);
})