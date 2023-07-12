var express = require('express');
const { authRequired } = require('../middlewares/validateToken');
var router = express.Router();

deviceController = require('../controllers/deviceController');

//Con autenticación
// router.post('/', authRequired ,deviceController.addDevice);
// router.get('/:deviceId?', authRequired, deviceController.getDevices); 
// router.put('/:deviceId', authRequired, deviceController.updateDevice);
// router.delete('/:deviceId', authRequired, deviceController.deleteDevice);

// Sin la autenticación 
router.post('/' ,authRequired,  deviceController.addDevice);
router.get('/:deviceId?', authRequired, deviceController.getDevices); 
router.put('/:deviceId', authRequired, deviceController.updateDevice);
router.delete('/:deviceId', authRequired, deviceController.deleteDevice);

module.exports = router;