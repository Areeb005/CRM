const express = require('express');
const authCrtl = require('../controllers/auth');
const usersCrtl = require('../controllers/users');
const { Auth, allowedUsers } = require('../middlewares');


const router = express.Router();

router.post('/register', authCrtl.register);
router.post('/login', authCrtl.login);
router.post('/forgot-password', authCrtl.forgotPassword);
router.post('/reset-password', authCrtl.resetPassword);

router.post('/user', Auth, allowedUsers(["admin"]), usersCrtl.create);
router.get('/users', Auth, allowedUsers(["admin"]), usersCrtl.get_all);
router.get('/user/:id', Auth, allowedUsers(["admin"]), usersCrtl.get_one);
router.patch('/user/:id', Auth, allowedUsers(["admin"]), usersCrtl.update_one);



module.exports = router;
