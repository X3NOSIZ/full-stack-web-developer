'use strict';

module.exports = Game;

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
var Score = require('./score');

/******************************************************************************
 * INSTANCE VARIABLES
 ******************************************************************************/

/**
 * Potential words. Each game initializes with a random word from this list.
 */
var WORD_BANK = [
    'PUZZLEMENT',
    'LUMBERJACK',
    'JACKHAMMER',
    'MOZZARELLA',
    'INTERMEZZO',
    'JACKRABBIT',
    'PICKPOCKET',
    'CHIMPANZEE',
    'BACKGAMMON',
    'PRIZEFIGHT',
    'IMMOBILIZE',
    'EARTHQUAKE'
];

/**
 * Number of incorrect guesses allowed. N'th incorrect guess ends a game in a loss.
 */
var INCORRECT_GUESS_LIMIT = process.env.INCORRECT_GUESS_LIMIT > 0 ? process.env.INCORRECT_GUESS_LIMIT : 5;

/******************************************************************************
 * CONSTRUCTOR
 ******************************************************************************/

/**
 * Constructor.
 * @param data Data to construct with.
 */
function Game(data) {
    data = data || {};
    this.key       = null;
    this.word      = data.word || getRandomWord();
    this.user      = data.user;
    this.start     = data.start || moment.utc().format();
    this.end       = data.end || null;
    this.lastMove  = data.lastMove || null;
    this.cancelled = data.cancelled || false;
    this.guesses   = data.guesses || [];
}

/**
 * Get a random word from the word bank.
 */
function getRandomWord() {
    return WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
}

/******************************************************************************
 * INSTANCE METHODS
 ******************************************************************************/

Game.prototype = {
    getData: getData,
    getIncorrectGuesses: getIncorrectGuesses,
    getHistory: getHistory,
    getIdleTime: getIdleTime,
    getGuesses: getGuesses,
    getStartTime: getStartTime,
    active: active,
    getKey: getKey,
    setKey: setKey,
    mask: mask,
    cancel: cancel,
    finish: finish,
    guess: guess,
    put: put
};

/**
 * Get the key/value pairs that make up the entity.
 * @param omitKey If true, exclude `key` property.
 */
function getData(omitKey) {
    var data = {
        key: this.key,
        word: this.word,
        user: this.user,
        start: this.start,
        end: this.end || null,
        lastMove: this.lastMove || null,
        cancelled: this.cancelled || false,
        guesses: _.clone(this.guesses) || []
    };
    return omitKey ? _.omit(data, 'key') : data;
}

/**
 * Get a list of incorrect guesses.
 * @return Incorrect guesses.
 */
function getIncorrectGuesses() {
    var self = this;
    return _.filter(self.guesses, function (guess) {
        return self.word.indexOf(guess) === -1;
    });
}

/**
 * Get the game history.
 * @return List of tuples in format: [[guess, word], [guess, word], ...]
 */
function getHistory() {
    var self = this;
    var h = [];
    var runningGuesses = [];

    _.forEach(self.guesses, function (guess) {
        runningGuesses.push(guess);

        // apply guesses so far
        var currentState = Game.applyGuesses(self.word, runningGuesses);
        h.push([guess, currentState]);

        // game won: terminate
        if (_.eq(self.word, currentState)) {
            return false;
        }
    });

    return h;
}

/**
 * Get the idle time of the game.
 * @param format How to format the time, defaults to 'hours'.
 * @return Idle time.
 */
function getIdleTime(format) {
    var now = moment.utc();
    var mostRecent = moment.utc(this.lastMove || this.created);
    return now.diff(mostRecent, format || 'hours');
}

/**
 * Get guesses.
 * @param Guesses delimited by comma.
 */
function getGuesses() {
    return this.guesses.join(', ');
}

/**
 * Get start time.
 * @param Start time in ISO-8601 format.
 */
function getStartTime() {
    return moment.utc(this.start).fromNow();
}

/**
 * Check if game is active.
 * @return True if active, false otherwise.
 */
