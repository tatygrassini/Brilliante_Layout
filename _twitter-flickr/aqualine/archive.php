<?php
/**
 * Aqualine Wordpress Theme
 * By The Forge Web Creations: Cape Town Web Designers
 */

get_header();
?>

	<div id="content">

		<?php if (have_posts()) : ?>

 	  <?php $post = $posts[0]; // Hack. Set $post so that the_date() works. ?>
 	  <?php /* If this is a category archive */ if (is_category()) { ?>
		<h2 class="pagetitle"><?php single_cat_title(); ?></h2>
 	  <?php /* If this is a tag archive */ } elseif( is_tag() ) { ?>
		<h2 class="pagetitle"><?php single_tag_title(); ?> tag</h2>
 	  <?php /* If this is a daily archive */ } elseif (is_day()) { ?>
		<h2 class="pagetitle">Posted: <?php the_time('F jS, Y'); ?></h2>
 	  <?php /* If this is a monthly archive */ } elseif (is_month()) { ?>
		<h2 class="pagetitle">Posted: <?php the_time('F, Y'); ?></h2>
 	  <?php /* If this is a yearly archive */ } elseif (is_year()) { ?>
		<h2 class="pagetitle">Posted: <?php the_time('Y'); ?></h2>
	  <?php /* If this is an author archive */ } elseif (is_author()) { ?>
		<h2 class="pagetitle">Author Archive</h2>
 	  <?php /* If this is a paged archive */ } elseif (isset($_GET['paged']) && !empty($_GET['paged'])) { ?>
		<h2 class="pagetitle">Blog Archives</h2>
 	  <?php } ?>



		<?php while (have_posts()) : the_post(); ?>
		<div class="column">
	 
		 	<div class="metadata-block"><span>Posted on:</span>
		 								<?php the_time('F jS, Y') ?> <!-- by <?php the_author() ?> --></div>
		 	<div class="metadata-block_r"><span>Posted in:</span>
		 								<?php the_category(',') ?></div>
		
	
			<div <?php post_class() ?>>
				
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
				
		<?php else :

		if ( is_category() ) { // If this is a category archive
			printf("<h2 class='center'>Sorry, but there aren't any posts in the %s category yet.</h2>", single_cat_title('',false));
		} else if ( is_date() ) { // If this is a date archive
			echo("<h2>Sorry, but there aren't any posts with this date.</h2>");
		} else if ( is_author() ) { // If this is a category archive
			$userdata = get_userdatabylogin(get_query_var('author_name'));
			printf("<h2 class='center'>Sorry, but there aren't any posts by %s yet.</h2>", $userdata->display_name);
		} else {
			echo("<h2 class='center'>No posts found.</h2>");
		}
		get_search_form();

	endif;
?>

	</div>


<?php get_footer(); ?>











