<?php
/**
 * Aqualine Wordpress Theme
 * By The Forge Web Creations: Cape Town Web Designers
 */

get_header(); ?>

	<div id="content">
	
	 <?php if (have_posts()) : ?>

		<?php while (have_posts()) : the_post(); ?>
	
	 <div class="column">
	 
	 	<div class="metadata-block"><span>Posted on:</span>
	 								<?php the_time('F jS, Y') ?> <!-- by <?php the_author() ?> --></div>
	 	<div class="metadata-block_r"><span>Posted in:</span>
	 								<?php the_category(',') ?></div>
		
	
			<div <?php post_class() ?> id="post-<?php the_ID(); ?>">
				
<?php if (get_option('aqualine_thumbshow') == "YES") {		 ?>		

				<div class="thumb-show"><a href="<?php the_permalink() ?>"><?php $cti = catch_that_image(); if(isset($cti)){ ?>
<img src="<?php bloginfo('template_url'); ?>/scripts/timthumb.php?src=<?php echo $cti; ?>&h=200&w=300&zc=1" alt="Link to <?php the_title(); ?>" class="thumbnail"/>
<?php } else {} ?></a></div>
				
				<div class="entry-small">
					<?php if (get_option('aqualine_content') == "NO") { the_excerpt('Read the rest of this entry &raquo;'); } else { the_content(); } ?>
				</div>
				
<?php } else { ?>
<div class="entry">
					<?php if (get_option('aqualine_content') == "NO") { the_excerpt('Read the rest of this entry &raquo;'); } else { the_content(); } ?>
</div>
<?php } ?>				
				
					<div class="read_more"><a href="<?php the_permalink() ?>">Read it</a></div>
				
			</div>
	</div>
	
		<div class="column_right">
				<h3><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>"><?php the_title(); ?></a></h3>
			
			<span><?php comments_popup_link(__('0'), __('1'), __('%')); ?> Comments</span>
			
		</div>
		<?php endwhile; ?>
		
		<div class="navigation">
			<?php pagination( $wp_query, get_bloginfo('url') );?>
		</div>

	<?php else : ?>

		<h2 class="center">Not Found</h2>
		<p class="center">Sorry, but you are looking for something that isn't here.</p>
		<?php get_search_form(); ?>

	<?php endif; ?>	
	</div>


<?php get_footer(); ?>
