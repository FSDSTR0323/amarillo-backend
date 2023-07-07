const { findById } = require('../models/roomModel.js');
const Room = require('../models/roomModel.js');


//Añadimos una nueva estancia
const addRoom = async (req,res)=>{
    
    const newRoom = await Room.create(
        {
            name: req.body.name,
            roomType: req.body.type,
            roomImage: req.body.roomImage, //Esto es la url que nos traemos de Cloudinary
            //house_.id: houseId // TENEMOS QUE MANDAR EL ID DE LA CASA A LA QUE PERTENECE
        }
    )
    .then( roomDoc => res.status(200).send({msg:"Habitación añadida"}))
    .catch(error=>{
        console.error(error.code);
        switch(error.code){
            case 11000:
                res.status(400).send({msg: "Error 11.000: Esta habitación ya existe. No puedes duplicarla"})
                break;
            default :
            res.status(400).send(error);
        }
    })
};


//Consultamos nuestras habitaciones. GET
const getRooms = (req, res) => {
    console.log("req. getRooms by House Id", req.params.roomId)
    if(req.params.roomId){ //al llamar al roomId, tenemos que hacer el método find
        Room.find({"houseId":req.params.roomId})
            .then( roomDoc => { 
                if(roomDoc === null ) {
                    res.status(400).send({msg: 'Esta estancia no existe.'})
                } else {
                    res.status(200).send( roomDoc )
                }
            })
            .catch( error => {  //De esta manera podemos controlar el hecho de que el error sea debido a un ID inválido
                switch (error.name){
                    case 'Cast Error':
                        res.status(400).send({msg: 'Formato de id inválido.'})
                        break;
                    default :
                        res.status(400).send(error)
                }
            })
    } else {
        let filter = {}
        if (req.query.status) {
            filter.status = req.query.status
        }

        //TODO: Find by text search

        //TODO: Find by datemax is not working properly
        if (req.query.datemax) {
            filter.dueDate = { $lte: new Date(req.query.datemax) }
        }

        //console.log("ID de la casa:", req,house.id)
        console.log("REQ: ",req);
        //filter= {houseId: req.house.id}
        Room.find(filter)
            .then(roomDocs => {
                if(roomDocs.length === 0) {
                    res.status(200).send({msg: "No se han encontrado estancias."})
                } else {
                    //Hay que filtrar el roomDocs por req.user/casa
                    console.log("el roomDoc: ", roomDocs)
                    res.status(200).send(roomDocs)
                }
            })
            .catch(error => res.status(400).send(error))
    }
};


//Podemos editar nuestra estancia. UPDATE CON PUT
const updateRoom = (req, res) => {
    Room.findByIdAndUpdate(
        req.params.roomId,
        {
            name: req.body.name,
        }
    )
    .then(roomDoc => {
        if( roomDoc === null ){
            res.status(404).send({msg: 'No hemos encontrado esta estancia.'})
        } else {
            res.status(200).send({msg: 'Estancia modificiada!'})
        }
    })
    .catch( error => {
        switch(error.name){
            case 'CastError':
                res.status(400).send({msg: 'Formato de id inválido.'})
                break;
            default :
                res.status(200).send({msg: 'Ha habido un error'})
        }
    })
    //res.status(200).send({msg: 'Estancia modificada correctamente!'})
};

// Eliminamos nuestra estancia. DELETE 1
const deleteRoom = (req, res) => {
    Room.findOneAndDelete(
        {
            _id: req.params.roomId,
            //status: { $ne: "DELETED" }
        }
        ,
        /*
        {
            status: "DELETED",
            deletedAt: new Date()
        }, 
        */
        {
            timestamps: false
        }
        )
        .then(roomDoc=>{
            //console.log(roomDoc)
            if ( roomDoc === null ) {
                res.status(404).send({msg: "No se ha encontrado esta estancia."})
            } else {
                res.status(200).send({msg:"Estancia eliminada."})   
            }
        })
        .catch(error=>{
            switch (error.name) {
                case 'CastError':
                    res.status(400).send({msg: 'Formato de id inválido'})
                    break;
                default:
                    res.status(400).send(error)
            }
        })
};

// DELETE Nº 2 ---> COMO EJECUTAMOS EL DELETE DE ESTA ESTANCIA?¿?¿?¿?
// const deleteRoom = (req, res) => {
//     if(req.params.roomId){
//         Room.findById(req.params.roomId)
//         .then( Room.remove( error => {
//             res.status(500).send({msg:`Error al borrar esta estancia! ${error}`})
//             res.status(200).send({msg:`Estancia elimianda correctamente!`})
//         }))
//         .catch(error => res.status(400).send(error))
//     } else {
//         res.status(500).send({msg:`No hemos encontrado id! ${error}`})
//     }
// };



module.exports = {
    addRoom,
    getRooms,
    updateRoom,
    deleteRoom,
}