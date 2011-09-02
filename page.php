<?php get_header(); ?>

			<div id="content">
			
				<div class="main">
				
						<h2><span><?php the_title(); ?></span></h2>	
					
						<?php if ( have_posts() ) while ( have_posts() ) : the_post(); ?>
						
						<div class="post">
							
							<div class="post-single">

							<?php the_content(); ?>
							
							<?php edit_post_link( __( 'Edit', 'brilliante_layout' ), '', '' ); ?>

							</div><!-- .post-single -->
							
						</div><!-- .post -->
						
						<?php endwhile; ?>
						
				</div><!-- main -->
			
<?php get_sidebar(); ?>
			
<?php get_footer(); ?>