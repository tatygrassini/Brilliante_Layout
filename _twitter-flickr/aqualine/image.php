<?php
/**
 * Aqualine Wordpress Theme
 * By The Forge Web Creations: Cape Town Web Designers
 */

get_header();
?>

	<div id="content">

  <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
  
   <div class="column">

		<div class="post" id="post-<?php the_ID(); ?>">
			
			<div class="entry">
				<p class="attachment"><a href="<?php echo wp_get_attachment_url($post->ID); ?>"><?php echo wp_get_attachment_image( $post->ID, '' ); ?></a></p>
				<div class="caption"><?php if ( !empty($post->post_excerpt) ) the_excerpt(); // this is the "caption" ?></div>

				<?php the_content('<p class="serif">Read the rest of this entry &raquo;</p>'); ?>

				<div class="navigation">
					<div class="alignleft"><?php previous_image_link() ?></div>
					<div class="alignright"><?php next_image_link() ?></div>
				</div>
				
			</div>
			
		</div>
		<?php comments_template(); ?>
		</div>

			<div class="column_right">
				<h3 class="postright"><a href="<?php echo get_permalink($post->post_parent); ?>" rev="attachment"><?php echo get_the_title($post->post_parent); ?></a> &raquo; <?php the_title(); ?></h3>
			
				<div class="postmetadata">
					<span>POSTED ON:</span>
					<p><?php the_time('F jS, Y') ?> <!-- by <?php the_author() ?> --></p>
				</div>
				
				<div class="postmetadata2">
					<span>POSTED IN:</span>
					<p><?php the_category(',') ?></p>
				</div>
				
				
				<?php
				if( has_tag() ) { ?>
				 
				<div class="postmetadata2">
					<span>TAGS:</span>
					<p><?php the_tags('') ?></p>
				</div>
				<?php } ?>			
		</div>
	

	<?php endwhile; else: ?>

		<p>Sorry, no attachments matched your criteria.</p>

<?php endif; ?>

	</div>

<?php get_footer(); ?>
