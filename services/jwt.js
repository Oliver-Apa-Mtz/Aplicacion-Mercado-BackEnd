'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta';

exports.crearToken = function(user){
    var payload = {
        sub: user._id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        tipo: user.tipo,
        imagen: user.imagen,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };
    return jwt.encode(payload, secret);
} 