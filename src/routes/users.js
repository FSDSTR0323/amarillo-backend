let express = require('express');
const { authRequired } = require('../middlewares/validateToken');
let router = express.Router();


userController = require('../controllers/userController');

//Ahora escribiremos las rutas que nos van a permitir gestionar los usuarios.

router.post('/register', userController.registerNewUser);
router.post('/login', userController.loginUser);


//Con autenticación
router.get('/',authRequired, userController.getUsers); //este endpoint nos devuelve todos los usuarios de la app en un array de objetos
// router.get('/myUser', authRequired, userController.myUser); ----> este endpoint esta dando problemas
router.put('/myUser', authRequired, userController.updateUser);
// router.get('/', userController.getUsers); //este endpoint nos devuelve todos los usuarios de la app en un array de objetos
// router.get('/me',  userController.myUser);

module.exports = router ;