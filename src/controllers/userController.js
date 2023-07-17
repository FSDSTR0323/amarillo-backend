const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const util = require('util');
const sendEmail = require('../utils/email.js');

require('dotenv').config();

const mySecret = process.env.TOKENSECRET;

const registerNewUser = async (req, res) => {
    try {
        //Tomamos el data que tengamos en el body - frontend
        const { name, email, password } = req.body;
        //todos los datos que necesitamos deben estar presentes para poder registrar al nuevo usuario:
        if (!( name || email || password )) {
            return res.status(400).send({msg: 'Tienes que rellenar todos los campos para realizar el registro.'})
        }
        //Chequeamos que el ususario no exista ya dentro de nuestra BD --- basado en el email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({msg:'Este usuario ya está registrado.'})
        }
        //Ahora requerimos de la libreria de bcrypt para encriptar la contraseña que nos pasan por el front.
        // console.log("Usuario no registrado, hasheamos el pass " )


        const encriptedPassword = await bcrypt.hash(password, 10)
        
        //Generamos y guardamos el nuevo usuario que enviaremos a la BD
        const newUser = new User({
            name,
            email,
            password: encriptedPassword,
            
        });
        const savedUser = await newUser.save();
        // console.log("usuario guardado en BBDD: " , savedUser)

        //Finalmente, generamos el token para el usuario.
        const token = await jwt.sign(
            {id: savedUser._id, email}, //este es el payload del token.
            mySecret, //este es el secreto que traemos como variable de entorno con process.env.TOKENSECRET
            { expiresIn: '2h'}
        );
        newUser.token = token;
        
        //Mandamos el email de validación
        try{
            await sendEmail({
                email: newUser.email,
                subject: 'Homehub te da la bienvenida.',
                message: '<div> <h2>Gracias por registrarte en la app.</h2> <p>Esto es un correo de verificación estándar.</p> </div>', 
            })
            res.status(200).send({
                status: 'success',
                message: 'Correo de bienvenida enviado al nuevo usuario.'
            })
        } catch(error) {
            console.log(error)
        }
        
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
        const userFound = await User.findOne( { email } )
        if (!userFound) return res.status(400).json({message: "Usuario no encontrado"});        //uso return para que salga una vez que lance el error
        const isMatch =await bcrypt.compare(password,userFound.password)
        if (!isMatch) return res.status(400).json({message: "Password incorrecto"});        //uso return para que salga una vez que lance el error
        
        const token = jwt.sign(
            {id: userFound._id,             //el campo _id que nos facilita mongoose.
                email: userFound.email},
                mySecret,                   //mySecret traido desde las variables de entorno .env
                { expiresIn: '2h'}          //propiedad para expirar el token en 2 horas.
            );
        
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

const updateUser = (req, res) => {
    User.findByIdAndUpdate(
        req.params.userId,
        {
            name: req.body.name,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            birthYear: req.body.birthYear
        }
    )
    .then( userDoc => {
        if( userDoc === null ){
            res.status(404).send({msg: 'No hemos encontrado este usuario.'})
        } else {
            res.status(200).send({userDoc})
        }
    })
    .catch( error => {
        switch(error.name){
            case 'CastError':
                res.status(400).send({msg: 'Formato de id inválido.'})
                break;
            default :
                res.status(400).send({msg: 'Ha habido un error'})
        }
    })
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
    // myUser,
    updateUser,
};

