
# Full Stack Nanodegree Project 5

## Public IP Address

```
52.36.54.131
```

## Public URL

```
http://ec2-52-36-54-131.us-west-2.compute.amazonaws.com
```

## Firewall

```
To                         Action      From
--                         ------      ----
80/tcp                     ALLOW       Anywhere
123/tcp                    ALLOW       Anywhere
2200                       ALLOW       Anywhere
80/tcp (v6)                ALLOW       Anywhere (v6)
123/tcp (v6)               ALLOW       Anywhere (v6)
2200 (v6)                  ALLOW       Anywhere (v6)
```

## Users

```
|--------------------|
| name    | password |
|--------------------|
| catalog | catalog  |
| grader  | grader   |
| root    |          |
|--------------------|
```

## SSH

```
ssh -i ~/.ssh/grader_key.rsa grader@52.36.54.131 -p 2200
```

Contents of the key `grader_key.rsa` were submitted in the project notes. Use
the password above to authenticate.

SSH configuration was modified by editing `/etc/ssh/sshd_config` (requiring a
service restart with `service ssh restart`). The following edits were made:

* Replace `Port 22` with `Port 2200`.
* Uncomment `AuthorizedKeysFile %h/.ssh/authorized_keys`
* Comment `PasswordAuthentication no`

## Software Installed

In addition to packages installed by `apt-get update` and `apt-get upgrade`,
the following were also installed:

* git
* nginx
* nodejs
* pm2

### git

Required for downloading the source code for the catalog app.

```
$ sudo apt-get install git
$ git clone https://github.com/mehmetbajin/full-stack-web-developer
```

The repo was cloned to the directory `/var/`.

### nginx

Used to set up a reverse proxy to the catalog app.

Users access this server's public IP address (see above) to get to the catalog
Node.js application. This server listes on port 80 while the catalog app listens
on port 8080 (as defined in `/var/full-stack-web-developer/p3/index.js`).

```
$ sudo apt-get install nginx
```

Configuration files:

```
/etc/nginx/sites-available/default
/etc/nginx/sites-enabled/default
```

Configuration (redirects requests to the Node.js app):

```
server {
    listen 80;

    server_name ec2-52-36-54-131.us-west-2.compute.amazonaws.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Relevant commands:

```
$ service nginx reload      # reload the configuration
$ service nginx restart     # restart nginx
```

### nodejs

Runtime environment for the catalog application.

Dependencies were installed with (from the project directory):

```
$ npm install
$ bower install --allow-root
```

### pm2

Provides an easy way to manage and daemonize applications (i.e. run them as a
service). `pm2` was installed using Node Packaged Modules (NPM):

```
$ sudo npm install pm2 -g
```

Relevant commands:

```
pm2 start index.js  # start a daemon
pm2 delete index    # delete a daemon
pm2 list            # list active daemons
pm2 monit           # monitor statuses
```

The daemon must be started from within the directory containing the file
`index.js` (`/var/full-stack-web-developer/p3/`). For this project, the daemon
was started while logged in as the `catalog` user, who does not have sudo
privileges like the `grader` user.

To authenticate as the `catalog` user:

```
$ su catalog -
```

At this point, you should be able to execute the `pm2` commands (though there
is no need to).
