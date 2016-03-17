'use strict';

/**
 * Port to use for server.
 */
process.env.PORT = 8080;

/**
 * Firebase database URL.
 */
process.env.FIREBASE_URL = 'https://hangman-app.firebaseio.com/';

/**
 * Number of incorrect guesses allowed. N'th incorrect guess ends a game in a loss.
 */
process.env.INCORRECT_GUESS_LIMIT = 5;

/**
 * Number of hours after a player in a game is considered idle.
 */
process.env.IDLE_TIME_IN_HOURS = 12;

/**
 * SMTP configuration for sending emails.
 * @see https://github.com/nodemailer/nodemailer-smtp-transport
 */
process.env.EMAIL_SERVICE  = '';  // e.g. 'gmail'
process.env.EMAIL_USER     = '';  // e.g. 'user@gmail.com'
process.env.EMAIL_PASSWORD = '';
process.env.EMAIL_FROM     = '';  // e.g. 'user@gmail.com'
