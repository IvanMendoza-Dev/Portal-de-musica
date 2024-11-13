'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Song = require('../models/song');
var ListRep = require('../models/listRep');
const e = require('express');
const listRep = require('../models/listRep');

async function saveList(req,res){
    var listRep = new ListRep();
  
    var params = req.body;
  
    console.log(params);
    listRep.user = params.user;
    listRep.song = params.song;
  
        if (listRep.user != "") {
          try {
            const listRepStored = await listRep.save();
            // Operación exitosa
            res.status(200).send({
              listRep: listRepStored
            });
          } catch (err) {
            // Manejo de errores al guardar la lista
            res.status(500).send({
              message: 'Error al guardar la lista de reproduccion'
            });
          }
        } else {
          res.status(400).send({
            message: 'Rellena todos los campos'
          });
        }
    }

    async function getListRep(req,res){
      var listRepId = req.params.id;
   
      try {
        const listRep = await ListRep.findById(listRepId).populate({path: 'user'});
    
        if (!listRep) {
          res.status(404).send({
            message: 'La lista no existe'
          });
        }else{
           res.status(200).send({
            listRep
           });
        }
      } catch (err) {
        res.status(500).send({
          message: 'Error en la petición'
        });
      }
  }


  async function getLists(req, res) { 
    try {
        const userId = req.params.userId; // Obtener el ID del usuario de los parámetros de la solicitud

        // Buscar la lista que pertenezcan al usuario específico
        const listReps = await ListRep.find({ user: userId }).populate({ path: 'user' });

        if (listReps.length === 0) { // Verificar si no se encontraron listas para el usuario
            return res.status(404).send({
                message: 'Este usuario no tiene listas de reproducción'
            });
        }

        // Devolver las listas encontrados en la respuesta
        return res.status(200).send({
            listReps: listReps
        });
    } catch (err) {
        // Manejar errores de la petición
        return res.status(500).send({
            message: 'Error en la petición'
        });
    }
}

async function deleteList(req, res) {
    try {
      const listRepSong = req.params.song;
  
      const listRepRemove = await ListRep.findOneAndRemove({ song: listRepSong });
  
      if (!listRepRemove) {
        return res.status(404).send({ message: 'No se encontró la lista para eliminar' });
      }
  
      res.status(200).send({
        message: 'La lista ha sido eliminada correctamente',
        lists: listRepRemove
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Error en la petición' });
    }
  }
  


    module.exports = {
        saveList,
        getListRep,
        getLists,
        deleteList
    };