const House = require ('../models/houseModel')

// cambiar con house

//Añadimos una nueva vivienda
const addHouse = (req,res)=>{
    //console.log(req.body);
    House.create(
        {
            name: req.body.name,
            address: req.body.address,
            size: req.body.size,
            roomsNumber: req.body.roomsNumber
        }
    )  

    .then( houseDoc=>res.status(200).send({msg:"Nueva vivienda registrada"}))
    .catch(error=>{
        console.error(error.code);
        switch(error.code){
            case 11000:
                res.status(400).send({msg: "Error 11.000: Esta vivienda ya existe. No puedes duplicarla"})
                break;
            default :
            res.status(400).send(error);
        }
    })
};

//Consultamos nuestras viviendas. GET
const getHouse = (req, res) => {
    if(req.params.houseId){ //al llamar al houseId, tenemos que hacer el método findById.
        House.findById(req.params.roomId)
            .then( houseDoc => { //En este punto tenemos que pensar en si existirá o no la task con ese ID, accediendo a roomDoc
                if(houseDoc === null ) {
                    res.status(400).send({msg: 'Esta estancia no existe.'})
                } else {
                    res.status(200).send( houseDoc )
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

        //console.log(req.query.status,filter)
        House.find(filter)
            .then(houseDocs => {
                if(houseDocs.length === 0) {
                    res.status(404).send({msg: "No se han encontrado viviendas."})
                } else {
                    res.status(200).send(houseDocs)
                }
            })
            .catch(error => res.status(400).send(error))
    }
};


//Podemos editar nuestra vivienda. UPDATE CON PUT
const updateHouse = (req, res) => {
    House.findByIdAndUpdate(
        req.params.houseId,
        {
            name: req.body.name,
        }
    )
    .then(houseDoc => {
        if( houseDoc === null ){
            res.status(404).send({msg: 'No hemos encontrado esta vivienda.'})
        } else {
            res.status(200).send({msg: '¡Vivienda modificiada!'})
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
    //res.status(200).send({msg: '¡Vivienda modificada correctamente!'})
};



//Eliminamos nuestra estancia. DELETE
const deleteHouse = (req, res) => {
    House.findOneAndUpdate(
        {
            _id: req.params.houseId,
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
        .then(houseDoc=>{
            //console.log(houseDoc)
            if ( houseDoc === null ) {
                res.status(404).send({msg: "No se ha encontrado esta vivienda."})
            } else {
                res.status(200).send({msg:"Vivienda eliminada."})   
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
    addHouse,
    getHouse,
    updateHouse,
    deleteHouse,
}