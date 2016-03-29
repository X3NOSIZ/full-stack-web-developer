'use strict';

module.exports = {
    envelope: envelope,
    sendReminderEmails: sendReminderEmails
};

/******************************************************************************
 * EXTERNAL DEPENDENCIES
 ******************************************************************************/

var _ = require('lodash');
var q = require('q');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

/******************************************************************************
 * INTERNAL DEPENDENCIES
 ******************************************************************************/

var models = require('./models');

/******************************************************************************
 * PRIVATE
 ******************************************************************************/

/**
 * Number of hours after a player in a game is considered idle.
 */
var IDLE_TIME_IN_HOURS = process.env.IDLE_TIME_IN_HOURS > 0 ? process.env.IDLE_TIME_IN_HOURS : 12;

/**
 * SMTP transport.
 */
var transport = nodemailer.createTransport(smtpTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
}));

/**
 * Reminder email template.
 */
var reminderEmailTemplate = transport.templateSender({
    subject: 'Hangman Game Reminder',
    html: [
        '<pre>',
        'Hello {{name}},',
        '',
        'This a is gentle reminder to resume your hangman game that was started {{start}}.',
        '',
        'Game:    {{key}}',
        'Word:    {{word}}',
        'Guesses: {{guesses}}',
        '',
        'Good luck!',
        '</pre>'
    ].join('\n')
}, {
    from: process.env.EMAIL_FROM,
});

/**
 * Send one reminder email.
 * @param {User} toUser Recipient.
 * @param {Game} regardingGame Game to send reminder for.
 * @returns {Object} Promise that is fulfilled when the email is sent.
 */
function sendReminderEmail(toUser, regardingGame) {
    return new q.Promise(function (resolve, reject) {
        reminderEmailTemplate({
            to: toUser.email
        }, {
            name: toUser.name,
            key: regardingGame.getKey(),
            word: regardingGame.mask().word,
            start: regardingGame.getStartTime(),
            guesses: regardingGame.getGuesses()
        }, function (error, info) {
            if (error) {
                return reject(error);
            } else {
                return resolve(info);
            }
        });
    });
}

/**
 * Get users for a list of games.
 * @param {Array} games List of game objects.
 * @returns {Object} Promise that is fulfilled with a list of user objects.
 */
function getUsersFromGames(games) {
    var userKeys = _.uniq(_.map(games, 'user'));
    return q.all(_.map(userKeys, function (userKey) {
        return models.User.getByKey(userKey);
    }));
}

/******************************************************************************
 * PUBLIC
 ******************************************************************************/

/**
 * Wrap an object in the appropriate envelope for an API response.
 * @param {Object} object Object to wrap, eg. Error.
 * @returns {Object} Envelope.
 */
function envelope(object) {
    if (object instanceof models.Error) {
        return {
            meta: object.getData()
        };
    } else {
        return {
            meta: { code: 200 },
            data: object.getData ? object.getData() : object
        };
    }
}

/**
 * Send reminder emails to idle games (no moves in the past N hours).
 * @param {Array} games Games to send reminders for.
 * @returns {Object} Promise fulfilled with the games list when emails are sent.
 */
function sendReminderEmails(games) {
    var idleGames = _.filter(games, function (game) {
        return game.active() && game.getIdleTime('hours') >= IDLE_TIME_IN_HOURS;
    });
    if (idleGames.length === 0) {
        return q.resolve([]);
    } else {
        return new q.Promise(function (resolve, reject) {
            getUsersFromGames(idleGames)
            .then(function (idleUsers) {
                return q.all(_.map(idleGames, function (game) {
                    var user = _.find(idleUsers, function (user) {
                        return _.eq(user.getKey(), game.user);
                    });
                    return sendReminderEmail(user, game);
                }));
            })
            .then(function () {
                return resolve(idleGames);
            })
            .catch(reject);
        });
    }
}
