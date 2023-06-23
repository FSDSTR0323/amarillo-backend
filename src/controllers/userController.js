const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const mySecret = process.env.TOKENSECRET;

const registerNewUser = async (req, res) => {
    try {
        //Tomamos el data que tengamos en el body - frontend
        const { name, email, password, savedToken } = req.body;
        //console.log('este es el body de la petición de registro: ', req.body);
        //todos los datos que necesitamos deben estar presentes para poder registrar al nuevo usuario:
        if (!( name || email || password )) {
            return res.status(400).send({msg:'Tienes que rellenar todos los campos para realizar el registro.'})
        }
        //Chequeamos que el ususario no exista ya dentro de nuestra BD --- basado en el email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({msg:'Este usuario ya está registrado.'})
        }
        //Ahora requerimos de la libreria de bcrypt para encriptar la contraseña que nos pasan por el front.
        const encriptedPassword = await bcrypt.hash(password, 10)
        
        //Generamos y guardamos el nuevo usuario que enviaremos a la BD
        const newUser = new User({
            name,
            email,
            password: encriptedPassword,
        });
        const savedUser = await newUser.save();

        //Finalmente, generamos el token para el usuario.
        const token = jwt.sign(
            {id: User._id, email}, //este es el payload del token.
            mySecret, //este es el secreto que traemos como variable de entorno con process.env.TOKENSECRET
            { expiresIn: '2h'}
        );
        newUser.token = token;
        //newUser.password = undefined;


        res.status(201).send({
            msg:'¡Usuario creado correctamente!',
            token: token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                createdAt: savedUser.createdAt,
                updatedAt: savedUser.updatedAt,
            }
        })
    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'error registrando usuario'});
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        //console.log('mi req body es: ', req.body);
        // if(!(email && password)){
        //     return res.status(400).send({msg:'Para acceder tienes que introducir tu email y tu contraseña de usuario.'})
        // };
        const userFound = await User.findOne( { email } )
        //console.log('el usuario encontrado es: ', userFound);
        if (!userFound) return res.status(400).json({message: "Usuario no encontrado"});        //uso return para que salga una vez que lance el error

        const isMatch =await bcrypt.compare(password,userFound.password)
        if (!isMatch) return res.status(400).json({message: "Password incorrecto"});        //uso return para que salga una vez que lance el error
        
        const token = jwt.sign(
            {id: userFound._id, //el campo _id que nos facilita mongoose.
                email: userFound.email},
                mySecret, //mySecret traido desde las variables de entorno .env
                { expiresIn: '2h'} //propiedad para expirar el token en 2 horas.
            );
        //console.log("Token generado: ", token)
        // const options = {
        //         expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        //         httpOnly: true,
        // };
            // return res.status(200).cookie('token', token, options).send({success: true, 'token': token})
        return res.status(200).send({success: true, token})

    } catch(error) {
        //console.log(error);
        return res.status(400).send({msg: 'error logueando usuario'})
    }
};



//Este endpoint nos va a servir para llamarnos a nosotros mismos. Es el endpoint de "mi perfil"
const myUser = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    //console.log('token es: ', token);
    //Ahora, decodificamos el token usando la función .verify!
    try{
        const decodedToken = jwt.verify(token, mySecret)
        //console.log('El token decodificado es: ', decodedToken);
        res.status(200).send({ result: 'success', data: decodedToken })
    } catch(error) {
        //console.log('Hay un error al tratar de verificar el token.')
        res.status(400).send({msg: 'No es un token válido.'})
    }
};

//Necesitamos crear una función que nos devuelva un array de objetos. Cada objeto es un usuario.
//Este endpoint nos va a servir para llamar a todos los usuarios.
const getUsers = async (req, res) => {
    //console.log("req.params:", req.params)
    try{
        const usersDoc = await User.find()
        if(usersDoc.length === 0) {
            res.status(404).send({msg: "No se han encontrado usuarios."})
        } else {
            //console.log('Estos son mis usuarios: ', usersDoc);
            return res.status(200).send(usersDoc)
        }
    } catch(error){ return res.status(400).send(error)}
};

module.exports = {
    registerNewUser,
    loginUser,
    getUsers,
    myUser,
};

