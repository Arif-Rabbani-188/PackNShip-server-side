require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const port = 3000;
const admin = require("firebase-admin");

const decodedServiceAccount = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf-8');

var serviceAccount = JSON.parse(decodedServiceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  // verify token using firebase admin SDK

  try{
    const decoded = await admin.auth().verifyIdToken(token);
    req.tokenEmail = decoded.email;
    next();
  }catch (error) {
    console.error("Error verifying token:", error);
    return res.status(403).send({ message: "Forbidden access" });
  }
  // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
  //   if (err) {
  //     return res.status(403).send({ message: "Forbidden access" });
  //   }
  //   req.decoded = decoded;
  //   next();
  // });

}

// generate a JWT token for testing purposes
app.post("/jwt", (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: false, // Use secure cookies in production
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nxpfiol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const collection = client.db("PickNShip").collection("AllProducts");
    const usersCollection = client.db("PickNShip").collection("users");

    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = collection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    app.get("/users", async (_req, res) => {
      const query = {};
      const cursor = usersCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id ? new ObjectId(id) : null };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });

    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedUser = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          cart : updatedUser.cart,
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.delete("products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collection.deleteOne(query);
      res.send(result);
    }
    );

    app.post("/users" ,async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User already exists" });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get("/myProducts", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = collection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedProduct = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          image: updatedProduct.image,
          price: updatedProduct.price,
          name: updatedProduct.name,
          brand_name: updatedProduct.brand_name,
          category: updatedProduct.category,
          rating: updatedProduct.rating,
          description: updatedProduct.short_description,
          main_quantity: updatedProduct.main_quantity,
          minimum_selling_quantity: updatedProduct.minimum_selling_quantity,
        },
      };
      const result = await collection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const product = await collection.findOne(query);
      res.send(product);
    });

    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await collection.insertOne(product);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
