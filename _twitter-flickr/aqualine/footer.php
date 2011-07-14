<?php
/**
 * Aqualine Wordpress Theme
 * By The Forge Web Creations: Cape Town Web Designers
 */
?>

<hr />	
</div>

<div id="footer_con">

	<div id="footer">
	
		<div class="footer-widget-1">	
			<!-- begin widgetized footer 1 -->	
		
			
			<?php if ( !function_exists('dynamic_sidebar') || !dynamic_sidebar('Footer 1') ) : ?>		
			
			<div class="widgethead">Flickr Images</div>
				
				<div class="flickr">
				<script type="text/javascript" src="http://www.flickr.com/badge_code_v2.gne?count=4&amp;display=latest&amp;size=m&amp;layout=x&amp;source=user&amp;user=<?php echo get_option('aqualine_flickrname'); ?>"></script>
				</div>
				<?php endif; ?>
	
			
			<!-- end widgetized footer 1 -->			
		</div>
				
		
		<div class="footer-widget-2">
			<!-- begin widgetized footer 2 -->	
		
			
			<?php if ( !function_exists('dynamic_sidebar') || !dynamic_sidebar('Footer 2') ) : ?>		
			
			<div class="widgethead">Latest Tweets</div>
			<ul class="left_blogroll">
			
			<?php
$doc = new DOMDocument();
 
   
 
# load the RSS -- replace 'lylo' with your user of choice
if($doc->load('http://twitter.com/statuses/user_timeline/'.get_option('aqualine_twittername').'.rss')) {    
  //echo "<ul>\n";
 
  # number of <li> elements to display.  20 is the maximum
  $max_tweets = get_option('aqualine_twittercount');    
 
  $i = 1;
  foreach ($doc->getElementsByTagName('item') as $node) {
    # fetch the title from the RSS feed. 
    # Note: 'pubDate' and 'link' are also useful (I use them in the sidebar of this blog)
    $tweet = $node->getElementsByTagName('title')->item(0)->nodeValue;
 
    # the title of each tweet starts with "username: " which I want to remove
    $tweet = substr($tweet, stripos($tweet, ':') + 1);   
 
    # OPTIONAL: turn URLs into links
    $tweet = preg_replace('@(https?://([-\w\.]+)+(:\d+)?(/([\w/_\.]*(\?\S+)?)?)?)@', 
          '<a href="$1">$1</a>', $tweet);
 
    # OPTIONAL: turn @replies into links
    $tweet = preg_replace("/@([0-9a-zA-Z]+)/", 
          "<a href=\"http://twitter.com/$1\">@$1</a>", 
          $tweet);
 
   echo "<li>" . $tweet . "</li>";
 
    if($i++ >= $max_tweets) break;
  }
  //echo "</ul>\n";
} 
?>
					
			</ul>
			
				<?php endif; ?>
			
			
			<!-- end widgetized footer 2 -->		
		</div>
		
		<div class="footer-credit">&copy; <?php bloginfo('name'); ?>.  All rights reserved.


<p>Designed by: <a href="http://www.theforge.co.za" target="_blank" title="Cape Town Web Designers">The Forge Web Creations</a><br /> 
  <a href="http://www.theforge.co.za" target="_blank" title="Cape Town Web Designers">Cape Town Web Designers</a></p>

<div class="forge"><a href="http://www.theforge.co.za" target="_blank" title="Cape Town Web Designers"></a></div>
<!-- please don't delete the credit links. It's all we ask for giving you this cool theme -->
</div>
		
	</div>
	
</div>

<div id="bottom-footer">

	<!-- begin subscribe icons -->
	<div class="subscribe-bott">
		<ul>
			<li class="subscribe-rss"><a href="<?php if (get_option('aqualine_feedburner') == "") { bloginfo('rss_url'); } else { echo get_option('aqualine_feedburner'); } ?>" title="Subscribe via RSS"><img src="<?php bloginfo('template_directory'); ?>/images/rss.gif" alt="Subscribe by Email" /><span>Subscribe by RSS</span></a></li>
			<li class="subscribe-gap"></li>
			<li class="subscribe-email"><?php if (get_option('aqualine_feedburner_email') != "") { ?><a href="<?php echo get_option('aqualine_feedburner_email'); ?>"  title="Subscribe via Email"><img src="<?php bloginfo('template_directory'); ?>/images/email.gif" alt="Subscribe by Email" /><span>Subscribe by Email</span></a><?php } ?></li>
		</ul>
	</div>
	<!-- end subscribe icons -->
	
	<!-- begin page navigation -->
	<ul class="nav">
		<?php wp_list_pages('title_li=' ); ?>
	</ul>
	<!-- end page navigation -->


</div>
<?php echo get_option("aqualine_analytics"); ?>
</body>
</html>
