
# Full Stack Nanodegree Interview

## 1

The most influential written material was neither a book nor a blog post.
Instead, it was a lecture series available through codeshool.com. After fussing
around with a completely hand-written web application that utilized only jQuery
as a framework, I discovered Google's open source MVC framework for web
applications: Angular.

Through codeshool, I learned in depth how to develop an application written with
Angular, realizing that Angular not only simplifies the development process but
also encourages best practices in design patterns such as MVC, Singleton,
Factory, and others in addition allowing writing highly testable code.

Since then, I have used Angular to deploy successful web applications, and I
only wish I had been exposed to it from the get go.

## 2

Sure. Last November, I was in the middle of a very difficult semester in my
online master's program through Georgia Tech. I was taking 3 classes at once,
two of which proved to be very time consuming. I wanted to be smarted about how
I picked classes in the future.

There was an unofficial Google spreadsheet students used to review courses that
I could use, but it was unvalidated, poorly organized, and difficult to digest.
I thought, "We can do better than this.", so I created a web application for
rating and reviewing courses in my graduate program.

Some of the challenges I faced included importing the data from the the original
Google spreadsheet. For example, some students rated a class as "difficult"
while others wrote "walk in the park" or worse, nothing at all. The import
process had to be clever enough to handle such varied input. Second, user
adoption turned out to be a challenge. Many students immediately raised concerns
instead of embracing the benefits of the new tool. Fortunately, every concern
could be addressed, which I did quickly, winning the community over. Now, the
app sees thousands of sessions per week.

For this application, I chose Firebase, Node.js, and Angular for the stack. I
wanted to use the same language throughout, and the web server did not need to
do more than serve a handful static files, so I implemented a simple Node.js
express server. I wanted to use Firebase, because Firebase abstracts much of the
hassles of web development away with their robust authentication and database
API. Most importantly, Firebase makes it easy to secure the data, which was an
important concern raised by the community.

The application can be accessed [here](https://gt-course-surveys.herokuapp.com).

## 3

### Safe Input

```python
def makeUnorderedList(strings):
    if len(strings) == 0:
        return "<ul></ul>"
    else:
        return "<ul><li>" + "</li><li>".join(strings) + "</li></ul>"
```

### User (Potentially Dangerous) Input

```python
import html

def makeUnorderedList(strings):
    if len(strings) == 0:
        return "<ul></ul>"
    else:
        # escape any html
        for i in range(len(strings)):
            strings[i] = html.escape(strings[i])
        return "<ul><li>" + "</li><li>".join(strings) + "</li></ul>"
```

## 4

### Cross Site Scripting (XSS)

XSS enables attackers to inject scripts into web pages viewed by victims. These
scripts may in turn monitor a user's keystrokes to steal passwords and other
sensitive data.

XSS can be prevented by escaping untrusted data before it is inserted into the
DOM. Additionally, website should not accept JavaScript code from untrusted
sources. Determining whether a source is trusted/untrusted still remains a
challenge.

### SQL Injection

This type of attack relies on unsafe programming practices. For example, in PHP,
a SQL query such as the following is vulnerable:

```php
$sql = "SELECT * FROM users WHERE username='$username' AND password='$hash';"
```

Here, if the value of the variable `$username` is set directly to user-specified
input, the user could inject SQL such as the following to gain unauthorized
access to an account:

```
johndoe';--
```

This attack works, because when the user-specified SQL is injected into the
query, the query now reads:

```
$sql = "SELECT * FROM users WHERE username='johndoe';--' AND password='$hash';"
```

The WHERE clause no longer evaluates the password, effectively eliminating any
security granted by a password-based authentication protocol.

SQL injection attacks can be prevented by escaping all user-specified input.

# 5

```python
from flask import Flask
app = Flask(__name__)

import json
import random


@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/roll')
def roll_dice():
    return flask.jsonify(roll_1=random.randint(1,6), roll_2=random.randint(1,6))

if __name__ == '__main__':
    app.debug = True
    app.run()
```

The method `roll_dice` returns the following JSON, where rolls are in the range
1 <= N <= 6:

```json
{
    "roll_1": 1
    "roll_2": 4
}
```

# 6

Please find the job description [here](https://www.google.com/about/careers/search#!t=jo&jid=42165&).

My goals a year from now would include:

## Learning

Google is a place that fosters learning. I would like to learn and master the
technologies that has propelled Google into its position in the market today.
In particular, I am interested in improving my mastery of automated software
analysis and testing tools.

## Experience

I find myself to a natural leader, but I understand that one must earn his
stripes before advancing to a leadership position. In my first year, I would
like to gain the experience required to find myself in a position where I am
leading teams of developers on projects, helping steer the direction of the
effort in addition to mentoring newer team members.
