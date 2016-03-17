'use strict';

module.exports = Score;

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

/******************************************************************************
 * CONSTRUCTOR
 ******************************************************************************/

/**
 * Constructor.
 * @param data Data to construct with.
 */
function Score(data) {
    this.key = null;
    this.game = data.game;
    this.user = data.user;
    this.incorrectGuesses = data.incorrectGuesses;
}

/******************************************************************************
 * INSTANCE METHODS
 ******************************************************************************/

Score.prototype = {
    getData: getData,
    getKey: getKey,
    setKey: setKey,
    put: put
};

/**
 * Get the key/value pairs that make up the entity.
 * @param omitKey If true, exclude `key` property.
 */
function getData(omitKey) {
    var data = {
        key: this.key,
        game: this.game,
        user: this.user,
        incorrectGuesses: this.incorrectGuesses
    };
    return omitKey ? _.omit(data, 'key') : data;
}

/**
 * Get the key.
 * @return Key.
 */
function getKey() {
    return this.key;
}

/**
 * Set the key.
 * @param key New key.
 * @return this
 */
function setKey(key) {
    this.key = key;
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
            db.putValue('/scores/' + key, self.getData(true))
            .then(function () {
                return resolve(self);
            })
            .catch(reject);
        });
    } else {
        return new q.Promise(function (resolve, reject) {
            db.pushValue('/scores', self.getData(true))
            .then(function (scoreKey) {
                return resolve(self.setKey(scoreKey));
            })
            .catch(reject);
        });
    }
}

/******************************************************************************
 * CLASS METHODS
 ******************************************************************************/

Score.makeScore = makeScore;
Score.makeScores = makeScores;
Score.get = get;
Score.getHighest = getHighest;

/**
 * Make one score.
 */
function makeScore(scoreData, key) {
    if (_.isEmpty(scoreData) || _.isEmpty(key)) {
        return null;
    } else {
        return new Score(scoreData).setKey(key);
    }
}

/**
 * Make a list of scores.
 */
function makeScores(scoresData) {
    return _.map(scoresData, Score.makeScore);
}

/**
 * Get all scores.
 * @return Promise that is fulfilled with a list of score objects.
 */
function get() {
    return new q.Promise(function (resolve, reject) {
        db.getValue('/scores')
        .then(function (scoresData) {
            resolve(Score.makeScores(scoresData));
        })
        .catch(reject);
    });
}

/**
 * Get highest scores.
 * @param limit Number of scores to return (defaults to 10).
 * @return Promise that is fulfilled with a list of score objects.
 */
function getHighest(limit) {
    if (!_.isNumber(limit) || limit <= 0) {
        limit = 10;
    }
    return new q.Promise(function (resolve, reject) {
        var query = db.getRef().child('scores').orderByChild('incorrectGuesses').limitToLast(limit);
        db.getQuery(query)
        .then(function (scoresData) {
            resolve(Score.makeScores(scoresData));
        })
        .catch(reject);
    });
}
