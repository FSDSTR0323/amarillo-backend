var express = require('express');
const { authRequired } = require('../middlewares/validateToken.js');
var router = express.Router();

roomController = require('../controllers/roomController.js');


//Con autenticación
router.post('/', authRequired, roomController.addRoom); //Al colocar el middleware authRequired tira el error 401 y concibe token como undefined
router.get('/:roomId?', authRequired, roomController.getRooms); 
router.put('/:roomId', authRequired,roomController.updateRoom);
router.delete('/:roomId', authRequired, roomController.deleteRoom);

// router.post('/', roomController.addRoom);
// router.get('/:roomId?',  roomController.getRooms); 
// router.put('/:roomId', roomController.updateRoom);
// router.delete('/:roomId', roomController.deleteRoom);

module.exports = router;