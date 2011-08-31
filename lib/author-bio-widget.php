<?php
/*
Plugin Name: Author Bio Widget
Description: Displays basic author info.
Author: <a href="http://www.fubra.com">Ray Viljoen</a>
Version: 1.0
Plugin URI: http://catn.com/community/plugins/
Usage: widget.
*/
// � 2009-2011 Fubra Limited, all rights reserved. 

class BioWidget extends WP_Widget {
    /** constructor */
    function BioWidget() {
        parent::WP_Widget(false, $name = 'Author Bio');  
    }

    function widget($args, $instance) {

    global $post;  
      $title = apply_filters('widget_title', $instance['title']);
      $av_size = $instance['size'];

    $author = $post->post_author;

    $name = get_the_author_meta('nickname', $author);
    $alt_name = get_the_author_meta('user_nicename', $author);
    $avatar = get_avatar($author, $av_size, 'Gravatar Logo', $alt_name.'-photo');
    $description = get_the_author_meta('description', $author);
    $author_link = get_author_posts_url($author);
   ?> 

		<li class="sidebar-widget">
      <div class="sidebar-widget" id="author-bio">
				<h2 class="cufon-h2"><span><?php echo $title ?></span></h2>
				<?php echo $avatar; ?>
				<h4><a href= "<?php echo $author_link; ?>" ><?php echo $name; ?></a></h4>
				<p><?php echo $description; ?></p>
			</div>
		</li>

    <?php
    }

    function update($new_instance, $old_instance) {       
  $instance = $old_instance;
  $instance['title'] = strip_tags($new_instance['title']);
  $instance['size'] = strip_tags($new_instance['size']);
        return $instance;
    }

    function form($instance) {
      if(array_key_exists('title', $instance)){
        $title = esc_attr($instance['title']);
      }else{$title='';}

      if(array_key_exists('size', $instance)){
        $size = esc_attr($instance['size']);
      }else{$size=99;}

        ?>
            <p><label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:'); ?> <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>" /></label></p>
            <p><label for="<?php echo $this->get_field_id('size'); ?>"><?php _e('Avatar Size:'); ?> <input class="widefat" id="<?php echo $this->get_field_id('size'); ?>" name="<?php echo $this->get_field_name('size'); ?>" type="text" value="<?php echo $size; ?>" /></label></p>
        <?php 
    }
}
add_action('widgets_init', create_function('', 'return register_widget("BioWidget");'));
?>