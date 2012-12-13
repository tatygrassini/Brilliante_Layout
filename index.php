<?php get_header(); ?>

<?php include (TEMPLATEPATH . '/inc/featured.php' ); ?>

</header>
<div id="content">
<div class="main" role="main">
<h2><span>Latest from the blog</span></h2>

<?php if (have_posts()) : while (have_posts()) : the_post(); ?>

<?php include (TEMPLATEPATH . '/inc/post.php' ); ?>

<?php endwhile;
    
else : ?>
    
<p>Page not found.</p>

<?php endif; ?>

<?php include (TEMPLATEPATH . '/inc/nav.php' ); ?>
</div><!-- main -->

<?php get_sidebar(); ?>

<?php get_footer(); ?>