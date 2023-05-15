const express = require ("express")
const app = express();


require('dotenv').config();
const port = process.env.PORT || 9000;
app.listen(port, ()=>console.log("El servidor está escuchando en el port", port))

const mongoose = require("mongoose");
const mongoDB = "mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@proyectofinalcluster.kshe6if.mongodb.net/"+process.env.DB_NAME+"?retryWrites=true&w=majority"

mongoose.connect(mongoDB)
.then (()=>console.log('Conectado correctamente a MondoDB Atlas'))
.catch(err => console.log(err));


app.get('/', (req, res) => {
    res.status(200).send({msj:'Hello World!'})
})



