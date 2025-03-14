const express = require('express');
const authCrtl = require('../controllers/auth');
const usersCrtl = require('../controllers/users');
const { Auth, allowedUsers } = require('../middlewares');
const orderCtrcl = require('../controllers/orders');
const { uploadFile } = require('../middlewares/multer');
const uploadCtrl = require('../controllers/upload');
const dashboardCtrl = require('../controllers/dashboard');
const SMTPController = require('../controllers/smtp');
const OrganizationController = require('../controllers/organization');
const locationCtrl = require('../controllers/location');
const CaseTypeCtrl = require('../controllers/casetype');
const ProcTypeCtrl = require('../controllers/proctype');


const router = express.Router();

router.post('/register', authCrtl.register);
router.post('/login', authCrtl.login);
router.post('/forgot-password', authCrtl.forgotPassword);
router.post('/reset-password', authCrtl.resetPassword);
router.get('/me', Auth, authCrtl.get_me);
router.patch('/me', Auth, authCrtl.update_me);

router.post('/user', Auth, allowedUsers(["admin"]), usersCrtl.create);
router.get('/users', Auth, allowedUsers(["admin", "attorney"]), usersCrtl.get_all);
router.get('/user/:id', Auth, allowedUsers(["admin", "attorney"]), usersCrtl.get_one);
router.patch('/user/:id', Auth, allowedUsers(["admin"]), usersCrtl.update_one);

router.post('/order', Auth, allowedUsers(["admin", "attorney"]), orderCtrcl.create);
router.post('/bulk-orders', Auth, allowedUsers(["admin", "attorney"]), orderCtrcl.create_bulk_orders);
router.get('/orders', Auth, allowedUsers(["admin", "attorney"]), orderCtrcl.get_all);
router.get('/order/:id', Auth, allowedUsers(["admin", "attorney"]), orderCtrcl.get_one);
router.patch('/order/:id', Auth, allowedUsers(["admin", "attorney"]), orderCtrcl.update);
router.patch('/cancel/:id', Auth, allowedUsers(["admin", "attorney"]), orderCtrcl.cancel);
router.patch('/complete/:id', Auth, allowedUsers(["admin", "attorney"]), orderCtrcl.complete);
router.delete('/delete/:id', Auth, allowedUsers(["admin", "attorney"]), orderCtrcl.delete);
router.patch('/document-location/:id', Auth, allowedUsers(["admin", "attorney"]), orderCtrcl.updateDocumentLocationStatus);

router.get('/overview', Auth, allowedUsers(["admin"]), dashboardCtrl.dashboardOverview);
router.get('/near-deadline', Auth, allowedUsers(["admin"]), dashboardCtrl.nearDeadline);
router.get('/recent-activities', Auth, allowedUsers(["admin"]), dashboardCtrl.recent_activities);
router.get('/recent-orders', Auth, allowedUsers(["admin"]), dashboardCtrl.recent_orders);

router.get("/smtp", Auth, allowedUsers(["admin"]), SMTPController.get_settings);
router.post("/smtp", Auth, allowedUsers(["admin"]), SMTPController.save_settings);
router.patch("/smtp", Auth, allowedUsers(["admin"]), SMTPController.update_settings);

router.get("/organization", Auth, OrganizationController.get_settings);
router.patch("/organization", Auth, allowedUsers(["admin"]), OrganizationController.update_settings);


router.get("/locations", Auth, locationCtrl.get_locations);
router.get("/customers", Auth, locationCtrl.get_customers);
router.get("/courts", Auth, locationCtrl.get_courts);
router.get("/casetypes", Auth, CaseTypeCtrl.get_all_casetypes);
router.get("/proctypes/:casetypeid", Auth, ProcTypeCtrl.get_proctypes_by_casetype);


router.post('/upload', Auth, allowedUsers(["admin", "attorney"]), uploadFile.array('files', 5), uploadCtrl.upload);



module.exports = router;
