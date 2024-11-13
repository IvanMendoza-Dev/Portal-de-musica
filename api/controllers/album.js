'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Album = require('../models/album');
var Song = require('../models/song');
const e = require('express');

async function saveAlbum(req,res){
    var album = new Album();
  
    var params = req.body;
  
    console.log(params);
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.user = params.user;
  
        if (album.user != "") {
          try {
            const albumStored = await album.save();
            // Operación exitosa
            res.status(200).send({
              album: albumStored
            });
          } catch (err) {
            // Manejo de errores al guardar el album
            res.status(500).send({
              message: 'Error al guardar el album'
            });
          }
        } else {
          res.status(400).send({
            message: 'Rellena todos los campos'
          });
        }
    }

    async function getAlbum(req,res){
      var albumId = req.params.id;
   
      try {
        const album = await Album.findById(albumId).populate({path: 'user'});
    
        if (!album) {
          res.status(404).send({
            message: 'El album no existe'
          });
        }else{
           res.status(200).send({
              album
           });
        }
      } catch (err) {
        res.status(500).send({
          message: 'Error en la petición'
        });
      }
  }

  async function getAlbumsAll(req, res) {
    if (req.params.page) {
      var page = req.params.page;
    } else {
      var page = 1;
    }
    
    var itemsPerPage = 4;
  
    try {
      const totalAlbums = await Album.countDocuments({});
      
      if (totalAlbums === 0) {
        res.status(404).send({
          message: 'No hay artistas'
        });
      } else {
        const totalPages = Math.ceil(totalAlbums / itemsPerPage);
        
        const albums = await Album.find().sort('user').skip((page - 1) * itemsPerPage).limit(itemsPerPage);
  
        return res.status(200).send({
          total_items: totalPages,
          albums: albums
        });
      }
    } catch (err) {
      res.status(500).send({
        message: 'Error en la petición'
      });
    }
  }


  async function getAlbums(req, res) { 
    try {
        const userId = req.params.userId; // Obtener el ID del usuario de los parámetros de la solicitud

        // Buscar álbumes que pertenezcan al usuario específico
        const albums = await Album.find({ user: userId }).sort('year').populate({ path: 'user' });

        if (albums.length === 0) { // Verificar si no se encontraron álbumes para el usuario
            return res.status(404).send({
                message: 'Este usuario no tiene álbumes'
            });
        }

        // Devolver los álbumes encontrados en la respuesta
        return res.status(200).send({
            albums: albums
        });
    } catch (err) {
        // Manejar errores de la petición
        return res.status(500).send({
            message: 'Error en la petición'
        });
    }
}

  async function updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;
  
    // Validar y sanitizar los datos de actualización aquí si es necesario
  
    try {
      const albumUpdated = await Album.findByIdAndUpdate(albumId, update);
      
      if (!albumUpdated) {
        res.status(404).send({ message: 'No se pudo encontrar el album a actualizar' });
      } else {
        res.status(200).send({ album: albumUpdated });
      }
    } catch (err) {
      console.error(err); // Registrar el error para depuración
      res.status(500).send({ message: 'Error al actualizar el album' });
    }
  }

  async function deleteAlbum(req, res) {
      try {
        const albumId = req.params.id;
    
        const albumRemove = await Album.findByIdAndRemove(albumId);
    
          if (!albumRemove) {
            res.status(404).send({ message: 'No se pudieron eliminar los álbumes' });
          }else{
            const songRemove = await Song.deleteMany({ album: albumRemove._id });
    
            if (!songRemove) {
              res.status(404).send({ message: 'No se pudieron eliminar las canciones' });            
            }else{
              res.status(200).send({
                albums: albumRemove,
                song: songRemove
              });
            }
          }
      } catch (err) {
        res.status(500).send({
          message: 'Error en la petición'
        });
      }
    }

    async function uploadImage(req, res) {
      var albumId = req.params.id;
      var file_name = 'No subido...';
    
      if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
    
        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];
    
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'jpeg') {
          try {
            const albumUpdated = await Album.findByIdAndUpdate(albumId, { image: file_name });
    
            if (!albumUpdated) {
              res.status(404).send({ message: 'No se pudo encontrar el album a actualizar' });
            } else {
              res.status(200).send({ album: albumUpdated });
            }
          } catch (error) {
            console.error(error); // Registrar el error para depuración
            res.status(500).send({ message: 'Error al actualizar la imagen del Album' });
          }
        } else {
          res.status(400).send({
            message: 'Extensión incorrecta'
          });
        }
        console.log(file_path);
      } else {
        res.status(400).send({ message: 'No has subido ninguna imagen...' });
      }
    }
    
    
  function getImageFile(req, res){
    var imageFile = req.params.imageFile;
  
    fs.exists('./uploads/album/'+imageFile, function(exists){
      if(exists){
        res.sendFile(path.resolve('./uploads/album/'+imageFile));
      }else{
        res.status(404).send({ message: 'No existe la imagen...' });
      }
    });
  }

    module.exports = {
        saveAlbum,
        getAlbum,
        getAlbums,
        updateAlbum,
        deleteAlbum,
        uploadImage,
        getImageFile,
        getAlbumsAll
    };