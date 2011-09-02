<?php 
/*
	Template Name: Blog
*/
?>
<?php get_header(); ?>
			<div id="content">
				<div class="main">
					<h2><span>Blog Posts</span></h2>
					
<?php if (is_page() ) {
  $args=array(    'paged' => (get_query_var('paged')) ? get_query_var('paged') : 1 );
  $temp = $wp_query;   
  $wp_query = null;
  $wp_query = new WP_Query($args); 
?>
					<div class="posts">
 
						<?php  if( have_posts() ) : while ($wp_query->have_posts()) : $wp_query->the_post(); ?>
							<h3 id="post-<?php the_ID(); ?>"><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title(); ?>"><?php the_title(); ?></a></h3>

						<?php endwhile;   ?>
					
					</div><!-- .posts -->

<?php else : ?>
<h1>Page not found!</h1>
<?php endif; $wp_query = $temp; } ?>


				</div><!-- main -->

<?php get_sidebar(); ?>

<?php get_footer(); ?>