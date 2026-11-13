<?php
/*
Template Name: Главная страница (home)
*/
?>
<?php get_header();
get_template_part('partials/home/home-hero');
get_template_part('partials/home/home-categories');
get_template_part('partials/home/home-featured-products');
get_template_part('partials/home/home-about');
get_footer(); ?>