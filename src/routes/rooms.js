var express = require('express');
const { authRequired } = require('../middlewares/validateToken.js');
var router = express.Router();

roomController = require('../controllers/roomController.js');


router.post('/', authRequired, roomController.addRoom);
router.get('/:houseId?', authRequired,  roomController.getRooms); 
router.put('/:roomId', authRequired, roomController.updateRoom);
router.delete('/:roomId', authRequired, roomController.deleteRoom);

module.exports = router;