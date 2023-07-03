var express = require('express');
const { authRequired } = require('../middlewares/validateToken.js');
var router = express.Router();


houseController =require('../controllers/houseController.js');

router.post('/', authRequired, houseController.addHouse);
router.get('/:houseId?', authRequired, houseController.getHouse); 
router.put('/:houseId', authRequired, houseController.updateHouse);
router.delete('/:houseId', authRequired, houseController.deleteHouse);

module.exports = router;