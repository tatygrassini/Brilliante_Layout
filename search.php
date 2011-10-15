<?php get_header(); ?>
<div id="content">
<div class="main">

<?php if (have_posts()) : ?>

<h2><span>Search results for: <?php the_search_query(); ?></span></h2>

<?php while (have_posts()) : the_post(); ?>

<?php include (TEMPLATEPATH . '/inc/post.php' ); ?>

<?php endwhile;
		
else : ?>
		
<h2><span>Page Not Found</span></h2>

<?php endif; ?>

<?php include (TEMPLATEPATH . '/inc/nav.php' ); ?>
</div><!-- main -->

<?php get_sidebar(); ?>

<?php get_footer(); ?>