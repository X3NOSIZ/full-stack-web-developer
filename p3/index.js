'use strict';

var _ = require('lodash');

var firebase = require('firebase');
var firebaseRef = new firebase('https://catalog-app.firebaseio.com/');

var express = require('express');
var app = express();

app.use('/', express.static('app/'));
app.use('/bower_components', express.static('bower_components/'));

app.get('/', function (req, res) {
    res.sendFile('index.html');
});

app.get('/catalog.json', function (req, res) {
    firebaseRef.once('value', function (catalog) {
        if (catalog.exists()) {
            var categories = catalog.child('categories').val();
            var items = catalog.child('items').val();
            res.json({
                Category: _.map(categories, function (category, categoryId) {
                    var categoryItems = _.pickBy(items, function (item, itemId) {
                        return item.category === categoryId;
                    });
                    return {
                        id: categoryId,
                        name: category.name,
                        Item: _.map(categoryItems, function (item, itemId) {
                            return {
                                cat_id: item.category,
                                description: item.description,
                                id: itemId,
                                title: item.title,
                                creator: item.creator,
                                created: item.created,
                                picture: item.picture || null
                            };
                        })
                    };
                })
            });
        } else {
            res.json({});
        }
    }, function (error) {
        res.json(error);
    });
});

var server = app.listen(8080, function () {
    console.log('Listening on port %d...', server.address().port);
});
