var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema= new Schema({
    name:{
        type: String,
        minLength:2,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String, // TO DO -- VALIDACIÓN DE MAIL CON @ REGEX ----
        required: true,
        trim: true, //trim nos permite eliminar los espacios innecesarios en el form
        unique: true //con unique estamos solicitando que el mail solo puede registrarse una vez
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    phoneNumber: {
        type: Number,
        //unique: true
    },
    birthYear: {
        type:Number
    },
    userType: {
        type: String,
        default: 'superadmin',
        enum: ['superadmin','admin', 'viewer']
    },
},
    {timestamps:true}
);

module.exports = mongoose.model('User', userSchema);