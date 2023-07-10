const House = require ('../models/houseModel');

//FUNCIÓN 
const addHouse = async (req,res)=>{

    //const user = await User.findById(userId)
    console.log("userId: ",req.user.id)
    console.log("req body addHouse: ", req.body)
    const newHouse = await House.create(
        
        {
            name: req.body.name,
            type:req.body.type,
            street: req.body.street,
            number: req.body.number,
            district: req.body.district,
            city: req.body.city,
            country: req.body.country,
            houseSize: req.body.houseSize,
            roomsNumber: req.body.roomsNumber,
            houseImg: req.body.houseImage,         
            userId: req.user.id                   //Aquí le estamos solicitando el usuario que se ha registrado previamente.
        }
    )  

    .then( houseDoc => res.status(200).send({msg:"Nueva vivienda registrada"}))
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


//PRUEBA DE FUNCIÓN ------- ÁLVARO
// const addHouse = async (req,res)=>{
//     //console.log(res.locals.user._id)
//     const houseData = {
//             name: req.body.name,

//             street: req.body.street,
//             number: req.body.number,
//             district: req.body.district,
//             city: req.body.city,
//             country: req.body.country,
            
//             houseSize: req.body.houseSize,
//             roomsNumber: req.body.roomsNumber,

//             //user: res.locals.user._id //Aquí le estamos solicitando el usuario que se ha registrado previamente.
//         }

//     const newHouse = await House.create(houseData);
//     newHouse.save(function(err){
//         if(!err){
//             res.status(200).send({msg: 'Vivienda creada!'})
//         } else {
//             console.log(newHouse)
//             res.render(err)
//         }
//     })
// };

//Consultamos nuestras viviendas. GET. Hay que filtrarlas por req.user.id
const getHouse = (req, res) => {
    console.log("req.user.id: ", req.user.id);

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

        //hacer un map de las casas para ver cuál tiene user.id=user


        // let filter = {}
        // if (req.query.status) {
        //     filter.status = req.query.status
        // }

        // //TODO: Find by text search

        // //TODO: Find by datemax is not working properly
        // if (req.query.datemax) {
        //     filter.dueDate = { $lte: new Date(req.query.datemax) }
        // }
        //let filter = {user}
        House.find({userId:req.user.id})
            .then(houseDocs => {
                //console.log("houseDocs; ",houseDocs)
                if(houseDocs.length === 0) {
                    res.status(200).send(houseDocs)
                } else {
                    //res.house.id=
                    //console.log("listado casas: ---->>>>>>>", houseDocs)
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
    //    House.findOneAndUpdate(
    House.findOneAndDelete(
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