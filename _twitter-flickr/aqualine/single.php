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
			<div <?php post_class() ?> id="post-<?php the_ID(); ?>">
				
				
				<div class="entry">
					<?php the_content(''); ?>
				</div>
				<span class="postlinks"><?php wp_link_pages(array('before' => '<p><strong>Pages:</strong> ', 'after' => '</p>', 'next_or_number' => 'number')); ?></span>
				<?php if (get_option('aqualine_theme_social') === "YES") { ?>	
				<div id="share-con">
					<H4 class="promote">Promote this post.</H4>
					<ul id="sharemenu">
						<li id="share-facebook"><a href="http://www.facebook.com/sharer.php?u=<?php the_permalink();?>&t=<?php the_title(); ?>" title="Share on Facebook"><span>Share on Facebook</span></a></li>
						<li id="share-divider"></li>
						<li id="share-technorati"><a href="http://technorati.com/faves?sub=addfavbtn&add=<?php the_permalink();?>" title="Share on technorati"><span>Share on technorati</span></a></li>
						<li id="share-divider"></li>
						<li id="share-delicious"><a href="http://delicious.com/post?url=<?php the_permalink();?>&title=<?php the_title();?>" title="Add to Delicious"><span>Add to delicious</span></a></li>
						<li id="share-divider"></li>
						<li id="share-twitter"><a href="http://twitter.com/home?status=Currently reading <?php the_permalink(); ?>" title="Tweet this"><span>Tweet this</span></a></li>
						<li id="share-divider"></li>
						<li id="share-stumble"><a href="http://www.stumbleupon.com/submit?url=<?php the_permalink(); ?>&title=<?php the_title(); ?>" title="Stumble upon it"><span>Stumble upon it</span></a></li>
						<li id="share-divider"></li>
						<li id="share-digg"><a href="http://www.digg.com/submit?phase=2&url=<?php the_permalink();?>" title="Digg It"><span>Digg It</span></a></li>
					</ul>
				</div>
				<?php } ?>
				
			</div>
			<?php comments_template(); ?>
		
	</div>	
		<div class="column_right">
				<h3 class="postright"><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>"><?php the_title(); ?></a></h3>
			
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
		

		<?php endwhile; ?>			
	<?php else : ?>

		<h2 class="center">Not Found</h2>
		<p class="center">Sorry, but you are looking for something that isn't here.</p>
		<?php get_search_form(); ?>

	<?php endif; ?>	
	</div>


<?php get_footer(); ?>

























