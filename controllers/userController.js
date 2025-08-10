// controllers/userController.js
// Handles user related operations.
const { ObjectId } = require('mongodb');
const { getCollection } = require('../config/db');

function usersCol() { return getCollection('users'); }

async function listUsers(_req, res) {
  const users = await usersCol().find({}).toArray();
  res.send(users);
}

async function getUser(req, res) {
  const { id } = req.params;
  const user = await usersCol().findOne({ _id: new ObjectId(id) });
  res.send(user);
}

async function patchUserCart(req, res) {
  const { id } = req.params;
  const updatedUser = req.body;
  const result = await usersCol().updateOne(
    { _id: new ObjectId(id) },
    { $set: { cart: updatedUser.cart } },
    { upsert: true }
  );
  res.send(result);
}

async function createUser(req, res) {
  const user = req.body;
  const existing = await usersCol().findOne({ email: user.email });
  if (existing) return res.send({ message: 'User already exists' });
  const result = await usersCol().insertOne(user);
  res.send(result);
}

module.exports = { listUsers, getUser, patchUserCart, createUser };
