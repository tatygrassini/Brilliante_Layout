<?php get_header(); ?>

      </header>
			<div id="content">
				<div class="main">
					<h2 id="post-<?php the_ID(); ?>"><span><?php the_title(); ?></span></a></h2>
					
						<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
					
						<div class="post">
							
							<div class="post-single">
								<?php if(has_post_thumbnail()) { ?>
									<a href="<?php the_permalink() ?>"><?php the_post_thumbnail( 'single-post-thumbnail' ); ?></a>
								<?php } else {
									echo '<img src="'.get_bloginfo("template_url").'/css/img/no-img-542x220.gif" />';
								} ?>
								
								<div class="text">
									<?php the_content(); ?>
									
									<div class="readMore">
										<span>Author: </span><em><?php the_author_posts_link(); ?></em><br />
									</div><!-- .readMore -->
									
									<div class="cat-date">
										<span class="posted">Posted in: </span><em><?php the_category(', ') ?></em></span>
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