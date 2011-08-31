<?php get_header(); ?>
			<div id="content">
				<div class="main">
					<h2><span>Latest from the blog</span></h2>
					
						<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
					
						<div class="post">
							<h3 id="post-<?php the_ID(); ?>"><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title(); ?>"><?php the_title(); ?></a></h3>
							
							<div class="cat-date">
								<span class="posted">Posted in: </span><em><a href="#"><?php the_category(', ') ?></a></em></span>
								<span class="sep">&nbsp;</span>
								<span class="date">Date: <em><a href="#"><?php the_time('d F Y') ?></a></em></span>
							</div><!-- .cat-date -->
							
							<div class="post-teaser">
								<a href="<?php the_permalink() ?>"><?php the_post_thumbnail(); ?></a>
								
								<div class="text">
									<?php the_content('<span class="more-link" alt="Read More" title="Read More">Read More</span>'); ?>
									
									<div class="readMore">
										<span>Author: </span><em><?php the_author_posts_link(); ?></em><br />
										<span>Reaction: </span><em><a href="<?php comments_link(); ?>"><?php comments_number('No Comments', '1 Comment', '% Comments'); ?></a></em>
									</div><!-- .readMore -->
								</div><!-- .text -->
							</div><!-- .post-teaser -->
						</div><!-- .post -->
						<?php endwhile;
												
						  else : ?>
												
						  <p>Page not found.</p>
						
						<?php endif; ?>
						
						<div class="navigation">
							<div class="alignleft"><?php next_posts_link('&larr; Older Entries') ?></div>
							<div class="alignright"><?php previous_posts_link('Newer Entries &rarr;') ?></div>
						</div>
				</div><!-- main -->
			
<?php get_sidebar(); ?>
			
<?php get_footer(); ?>