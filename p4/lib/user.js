'use strict';

module.exports = User;

/******************************************************************************
 * EXTERNAL DEPENDENCIES
 ******************************************************************************/

var _ = require('lodash');
var q = require('q');
var moment = require('moment');

/******************************************************************************
 * INTERNAL DEPENDENCIES
 ******************************************************************************/

var db = require('./database');
var Game = require('./game');
var Score = require('./score');

/******************************************************************************
 * CONSTRUCTOR
 ******************************************************************************/

/**
 * Constructor.
 * @param data Data to construct with.
 */
function User(data) {
    data = data || {};
    this.key     = null;
    this.name    = _.toUpper(data.name);
    this.email   = data.email;
    this.created = data.created || moment.utc().format();
    this.wins    = data.wins || 0;
    this.total   = data.total || 0;
}

/******************************************************************************
 * INSTANCE METHODS
 ******************************************************************************/

User.prototype = {
    getData: getData,
    getKey: getKey,
    setKey: setKey,
    recordWin: recordWin,
    recordLoss: recordLoss,
    put: put,
    getGames: getGames,
    getScores: getScores
};

/**
 * Get the key/value pairs that make up the entity.
 * @param omitKey If true, exclude `key` property.
 */
function getData(omitKey) {
    var data = {
        key: this.key,
        name: this.name,
        created: this.created,
        email: this.email || null,
        wins: this.wins || 0,
        total: this.total || 0
    };
    return omitKey ? _.omit(data, 'key') : data;
}

/**
 * Get the key.
 */
function getKey() {
    return this.key;
}

/**
 * Set the key.
 * @param key New key.
 */
function setKey(key) {
    this.key = key;
    return this;
}

/**
 * Record a win.
 * @return this
 */
function recordWin() {
    this.wins++;
    this.total++;
    return this;
}

/**
 * Record a loss.
 * @return this
 */
function recordLoss() {
    this.total++;
    return this;
}

/**
 * Persist an entity in the database. Creates entity if necessary.
 * @return Promise that is fulfilled with a reference to the entity.
 */
function put() {
    var self = this;
    var key = self.getKey();
    if (key) {
        return new q.Promise(function (resolve, reject) {
            db.putValue('/users/' + key, self.getData(true))
            .then(function () {
                return resolve(self);
            })
            .catch(reject);
        });
    } else {
        return new q.Promise(function (resolve, reject) {
            db.pushValue('/users', self.getData(true))
            .then(function (userKey) {
                return resolve(self.setKey(userKey));
            })
            .catch(reject);
        });
    }
}

/**
 * Get the games played by the user.
 * @return Promise that is fulfilled with a list of game objects.
 */
function getGames(active) {
    var self = this;
    var key = self.getKey();
    return new q.Promise(function (resolve, reject) {
        var query = db.getRef().child('games').orderByChild('user').equalTo(key);
        db.getQuery(query)
        .then(function (gamesData) {
            var games = Game.makeGames(gamesData);
            if (_.isBoolean(active)) {
                games = _.filter(games, function (game) {
                    return active ? game.active() : !game.active();
                });
            }
            return resolve(games);
        })
        .catch(reject);
    });
}

/**
 * Get the scores recorded for a user.
 * @return Promise that is fulfilled with a list of score objects.
 */
function getScores() {
    var self = this;
    var key = self.getKey();
    return new q.Promise(function (resolve, reject) {
        var query = db.getRef().child('scores').orderByChild('user').equalTo(key);
        db.getQuery(query)
        .then(function (scoresData) {
            return resolve(Score.makeScores(scoresData));
        })
        .catch(reject);
    });
}

/******************************************************************************
 * CLASS METHODS
 ******************************************************************************/

User.makeUser = makeUser;
User.makeUsers = makeUsers;
User.get = get;
User.getByKey = getByKey;

/**
 * Make one user.
 */
function makeUser(userData, key) {
    if (_.isEmpty(userData) || _.isEmpty(key)) {
        return null;
    } else {
        return new User(userData).setKey(key);
    }
}

/**
 * Make a list of users.
 */
function makeUsers(usersData) {
    return _.map(usersData, User.makeUser);
}

/**
 * Get all users.
 * @return Promise that is fulfilled with a list of user objects.
 */
function get() {
    return new q.Promise(function (resolve, reject) {
        db.getValue('/users')
        .then(function (usersData) {
            return resolve(User.makeUsers(usersData));
        })
        .catch(reject);
    });
}

/**
 * Get an entity by its key.
 */
function getByKey(key) {
    return new q.Promise(function (resolve, reject) {
        db.getValue('/users/' + key)
        .then(function (userData) {
            return resolve(User.makeUser(userData, key));
        })
        .catch(reject);
    });
}
