const User = require('../models/userModel.js');

module.exports = function(req, res, next) {
    if(!req.session.user_id){
        res.redirect('/users/login');
    } else {
        User.findById(req.session.user_id, function(err, userModel){
            if(err){
                console.log(err);
                res.redirect('/users/login');
            } else {
                res.locals = { user: userModel } ;
                next();
            }
        })
    }
}