// middlewares/verifyJWT.js
// Verifies Firebase ID token from Authorization header (Bearer <token>)
const admin = require('../config/firebase');

async function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ message: 'Unauthorized access' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).send({ message: 'Unauthorized access' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.tokenEmail = decoded.email;
    next();
  } catch (err) {
    return res.status(403).send({ message: 'Forbidden access' });
  }
}

module.exports = verifyJWT;
