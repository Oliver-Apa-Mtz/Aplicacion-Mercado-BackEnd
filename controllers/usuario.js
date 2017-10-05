'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var Usuario = require('../models/usuario');
var jwt = require('../services/jwt');

function login(req, res){
    var parametros = req.body;
    var email = parametros.email;
    var password = parametros.password;

    Usuario.findOne({email: email.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!user){
                res.status(404).send({message: 'El usuario no existe'});
            }else{
                bcrypt.compare(password, user.password, (err, check) => {
                    if(check){
                        if(parametros.gethash){
                            res.status(200).send({token: jwt.crearToken(user)});
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({message: 'El usuario no pudo logearse'});
                    }
                });
            }
        }
    });
}

function guardarUsuario(req, res){
    var usu = new Usuario;
    var parametros = req.body;

    usu.nombre = parametros.nombre;
    usu.email = parametros.email;
    usu.apellido = '';
    usu.tipo = 'usuario';
    usu.imagen = 'null';
    usu.favoritos = [];
    usu.ventas = [];
    usu.compras = [];
    usu.ofertasHechas = [];
    usu.ofertasRecibidas = [];

    if(parametros.password){
        bcrypt.hash(parametros.password, null, null, (err, hash) => {
            usu.password = hash;
        });
        if(usu.nombre != null && usu.email != null){
            usu.save((err, usuarioGuardado) => {
                if(err){
                    console.log(err);
                    res.status(500).send({message: 'Error al guardar el usuario'});
                }else{
                    if(!usuarioGuardado){
                        res.status(404).send({messsage: 'No se pudo guardar el usuario'});
                    }else{
                        res.status(200).send({usuario: usuarioGuardado});
                    }
                }
            });
        }else{
            res.status(200).send({message: 'Rellena todos los campos'});
        }
    }else{
        res.status(200).send({message: 'introduce la contraseña'});
    }
}

function actualizarUsuario(req, res){
    var usuId = req.params.id;
    var actualizar = req.body;
    if(usuId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para actualizar este usuario'});
    }

    Usuario.findByIdAndUpdate(usuId, actualizar, (err, usuarioActualizado) => {
        if(err){
            res.status(500).send({message: 'Error al actualizar el usuario'});
        }else{
            if(!usuarioActualizado){
                res.status(404).send({message: 'No existe el usuario'});
            }else{
                res.status(200).send({usuario: usuarioActualizado});
            }
        }
    });
}

function actualizarVendedor(req, res){
  var vendId = req.params.id;
  var actualizar = req.body;
  console.log(req.body);

  Usuario.findByIdAndUpdate(vendId, actualizar, (err, usuarioActualizado) => {
      if(err){
          res.status(500).send({message: 'Error al actualizar al vendedor'});
      }else{
          if(!usuarioActualizado){
              res.status(404).send({message: 'No existe el vendedor'});
          }else{
              res.status(200).send({usuario: usuarioActualizado});
          }
      }
  });
}
function subirImagenUsuario(req, res){
    var usuId = req.params.id;
    var file_name = 'No subido';
    if(req.files){
        var file_path = req.files.imagen.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg'){
            Usuario.findByIdAndUpdate(usuId, {imagen: file_name}, (err, usuarioActualizado) => {
                if(!usuarioActualizado){
                    res.status(500).send({message: 'No se pudo actualizar la imagen del usuario'});
                }else{
                    res.status(200).send({imagen: file_name, usuario: usuarioActualizado});
                }
            });
        }else{
            res.status(200).send({message: 'Extension de archivo no valido'});
        }
    }else{
        res.status(200).send({message: 'No ha subido ninguna imagen'});
    }
}

function obtenerImagen(req, res){
    var imagenFile = req.params.imagen;
    var pathFile = './uploads/usuarios/'+imagenFile;
    fs.exists(pathFile, (exists) => {
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(200).send({message: 'No existe la imagen'});
        }
    });
}

function obtenerVendedor(req ,res){
  var idVendedor = req.params.id;
  Usuario.findOne({_id: idVendedor}, (err, Usuario) => {
    if(err){
      res.status(500).send({message: 'Error en la peticion'});
    }else{
      if(!Usuario){
        res.status(404).send({message: 'El usuario no existe'});
      }else{
        res.status(200).send({usuario: Usuario});
      }
    }
  });
}

module.exports = {
    guardarUsuario,
    login,
    actualizarUsuario,
    actualizarVendedor,
    subirImagenUsuario,
    obtenerImagen,
    obtenerVendedor
};
