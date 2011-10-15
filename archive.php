<?php get_header(); ?>

<div id="content">

<div class="main">

<?php if (have_posts()) : ?>

<?php $post = $posts[0]; // Hack. Set $post so that the_date() works. ?>

<?php /* If this is a category archive */ if (is_category()) { ?>
<h2><span>Archive for the &#8216;<?php single_cat_title(); ?>&#8217; Category</span></h2>

<?php /* If this is a tag archive */ } elseif( is_tag() ) { ?>
<h2><span>Posts Tagged &#8216;<?php single_tag_title(); ?>&#8217;</span></h2>

<?php /* If this is a daily archive */ } elseif (is_day()) { ?>
<h2><span>Archive for <?php the_time('F jS, Y'); ?></span></h2>

<?php /* If this is a monthly archive */ } elseif (is_month()) { ?>
<h2><span>Archive for <?php the_time('F, Y'); ?></span></h2>

<?php /* If this is a yearly archive */ } elseif (is_year()) { ?>
<h2 class="pagetitle"><span>Archive for <?php the_time('Y'); ?></span></h2>

<?php /* If this is an author archive */ } elseif (is_author()) { ?>
<h2 class="pagetitle"><span>Author Archive</span></h2>

<?php /* If this is a paged archive */ } elseif (isset($_GET['paged']) && !empty($_GET['paged'])) { ?>
<h2 class="pagetitle"><span>Blog Archives</span></h2>

<?php } ?>

<?php include (TEMPLATEPATH . '/inc/nav.php' ); ?>

<?php while (have_posts()) : the_post(); ?>

<div class="post">

<h3 id="post-<?php the_ID(); ?>"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a></h3>

</div><!-- .post -->

<?php endwhile; ?>

<?php include (TEMPLATEPATH . '/inc/nav.php' ); ?>

<?php else : ?>

<h2><span>Nothing found</span></h2>

<?php endif; ?>

</div><!-- main -->

<?php get_sidebar(); ?>

<?php get_footer(); ?>