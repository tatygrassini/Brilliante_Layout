<?php
/**
* @package FlickrThumbsWidget
* @version 1.5
*/
/*
Plugin Name: Flickr Thumbnails Widget
Plugin URI: http://www.karrderized.com/wordpress-plugins/flickr-thumbnail-widget/
Description: Displays thumbnails from Flickr based on the user/group/tag you provide.
Author: James Carppe
Version: 1.5
Author URI: http://www.karrderized.com/
*/

// Changelog:
// v1.5: fixed tag feed url (was retrieving an atom feed instead of rss), moved feed retrieval to the new Wordpress default parser (SimplePie)
// v1.4: rewrote with wp2.8+ new widget interface code
// v1.3: added column support (thanks debashish!)
// v1.2: .. too long ago to remember ;)


add_action('widgets_init', 'flickrthumbs_load_widgets');

function flickrthumbs_load_widgets() {
  register_widget('FlickrThumbsWidget');
}

class FlickrThumbsWidget extends WP_Widget {
  function FlickrThumbsWidget() {
    $widget_ops = array('classname'=>'flickrthumbs', 'description'=>'Displays thumbnails from Flickr based on the user/group/tag you provide.');
    $control_ops = array('width'=>300, 'height'=>150, 'id_base'=>'flickrthumbs-widget');
    $this->WP_Widget('flickrthumbs-widget', 'Flickr Thumbnails', $widget_ops, $control_ops);
  }
  
  function widget($args, $instance) {
    extract($args);
    $title = apply_filters('widget_title', $instance['title']);
    $searchtext = $instance['searchtext'];
    $type = $instance['type'];
    $numpics = $instance['numpics'];
    $numcols = $instance['numcols'];
    
    echo $before_widget . $before_title . $title . $after_title;
    if ($type == "group") {
			$feedurl = "http://www.flickr.com/groups/" . $searchtext . "/pool/feed/?format=rss_200";
		} else if ($type == "tag") {
			$feedurl = "http://www.flickr.com/services/feeds/photos_public.gne?tags=" . $searchtext . "&format=rss_200";
		} else {
			$feedurl = "http://www.flickr.com/services/feeds/photos_public.gne?id=" . $searchtext . "&format=rss_200";
		}
		require_once (ABSPATH . WPINC . '/feed.php');
		$rss = fetch_feed($feedurl);
		
    if (!is_wp_error( $rss ) ) { // Checks that the object is created correctly 
      $maxitems = $rss->get_item_quantity($numpics);
      $rss_items = $rss->get_items(0, $maxitems);
			$count = 0;			
			echo "<table border=0 width=100%><tr>";
			foreach ($rss_items as $item ) {
				$r = $count % $numcols;				    
				if($r == 0) {
					echo "<tr>";
				}					
				preg_match('<img src="([^"]*)" [^/]*/>', $item->get_description(),$imgUrlMatches);
				$imgurl = $imgUrlMatches[1];
				$imgurl = str_replace("m.jpg", "s.jpg", $imgurl);
				$thetitle = $item->get_title();
				$thelink = $item->get_permalink();
				echo "<td><a href=\"$thelink\" title=\"$thetitle\"><img class=\"flickr\" width=\"80px\" height=\"80px\" src=\"$imgurl\" alt=\"$thetitle\" /></a></td>";
				if($r == ($numcols - 1)) {
					echo "</tr>";
				}
				$count++;										
			}
			echo "</table>";
		} else {
		    echo "An error occured!  " .      
		        "<br>Error Message: "   . wp_error();
		}
		
		echo $after_widget;    
  }
  
  function update($new_instance, $old_instance) {
    $instance = $old_instance;
    
    $instance['title'] = strip_tags($new_instance['title']);
    $instance['searchtext'] = strip_tags($new_instance['searchtext']);
    $instance['type'] = strip_tags($new_instance['type']);
    $instance['numpics'] = strip_tags($new_instance['numpics']);
    $instance['numcols'] = strip_tags($new_instance['numcols']);
    
    return $instance;    
  }
  
  function form($instance) {
    $defaults = array('title'=>'Flickr', 'searchtext'=>'', 'type'=>'group', 'numpics'=>6, 'numcols'=>2);
    $instance = wp_parse_args((array) $instance, $defaults); ?>
    
    <p><label for="<?php echo $this->get_field_id('title'); ?>">Title: <input style="width: 200px;" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $instance['title']; ?>" /></label></p>
		<p><label for="<?php echo $this->get_field_id('searchtext'); ?>">Search Text: <input style="width: 200px;" id="<?php echo $this->get_field_id('searchtext'); ?>" name="<?php echo $this->get_field_name('searchtext'); ?>" type="text" value="<?php echo $instance['searchtext']; ?>" /></label></p>
		<p><label for="<?php echo $this->get_field_id('type'); ?>">Type:
    <input type="radio" name="<?php echo $this->get_field_name('type'); ?>" value="group"<?php if($instance['type'] == 'group') {echo ' checked';} ?>>group</input>
		<input type="radio" name="<?php echo $this->get_field_name('type'); ?>" value="tag"<?php if($instance['type'] == 'tag') {echo ' checked';} ?>>tag</input>
		<input type="radio" name="<?php echo $this->get_field_name('type'); ?>" value="user"<?php if($instance['type'] == 'user') {echo 'checked';} ?>>user</input>
    </label></p>
		<p>Get your Group/User ID <a href="http://idgettr.com/" target="_blank">here</a> </p>

		<p style="display:none;"><label for="<?php echo $this->get_field_id('numpics'); ?>">Number of images to show: <input style="width: 50px;" id="<?php echo $this->get_field_id('numpics'); ?>" name="<?php echo $this->get_field_name('numpics'); ?>" type="text" value="6" /></label></p>
		<p style="display:none;"><label for="<?php echo $this->get_field_id('numcols'); ?>">Number of columns: <input style="width: 50px;" id="<?php echo $this->get_field_id('numcols'); ?>" name="<?php echo $this->get_field_name('numcols'); ?>" type="text" value="3" /></label></p>
		
		<?php
  }
}
?>