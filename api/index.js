'use strict'

const mongoose = require('mongoose');
var app = require('./app');
var puerto = process.env.PORT || 3977;

async function conexionBD() {
    try {
        await mongoose.connect('mongodb://localhost:27017/tfg');
        console.log('La base de datos está corriendo correctamente...');

        app.listen(puerto, function(){
            console.log("Servidor del api rest de musica escuchando en http://localhost:"+puerto);
        });
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}

conexionBD();

