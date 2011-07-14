<?php

function check_theme_active() {
 if ((get_option('aqualine_feedburner') == "http://feeds2.feedburner.com/theforgeweb") && (is_admin())) { 
 echo "<div class='error fade'><p>Setup your Aqualine theme options - <a href='".get_bloginfo('url')."/wp-admin/admin.php?page=functions.php'>click here!</a> (This message will disappear once you have updated your RSS feed link)</p></div>";
 }
}
add_action( 'admin_notices', 'check_theme_active' );

$themename = "Aqualine";
$shortname = "aqualine";



$options = array (

array( "name" => "PAGES & CATEGORIES", "type" => "section"),
array( "type" => "open"),

array(  "name" => "Page Setup",
        "desc" => "If you would like to choose which pages are listed in the navigation, simply enter the page IDs separated with commas.",
        "id" => $shortname."_pages",
        "type" => "text",
        "std" => ""),
		
array(  "name" => "Category Setup",
        "desc" => "If you would like to choose which pages are listed in the navigation, simply enter the page IDs separated with commas.",
        "id" => $shortname."_cats",
        "type" => "text",
        "std" => ""), 			

array( "type" => "close"),

array( "name" => "Post Options", "type" => "section"),
array( "type" => "open"),

array(  "name" => "Social Bookmarking?",
        "desc" => "Social Bookmarking for your posts",
        "id" => $shortname."_theme_social",
        "type" => "select",
		"options" => array("YES","NO"),
        "std" => "YES"),
		
array(  "name" => "Show Thumbnail?",
        "desc" => "Display thumbnails for your posts",
        "id" => $shortname."_thumbshow",
        "type" => "select",
		"options" => array("NO","YES"),
        "std" => "NO"), 			
		
array(  "name" => "Display Full Posts?",
        "desc" => "Show full posts instead of excerpts",
        "id" => $shortname."_content",
        "type" => "select",
		"options" => array("NO","YES"),
        "std" => "NO"), 			

array( "type" => "close"),

array( "name" => "Color & Favicon", "type" => "section"),
array( "type" => "open"),

array("name" => "Color",
            "desc" => "Choose a colour for your theme",
            "id" => $shortname."_color",
            "type" => "color-picker",
            "std" => "37EDE8"),	
			
array(  "name" => "Favicon",
        "desc" => "If you have a favicon you'de like to use, upload the icon with the Media Uploader, then paste the full path here.",
        "id" => $shortname."_icon",
        "type" => "text",
        "std" => ""), 					

array( "type" => "close"),

array( "name" => "Twitter & Flickr Settings", "type" => "section"),
array( "type" => "open"),

array(    "name" => "Twitter Account:",
        "desc" => "Don't include the '@'",
        "id" => $shortname."_twittername",
        "std" => "theforgeweb",
        "type" => "text"),
		
array(    "name" => "Number of tweets to display?",
        "desc" => "",
        "id" => $shortname."_twittercount",
        "std" => "5",
        "type" => "text"),
		
array(    "name" => "Flickr ID:",
        "desc" => "Get your Flickr ID from <a href='http://idgettr.com/' target='_blank'>idGettr</a>",
        "id" => $shortname."_flickrname",
        "std" => "45121347@N05",
        "type" => "text"),		

array( "type" => "close"),

array( "name" => "Social Groups", "type" => "section"),
array( "type" => "open"),

array(    "name" => "Twitter:",
        "desc" => "Fill in the full link. Eg. http://www.twitter.com/theforgeweb/",
        "id" => $shortname."_twitter",
        "std" => "#",
        "type" => "text"),

array(    "name" => "Facebook:",
        "desc" => "Fill in the full link.",
        "id" => $shortname."_facebook",
        "std" => "#",
        "type" => "text"),

array(    "name" => "Flickr:",
        "desc" => "Fill in the full link.",
        "id" => $shortname."_flickr",
        "std" => "#",
        "type" => "text"),

array(    "name" => "Last.fm:",
        "desc" => "Fill in the full link.",
        "id" => $shortname."_lastfm",
        "std" => "#",
        "type" => "text"),
		
array(    "name" => "LinkedIn:",
        "desc" => "Fill in the full link.",
        "id" => $shortname."_linkedin",
        "std" => "#",
        "type" => "text"),

array( "type" => "close"),

array( "name" => "Analytics & Feeds", "type" => "section"),
array( "type" => "open"),
	
array(    "name" => "Feedburner:",
        "desc" => "Insert Feedburner Link",
        "id" => $shortname."_feedburner",
        "std" => "http://feeds2.feedburner.com/theforgeweb",
        "type" => "text"),

array(    "name" => "Feedburner Email:",
        "desc" => "Insert Feedburner email link. Leave textfield blank to exclude.",
        "id" => $shortname."_feedburner_email",
        "std" => "http://feedburner.google.com/fb/a/mailverify?uri=theforgeweb&amp;loc=en_US",
        "type" => "text"),

array(    "name" => "Google Analytics Code:",
        "desc" => "Insert your Google Analytics tracking code.",
        "id" => $shortname."_analytics",
        "std" => "",
        "type" => "textarea"),		
	
array( "type" => "close"),
 
);

