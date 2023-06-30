var express = require('express');
var router = express.Router();
const { authRequired } = require('../middlewares/validateToken.js');


houseController =require('../controllers/houseController.js');

router.post('/', houseController.addHouse);
router.get('/:houseId?', authRequired, houseController.getHouse); 
router.put('/:houseId', authRequired, houseController.updateHouse);
router.delete('/:houseId',authRequired, houseController.deleteHouse);

module.exports = router;