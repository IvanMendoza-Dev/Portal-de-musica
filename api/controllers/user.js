'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');
var Album = require('../models/album');
var Song = require('../models/song');

function pruebas(req, res){
    res.status(200).send({
        message: 'Probando una acción del controlador de usuarios del api rest con Node y Mongo'
    });
}

function saveUser(req, res) {
    var user = new User();
  
    var params = req.body;
  
    console.log(params);
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.description = params.description;
    user.role = 'ROLE_USER';
    user.image = null;
  
    if (params.password) {
      // Encriptar contraseña y guardar datos
      bcrypt.hash(params.password, null, null, async function (err, hash) {
        if (err) {
          return res.status(500).send({
            message: 'Error al encriptar la contraseña'
          });
        }
  
        user.password = hash;
  
        if (user.name != "" && user.surname != "" && user.email != "") {
          try {
            const userStored = await user.save();
            // Operación exitosa
            res.status(200).send({
              user: userStored
            });
          } catch (err) {
            // Manejo de errores al guardar el usuario
            res.status(500).send({
              message: 'Error al guardar el usuario'
            });
          }
        } else {
          res.status(400).send({
            message: 'Rellena todos los campos'
          });
        }
      });
    } else {
      res.status(400).send({
        message: 'Introduce la contraseña'
      });
    }
  }

  async function getUser(req, res) {
    var userId = req.params.id;
 
    try {
        const user = await User.findById(userId);
  
        if (!user) {
            return res.status(404).send({
                message: 'El usuario no existe'
            });
        } else {
            return res.status(200).send({
                user: user
            });
        }
    } catch (err) {
        return res.status(500).send({
            message: 'Error en la petición'
        });
    }
}


async function getUsers(req, res) {
  try {
    if (req.params.page) {
      var page = req.params.page;
    } else {
      var page = 1;
    }
    
    var itemsPerPage = 4;

    const totalUsers = await User.countDocuments({ role: { $ne: 'ROLE_ADMIN' } });
    
    if (totalUsers === 0) {
      return res.status(404).send({
        message: 'No hay usuarios'
      });
    } else {
      const totalPages = Math.ceil(totalUsers / itemsPerPage);
      
      const users = await User.find({ role: { $ne: 'ROLE_ADMIN' } }).sort('name').skip((page - 1) * itemsPerPage).limit(itemsPerPage);

      return res.status(200).send({
        total_items: totalPages,
        users: users
      });
    }
  } catch (err) {
    return res.status(500).send({
      message: 'Error en la petición'
    });
  }
}



  async function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;
  
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
  
      if (!user) {
        res.status(404).send({
          message: 'El usuario no existe'
        });
      }else{
        bcrypt.compare(password, user.password, function(err, result) {
            if (err) {
              console.error('Error al comparar contraseñas:', err);
              // Manejo del error aquí
            } else {
              if (result) {
                // Contraseña correcta
                if (params.gethash) {
                    //Token con JWT
                    res.status(200).send({
                        token: jwt.createToken(user)
                    });
                  } else {
                    res.status(200).send({ user });
                  }
              } else {
                // Contraseña incorrecta
                res.status(404).send({
                    message: 'Contraseña incorrecta'
                  });
              }
            }
          });  
      }
    } catch (err) {
      res.status(500).send({
        message: 'Error en la petición'
      });
    }
  }

  async function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;
  
    try {
      const userUpdated = await User.findByIdAndUpdate(userId, update);
      
      if (!userUpdated) {
        res.status(404).send({ message: 'No se pudo encontrar el usuario a actualizar' });
      } else {
        res.status(200).send({ user: userUpdated });
      }
    } catch (err) {
      console.error(err); // Registrar el error para depuración
      res.status(500).send({ message: 'Error al actualizar el usuario' });
    }
  }

  async function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'No subido...';
  
    if (req.files) {
      var file_path = req.files.image.path;
      var file_split = file_path.split('\\');
      var file_name = file_split[2];
  
      var ext_split = file_name.split('.');
      var file_ext = ext_split[1];
  
      if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'jpeg') {
        try {
          const userUpdated = await User.findByIdAndUpdate(userId, { image: file_name });
  
          if (!userUpdated) {
            res.status(404).send({ message: 'No se pudo encontrar el usuario a actualizar' });
          } else {
            res.status(200).send({ image: file_name, user: userUpdated });
          }
        } catch (error) {
          console.error(error); // Registrar el error para depuración
          res.status(500).send({ message: 'Error al actualizar la imagen del Usuario' });
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

  fs.exists('./uploads/users/'+imageFile, function(exists){
    if(exists){
      res.sendFile(path.resolve('./uploads/users/'+imageFile));
    }else{
      res.status(404).send({ message: 'No existe la imagen...' });
    }
  });
}

async function deleteUser(req, res) {
  try {
    const userId = req.params.id;

    const userRemove = await User.findByIdAndRemove(userId);

    if (!userRemove) {
      res.status(404).send({ message: 'No se pudo eliminar el usuario' });
    }else{
      const albumRemove = await Album.deleteMany({ user: userRemove._id });

      if (!albumRemove) {
        res.status(404).send({ message: 'No se pudieron eliminar los álbumes' });
      }else{
        const songRemove = await Song.deleteMany({ user: userRemove._id });

        if (!songRemove) {
          res.status(404).send({ message: 'No se pudieron eliminar las canciones' });            
        }else{
          res.status(200).send({
            user: userRemove,
            albums: albumRemove,
            song: songRemove
          });
        }
      }
    }
  } catch (err) {
    res.status(500).send({
      message: 'Error en la petición'
    });
  }
}
  
  

    
module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile,
    getUser,
    getUsers,
    deleteUser
};