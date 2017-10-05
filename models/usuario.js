'use strict'
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    nombre: String,
    apellido: String,
    email: String,
    password: String,
    tipo: String,
    imagen: String,
    telefono: Number,
    fechaRegistro: {type: Date, default: Date.now},
    favoritos: Array,
    ventas: Array,
    compras: Array,
    ofertasHechas: Array,
    ofertasRecibidas: Array
});

module.exports = mongoose.model('Usuario',UsuarioSchema);
