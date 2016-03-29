'use strict';

/******************************************************************************
 * EXTERNAL DEPENDENCIES
 ******************************************************************************/

var _ = require('lodash');
var q = require('q');
var url = require('url');
var express = require('express');
var bodyParser = require('body-parser');

/******************************************************************************
 * INTERNAL DEPENDENCIES
 ******************************************************************************/

var env = require('./env');
var util = require('./lib/util');
var models = require('./lib/models');

/******************************************************************************
 * SERVER CONFIGURATION
 ******************************************************************************/

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));  // x-www-form-urlencoded
app.use(bodyParser.json());                           // json
app.use(parseQueryParameters);
app.use(loadEntities);
app.param('user_key', loadUserEntity);
app.param('game_key', loadGameEntity);

/**
 * Parse query parameters (if present).
 */
function parseQueryParameters(request, response, next) {
    var urlParts = url.parse(request.url, true);
    if (urlParts && urlParts.query) {
        request.query = urlParts.query;
    } else {
        request.query = {};
    }
    next();
}

/**
 * If request includes a user/game key, get a reference to the user/game.
 */
function loadEntities(request, response, next) {
    var user_key = request.body.user_key || request.query.user_key;
    var game_key = request.body.game_key || request.query.game_key;
    var promises = [ null, null ];
    if (!_.isEmpty(user_key)) {
        promises[0] = models.User.getByKey(user_key);
    }
    if (!_.isEmpty(game_key)) {
        promises[1] = models.Game.getByKey(game_key);
    }
    if (!_.isEmpty(user_key) || !_.isEmpty(game_key)) {
        q.all(promises)
        .then(function (result) {
            request.user = result[0] || null;
            request.game = result[1] || null;
            return models.User.getByKey(request.game.user);
        })
        .then(function (result) {
            request.gameUser = result;
        })
        .finally(next);
    } else {
        next();
    }
}

/**
 * If the request includes a user key as part of the URL, get a reference to it.
 */
function loadUserEntity(request, response, next, user_key) {
    models.User.getByKey(user_key)
    .then(function (user) {
        request.user = user;
    })
    .finally(next);
}

/**
 * If the request includes a game key as part of the URL, get a reference to it
 * and the game user.
 */
function loadGameEntity(request, response, next, game_key) {
    models.Game.getByKey(game_key)
    .then(function (game) {
        request.game = game;
        return models.User.getByKey(request.game.user);
    })
    .then(function (user) {
        request.gameUser = user;
    })
    .finally(next);
}

/******************************************************************************
 * API ENDPOINTS: USER
 ******************************************************************************/

var errorInvalidParameter = new models.Error({
    type: 'InvalidParameterException',
    message: 'Invalid or missing parameter(s).'
});

var errorNotFound = new models.Error({
    type: 'NotFoundException',
    message: 'Entity not found.'
});

/**
 * create_user: Create a new user.
 */
app.post('/user', function (request, response) {
    if (_.isEmpty(request.body.name) || _.isEmpty(request.body.email)) {
        return response.status(400).json(util.envelope(errorInvalidParameter));
    }

    var user = new models.User({
        name: request.body.name,
        email: request.body.email
    });

    user.put()
    .then(function (user) {
        return response.status(200).json(util.envelope(user));
    })
    .catch(function (error) {
        return response.status(400).json(util.envelope(error));
    });
});

/**
 * get_user: Get details of a user.
 */
app.get('/user/:user_key', function (request, response) {
    if (_.isEmpty(request.user)) {
        return response.status(400).json(util.envelope(errorNotFound));
    } else {
        return response.status(200).json(util.envelope(request.user));
    }
});

/**
 * get_user_games: Get all active games of a user.
 */
app.get('/user/:user_key/games', function (request, response) {
    if (_.isEmpty(request.user)) {
        return response.status(400).json(util.envelope(errorNotFound));
    } else {
        request.user.getGames(true)
        .then(function (games) {
            games = _.map(games, function (game) {
                return game.mask();
            });
            return response.status(200).json(util.envelope(games));
        })
        .catch(function (error) {
            return response.status(400).json(util.envelope(error));
        });
    }
});

/**
 * get_user_scores: Get all scores recorded for user (unordered).
 */
app.get('/user/:user_key/scores', function (request, response) {
    if (_.isEmpty(request.user)) {
        return response.status(400).json(util.envelope(errorNotFound));
    } else {
        request.user.getScores()
        .then(function (scores) {
            return response.status(200).json(util.envelope(scores));
        })
        .catch(function (error) {
            return response.status(400).json(util.envelope(error));
        });
    }
});

/**
 * get_user_rankings: Get the leaderboard.
 */
