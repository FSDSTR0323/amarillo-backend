const Device = require('../models/deviceModel.js')


//Añadimos una nuevo dispositivo
const addDevice = async (req,res)=>{
    try {
        //console.log(req.body);
        const { name, deviceType, status, roomId } = req.body;
        const existingDevice = await Device.findOne({ name });
        if (existingDevice) {
            return res.status(400).send({msg:'Este Device ya está registrado.'})
        }

        Device.create(
            {
                name,
                deviceType,
                status,
                roomId
            }
        )
        res.status(200).send({msg:"Dispositivo añadido"})
    } catch (error) {
        console.error(error.code);
        switch(error.code){
            case 11000:
                res.status(400).send({msg: "Error 11.000:"})
                break;
            default :
            res.status(400).send(error);
        }
    }
};

const getDevices = async (req, res) => {
        // podríamos pedir devices en habitación: on; tipo: persiana; todos
        // Siempre necesitaré el roomId para saber 
    //console.log("req.params. :", req.params)
    if(req.params.deviceId){
        try{
            const devicesDoc = await Device.findById(req.params.deviceId)
            if (!devicesDoc||devicesDoc.length=== null) return res.status(404).send({msg: "No se han encontrado dispositivos."})
            return res.status(200).send( devicesDoc )
            } catch( error) {  
                switch (error.name){
                    case 'Cast Error':
                        res.status(400).send({msg: 'Formato de id inválido.'})
                        break;
                    default :
                        res.status(400).send(error)
                }
            }
    } else {
        const devicesDoc = await Device.find()
        try{
            if(devicesDoc.length === 0) res.status(404).send({msg: "No se han encontrado dispositivos."})
            //console.log('Estos son mis dispositivos: ', devicesDoc);
            return res.status(200).send(devicesDoc)
            } catch(error) {
            //console.log("error: ", error)
            res.status(400).send(error)
        }
    }
};

//Podemos editar nuestra estancia. UPDATE CON PUT
const updateDevice = (req, res) => {
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