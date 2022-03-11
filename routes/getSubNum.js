const express = require('express')
var router = express.Router();
const dbHandler = require('../handle/dbHandler')

router.get('/', dbHandler.getSubNum);

module.exports = router