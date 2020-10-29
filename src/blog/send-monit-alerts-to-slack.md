---
title: 'Send Monit Alerts to Slack'
date: '2017-06-25'
description: "This post will show you how to install Monit on a Ubuntu server to send alerts to you on Slack. If you're not using Slack, this post is still applicable as intructions for installation."
categories:
  - 'Coding'
tags:
  - 'blog'
  - 'SysAdmin'
  - 'Monit'
  - 'Slack'
---

## Installing Monit

This is as easy as `sudo apt-get install monit`. Just a heads-up to ServerPilot users, you'll have to SSH in to your server as `root` or another user with root/sudo priviledges. If you do SSH in as root, you can leave off all of the `sudo`s.

Now that Monit is installed, the next step is to turn it on so `cd /etc/monit`. If you `tree` here, you'll see the following directory structure:

```shell
$ tree /etc/monit
/etc/monit
├── conf.d
│   └── services
├── monitrc
├── monitrc.d
│   ├── acpid
│   ├── apache2
│   ├── at
│   ├── cron
│   ├── mdadm
│   ├── memcached
│   ├── mysql
│   ├── nginx
│   ├── openntpd
│   ├── openssh-server
│   ├── pdns-recursor
│   ├── postfix
│   ├── rsyslog
│   ├── smartmontools
│   └── snmpd
└── templates
    ├── rootbin
    ├── rootrc
    └── rootstrict

3 directories, 20 files
```

## Configure Monit

The first thing we'll need to do is edit the `monitrc` file so `sudo nano monitrc`. Now scroll down and uncomment the following lines:

```shell
set httpd port 2812 and
use address localhost
allow localhost
```

Then scroll down just a bit to under the Services section and uncomment the part about checking general system resources. **Be sure** to change `myhost.mydomain.tld` to match your server. So you should have the following lines uncommented:

```shell
check system myhost.mydomain.tld
  if loadavg (1min) > 4 then alert
  if loadavg (5min) > 2 then alert
  if memory usage > 75% then alert
  if swap usage > 20% then alert
  if cpu usage (user) > 70% then alert
  if cpu usage (system) > 30% then alert
  if cpu usage (wait) > 20% then alert
```

Now that Monit is set up, we need to configure it to monitor our chosen services. If you read the `monitrc` file, you would have found that the last line is to include any files in the `conf.d` folder. This is where we'll put our custom services file so `sudo nano conf.d/services`. You can check out Monit's [configuration examples](https://mmonit.com/wiki/Monit/ConfigurationExamples) but here's my file:

```shell
check process nginx with pidfile /var/run/nginx-sp.pid
  group serverpilot
  start program = "/etc/init.d/nginx-sp start"
  stop program = "/etc/init.d/nginx-sp stop"
  if changed pid then exec "/etc/monit/slack.sh"

check process mysql with pidfile /var/run/mysqld/mysqld.pid
  start program = "/etc/init.d/mysql start"
  stop program = "/etc/init.d/mysql stop"
  if failed unixsocket /var/run/mysqld/mysqld.sock then restart
  if 5 restarts within 5 cycles then timeout
  if changed pid then exec "/etc/monit/slack.sh"

check process php5-fpm with pidfile /var/run/php5.5-fpm-sp.pid
  start program = "/etc/init.d/php5.5-fpm-sp start"
  stop program = "/etc/init.d/php5.5-fpm-sp stop"
  if changed pid then exec "/etc/monit/slack.sh"
```

The `-sp` suffix is if you're using ServerPilot, but if you're not just leave it off. If you're in doubt of the name of the pid, just `ls /var/run` to double-check. Once that's done we can check that everything is configured correctly with `sudo monit -t`. If successful, then restart Monit with `sudo service monit restart` and start monitoring your configured services with `sudo monit start all`. Finally, you can double-check that everything is running with `sudo monit status`.

## Sending Alerts to Slack

The first thing you'll have to do is set up an Incoming Webhook with your Slack team and copy the url for later. Now we'll configure a payload to send to Slack. So from still within the `/etc/monit` directory, go ahead and `sudo nano slack.sh`. **Be sure** to change the channel, username, and emoji name to your choosing.

```shell
#!/bin/sh
/usr/bin/curl \
  -X POST \
  -s \
  --data-urlencode "payload={ \
    \"channel\": \"#slack-channel\", \
    \"username\": \"monit-serverName\", \
    \"icon_emoji\": \":emoji-name:\", \
    \"text\": \"$MONIT_DATE - $MONIT_SERVICE - $MONIT_DESCRIPTION\" \
  }" \
  https://hooks.slack.com/services/blahblah/blahblah/blahblahblah
```

Now we need to make sure that Monit can execute this script so `chmod 744 slack.sh`. Next, we need to tell Monit to run the Slack script when it needs to send an alert so `sudo nano monitrc`. In the section about checking general system resources, replace `then alert` with `then exec "/etc/monit/slack.sh" else if succeeded then exec "/etc/monit/slack.sh"`. At the end it should look like this:

```shell
check system myhost.mydomain.tld
  if loadavg (1min) > 4 then exec "/etc/monit/slack.sh" else if succeeded then exec "/etc/monit/slack.sh"
  if loadavg (5min) > 2 then exec "/etc/monit/slack.sh" else if succeeded then exec "/etc/monit/slack.sh"
  if memory usage > 75% then exec "/etc/monit/slack.sh" else if succeeded then exec "/etc/monit/slack.sh"
  if swap usage > 40% then exec "/etc/monit/slack.sh" else if succeeded then exec "/etc/monit/slack.sh"
  if cpu usage (user) > 70% then exec "/etc/monit/slack.sh" else if succeeded then exec "/etc/monit/slack.sh"
  if cpu usage (system) > 30% then exec "/etc/monit/slack.sh" else if succeeded then exec "/etc/monit/slack.sh"
  if cpu usage (wait) > 20% then exec "/etc/monit/slack.sh" else if succeeded then exec "/etc/monit/slack.sh"
```

Finally, we can make sure everything is configured correctly with `sudo monit -t` and restart Monit to put our changes in to effect with `sudo service monit restart`.
