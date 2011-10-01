<?php /* Template Name: Blog */ ?>
<?php get_header(); ?>

			<div id="content">
			
				<div class="main">
				
						<h2><span><?php the_title(); ?></span></h2>	
					
						<?php query_posts( 'posts_per_page=5' ); ?>
									
						<?php if ( have_posts() ) while ( have_posts() ) : the_post(); ?>
						
							<div class="post-page-blog">
								<?php if(has_post_thumbnail()) { ?>
									<a href="<?php the_permalink() ?>"><?php the_post_thumbnail( array(50,50) ); ?></a>
								<?php } else {
									echo '<img src="'.get_bloginfo("template_url").'/css/img/no-img-50x50.gif" />';
								} ?>
								
	              <h3 id="post-<?php the_ID(); ?>"><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title(); ?>"><?php the_title(); ?></a></h3>
								<p><?php comments_number('No Comments', '1 Comment', '% Comments'); ?></p>
	            </div><!-- .post -->
						
						<?php endwhile; ?>
						
				</div><!-- main -->
			
<?php get_sidebar(); ?>
			
<?php get_footer(); ?>