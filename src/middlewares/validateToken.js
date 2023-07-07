const jwt = require('jsonwebtoken');
require('dotenv').config();

const mySecret = process.env.TOKENSECRET;


const authRequired=(req,res,next)=>{
    
    //console.log('req.token', req.headers.authorization)

    const token = req.headers.authorization || false;

    if (!token) return res.status(401).json({message:"No hay token, no está autorizado"})

    jwt.verify(token, mySecret,(error, user)=>{
        if (error) return res.status(403).json({message:"Token inválido"});
        req.user=user
        req.token=token
        //console.log("req.user decodificado: ", req.user)
        next();
    })
};



module.exports = {
    authRequired,
};
