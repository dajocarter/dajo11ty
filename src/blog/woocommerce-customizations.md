---
title: 'Woocommerce Customizations'
date: '2017-06-24'
description: 'A compilation of customizations I have had to make to WooCommerce installations.'
categories:
  - 'Coding'
tags:
  - 'blog'
  - 'WordPress'
  - 'WooCommerce'
---

WooCommerce is the go-to solution for e-commerce on the WordPress platform. I just wanted to compile a list of customizations I have made during development. Some are more routine than others.

## Declare Theme Support

```php
<?php
  function woocommerce_support() {
    add_theme_support( 'woocommerce' );
  }

  add_action( 'after_setup_theme', 'woocommerce_support' );
?>
```

## Replace the WooCommerce Placeholder Image

```php
<?php
  function custom_fix_thumbnail() {
    function custom_woocommerce_placeholder_img_src( $src ) {
      $upload_dir = wp_upload_dir();
      $uploads = untrailingslashit( $upload_dir[ 'baseurl' ] );
      $src = $uploads . '/2017/06/yourplaceholderimage.png';

      return $src;

      // If you know the ID of the image (you can get this from the Media Library)
      // you can do this instead

      $image_ID = 88;
      $size = 'thumbnail';

      return wp_get_attachment_image_src( $image_ID, $size );
    }

    add_filter( 'woocommerce_placeholder_img_src', 'custom_woocommerce_placeholder_img_src' );
  }

  add_action( 'init', 'custom_fix_thumbnail' );
?>
```

## Change the number of products shown per row

This will appropriately add the `first` and `last` classes to the products shown in the loop.

```php
<?php
  if ( ! function_exists( 'loop_columns' ) ) {
    function loop_columns() {
      return 3; // Show 3 products per row
    }
  }

  add_filter( 'loop_shop_columns', 'loop_columns' );
?>
```

## Remove breadcrumbs

This will remove the breadcrumbs from the top of each woocommerce page.

```php
<?php
  function remove_wc_breadcrumbs() {
    remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );
  }

  add_action( 'init', 'remove_wc_breadcrumbs' );
?>
```
