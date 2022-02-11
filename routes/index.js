var express = require('express');
var router = express.Router();
const dbHandler = require('../handle/dbHandler')
/* GET home page. */
router.get('/', dbHandler.getUsers);

module.exports = router
