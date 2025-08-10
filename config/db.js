// config/db.js
// Centralized MongoDB client & helper functions.
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nxpfiol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db; // cached db instance

async function connectDB() {
  if (db) return db;
  await client.connect();
  db = client.db('PickNShip');
  console.log('MongoDB connected');
  return db;
}

function getCollection(name) {
  if (!db) throw new Error('DB not initialized. Call connectDB first.');
  return db.collection(name);
}

module.exports = { client, connectDB, getCollection };
