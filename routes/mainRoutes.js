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
const fileCtrl = require('../controllers/files');


const router = express.Router();

router.post('/register', authCrtl.register);
router.post('/login', authCrtl.login);
router.post('/forgot-password', authCrtl.forgotPassword);
router.post('/reset-password', authCrtl.resetPassword);
router.get('/me', Auth, authCrtl.get_me);
router.patch('/me', Auth, authCrtl.update_me);

router.post('/user', Auth, allowedUsers(["Administrator"]), usersCrtl.create);
router.get('/users', Auth, allowedUsers(["Administrator", "attorney", "Attorney"]), usersCrtl.get_all);
router.get('/user/:id', Auth, allowedUsers(["Administrator", "attorney", "Attorney"]), usersCrtl.get_one);
router.patch('/user/:id', Auth, allowedUsers(["Administrator"]), usersCrtl.update_one);

router.post('/order', Auth, allowedUsers(["Administrator", "attorney", "Attorney"]), orderCtrcl.create);
router.post('/bulk-orders', Auth, allowedUsers(["Administrator", "attorney", "Attorney"]), orderCtrcl.create_bulk_orders);
router.get('/orders', Auth, allowedUsers(["Administrator", "attorney", "Attorney"]), orderCtrcl.get_all);
router.get('/order/:id', Auth, allowedUsers(["Administrator", "attorney", "Attorney"]), orderCtrcl.get_one);
router.patch('/order/:id', Auth, allowedUsers(["Administrator", "attorney", "Attorney"]), orderCtrcl.update);
router.patch('/cancel/:id', Auth, allowedUsers(["Administrator", "attorney", "Attorney"]), orderCtrcl.cancel);
router.patch('/complete/:id', Auth, allowedUsers(["Administrator", "attorney", "Attorney"]), orderCtrcl.complete);
router.delete('/delete/:id', Auth, allowedUsers(["Administrator", "attorney", "Attorney"]), orderCtrcl.delete);
router.patch('/document-location/:id', Auth, allowedUsers(["Administrator", "attorney", "Attorney"]), orderCtrcl.updateDocumentLocationStatus);

router.get('/overview', Auth, allowedUsers(["Administrator"]), dashboardCtrl.dashboardOverview);
// router.get('/near-deadline', Auth, allowedUsers(["Administrator"]), dashboardCtrl.nearDeadline);
// router.get('/recent-activities', Auth, allowedUsers(["Administrator"]), dashboardCtrl.recent_activities);
// router.get('/recent-orders', Auth, allowedUsers(["Administrator"]), dashboardCtrl.recent_orders);

router.get("/smtp", Auth, allowedUsers(["Administrator"]), SMTPController.get_settings);
router.post("/smtp", Auth, allowedUsers(["Administrator"]), SMTPController.save_settings);
router.patch("/smtp", Auth, allowedUsers(["Administrator"]), SMTPController.update_settings);

// router.get("/organization", Auth, OrganizationController.get_settings);
// router.patch("/organization", Auth, allowedUsers(["Administrator"]), OrganizationController.update_settings);


router.get("/locations", Auth, locationCtrl.get_locations);
router.get("/customers", Auth, locationCtrl.get_customers);
router.get("/courts", Auth, locationCtrl.get_courts);
router.get("/casetypes", Auth, CaseTypeCtrl.get_all_casetypes);
router.get("/proctypes/:casetypeid", Auth, ProcTypeCtrl.get_proctypes_by_casetype);


router.post('/upload', Auth, allowedUsers(["Administrator", "attorney", "Attorney"]), uploadFile.array('files', 5), uploadCtrl.upload);

router.get('/files/:filename', Auth, allowedUsers(["Administrator", "attorney"]), fileCtrl.getFileByName);



module.exports = router;
