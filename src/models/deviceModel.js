var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deviceSchema= new Schema({
    name: String,
    deviceType: {
        type: String,
        enum: ['lightbulb', 'blinders', 'temperature', 'furniture', 'other'],
        required: true,
        //unique:true
    },
    status: {
        //type: Boolean,        
        enum: ['On','Off']
    },
    deviceData: {},       //Posibles datos de los dispositivos a representar
    roomId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },

    deletedAt: {type: Date}
},
    { timestamps : true }
);

module.exports = mongoose.model('Device', deviceSchema);