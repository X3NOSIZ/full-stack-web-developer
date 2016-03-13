#!/usr/bin/env python
#
# tournament.py -- implementation of a Swiss-system tournament
#

import psycopg2


def connect():
    """Connect to the PostgreSQL database. Returns a database connection."""
    return psycopg2.connect("dbname=tournament")


def execute(query, params=None):
    """Execute a database command and return the result.

    Args:
        query: Query to execute.
        params: Query parameters (optional).
    """
    # connect to database
    conn = connect()

    # open cursor to perform database operations
    cur = conn.cursor()

    # execute a command
    if params is not None:
        cur.execute(query, params)
    else:
        cur.execute(query)

    # obtain result(s)
    try:
        result = cur.fetchall()
    except psycopg2.ProgrammingError:  # indicates result-less operation
        result = None

    # make the changes persistent
    conn.commit()

    # close communication with the database and return result(s)
    cur.close()
    conn.close()
    return result


def deleteMatches():
    """Remove all the match records from the database."""
    execute('TRUNCATE matches CASCADE;')


def deletePlayers():
    """Remove all the player records from the database."""
    execute('TRUNCATE players CASCADE;')


def countPlayers():
    """Returns the number of players currently registered."""
    result = execute('SELECT COUNT(*) FROM players;')
    return result[0][0]


def registerPlayer(name):
    """Adds a player to the tournament database.

    The database assigns a unique serial id number for the player. (This
    should be handled by your SQL database schema, not in your Python code.)

    Args:
      name: the player's full name (need not be unique).
    """
    command = 'INSERT INTO players (name) VALUES (%(name)s);'
    params = {'name': name}
    execute(command, params)


def playerStandings():
    """Returns a list of the players and their win records, sorted by wins.

    The first entry in the list should be the player in first place, or a player
    tied for first place if there is currently a tie.

    Returns:
      A list of tuples, each of which contains (id, name, wins, matches):
        id: the player's unique id (assigned by the database)
        name: the player's full name (as registered)
        wins: the number of matches the player has won
        matches: the number of matches the player has played
    """
    return execute('SELECT * FROM standings;')


def getWinner(match):
    """Get winning player ID from a match tuple."""
    return match[0]


def getLoser(match):
    """Get losing player ID from a match tuple."""
    return match[1]


def reportMatch(winner, loser):
    """Records the outcome of a single match between two players.

    Args:
      winner:  the id number of the player who won
      loser:  the id number of the player who lost
    """
    command = 'INSERT INTO matches (winner, loser) VALUES (%(winner)s, %(loser)s);'
    params = {'winner': winner, 'loser': loser}
    execute(command, params)


def swissPairings():
    """Returns a list of pairs of players for the next round of a match.

    Assuming that there are an even number of players registered, each player
    appears exactly once in the pairings. Each player is paired with another
    player with an equal or nearly-equal win record, that is, a player adjacent
    to him or her in the standings.

    Returns:
      A list of tuples, each of which contains (id1, name1, id2, name2)
        id1: the first player's unique id
        name1: the first player's name
        id2: the second player's unique id
        name2: the second player's name
    """
    pairings = []
    standings = playerStandings()

    # must have even number of players
    num_players = len(standings)
    if num_players % 2 != 0:
        return []

    rank = 0
    while rank < num_players:
        s1 = standings[rank+0]  # player with this rank
        s2 = standings[rank+1]  # player with next bext rank
        pairing = (getId(s1), getName(s1), getId(s2), getName(s2))
        pairings.append(pairing)
        rank += 2  # process one pair at a time

    return pairings


def getId(standing):
    """Get player ID from a standing tuple."""
    return standing[0]


def getName(standing):
    """Get player name from a standing tuple."""
    return standing[1]
