// controllers/productController.js
// Business logic for product operations. Route paths MUST remain unchanged.
const { ObjectId } = require('mongodb');
const { getCollection } = require('../config/db');

function productsCol() { return getCollection('AllProducts'); }

async function listProducts(req, res) {
  const products = await productsCol().find({}).toArray();
  res.send(products);
}

async function getProduct(req, res) {
  const { id } = req.params;
  const product = await productsCol().findOne({ _id: new ObjectId(id) });
  res.send(product);
}

async function createProduct(req, res) {
  const result = await productsCol().insertOne(req.body);
  res.send(result);
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const p = req.body;
  const result = await productsCol().updateOne(
    { _id: new ObjectId(id) },
    { $set: {
      image: p.image,
      price: p.price,
      name: p.name,
      brand_name: p.brand_name,
      category: p.category,
      rating: p.rating,
      description: p.short_description,
      main_quantity: p.main_quantity,
      minimum_selling_quantity: p.minimum_selling_quantity,
    } },
    { upsert: true }
  );
  res.send(result);
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  const result = await productsCol().deleteOne({ _id: new ObjectId(id) });
  res.send(result);
}

async function listMyProducts(req, res) {
  const email = req.query.email;
  const products = await productsCol().find({ email }).toArray();
  res.send(products);
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct, listMyProducts };
