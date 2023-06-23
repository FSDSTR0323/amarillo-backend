var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema= new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    roomType: {
        type: String,
        enum: ['Kitchen', 'Lounge', 'Room', 'Bathroom', 'Garden', 'Dinning Room'],
        required: true
    },
    roomImage: {
        type: String,
    },
    //TO DO: METER LOS DEVICES

    houseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'House'
    },
},
    {timestamps:true}
);

module.exports = mongoose.model('Room', roomSchema);