function active() {
    return !this.cancelled && _.isEmpty(this.end);
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
 * Unmask the word based on current guesses.
 * @return this
 */
function mask() {
    this.word = Game.applyGuesses(this.word, this.guesses);
    return this;
}

/**
 * Cancel the game.
 * @return True if successful, false otherwise (i.e. game was inactive).
 */
function cancel() {
    if (this.active()) {
        this.cancelled = true;
        return true;
    } else {
        return false;
    }
}

/**
 * End the game.
 * @return this
 */
function finish() {
    if (_.isEmpty(this.end)) {
        this.end = this.lastMove = moment.utc().format();
    }
    return this;
}

/**
 * Make a guess.
 * @param letterOrWord If single character, treated as letter. Word otherwise.
 * @param user Reference to the game user.
 * @return Promises that are fulfilled when effects of the guess are completed.
 */
function guess(letterOrWord, user) {
    var self = this;
    
    // short-circuit if the game is not active
    if (!self.active()) {
        return [
            q.resolve(self)
        ];
    }

    // record the guess and time
    self.guesses.push(_.toUpper(letterOrWord));
    self.lastMove = moment.utc().format();

    // apply the guesses so far
    var newState = Game.applyGuesses(self.word, self.guesses);

    // get the number of incorrect guesses (for scoring)
    var numIncorrectGuesses = self.getIncorrectGuesses().length;

    // check if game is over
    if (_.eq(self.word, newState)) {
        // victory if new state matches the secret word
        return [
            self.finish().put(),
            user.recordWin().put(),
            new Score({
                game: self.getKey(),
                user: user.getKey(),
                incorrectGuesses: numIncorrectGuesses
            }).put()
        ];
    } else if (numIncorrectGuesses >= INCORRECT_GUESS_LIMIT) {
        // loss if this is the N'th incorrect guess
        return [
            self.finish().put(),
            user.recordLoss().put(),
            new Score({
                game: self.getKey(),
                user: user.getKey(),
                incorrectGuesses: numIncorrectGuesses
            }).put()
        ];
    } else {
        // game continues
        return [
            self.put()  // first element must be the save
        ];
    }
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
            db.putValue('/games/' + key, self.getData(true))
            .then(function () {
                return resolve(self);
            })
            .catch(reject);
        });
    } else {
        return new q.Promise(function (resolve, reject) {
            db.pushValue('/games', self.getData(true))
            .then(function (gameKey) {
                return resolve(self.setKey(gameKey));
            })
            .catch(reject);
        });
    }
}

/******************************************************************************
 * CLASS METHODS
 ******************************************************************************/

Game.makeGame = makeGame;
Game.makeGames = makeGames;
Game.get = get;
Game.getByKey = getByKey;
Game.applyGuesses = applyGuesses;

/**
 * Make one game.
 */
function makeGame(gameData, key) {
    if (_.isEmpty(gameData) || _.isEmpty(key)) {
        return null;
    } else {
        return new Game(gameData).setKey(key);
    }
}

/**
 * Make a list of games.
 */
function makeGames(gamesData) {
    return _.map(gamesData, Game.makeGame);
}

/**
 * Get all games.
 * @return Promise that is fulfilled with a list of game objects.
 */
function get() {
    return new q.Promise(function (resolve, reject) {
        db.getValue('/games')
        .then(function (gamesData) {
            resolve(Game.makeGames(gamesData));
        })
        .catch(reject);
    });
}

/**
 * Get an entity by its key.
 */
function getByKey(key) {
    return new q.Promise(function (resolve, reject) {
        db.getValue('/games/' + key)
        .then(function (gameData) {
            return resolve(Game.makeGame(gameData, key));
        })
        .catch(reject);
    });
}

/**
 * Apply guesses to a word.
 * @param word
 * @param guesses
 * @return Word with guesses applied.
 */
function applyGuesses(word, guesses) {
    // word correctly guessed?
    if (guesses.indexOf(word) >= 0) {
        return word;
    }

    // otherwise, mask not-yet-guessed letters as `_`
    var masked = [];
    for (var i = 0; i < word.length; i++) {
        var c = _.toUpper(word[i]);
        if (guesses.indexOf(c) >= 0) {
            masked.push(c);
        } else {
            masked.push('_');
        }
    }
    return masked.join('');
}