app.get('/users/rankings', function (request, response) {
    models.User.get()
    .then(function (users) {
        users = _.filter(users, function (user) { return user.total > 0; });
        var rankings = _.sortBy(users, function (user) {
            if (user.wins > 0 && user.total > 0) {
                var winPercentage = (user.wins * 100.0) / user.total;
                return _.floor(winPercentage);
            } else {
                return 0;
            }
        }).reverse();
        return response.status(200).json(util.envelope(rankings));
    })
    .catch(function (error) {
        return response.status(400).json(util.envelope(error));
    });
});

/******************************************************************************
 * API ENDPOINTS: GAME
 ******************************************************************************/

/**
 * new_game: Create a new game.
 */
app.post('/game', function (request, response) {
    if (_.isEmpty(request.body.user_key)) {
        return response.status(400).json(util.envelope(errorInvalidParameter));
    } else if (_.isEmpty(request.user)) {
        return response.status(400).json(util.envelope(errorNotFound));
    }

    var game = new models.Game({ user: request.user.getKey() });

    game.put()
    .then(function (game) {
        return response.status(200).json(util.envelope(game.mask()));
    })
    .catch(function (error) {
        return response.status(400).json(util.envelope(error));
    });
});

/**
 * get_game: Get details of a game.
 */
app.get('/game/:game_key', function (request, response) {
    if (_.isEmpty(request.game)) {
        return response.status(400).json(util.envelope(errorNotFound));
    } else {
        return response.status(200).json(util.envelope(request.game.mask()));
    }
});

/**
 * get_active_games: Get all active games in the database.
 */
app.get('/games/active', function (request, response) {
    models.Game.get()
    .then(function (games) {
        var activeGames = _.filter(games, function (game) {
            if (game.active()) {
                game.mask();
                return true;
            }
            return false;
        });
        return response.status(200).json(util.envelope(activeGames));
    })
    .catch(function (error) {
        return response.status(400).json(util.envelope(error));
    });
});

/**
 * make_guess: Make a guess.
 */
app.put('/game/:game_key', function (request, response) {
    if (_.isEmpty(request.game)) {
        return response.status(400).json(util.envelope(errorNotFound));
    } else if (_.isEmpty(request.body.guess) || !_.isString(request.body.guess)) {
        return response.status(400).json(util.envelope(errorInvalidParameter));
    } else {
        q.all(request.game.guess(request.body.guess, request.gameUser))
        .then(function (result) {
            return response.status(200).json(util.envelope(result[0].mask()));
        })
        .catch(function (error) {
            return response.status(400).json(util.envelope(error));
        });
    }
});

/**
 * cancel_game: Cancel a game.
 */
app.delete('/game/:game_key', function (request, response) {
    if (_.isEmpty(request.game)) {
        return response.status(400).json(util.envelope(errorNotFound));
    } else if (!request.game.cancel()) {
        return response.status(400).json(util.envelope(errorInvalidParameter));
    } else {
        q.all([
            request.gameUser.recordLoss().put(),
            request.game.put()
        ])
        .then(function (result) {
            return response.status(200).json(util.envelope(result[1].mask()));
        })
        .catch(function (error) {
            return response.status(400).json(util.envelope(error));
        });
    }
});

/**
 * get_game_history: Get the guess history for a game.
 */
app.get('/game/:game_key/history', function (request, response) {
    if (_.isEmpty(request.game)) {
        return response.status(400).json(util.envelope(errorNotFound));
    } else {
        return response.status(200).json(util.envelope({
            key: request.game.getKey(),
            history: request.game.getHistory()
        }));
    }
});

/******************************************************************************
 * API ENDPOINTS: SCORE
 ******************************************************************************/

/**
 * get_high_scores: Get a list of high scores in descending order.
 */
app.get('/scores/leaderboard', function (request, response) {
    models.Score.getHighest(request.query.number_of_results)
    .then(function (scores) {
        return response.status(200).json(util.envelope(scores));
    })
    .catch(function (error) {
        return response.status(400).json(util.envelope(error));
    });
});

/**
 * get_scores: Get all scores (unordered).
 */
app.get('/scores', function (request, response) {
    models.Score.get()
    .then(function (scores) {
        return response.status(200).json(util.envelope(scores));
    })
    .catch(function (error) {
        return response.status(400).json(util.envelope(error));
    });
});

/******************************************************************************
 * API ENDPOINTS: EMAIL
 ******************************************************************************/

/**
 * send_reminder_emails: Email users with incomplete games (return games).
 */
app.get('/email/reminders', function (request, response) {
    models.Game.get()
    .then(function (games) {
        return util.sendReminderEmails(games);
    })
    .then(function (idleGames) {
        return response.status(200).json(util.envelope(idleGames));
    })
    .catch(function (error) {
        return response.status(400).json(util.envelope(error));
    });
});

/******************************************************************************
 * SERVER
 ******************************************************************************/

var server = app.listen(process.env.PORT || 8080, function () {
    console.log('Listening on port %d...', server.address().port);
});
