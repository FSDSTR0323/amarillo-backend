const Device = require('../models/deviceModel.js')

//Añadimos una nuevo dispositivo
const addDevice = async (req,res)=>{
    console.log('Estos son los datos del nuevo dispositivo: ', req.body);
    const addDevice = await Device.create(
        {
            name: req.body.name,
            deviceType: req.body.deviceType,
            status: req.body.status,
            deviceData: req.body.deviceData,
            roomId: req.body.roomId
        }
    )
    .then( deviceDoc => res.status(200).send({msg:'Dispositivo añadido!'}))
    .catch(error => {
        console.error(error.code);
        res.status(400).send({msg:'Algo ha salido mal.'})
    })
};

const getDevices = async (req, res) => {
    console.log('req. getDevices por id de habitación: ', req.params.roomId )
    if(req.params.roomId){
        Device.find({'roomId': req.params.roomId})
            .then( deviceDocs => {
                if( deviceDocs === null ){
                    res.status(200).send({msg:'No hemos encontrado dispositivos conectados.'})
                } else {
                    res.status(200).send( deviceDocs)
                }
            })
            .catch ( error => {  //De esta manera podemos controlar el hecho de que el error sea debido a un ID inválido
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

        Device.find(filter)
            .then( deviceDocs => {
                if( deviceDocs.length === 0){
                    res.status(200).send({msg:'No se han encontrado resultados.'})
                } else {
                    console.log('Estos son los datos que traemos de la BBDD: ', deviceDocs );
                    res.status(200).send(deviceDocs)
                }
            })
            .catch(error => res.status(400).send(error))
    }
};

//Podemos editar nuestro dispositivo. UPDATE CON PUT
const updateDevice = (req, res) => {
    console.log (req.params.status);
    // if (req.params.status==="On"){
    // }else 


    Device.findByIdAndUpdate(
        req.params.deviceId,
        {
            name: req.body.name,
            // status: req.body.name: haría falta poder cambiar el estado de on a off
            // o incluso cambiar volumen, velocidad...
        }
    )
    .then(deviceDoc => {
        if( deviceDoc === null ){
            res.status(404).send({msg: 'No hemos encontrado este dispositivo.'})
        } else {
            res.status(200).send({msg: 'Dispositivo modificiado!'})
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
};

//Eliminamos nuestro dispositivo. DELETE
const deleteDevice = (req, res) => {
    Device.findOneAndDelete(
        {
            _id: req.params.deviceId,
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
        .then(deviceDoc=>{
            //console.log(deviceDoc)
            if ( deviceDoc === null ) {
                res.status(404).send({msg: "No se ha encontrado este dispositivo."})
            } else {
                res.status(200).send({msg:"Dispositivo eliminada."})   
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

module.exports = {
    addDevice,
    getDevices,
    updateDevice,
    deleteDevice,
}