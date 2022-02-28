const express = require('express')
var router = express.Router();
const dbHandler = require('../handle/dbHandler')

router.get('/', dbHandler.getTag);
module.exports = router