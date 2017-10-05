'use strict'

var express = require('express');
var UsuarioControlador = require('../controllers/usuario');
var md_auth = require('../middlewares/autenticar');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/usuarios'});

var api = express.Router();

api.post('/registro', UsuarioControlador.guardarUsuario);
api.post('/login', UsuarioControlador.login);
api.put('/actualizar/:id', md_auth.comprobarAuntenticacion, UsuarioControlador.actualizarUsuario);
api.put('/actualizar-vendedor/:id', UsuarioControlador.actualizarVendedor);
api.post('/subir-imagen/:id', [md_auth.comprobarAuntenticacion, md_upload], UsuarioControlador.subirImagenUsuario);
api.get('/obtener-img-usuario/:imagen', UsuarioControlador.obtenerImagen);
api.get('/obtener-vendedor/:id', UsuarioControlador.obtenerVendedor);

module.exports = api;
