<div class="post">
<h3 id="post-<?php the_ID(); ?>"><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title(); ?>"><?php the_title(); ?></a></h3>

<div class="cat-date">
<span class="posted">Posted in: </span><em><?php the_category(', ') ?></em></span>
<span class="sep">&nbsp;</span>
<span class="date">Date: <em><?php the_time('d F Y') ?></em></span>
</div><!-- .cat-date -->

<div class="post-teaser">
<?php if(has_post_thumbnail()) { ?>
<a href="<?php the_permalink() ?>"><?php the_post_thumbnail(); ?></a>
<?php } else { echo '<img src="'.get_bloginfo("template_url").'/css/img/no-img-140x140.gif" />'; } ?>

<div class="text">
<?php the_content('<span class="more-link" alt="Read More" title="Read More">Read More</span>'); ?>
<hr noshade="noshade"/>
<div class="readMore">
<span>Author: </span><em><?php the_author_posts_link(); ?></em><br />
<span>Reaction: </span><em><a href="<?php comments_link(); ?>"><?php comments_number('Be The First to Comment', '1 Comment', '% Comments'); ?></a></em>
</div><!-- .readMore -->
</div><!-- .text -->
</div><!-- .post-teaser -->
</div><!-- .post -->