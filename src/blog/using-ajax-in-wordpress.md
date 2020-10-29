---
title: 'Using AJAX in WordPress'
date: '2018-02-24'
description: 'How to configure your theme to process AJAX requests.'
categories:
  - 'Coding'
tags:
  - 'blog'
  - 'AJAX'
  - 'WordPress'
---

## Getting your theme ready for AJAX

The first thing you'll need to do is enqueue your javascript file. Open up `functions.php` and add the following if it's not already there.

```php
function theme_js() {
  wp_register_script(
    'theme-js',
    get_template_directory_uri() . '/path/to/file.js',
    array( 'jquery' ),
    filemtime( dirname(  __FILE__ ) . '/path/to/file.js' ),
    true
  );
  wp_enqueue_script( 'theme-js' );
}
add_action( 'wp_enqueue_scripts', 'theme_js' );
```

You can look this up in the [codex](https://developer.wordpress.org/reference/functions/wp_register_script/), but I'll go through the arguments for `wp_register_script()`.

The first argument is a name for your javascript file. This can be anything you want, but it needs to be unique and makes sense to you.

The next argument lets WordPress know where to find your file. Use the full URL of the script, or a path relative to the root directory of your WordPress installation. The `get_template_directory_uri()` will output the URL of your theme so `https://www.yourdomain.com/wp-content/themes/your-theme`.

The next argument is an array of registered scripts that your file depends on. Here, I'm listing jQuery as a dependence.

Next is the version file for your script. You can easily set this to `false` or manually set it using a string. For cache busting purposes, I use `filemtime()` to set it to the last modified time of the file.

The last argument is whether or not to enqueue the script just before `</body>` rather than `</head>`. I set it to `true` since that's good practice for JS files.

Next, you need to make some variables available in your JS file. Add the following to the end of your `theme_js()` function.

```php
  wp_localize_script(
    'theme-js',
    'uniqueObj',
    array(
      'ajaxurl' => admin_url( 'admin-ajax.php' ), // Required for front-end requests
      'ajaxnonce' => wp_create_nonce( 'some-unique-string' ), // Recommended for all requests
      // You can use this opportunity to pass variables from PHP to JS needed for your request
      'actionName' => 'perform_some_action' // Optional
    )
  );
}
```

What the `wp_localize_script()` does is create a JS object and make it globally available in your file. The first argument is the name for the script that the data will be used in. The second argument is the name for the object created. Use an associative array for the third argument to create your JS object.

All AJAX requests must be sent to the `admin-ajax.php` URL so that must be made available to any front-end JavaScript code. Just so you're aware, if you're making AJAX requests **on the admin side only** (such as a plugin), there is a global `ajaxurl` JS variable already made available by WordPress.

Save your `functions.php` file, refresh your page, and open up your inspector. Scroll down to just above the closing `body` tag to find where your JS file is enqueued. Right above it you will now find the following script

```html
<script type="text/javascript">
  /* <![CDATA[ */
  var uniqueObj = {
    ajaxurl: 'https:\/\/www.yourdomain.com\/wp-admin\/admin-ajax.php',
    ajaxnonce: '2a43e453a7',
    actionName: 'perform_some_action',
  }
  /* ]]> */
</script>
```

## Create a PHP function to respond to an AJAX request

In order to send an AJAX request, you need to know the action you want to perform to create your response. This can be done in `functions.php` or you can create a separate PHP file but you must remember to `include( 'path/to/file.php' )` inside your `functions.php`.

```php
function perform_some_action() {
  check_ajax_referrer( 'some-unique-string', 'security' );
  $greeting = $_POST['greeting'];
  $user_logged_in = is_user_logged_in();
  if ( $user_logged_in ) {
    $current_user = wp_get_current_user();
    $username = $current_user->first_name;
  } else {
    $username = "Anonymous";
  }
  $message = $greeting . ', ' . $username . '!';
  echo json_encode( array( 'message' => $message ), JSON_FORCE_OBJECT );
  wp_die();
}
if ( is_admin() ) {
  add_action( 'wp_ajax_perform_some_action', 'perform_some_action' );
  add_action( 'wp_ajax_nopriv_perform_some_action', 'perform_some_action' );
}
```

The `check_ajax_referrer()` method verifies the AJAX request so that unscrupulous requests from third-parties aren't processed. This does not handle and cannot be used for authentication, authorization, or access control. If this test fails, processing stops immediately.

Once you've created your response, you need to `echo` it. I've chosen to put my response in an array that will get transformed into an object, but you can easily just echo a string as your response if that's all it is.

The `wp_die()` function is required to terminate the action immediately and return a proper response. Since it provides better integration with WordPress, it is best to use this over native PHP functions like `die()` or `exit()`.

In order to "hook" your function, you must use the `add_action()` method. If your AJAX request is only used on the admin side, you only have to use `add_action( 'wp_ajax_action_name' 'action_name' )`. Otherwise, if it's coming from the front-end, you must also use `add_action( 'wp_ajax_nopriv_action_name', 'action_name' )` in conjuction. Since all AJAX requests go to `admin-ajax.php`, the `is_admin()` check will always return true so this helps to separate them from non-AJAX front-end action hooks.

## Create an AJAX request

Now we're ready to make our AJAX request. Since we named jQuery as a dependency, we can use its `ajax()` method to make our request.

```js
jQuery(document).ready(function ($) {
  $.ajax({
    type: 'POST',
    url: uniqueObj.ajaxurl,
    data: {
      security: uniqueObj.ajaxnonce,
      action: uniqueObj.actionName,
      greeting: 'Hello',
    },
  }).success(function () {
    if (response.message) {
      $('#some_element').text(response.message)
    }
  })
})
```

If you messed up somewhere along the way, the response will be `-1` or `0` depending on the reason. Most of the above information comes from the [AJAX in Plugins](https://codex.wordpress.org/AJAX_in_Plugins) page of the codex if you'd like more information. Otherwise, enjoy using AJAX in WordPress!
