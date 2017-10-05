'use strict'

var bcrypt = require('bcrypt-nodejs');
var Usuario = require('../models/usuario');
var Comentario = require('../models/comentario');
var Publicacion = require('../models/publicacion');
var jwt = require('../services/jwt');

function guardarComentario(req, res){
    var usuarioId = req.params.idAut;
    var publicacionId = req.params.idPubli;
    var comentario = new Comentario;
    var parametros = req.body;
    comentario.mensaje = parametros.mensaje; 
    comentario.autor = usuarioId;
    comentario.publicacion = publicacionId;

    comentario.save((err, comentarioGuardado) => {
        if(err){
            res.status(500).send({message: 'Error en la conexion'});
        }else{
            if(!comentarioGuardado){
                res.status(404).send({message: 'No se pudo guardar el comentario'});
            }else{
                res.status(200).send({comentarioGuardado});
            }
        }
    });
}

function mostrarComentarios(req, res){
    var publicacionId = req.params.id;
    Comentario.find({publicacion: publicacionId}).populate([{
        path: 'publicacion',
        populate: {
            path: 'usuario',
            model: 'Usuario'
        }
    },{
        path: 'autor',
        populate: {
            path: 'usuario',
            model: 'Usuario'
        }
    }]).exec((err, comentarios) => {
        if(err){
            res.status(500).send({message: 'Error en la conexion'});
        }else{
            if(!comentarios){
                res.status(404).send({message: 'No hay comentarios'});
            }else{
                res.status(200).send({comentarios});
            }
        }
    });
}

module.exports = {
    guardarComentario,
    mostrarComentarios
}