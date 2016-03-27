
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

### User Input (Potentially Dangerous)

```python
import html

def makeUnorderedList(strings):
    # escape any html
    escaped = []
    for i in range(len(strings)):
        temp = html.escape(strings[i].strip())  # trim and escape
        if len(temp) > 0:
            escaped.append(temp)
    if len(escaped) == 0:
        return "<ul></ul>"
    else:
        return "<ul><li>" + "</li><li>".join(escaped) + "</li></ul>"
```

## 4

### Cross Site Scripting (XSS)

XSS enables attackers to inject scripts into web pages viewed by victims. These
scripts may in turn monitor a user's keystrokes to steal passwords and other
sensitive data (among other malicious activities).

XSS can be prevented by escaping untrusted data before it is inserted into the
DOM. Additionally, websites should not accept JavaScript code from untrusted
sources. Determining whether a source is trusted/untrusted remains a challenge.

### Cross Site Request Forgery (XSRF)

XSRF involves performing malicious actions, particularly those that modify
state, on behalf of the victim as the attacker. In other words, unauthorized
commands are transmitted from a user that the website trusts.

If the attacker is able to find a URL that executes a specific action on the
target server while the victim is authenticated, the attacker can embed such a
link on a page controlled by the attacker. Once the victim is tricked into
accessing that page (for example, a hidden <iframe> or <img>), the attack
succeeds.

XSRF attacks can be prevented by requiring an almost-impossible-to-guess session
and user specific token. The token should be randomly generated and contain
enough bytes to render a brute-force guess infeasible. Furthermore, limiting the
token to a user/session pair contains the impact of a successful guess of the
token by the attacker.

### SQL Injection

This type of attack relies on unsafe programming practices. For example, in PHP,
a SQL query such as the following is vulnerable:

```php
$sql = "SELECT * FROM users WHERE username='$username' AND password='$hash';";
```

Here, if the value of the variable `$username` is set directly to user-specified
input, the user could inject SQL such as the following to gain unauthorized
access to an account:

```
johndoe';--
```

This attack works, because when the user-specified SQL is injected into the
query, the query now reads:

```php
$sql = "SELECT * FROM users WHERE username='johndoe';--' AND password='$hash';";
```

The WHERE clause no longer evaluates the password, effectively eliminating any
security granted by a password-based authentication protocol.

SQL injection attacks can be prevented by escaping all user-specified input or
by using prepared statements. For example, with SQLite3:

```php
$query = "SELECT * FROM users WHERE username=:username AND password=:hash;";
$statement = $db->prepare($query);
$statement->bindValue(":username", $username, SQLITE3_TEXT);
$statement->bindValue(":hash", $hash, SQLITE3_TEXT);
$result = $statement->execute();
```

# 5

```python
from flask import Flask
from flask import jsonify
app = Flask(__name__)

import json
import random


@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/roll')
def roll_dice():
    return jsonify(roll_1=random.randint(1,6), roll_2=random.randint(1,6))

if __name__ == '__main__':
    app.debug = True
    app.run()
```

The method `roll_dice` returns the following JSON, where rolls are in the range
1 <= N <= 6:

```json
{
    "roll_1": 1,
    "roll_2": 4
}
```

# 6

Please find the job description [here](https://www.google.com/about/careers/search#!t=jo&jid=42165&).

## What milestones do you see yourself reaching?

In addition to fulfilling the job responsibilities, I see myself identifying and
designing the right fixes to bugs. Bugs that almost every non-trivial software
product or solution contains. Even a groundbreaking company like Google ships
software with bugs. I see no more effective way to have an impact than to
efficiently identify and resolve such bugs in the software.

## How do you quantify your progress to know if you have reached your goal?

Quantifying progress comes down to the impact of a bug-fix in the user base.
Here, users may be end-users, admins, developers, or another population
altogether. Regardless, it is possible to quantify the cost of a bug's
remaining unfixed in economical terms. How will I know I have reached my goal?
Simple: Save the company X man hours and/or dollars, where X is large enough
to be noticeable.

## What projects or features would you like to contribute to? In what way?

This is almost impossible to answer for this position. Google is a company that
hires based on fit with the company first, and only then are new hires matched
to a team or project; however, Google also allows employees to switch teams
when it makes sense to do so.

Given these factors, I'd like to find myself contributing to end-user facing,
high-volume features such as YouTube, Inbox, or the like. With my background,
I would be most prepared to develop back-end code that synthesizes meaningful
conclusions from the rich data stores of Google applications.

## Are there specific tools or languages that you would like to use to accomplish this?

I would not pidgeonhole myself to specific tools, technologies, or languages.
I pride myself in my ability to pick up new skills, especially those with
steep learning curves. I am also humble and aware enough to trust in what a
company like Google has chosen. For these reasons, I welcome any challenge in
this arena.

## Why are you a good fit? Can you highlight how your values and mission are aligned?

I love to learn. In fact, I must continually learn and grow; otherwise, I'm
stagnating, and if I'm stagnating, then I'm unhappy. Google is a company that
fosters learning. Engineers regularly give talks on the projects they are
working on and the technologies they are developing. Google is an industry
leader, and the software solutions developed push the envelope and carve new
possibilities. The recent achievements in AI technology with AlphaGo or self-
driving cars are examples of this.

There is no such thing as a finish line in the field of software engineering.
That's what draws me to the field in the first place. I see no better place than
Google to fuel this passion.
