<?php
/**
 * Aqualine Wordpress Theme
 * By The Forge Web Creations: Cape Town Web Designers
 */

get_header(); ?>

	<div id="content">

		<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
		
	<div class="column">
		<div class="post" id="post-<?php the_ID(); ?>">
			<div class="entry">
				<?php the_content('<p class="serif">Read the rest of this page &raquo;</p>'); ?>

				<?php wp_link_pages(array('before' => '<p><strong>Pages:</strong> ', 'after' => '</p>', 'next_or_number' => 'number')); ?>
			<?php endwhile; endif; ?>
	
			<?php edit_post_link('Edit this entry.', '<p>', '</p>'); ?>

			</div>
		<?php comments_template(); ?>
		</div>
		
	</div>
		
		<div class="column_right">
				<h3 class="postright"><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>"><?php the_title(); ?></a></h3>
			
				<div class="postmetadata">
					<span>POSTED BY:</span>
					<p><?php the_author() ?></p>
				</div>
				
				<!--<div class="postmetadata2">
					<span>POSTED IN:</span>
					<p><?php the_category(',') ?></p>
				</div>-->
				
				
				<?php
				if( has_tag() ) { ?>
				 
				<div class="postmetadata2">
					<span>TAGS:</span>
					<p><?php the_tags('') ?></p>
				</div>
				<?php } ?>			
		</div>

	</div>
<?php get_footer(); ?>
