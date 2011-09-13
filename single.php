<?php get_header(); ?>

			<div id="content">
				<div class="main">
					<h2 id="post-<?php the_ID(); ?>"><span><?php the_title(); ?></span></a></h2>
					
						<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
					
						<div class="post">
							
							<div class="post-single">
								<?php the_post_thumbnail( 'single-post-thumbnail' ); ?>
								
								<div class="text">
									<?php the_content(); ?>
									
									<div class="readMore">
										<span>Author: </span><em><?php the_author_posts_link(); ?></em><br />
										<span>Reaction: </span><em><a href="<?php comments_link(); ?>"><?php comments_number('No Comments', '1 Comment', '% Comments'); ?></a></em>
									</div><!-- .readMore -->
									
									<div class="cat-date">
										<span class="posted">Posted in: </span><em><a href="#"><?php the_category(', ') ?></a></em></span>
										<span class="sep">&nbsp;</span>
										<span class="date">Date: <em><a href="#"><?php the_time('d F Y') ?></a></em></span>
									</div><!-- .cat-date -->
								</div><!-- .text -->
							</div><!-- .post-single -->
						</div><!-- .post -->
						<?php endwhile;
												
						  else : ?>
												
						  <p>Page not found.</p>
						
						<?php endif; ?>
						
						<div id="comments">
							<?php comments_template(); ?>
						</div>
						
				</div><!-- main -->
			
<?php get_sidebar(); ?>

<?php get_footer(); ?>