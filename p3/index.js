'use strict';

var express = require('express');
var app = express();

app.use('/', express.static('app/'));
app.use('/bower_components', express.static('bower_components/'));

app.get('/', function (req, res) {
    res.sendFile('index.html');
});

app.get('/catalog.json', function (req, res) {
    res.json({});
});

var server = app.listen(8080, function () {
    console.log('Listening on port %d...', server.address().port);
});
