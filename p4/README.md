
# Full Stack Nanodegree Project 4

## Setup Instructions

This project uses `npm` (Node Package Manager) to manage dependencies.

1. Install [Node](https://nodejs.org/).
2. From the top-level `p4` project directory, execute `npm install` to install
dependencies.
3. Once finished, execute `npm start` to start the web server on port 8080.
4. Issue the HTTP GET/PUT/POST/DELETE requests to the appropriate endpoints at
`http://localhost:8080/`.

I recommend using [POSTMAN](https://www.getpostman.com/) or
[curl](https://curl.haxx.se/docs/httpscripting.html) for step 4.

For the email endpoint to work, `./env.js` must be updated with appropriate
SMTP settings.

All other endpoints work out of the box.



## Database

The database is powered by [Firebase](https://www.firebaseio.com/), a scalable
real-time NOSQL database solution provided by Google.

Firebase stores data in key/value pairs.

Everything is accessible at a URL. For example, to view the `users` in the
database, issue a GET request to
`https://hangman-app.firebaseio.com/users.json` (similarly for `/games.json`
and `/scores.json`).

The endpoints do not use this feature of Firebase, however. Instead, they
utilize the [Node API](https://www.npmjs.com/package/firebase).

The [security rules](https://www.firebase.com/docs/security/guide/) for the
database are accessible in `rules.json`.



## Game Description

Hangman is a simple one player game. The game instructions are available
[here](https://en.wikipedia.org/wiki/Hangman_(game)).



## Features/Functionality

The game is represented as a single word that the player tries to guess.

The player is allowed at most 5 incorrect guesses. The 6th incorrect guess ends
the game in a loss. At any point, the player may guess a letter or a word. The
penalty for an incorrect guess is always the same (consumption of an incorrect
guess). If the player guesses every letter in the word or the word itself
before running out of incorrect guesses, the game ends in a victory.

Rankings are based on players' win percentages. There are no tie-breakers.

A player's score for a game is the number of incorrect guesses consumed. If
this number if 6, the game must have ended in a loss. Otherwise, the game must
have ended in a victory.

A player is allowed to cancel a game before it has ended. Such a game is not
scored and but still contributes to the player's ranking as a loss.

An active game does not contribute to a player's ranking.

A player may retrieve the history of guesses for a game.



## Files Included

 - env.js: Environment variables.
 - app.js: Endpoints.
 - lib/database.js: Firebase database singleton.
 - lib/error.js: Error entity (used only in runtime, not persisted in database).
 - lib/game.js: Game entity.
 - lib/user.js: User entity.
 - lib/score.js: Score entity.
 - lib/models.js: Convenience wrapper to entities.
 - lib/util.js: Helper functions.
 - package.json: NPM package management directives.
 - rules.json: Database security rules.
 - .jshintrc: jshint rules.
 - README.md: This file.


## Configuration Options


## API Endpoints

### Design

Every URL is RESTful and may support one of four different HTTP verbs:

* GET requests fetch information about an object.
* POST requests create objects.
* PUT requests update objects.
* DELETE requests delete objects.

### Parameters

* GET requests expect parameter values (if any) in the request query (i.e. URL).
* POST requests expect parameter values (if any) in the request body.

### Structure

#### The Envelope

Every response is contained by an envelope. That is, each response has a predictable set of keys:

```json
{
   "meta": {
      "code": 200
   },
   "data": {
      ...
   }
}
```

#### META

The meta key is used to communicate extra information about the response. If all goes well, there will only be a code key with value 200. However, sometimes things go wrong, and in that case a response such as the following would be generated:

```json
{
   "meta": {
      "code": 400,
      "type": "NotFoundException",
      "message": "User with name Turbo does not exist."
   }
}
```

#### DATA

The data key is the meat of the response. It may be a list or dictionary, but either way this is where the requrested data is located.



## Endpoints

### USER

#### create\_user
 - Path: '/user'
 - Method: POST
 - Parameters: name, email
 - Returns: UserForm
 - Description: Create a new user. Name and email are required. Name or email
   do not need to be unique as users are identified uniquely by their keys.

#### get\_user
 - Path: '/user/{user\_key}'
 - Method: GET
 - Parameters: None
 - Returns: UserForm
 - Description: Get details of a user.

#### get\_user\_games
 - Path: '/user/{user\_key}/games'
 - Method: GET
 - Parameters: None
 - Returns: GameForms
 - Description: Get all active games of a user.

#### get\_user\_scores
 - Path: '/user/{user\_key}/scores'
 - Method: GET
 - Parameters: None
 - Returns: ScoreForms
 - Description: Returns all scores recorded by the given user (unordered).

#### get\_user\_rankings
 - Path: '/users/rankings'
 - Method: GET
 - Parameters: None
 - Returns: UserForms
 - Description: Get all players that have played at least one game sorted by
   their winning percentage.

### GAME

#### new\_game
 - Path: '/game'
 - Method: POST
 - Parameters: user\_key
 - Returns: GameForm
 - Description: Creates a new game for the user (with the given key) with a
   randomly selected secret word of length 10. Words contain only letters.

#### get\_game
 - Path: '/game/{game\_key}'
 - Method: GET
 - Parameters: None
 - Returns: GameForm
 - Description: Returns the current state of a game.

#### get\_active\_games
 - Path: '/games/active'
 - Method: GET
 - Parameters: None
 - Returns: GameForms
 - Description: Returns all active games in the database (unordered).

#### make\_guess
 - Path: '/game/{game\_key}'
 - Method: PUT
 - Parameters: guess
 - Returns: GameForm
 - Description: Accepts a letter/word and returns the updated state of the game.
   A letter must be from the English alphabet. A word may be any string. If
   guess is a single character string, it is assumed to be a letter. Otherwise,
   it is assumed to be a word.

   If this causes a game to end, a corresponding score entity will be created.
   The score is the number of incorrect guesses (lower is better).

   For letters:
   If guess is correct, game continues unless the guess completes the word,
   at which point the user wins the game.

   For words:
   If guess is correct, the user wins the game.

   For either:
   If guess is incorrect, game continues until the N'th incorrect guess, at
   which point the user loses the game (N is configurable).

#### cancel\_game
 - Path: '/game/{game\_key}'
 - Method: DELETE
 - Parameters: None
 - Returns: GameForm
 - Description: Cancels a game by setting the cancelled flag to true. This is
   recorded as a loss against the player.

#### get\_game\_history
 - Path: '/game/{game\_key}/history'
 - Method: GET
 - Parameters: None
 - Returns: GameHistoryForm
 - Description: Returns the guess history of a game as a list of tuples in the
   form (guess, word). For example:
   [('A', '\_\_\_\_\_\_\_A\_\_'), ('S', 'S\_\_\_\_\_\_A\_\_')]

### SCORE

#### get\_high\_scores
 - Path: '/scores/leaderboard'
 - Method: GET
 - Parameters: number\_of\_results
 - Returns: ScoreForms
 - Description: Returns a list of high scores in descending order. Returns at
   most N results, where N is number\_of\_results.

#### get\_scores
 - Path: '/scores'
 - Method: GET
 - Parameters: None
 - Returns: ScoreForms
 - Description: Returns all scores in the database (unordered).

### EMAIL

#### send\_reminder\_emails
 - Path: '/email/reminders'
 - Method: GET
 - Parameters: None
 - Returns: GameForms
 - Description: Returns every idle game after emailing reminders to their players.
   An idle game is an active game where the player has not made a move in 12
   hours or more (configurable).



## Forms

### User

```
{
    "key": "string",
    "name": "string",
    "email": "string",
    "created": "string",
    "wins": "number",
    "total": "number"
}
```

* `created` is a datetime in ISO-8601 format.
* `wins` is the number of games won by the user.
* `total` is the number of games played by the user.

### Game

```
{
    "key": "string",
    "word": "string",
    "user": "string",
    "start": "string",
    "end": "string",
    "lastMove": "string",
    "cancelled": "boolean",
    "guesses": [
        "string",
        "string",
        ...
    ]
}
```

* `user` is the key corresponding to the user playing the game.
* `start` and `end` are datetimes in ISO-8601 format.
* `guesses` is an array of single-characters and words that have been guessed.
* `word` is the word being guessed. Unguessed characters are masked with `_`.
* `lastMove` is the datetime of the most recent move in ISO-8601 format.

### Score

```
{
    "key": "string",
    "game": "string",
    "user": "string",
    "incorrectGuesses": "number"
}
```

* `game` is the key corresponding to the game that was scored.
* `user` is the key corresponding to the user that was scored.
* `incorrectGuesses` is the number of incorrect guesses at the time the game ended.
