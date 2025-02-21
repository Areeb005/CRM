const express = require('express');
const authCrtl = require('../controllers/auth');
const usersCrtl = require('../controllers/users');
const { Auth, allowedUsers } = require('../middlewares');
const orderCtrcl = require('../controllers/orders');
const { uploadFile } = require('../middlewares/multer');
const uploadCtrl = require('../controllers/upload');
const dashboardCtrl = require('../controllers/dashboard');


const router = express.Router();

router.post('/register', authCrtl.register);
router.post('/login', authCrtl.login);
router.post('/forgot-password', authCrtl.forgotPassword);
router.post('/reset-password', authCrtl.resetPassword);

router.post('/user', Auth, allowedUsers(["admin"]), usersCrtl.create);
router.get('/users', Auth, allowedUsers(["admin", "attorney"]), usersCrtl.get_all);
router.get('/user/:id', Auth, allowedUsers(["admin", "attorney"]), usersCrtl.get_one);
router.patch('/user/:id', Auth, allowedUsers(["admin"]), usersCrtl.update_one);

router.post('/order', Auth, allowedUsers(["admin", "attorney"]), orderCtrcl.create);
router.get('/orders', Auth, allowedUsers(["admin", "attorney"]), orderCtrcl.get_all);
router.get('/order/:id', Auth, allowedUsers(["admin", "attorney"]), orderCtrcl.get_one);
router.patch('/order/:id', Auth, allowedUsers(["admin", "attorney"]), orderCtrcl.update);

router.get('/dashboard', Auth, dashboardCtrl.getDashboardStats);


router.post('/upload', Auth, allowedUsers(["admin", "attorney"]), uploadFile.array('files', 5), uploadCtrl.upload);



module.exports = router;
