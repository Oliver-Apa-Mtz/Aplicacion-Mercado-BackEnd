'use strict'

var express = require('express');
var PublicacionControlador = require('../controllers/publicacion');
var md_auth = require('../middlewares/autenticar');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/publicaciones'});

var api = express.Router();

api.post('/guardar-publicacion', md_auth.comprobarAuntenticacion, PublicacionControlador.guardarPublicacion);
api.get('/publicacion/:id', md_auth.comprobarAuntenticacion, PublicacionControlador.mostrarPublicacion);
api.put('/actualizar-publicacion/:id',md_auth.comprobarAuntenticacion, PublicacionControlador.actualizarPublicacion);
api.post('/subir-imagen-publi/:id', [md_auth.comprobarAuntenticacion, md_upload], PublicacionControlador.subirImagenPublicacion);
api.get('/obtener-img-publi/:imagen', PublicacionControlador.obtenerImagenPubli);
api.get('/publicaciones/:id?', md_auth.comprobarAuntenticacion, PublicacionControlador.mostrarPublicaciones);
api.get('/publicaciones-cate/:categoria',md_auth.comprobarAuntenticacion, PublicacionControlador.mostraPublicacionesCategoria);
api.get('/publicaciones-sub/:subcategoria',md_auth.comprobarAuntenticacion, PublicacionControlador.mostraPublicacionesSubcategoria);
api.get('/publicaciones-buscar/:termino',md_auth.comprobarAuntenticacion, PublicacionControlador.mostrarPublicacionesBuscar);
api.delete('/eliminar-publicacion/:id', md_auth.comprobarAuntenticacion, PublicacionControlador.eliminarPublicacion);

module.exports = api;