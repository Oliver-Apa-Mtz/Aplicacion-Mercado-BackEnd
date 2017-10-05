'use strict'

var express = require('express');
var ComentarioControlador = require('../controllers/comentario');
var md_auth = require('../middlewares/autenticar');

var api = express.Router();

api.post('/guardar-comentario/:idAut-:idPubli',md_auth.comprobarAuntenticacion, ComentarioControlador.guardarComentario);
api.get('/comentario/:id', md_auth.comprobarAuntenticacion, ComentarioControlador.mostrarComentarios);

module.exports = api;