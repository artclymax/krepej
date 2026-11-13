<?php
defined('ABSPATH') || exit;

get_header();
get_template_part('partials/woocommerce/single-product');
get_template_part('partials/woocommerce/related-products');
get_template_part('partials/section-form');
get_footer(); ?>