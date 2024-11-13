'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Album = require('../models/album');
var Song = require('../models/song');
const e = require('express');

async function getSong(req,res){
    var songId = req.params.id;
 
    try {
      const song = await Song.findById(songId);
  
      if (!song) {
        res.status(404).send({
          message: 'La cancion no existe'
        });
      }else{
         res.status(200).send({
            song
         });
      }
    } catch (err) {
      res.status(500).send({
        message: 'Error en la petición'
      });
    }
}

async function saveSong(req,res){
    var song = new Song();
  
    var params = req.body;
  
    console.log(params);
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

        if (song.album != "") {
          try {
            const songStored = await song.save();
            // Operación exitosa
            res.status(200).send({
              song: songStored
            });
          } catch (err) {
            // Manejo de errores al guardar la cancion
            res.status(500).send({
              message: 'Error al guardar la cancion'
            });
          }
        } else {
          res.status(400).send({
            message: 'Rellena todos los campos'
          });
        }
    }


    async function getSongs(req, res) {     
      try {
          const albumId = req.params.album;
  
          // Verificar si se proporcionó el ID del álbum en la solicitud
          if (!albumId) {
              return res.status(400).send({
                  message: 'El ID del álbum es requerido'
              });
          }
  
          const totalSongs = await Song.countDocuments({ album: albumId });
          
          if (totalSongs === 0) {
              return res.status(404).send({
                  message: 'No hay canciones para este álbum'
              });
          }
  
          const songs = await Song.find({ album: albumId }).sort('number').populate({ path: 'album', populate: { path: 'user', model: 'User' } });
  
          return res.status(200).send({
              songs: songs
          });
      } catch (err) {
          console.error(err);
          return res.status(500).send({
              message: 'Error en la petición'
          });
      }
  }

  
    async function getSongsAll(req, res) {     
        try {
          const totalSongs = await Song.countDocuments({});
          
          if (totalSongs === 0) {
            res.status(404).send({
              message: 'No hay canciones'
            });
          } else {
            
            const songs = await Song.find().sort('number').populate({path: 'album', populate:{path: 'user', model:'User'}});
      
            return res.status(200).send({
              songs: songs
            });
          }
        } catch (err) {
          res.status(500).send({
            message: 'Error en la petición'
          });
        }
      }

      async function updateSong(req, res) {
        var songId = req.params.id;
        var update = req.body;
      
        // Validar y sanitizar los datos de actualización aquí si es necesario
      
        try {
          const songUpdated = await Song.findByIdAndUpdate(songId, update);
          
          if (!songUpdated) {
            res.status(404).send({ message: 'No se pudo encontrar la cancion a actualizar' });
          } else {
            res.status(200).send({ song: songUpdated });
          }
        } catch (err) {
          console.error(err); // Registrar el error para depuración
          res.status(500).send({ message: 'Error al actualizar la cancion' });
        }
      }


      async function deleteSong(req, res) {
        try {
          const songId = req.params.id;
      
          const songRemove = await Song.findByIdAndRemove(songId);

              if (!songRemove) {
                res.status(404).send({ message: 'No se pudieron eliminar la cancion' });            
              }else{
                res.status(200).send({
                  song: songRemove
                });
              }
            
        } catch (err) {
          res.status(500).send({
            message: 'Error en la petición'
          });
        }
      }

      async function uploadFile(req, res) {
        var songId = req.params.id;
        var file_name = 'No subido...';
      
        if (req.files) {
          var file_path = req.files.file.path;
          var file_split = file_path.split('\\');
          var file_name = file_split[2];
      
          var ext_split = file_name.split('.');
          var file_ext = ext_split[1];
      
          if (file_ext == 'mp3') {
            try {
              const songUpdated = await Song.findByIdAndUpdate(songId, { file: file_name });
      
              if (!songUpdated) {
                res.status(404).send({ message: 'No se pudo encontrar la cancion a actualizar' });
              } else {
                res.status(200).send({ song: songUpdated });
              }
            } catch (error) {
              console.error(error); // Registrar el error para depuración
              res.status(500).send({ message: 'Error al actualizar la el archivo file de Cancion' });
            }
          } else {
            res.status(400).send({
              message: 'Extensión incorrecta'
            });
          }
          console.log(file_path);
        } else {
          res.status(400).send({ message: 'No has subido ningun fichero...' });
        }
      }
      
      
    function getSongFile(req, res){
      var songFile = req.params.songFile;
    
      fs.exists('./uploads/songs/'+songFile, function(exists){
        if(exists){
          res.sendFile(path.resolve('./uploads/songs/'+songFile));
        }else{
          res.status(404).send({ message: 'No existe el fichero de audio...' });
        }
      });
    }


module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile,
    getSongsAll
};