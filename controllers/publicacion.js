'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var Usuario = require('../models/usuario');
var Publicacion = require('../models/publicacion');
var Comentario = require('../models/comentario');
var jwt = require('../services/jwt');

function guardarPublicacion(req, res){
    var publicacion = new Publicacion;
    var parametros = req.body;
    publicacion.titulo = parametros.titulo;
    publicacion.descripcion = parametros.descripcion;
    publicacion.precio = parametros.precio;
    publicacion.estado = parametros.estado;
    publicacion.existencias = parametros.existencias;
    publicacion.categoriaPrincipal = parametros.categoriaPrincipal;
    publicacion.categoriaSecundaria = parametros.categoriaSecundaria;
    publicacion.usuario = parametros.usuario;
    publicacion.fechaRegistro = parametros.fechaRegistro;
    publicacion.entregaLat = parametros.entregaLat;
    publicacion.entregaLng = parametros.entregaLng;

    if(publicacion.titulo != null && publicacion.precio != null && publicacion.descripcion != null && publicacion.estado != null){
        publicacion.save((err, publicacionGuardada) => {
            if(err){
                res.status(500).send({message: 'Error al guardar la publicacion'});
            }else{
                if(!publicacionGuardada){
                    console.log(err);
                    res.status(404).send({message: 'No se guardo la publicacion'});
                }else{
                    res.status(200).send({publicacion: publicacionGuardada});
                }
            }
        });
    }
}

function mostrarPublicacion(req, res){
    let publicacionId = req.params.id;
    let find = Publicacion.find({_id: publicacionId});
    find.populate({
        path: 'usuario',
        populate: {
            path: 'usuario',
            model: 'Usuario'
        }
    }).exec((err, Publicacion) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion'})
        }else{
            if(!Publicacion){
                res.status(404).send({message: 'No existe la publicacion'});
            }else{
                res.status(200).send({publicacion: Publicacion});
            }
        }
    })
}

function mostraPublicacionesCategoria(req, res){
    let publicacionCategoria = req.params.categoria;
    let find = Publicacion.find({categoriaPrincipal: publicacionCategoria}).sort('fecharegistro');
    find.populate({
        path: 'usuario',
        populate: {
            path: 'usuario',
            model: 'Usuario'
        }
    }).exec((err, Publicaciones) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion'})
        }else{
            if(!Publicaciones){
                res.status(404).send({message: 'No hay publicaciones'});
            }else{
                res.status(200).send({publicaciones: Publicaciones});
            }
        }
    })
}
function mostraPublicacionesSubcategoria(req, res){
    let publicacionSubcategoria = req.params.subcategoria;
    let find = Publicacion.find({categoriaSecundaria: publicacionSubcategoria}).sort('fecharegistro');
    find.populate({
        path: 'usuario',
        populate: {
            path: 'usuario',
            model: 'Usuario'
        }
    }).exec((err, Publicaciones) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion'})
        }else{
            if(!Publicaciones){
                res.status(404).send({message: 'No hay publicaciones'});
            }else{
                res.status(200).send({publicaciones: Publicaciones});
            }
        }
    })
}
function mostrarPublicacionesBuscar(req, res){
    let termino = req.params.termino.toLowerCase();
    let find = Publicacion.find({}).sort('fecharegistro');
    find.populate({
        path: 'usuario',
        populate: {
            path: 'usuario',
            model: 'Usuario'
        }
    }).exec((err, Publicaciones) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion'})
        }else{
            if(!Publicaciones){
                res.status(404).send({message: 'No hay publicaciones'});
            }else{
                let publicacionesBuscar = [];
                for(let publicacion of Publicaciones){
                    let nombre = publicacion.titulo.toLowerCase();
                    if(nombre.indexOf(termino) >= 0){
                        publicacionesBuscar.push(publicacion);
                    }
                }
                res.status(200).send({publicaciones: publicacionesBuscar});
            }
        }
    })
}
function mostrarPublicaciones(req, res){
    var id = req.params.id;
    if(!id){
        var find = Publicacion.find({}).sort('fechaRegistro')
    }else{
        var find = Publicacion.find({usuario: id}).sort('fechaRegistro')
    }
    find.populate({
        path: 'usuario',
        populate: {
            path: 'usuario',
            model: 'Usuario'
        }
    }).exec((err, Publicaciones) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion'})
        }else{
            if(!Publicaciones){
                res.status(404).send({message: 'No hay publicaciones'});
            }else{
                res.status(200).send({publicaciones: Publicaciones});
            }
        }
    })
}

