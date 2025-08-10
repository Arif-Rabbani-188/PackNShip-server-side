// routes/userRoutes.js
// User endpoints with unchanged paths.
const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');
const { listUsers, getUser, patchUserCart, createUser } = require('../controllers/userController');

router.get('/users', listUsers);
router.get('/users/:id', getUser);
router.patch('/users/:id', patchUserCart);
router.post('/users', createUser);

module.exports = router;
