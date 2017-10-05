'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ComentarioSchema = Schema({
    autor: {type: Schema.ObjectId, ref: 'Usuario'},
    mensaje: String,
    fecha: {type: Date, default: Date.now},
    publicacion: {type: Schema.ObjectId,  ref: 'Publicacion'}
});

module.exports = mongoose.model('Comentario',ComentarioSchema);