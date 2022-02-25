const express = require('express')
var router = express.Router();
const dbHandler = require('../handle/dbHandler')

router.post('/', dbHandler.createQuestion);

module.exports = router