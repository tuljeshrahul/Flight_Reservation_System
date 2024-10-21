const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3002;

app.use(express.json());

mongoose.connect('mongodb://mongodb:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected!'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

const Product = mongoose.model('Product', {
  name: { type:String, unique:true},
  price: Number,
  stock: Number
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

app.get('/products/:name', async (req, res) => {
  try {
    const product = await Product.findOne({name:req.params.name});
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product' });
  }
});

app.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error creating product' });
  }
});

app.listen(PORT, () => {
  console.log(`Product service running on port ${PORT}`);
});
