require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 9000;
// test conflicto jgalobart
//Hola, vamos a crear un conflicto 3 trentaitres.
//Hola, vamos a crear un conflicto - prueba 4
//Modificación Alvaro.
app.use(express.json());
app.use(cors());
app.listen(port, () => console.log("El servidor está escuchando en el port", port))

const mongoose = require("mongoose");
const mongoDB = "mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@proyectofinalcluster.kshe6if.mongodb.net/"+process.env.DB_NAME+"?retryWrites=true&w=majority"

mongoose.connect(mongoDB)
    .then (()=>console.log('Conectado correctamente a MondoDB Atlas'))
    .catch(err => console.log(err));

//Lo que enviamos cuando no se manda ruta: backend funcionando
app.get('/', (req, res) => {
    res.status(200).send({msj:'Hello World!'})
})


//Definimos las rutas


const rooms = require('./src/routes/rooms.js')
app.use('/rooms', rooms)

const users = require('./src/routes/users.js')
app.use('/users', users)

const devices = require('./src/routes/devices.js')
app.use('/devices', devices)





