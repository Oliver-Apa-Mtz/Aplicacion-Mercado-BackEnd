'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublicacionSchema = Schema({
    titulo: String,
    descripcion: String,
    precio: String,
    fechaRegistro: String,
    estado: String,
    existencias: String,
    entregaLat: Number,
    entregaLng: Number,
    categoriaPrincipal: String,
    categoriaSecundaria: String,
    usuario: {type: Schema.ObjectId, ref: 'Usuario'},
    imgPri: String,
    imgSec: String,
    imgTer: String,
});

module.exports = mongoose.model('Publicacion',PublicacionSchema);