function actualizarPublicacion(req, res){
    var publicacionId = req.params.id;
    var actualizar = req.body;

    Publicacion.findByIdAndUpdate(publicacionId, actualizar, (err, publicacionActualizada) => {
        if(err){
            res.status(500).send({message: 'Error al actualizar la publicacion'});
        }else{
            if(!publicacionActualizada){
                res.status(404).send({message: 'No se pudo actualizar la publicacion'});
            }else{
                res.status(200).send({publicacionActualizada});
            }
        }
    });
}

function subirImagenPublicacion(req, res){
    var publicacionId = req.params.id;
    var file_namePri = 'No subido';
    var file_nameSec = 'No subido';
    var file_nameTer = 'No subido';
    if(req.files){
        var file_pathPri = req.files.imgPri.path;
        var file_splitPri = file_pathPri.split('\\');
        var file_namePri = file_splitPri[2];
        var ext_splitPri = file_namePri.split('\.');
        var file_extPri = ext_splitPri[1];
        console.log(file_pathPri);

        var file_pathSec = req.files.imgSec.path;
        var file_splitSec = file_pathSec.split('\\');
        var file_nameSec = file_splitSec[2];
        var ext_splitSec = file_nameSec.split('\.');
        var file_extSec = ext_splitSec[1];
        console.log(file_pathSec);

        var file_pathTer = req.files.imgTer.path;
        var file_splitTer = file_pathTer.split('\\');
        var file_nameTer = file_splitTer[2];
        var ext_splitTer = file_nameTer.split('\.');
        var file_extTer = ext_splitTer[1];
        console.log(file_pathTer);

        if(file_extPri == 'png' || file_extPri == 'jpg' || file_extPri == 'jpeg' || file_extSec == 'png' || file_extSec == 'jpg' || file_extSec == 'jpeg' || file_extTer == 'png' || file_extTer == 'jpg' || file_extTer == 'jpeg'){
            Publicacion.findByIdAndUpdate(publicacionId, {imgPri: file_namePri, imgSec: file_nameSec, imgTer: file_nameTer}, (err, publicacionActualizado) => {
                if(!publicacionActualizado){
                    res.status(500).send({message: 'No se pudo actualizar la imagen de la publicacion'});
                }else{
                    res.status(200).send({imgPri: file_namePri, imgSec: file_nameSec, imgTer: file_nameTer, publicacion: publicacionActualizado});
                }
            });
        }else{
            res.status(200).send({message: 'Extension de archivo no valido'});
        }
    }else{
        res.status(200).send({message: 'No ha subido ninguna imagen'});
    }
}

function obtenerImagenPubli(req, res){
    var imagenFile = req.params.imagen;
    var pathFile = './uploads/publicaciones/'+imagenFile;
    fs.exists(pathFile, (exists) => {
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(200).send({message: 'No existe la imagen'});
        }
    });
}

function eliminarPublicacion(req, res){
    var publicacionId = req.params.id;
    Publicacion.findByIdAndRemove(publicacionId, (err, publicacionEliminada) => {
        if(err){
            res.status(500).send({message: 'Error en la conexion'});
        }else{
            if(!publicacionEliminada){
                res.status(404).send({message: 'No se pudo eliminar la publicacion'});
            }else{
                Comentario.find({publicacion: publicacionId}).remove((err, comentarioEliminado) => {
                    if(err){
                        res.status(500).send({message: 'Error en la conexion'});
                    }else{
                        if(!comentarioEliminado){
                            res.status(404).send({message: 'No se pudo eliminar el comentario'});
                        }else{
                            res.status(200).send({publicacionEliminada});
                        }
                    }
                });
            }
        }
    });
}

module.exports = {
    guardarPublicacion,
    mostrarPublicacion,
    actualizarPublicacion,
    mostrarPublicaciones,
    eliminarPublicacion,
    subirImagenPublicacion,
    obtenerImagenPubli,
    mostraPublicacionesCategoria,
    mostraPublicacionesSubcategoria,
    mostrarPublicacionesBuscar
}