//Widgetized Footer
if ( function_exists('register_sidebar') ) {
 register_sidebar(array(
  'name' => 'Footer 1',
  'before_widget' => '',
  'after_widget' => '</li>',
  'before_title' => '<div class="widgethead">',
  'after_title' => '</div>',
 ));

}

if ( function_exists('register_sidebar') ) {
 register_sidebar(array(
  'name' => 'Footer 2',
  'before_widget' => '',
  'after_widget' => '</li>',
  'before_title' => '<div class="widgethead">',
  'after_title' => '</div>',
 ));

}

//Get the First Image
function catch_that_image() {
global $post, $posts;
$first_img = '';
$url = get_bloginfo('url');
ob_start();
ob_end_clean();
$output = preg_match_all('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $post->post_content, $matches);
$first_img = $matches [1] [0];

$not_broken = @fopen("$first_img","r"); // checks if the image exists
if(empty($first_img) || !($not_broken)){ //Defines a default image
unset($first_img);
} else {
$first_img = str_replace($url, '', $first_img);
}
return $first_img;
}

function new_excerpt_more($more) {
	return ' ...';
}
add_filter('excerpt_more', 'new_excerpt_more');


function pagination( $query, $baseURL ) {
	// archive test
	if (is_category()) { $cat_name = single_cat_title("", false); $baseURL = $baseURL . "/category/" . $cat_name; }
	if (is_tag()) { $tag_name = single_tag_title("", false); $baseURL = $baseURL . "/tag/" . $tag_name; }
	if (is_day()) { $day_name = get_the_time('Y'). "/" . get_the_time('n') . "/" . get_the_time('j'); $baseURL = $baseURL . "/" . $day_name; }
	if (is_month()) { $month_name = get_the_time('Y'). "/" . get_the_time('n'); $baseURL = $baseURL . "/" . $month_name; }
	if (is_year()) { $year_name = get_the_time('Y'); $baseURL = $baseURL . "/" . $year_name; }
	if (is_author()) { $author_name = get_the_author(); $baseURL = $baseURL . "/author/" . $author_name; }
	// ==
	$page = $query->query_vars["paged"];
	if ( !$page ) $page = 1;
	$qs = $_SERVER["QUERY_STRING"] ? "?".$_SERVER["QUERY_STRING"] : "";
	// Only necessary if there's more posts than posts-per-page
	if ( $query->found_posts > $query->query_vars["posts_per_page"] ) {
		echo '<ul class="paging">';
		// Previous link?
		if ( $page > 1 ) {
			echo '<li class="previous"><a href="'.$baseURL.'/page/'.($page-1).'/'.$qs.'">previous</a></li>';
		}
		// Loop through pages
		for ( $i=1; $i <= $query->max_num_pages; $i++ ) {
			// Current page or linked page?
			if ( $i == $page ) {
				echo '<li class="active">'.$i.'</li>';
			} else {
				echo '<li><a href="'.$baseURL.'/page/'.$i.'/'.$qs.'">'.$i.'</a></li>';
			}
		}
		// Next link?
		if ( $page < $query->max_num_pages ) {
			echo '<li><a href="'.$baseURL.'/page/'.($page+1).'/'.$qs.'">next</a></li>';
		}
		echo '</ul>';
	}
}


function mytheme_add_admin() {
global $themename, $shortname, $options;
foreach ($options as $value) {
if (!isset($value['id'])) { include("functions/reset.php"); } 
}
if ( $_GET['page'] == basename(__FILE__) ) {
 
	if ( 'save' == $_REQUEST['action'] ) {
 
		foreach ($options as $value) {
		update_option( $value['id'], $_REQUEST[ $value['id'] ] ); }
 
foreach ($options as $value) {
	if( isset( $_REQUEST[ $value['id'] ] ) ) { update_option( $value['id'], $_REQUEST[ $value['id'] ]  ); } else { delete_option( $value['id'] ); } }
 
	header("Location: admin.php?page=functions.php&saved=true");
die;
 
} 
else if( 'reset' == $_REQUEST['action'] ) {
 
	foreach ($options as $value) {
		delete_option( $value['id'] ); }
		include("functions/reset.php");
		
	header("Location: admin.php?page=functions.php&reset=true");
die;
 
}
}
 
add_menu_page($themename, $themename, 'administrator', basename(__FILE__), 'mytheme_admin');
}

function mytheme_add_init() {
$file_dir=get_bloginfo('template_directory');
wp_enqueue_style("functions", $file_dir."/functions/functions.css", false, "1.0", "all");
wp_enqueue_script("rm_script", $file_dir."/functions/rm_script.js", false, "1.0");
$jscolor_path = get_bloginfo('template_directory') . '/scripts/jscolor/jscolor.js';
wp_enqueue_script('jquery');
wp_enqueue_script('aqualine-jscolor', $jscolor_path, array('jquery', 'jquery-ui-tabs'), '1.1', false);
}



function mytheme_admin() {
 
global $themename, $shortname, $options;
$i=0;
 
if ( $_REQUEST['saved'] ) echo '<div id="message" class="updated fade"><p><strong>'.$themename.' settings saved.</strong></p></div>';
if ( $_REQUEST['reset'] ) echo '<div id="message" class="updated fade"><p><strong>'.$themename.' settings reset.</strong></p></div>';
 
?>
<div class="wrap rm_wrap">
<h2><?php echo $themename; ?> Settings</h2>
 
<div class="rm_opts">
<form method="post">
<?php foreach ($options as $value) {
switch ( $value['type'] ) {
 
case "open":
?>
 
<?php break;
 
case "close":
?>
 
</div>
</div>
<br />

 
<?php break;

case 'color-picker':

    //create_opening_tag($value);
    $color_value = "";
    if (get_option($value['id']) === FALSE) {
        $color_value = $value['std'];
    }
    else {
        $color_value = get_option($value['id']);
    }

    ?><div class="rm_input rm_text"><?php
    echo '<input type="text" id="'.$value['id'].'" name="'.$value['id'].'" value="'.$color_value.'" class="color" />';
    ?></div><?php

break;

 
case "title":
?>
<p>Use the menus below to set up your theme.</p>

 
<?php break;
 
case 'text':
?>

<div class="rm_input rm_text">
	<label for="<?php echo $value['id']; ?>"><?php echo $value['name']; ?></label>
 	<input name="<?php echo $value['id']; ?>" id="<?php echo $value['id']; ?>" type="<?php echo $value['type']; ?>" value="<?php if ( get_settings( $value['id'] ) != "") { echo stripslashes(get_settings( $value['id'])  ); } else { echo $value['std']; } ?>" />
 <small><?php echo $value['desc']; ?></small><div class="clearfix"></div>
 
 </div>
<?php
break;
 
case 'textarea':
?>

<div class="rm_input rm_textarea">
	<label for="<?php echo $value['id']; ?>"><?php echo $value['name']; ?></label>
 	<textarea name="<?php echo $value['id']; ?>" type="<?php echo $value['type']; ?>" cols="" rows=""><?php if ( get_settings( $value['id'] ) != "") { echo stripslashes(get_settings( $value['id']) ); } else { echo $value['std']; } ?></textarea>
 <small><?php echo $value['desc']; ?></small><div class="clearfix"></div>
 
 </div>
  
<?php
break;
 
case 'select':
?>

<div class="rm_input rm_select">
	<label for="<?php echo $value['id']; ?>"><?php echo $value['name']; ?></label>
	
<select name="<?php echo $value['id']; ?>" id="<?php echo $value['id']; ?>">
<?php foreach ($value['options'] as $option) { ?>
		<option <?php if (get_settings( $value['id'] ) == $option) { echo 'selected="selected"'; } ?>><?php echo $option; ?></option><?php } ?>
</select>

	<small><?php echo $value['desc']; ?></small><div class="clearfix"></div>
</div>
<?php
break;
 
case "checkbox":
?>

<div class="rm_input rm_checkbox">
	<label for="<?php echo $value['id']; ?>"><?php echo $value['name']; ?></label>
	
<?php if(get_option($value['id'])){ $checked = "checked=\"checked\""; }else{ $checked = "";} ?>
<input type="checkbox" name="<?php echo $value['id']; ?>" id="<?php echo $value['id']; ?>" value="true" <?php echo $checked; ?> />


	<small><?php echo $value['desc']; ?></small><div class="clearfix"></div>
 </div>
<?php break; 
case "section":

$i++;

?>

<div class="rm_section">
<div class="rm_title"><h3><img src="<?php bloginfo('template_directory')?>/functions/images/trans.png" class="inactive" alt="""><?php echo $value['name']; ?></h3><span class="submit"><input name="save<?php echo $i; ?>" type="submit" value="Save changes" />
</span><div class="clearfix"></div></div>
<div class="rm_options">

 
<?php break;
 
}
}
?>
 
<input type="hidden" name="action" value="save" />
</form>
<form method="post">
<p class="submit">
<input name="reset" type="submit" value="Reset All Options" />
<input type="hidden" name="action" value="reset" />
</p>
</form>
 </div> 
 

<?php
}
?>
<?php
add_action('admin_init', 'mytheme_add_init');
add_action('admin_menu', 'mytheme_add_admin');
?>
