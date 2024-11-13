'use strict'

var express = require('express');
var ListRepController = require('../controllers/listRep');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');


api.get('/listRep/:id', md_auth.ensureAuth, ListRepController.getListRep);
api.post('/listRep', md_auth.ensureAuth, ListRepController.saveList);
api.get('/listReps/:userId', md_auth.ensureAuth, ListRepController.getLists);
api.delete('/listRep/:song', md_auth.ensureAuth, ListRepController.deleteList);


module.exports = api;