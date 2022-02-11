var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

// 导入路由
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registRouter = require('./routes/regist');
// ---------------------------------------

const cors = require('cors')

var app = express();
var http = require('http');
var server = http.createServer(app);

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 绑定路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/regist', registRouter);
// ---------------------------------------

server.listen(3000)

