---
title: 'WordPress Authentication with Gatsby'
date: '2018-06-27'
description: 'How to set up basic authentication for your self-hosted WordPress site with Gatsby.'
categories:
  - 'Coding'
tags:
  - 'blog'
  - 'WordPress'
  - 'Gatsby'
---

Setting up authentication with Gatsby allows you to pull data from protected routes like WordPress settings and information about your user profile. For example, here's the new information I get with authentication set up.

![GraphiQL WordPress Settings](/img/graphiql-wordpress-settings.png)

To get started, you'll need to install the [Basic Auth](https://github.com/WP-API/Basic-Auth) plugin in your WordPress installation. Then you'll need to inform your gatsby-source-wordpress plugin of your WordPress username and password.

Open your `gatsby-config.js` file and locate the portion for configuring `gatsby-source-wordpress` and add the following:

```json/8-12
{
  "resolve": "gatsby-source-wordpress",
  "options": {
    "baseUrl": "yourdomain.com",
    "protocol": "https",
    "hostingWPCOM": false,
    "useACF": true,
    "verboseOutput": true,
    "auth": {
      "htaccess_user": "yourWPusername",
      "htaccess_pass": "yourWPpassword",
      "htaccess_sendImmediately": false
    }
  }
}
```

Fire up `gatsby-develop` and you'll be able to see the protected data now in GraphiQL.

## Taking it further

Your WordPress username and password is something you probably don't want to expose to the world. To get around this, you can use [environment variables](https://www.gatsbyjs.org/docs/environment-variables/).

In order for Gatsby to read enviroment variables in `gatsby-config.js`, you'll have to install the NPM package `dotenv` using either `npm install dontenv` or `yarn add dotenv`. Once installed, at the top of your `gatsby-config.js` file, add the following:

```js
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})
```

Now you're ready to create a `.env.development` file in the root of your Gatsby project (same level as `gatsby-config.js`). Don't forget to add it to your `.gitignore`! Once you've created that file, add your WordPress login information:

```bash
WP_USERNAME=yourWPusername
WP_PASSWORD=yourWPpassword
```

Finally, open your `gatsby-config.js` file and locate the portion for configuring `gatsby-source-wordpress` and replace your username and password with the following:

```json
auth: {
  htaccess_user: process.env.WP_USERNAME,
  htaccess_pass: process.env.WP_PASSWORD
}
```

Once again, fire up `gatsby develop` to make sure it works.

This setup, however, only works in development so far. If you decide to deploy this, your production build won't have access to your environment variables since they're not being tracked. I use [Netlify](https://www.netlify.com/) to deploy my Gatsby sites, so other deployment setups will be different, but it's incredibly easy to do with Netlify (like usual with them). You just need to go to the deploy settings for your site and add Build environment variables. Check out the screenshot below if you're lost.

![Netlify Build environment variables](/img/netlify-htaccess-env-vars.png)
