<?php
/**
 * Aqualine Wordpress Theme
 * By The Forge Web Creations: Cape Town Web Designers
 */
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); ?>>

<head profile="http://gmpg.org/xfn/11">
<meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>" />

<title><?php wp_title('&laquo;', true, 'right'); ?><?php bloginfo('name'); ?></title>
<?php if (get_option('aqualine_icon') != ""){ ?><link rel="SHORTCUT ICON" href="<?php echo get_option('aqualine_icon'); ?>" /><?php } ?>
<link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>" type="text/css" media="screen" />
<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />


<script type="text/javascript" src="<?php bloginfo('template_url'); ?>/scripts/jquery.js"></script>
<script type="text/javascript" src="<?php bloginfo('template_url'); ?>/scripts/nav.js"></script>


<style type="text/css">
body #logo { background-color: #<?php echo get_option("aqualine_color"); ?>; }
.column_right span a { color: #<?php echo get_option("aqualine_color"); ?>; }
.metadata-block a:hover { color: #<?php echo get_option("aqualine_color"); ?>; }
.metadata-block_r a:hover { color: #<?php echo get_option("aqualine_color"); ?>; }
.postmetadata2 a:hover { color: #<?php echo get_option("aqualine_color"); ?>; }
.footer-widget-1 a { color: #<?php echo get_option("aqualine_color"); ?>;}
.footer-widget-2 a { color: #<?php echo get_option("aqualine_color"); ?>;}
.footer-widget-1 img:hover { background-color: #<?php echo get_option("aqualine_color"); ?>;}
.postlinks a { color: #<?php echo get_option("aqualine_color"); ?>;}
.feedback { background-color: #<?php echo get_option("aqualine_color"); ?>;}
.commentlist cite a { color: #<?php echo get_option("aqualine_color"); ?>;}
.thumb-show a:hover { border-bottom: 1px solid #<?php echo get_option("aqualine_color"); ?>; }
.read_more a:hover { background-color: #<?php echo get_option("aqualine_color"); ?>; }
h2.pagetitle { background-color: #<?php echo get_option("aqualine_color"); ?>; }
h3, h3 a, h3 a:visited { background-color: #<?php echo get_option("aqualine_color"); ?>;	}
ul.paging li.active {background:#<?php echo get_option("aqualine_color"); ?>; }
ul.paging li a:hover {background:#<?php echo get_option("aqualine_color"); ?>; }
.nav-cats ul a:hover {background:#<?php echo get_option("aqualine_color"); ?>; }
input.search-go { background-color: #<?php echo get_option("aqualine_color"); ?>; }
#commentform #submit:hover { background-color: #<?php echo get_option("aqualine_color"); ?>; }
.comment_block { color: #<?php echo get_option("aqualine_color"); ?>; }
.reply a:hover { background-color: #<?php echo get_option("aqualine_color"); ?>; }
.commentlist li ul li { border-left-color: #<?php echo get_option("aqualine_color"); ?>; border-bottom-color: #<?php echo get_option("aqualine_color"); ?>; }
</style>

<?php wp_head(); ?>
</head>

<body>
<div id="container">

<div id="header">
	
	
	<ul class="nav right">
			<?php wp_list_pages('sort_column=menu_order&title_li=&include=' . get_option('aqualine_pages')); ?>
	</ul>
	
	
	<div class="subscribe">
		<ul>
			<li><a href="<?php if (get_option('aqualine_feedburner') == "") { bloginfo('rss_url'); } else { echo get_option('aqualine_feedburner'); } ?>"  title="Subscribe via RSS"><img src="<?php bloginfo('template_directory'); ?>/images/rss.gif" alt="Subscribe via RSS" /><span>Subscribe by RSS</span></a></li>
			<li><?php if (get_option('aqualine_feedburner_email') != "") { ?><a href="<?php echo get_option('aqualine_feedburner_email'); ?>" title="Subscribe via Email"><img src="<?php bloginfo('template_directory'); ?>/images/email.gif" alt="Subscribe via email" /><span>Subscribe by Email</span></a><?php } ?></li>
		</ul>
	</div>
	
		
		<div id="logo">
			<h1><a href="<?php echo get_option('home'); ?>/"><?php bloginfo('name'); ?></a></h1>
		</div>
		
		
		
		<div class="search-box">
			<form method="get" action="<?php bloginfo('url'); ?>/">
			<input type="text" size="15" class="search-field" name="s" id="s" value="search" onfocus="if(this.value == 'search') {this.value = '';}" onblur="if (this.value == '') {this.value = 'search';}"/><input type="submit"  value="" class="search-go" />
			</form>
		</div>
		
				
		<div id="social-header">
			<ul class="social-profiles">
				<?php if (get_option('aqualine_twitter') != ""){ ?><li class="social-twitter"><a href="<?php echo get_option('aqualine_twitter'); ?>"></a></li><?php } ?>
				<?php if (get_option('aqualine_facebook') != ""){ ?><li class="social-facebook"><a href="<?php echo get_option('aqualine_facebook'); ?>"></a></li><?php } ?>
				<?php if (get_option('aqualine_flickr') != ""){ ?><li class="social-flickr"><a href="<?php echo get_option('aqualine_flickr'); ?>"></a></li><?php } ?>
				<?php if (get_option('aqualine_lastfm') != ""){ ?><li class="social-lastfm"><a href="<?php echo get_option('aqualine_lastfm'); ?>"></a></li><?php } ?>
				<?php if (get_option('aqualine_linkedin') != ""){ ?><li class="social-linkedin"><a href="<?php echo get_option('aqualine_linkedin'); ?>"></a></li><?php } ?>
			</ul>
		</div>
		
		
			<ul class="nav-cats">
				<?php wp_list_categories('exclude=1&title_li=&include=' . get_option('aqualine_cats') ); ?>
			</ul>
		

		<div class="site-description"><h2 class="description"><?php bloginfo('description'); ?></h2></div>
</div>
<hr />