let express = require('express');
const { authRequired } = require('../middlewares/validateToken');
let router = express.Router();
let user = require('../models/userModel')


userController = require('../controllers/userController');

//Ahora escribiremos las rutas que nos van a permitir gestionar los usuarios.

router.post('/register', userController.registerNewUser);
router.post('/login', userController.loginUser);

//Con autenticación
router.get('/dataUser', authRequired, userController.dataUser);  // Ruta para pedir datos del usuario
router.put('/dataUser', authRequired, userController.updateUser); // Ruta para actualizar los datos del usuario


// Ruta para actualizar los datos del usuario
router.put('/editar-usuario/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, surname, email, phoneNumber, birthYear, avatar} = req.body;
    try {
        // Buscar el usuario por su ID
        const user = await User.findById(userId);
    
        if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }
    
        // Actualizar los datos del usuario
        user.name = name;
        user.surname = surname;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.birthYear = birthYear;
        user.avatar = avatar;

    
        // Guardar los cambios en la base de datos
    const updateUser = await user.save();
    console.log('Este es mi usuario editado', updateUser)

    res.json({ message: 'Datos de usuario actualizados correctamente' });
  } catch (error) {
    console.error('Error al actualizar los datos del usuario:', error);
    res.status(500).json({ message: 'Error al actualizar los datos del usuario' });
  }
});

//router.get('/',authRequired, userController.getUsers); //este endpoint nos devuelve todos los usuarios de la app en un array de objetos

//router.get('/',authRequired, userController.findUsers)

// router.get('/', userController.getUsers); //este endpoint nos devuelve todos los usuarios de la app en un array de objetos
// router.get('/me',  userController.myUser);

module.exports = router ;