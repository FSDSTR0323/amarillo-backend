var express = require('express');
const { authRequired } = require('../middlewares/validateToken.js');
var router = express.Router();

roomController = require('../controllers/roomController.js');


//Con autenticación
// router.post('/', authRequired, roomController.addRoom); //Al colocar el middleware authRequired tira el error 401 y concibe token como undefined
// router.get('/:roomId?', authRequired, roomController.getRooms); 
// router.put('/:roomId', authRequired,roomController.updateRoom);
// router.delete('/:roomId', authRequired, roomController.deleteRoom);

router.post('/', authRequired, roomController.addRoom);
router.get('/:houseId?', authRequired,  roomController.getRooms); 
router.put('/:roomId', authRequired, roomController.updateRoom);
router.delete('/:roomId', authRequired, roomController.deleteRoom);

module.exports = router;