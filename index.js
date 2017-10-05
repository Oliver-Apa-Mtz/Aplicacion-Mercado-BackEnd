'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port =  process.env.PORT || 3977;


mongoose.connect('mongodb://localhost:27017/mercado',(err, res) => {
    if(err){
        throw err;
    }else{
        console.log('La conexion con la base de datos se establecio correctamente :)');
        app.listen(port, function(){
            console.log('Servidor del Api_Rest escuchando en http://localhost:'+port);
        })
    }
});
