
# Full Stack Nanodegree Project 2

## Files

```
/
|--tournament.sql
|--tournament.py
|--tournament_test.py
```

## Setup

From psql, import tournament.sql to create the SQL database for the tournament project.

```
=> \i tournament.sql
```

## Dependencies

The installation script below assumes a Linux environment.

```
apt-get -qqy update
apt-get -qqy install postgresql python-psycopg2
apt-get -qqy install python-flask python-sqlalchemy
apt-get -qqy install python-pip
pip install bleach
pip install oauth2client
pip install requests
pip install httplib2
pip install redis
pip install passlib
pip install itsdangerous
pip install flask-httpauth
```

## Running Tests

From the directory containing the project files:

`python tourname_test.py`
