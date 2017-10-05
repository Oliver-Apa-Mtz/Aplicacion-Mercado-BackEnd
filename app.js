'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//cargar rutas
var usuario_rutas = require('./routes/usuario');
var publicacion_rutas = require('./routes/publicacion');
var comentario_rutas = require('./routes/comentario');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//rutas base
app.use('/api', usuario_rutas);
app.use('/api', publicacion_rutas);
app.use('/api', comentario_rutas);

module.exports = app;