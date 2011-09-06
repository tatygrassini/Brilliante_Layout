<!DOCTYPE html>
	<html>
		<head>
			<meta charset=utf-8 />
			<title><?php bloginfo('name'); ?></title>
			
			<link rel="shortcut icon" href="favicon.ico" >
		
			<link rel="stylesheet" media="screen" href="<?php bloginfo('stylesheet_url')?>" />
			
			<!--[if lte IE 9]>
				<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
				
				<link rel="stylesheet" media="screen" href="<?php bloginfo('template_url')?>/css/ie.css" />
			<![endif]-->
			
			<?php wp_head(); ?>
		</head>

		<?php echo is_single() || is_page() || is_search() ? "<body class='single'>" : "<body>"; ?>

		<body>
			<header>
				<div class="top">
					<div class="top-content">
						
						<nav>
							<?php wp_nav_menu( array( 'theme_location' => 'primary' ) ); ?>
						</nav>

						<div class="block">
							
							<p><a href="<?php bloginfo('rss2_url'); ?>">Grab our feeds</a></p>
							
					<!-- TODO: WP searchform here -->
							
							<form id="search" action="<?php get_option('home') ?>" method="get">
	            	<input name="s" id="s" class="search_input"  placeholder="Search...">
	            	<input type="submit" class="search_submit" value="Go">
	            </form>
	
					<!-- TODO: eof WP searchform here -->
						</div><!-- .block -->
					
					</div><!-- .top-content -->
				</div><!-- .top -->
				
				<div class="logo">
					<a href="<?php bloginfo('url'); ?>"><h1 class="notext"><?php bloginfo('name'); ?></h1></a>
					<p><?php bloginfo ('description'); ?></p>
				</div><!-- .logo -->
				
				<div class="featured">
					<div id="slider">
	            <div class="slides_container">
                <a href="#"><img src="<?php bloginfo('template_url')?>/css/img/feat1.jpg" width="599" height="251" alt="" /></a>
								<a href="#"><img src="<?php bloginfo('template_url')?>/css/img/feat2.jpg" width="599" height="251" alt="" /></a>
								<a href="#"><img src="<?php bloginfo('template_url')?>/css/img/feat3.jpg" width="599" height="251" alt="" /></a>
	            </div><!-- .slides_container -->
							
							
							<div class="description">
								<h3>It’s Brilliant!</h3>
								<p>Brilliante, Lorem ipsum dolor sit amet, con-<br />sectetur adipisicing elit, sf sed dos eiusmod lorem ipsum dolot sit amto. It is brillaint!</p>
							</div>
							
							<ul class="pagination">
								<li><a href="#"><img src="<?php bloginfo('template_url')?>/css/img/feat1_thumb.jpg" width="71" height="59" alt=""></a></li>
								<li><a href="#"><img src="<?php bloginfo('template_url')?>/css/img/feat2_thumb.jpg" width="71" height="59" alt=""></a></li>
								<li class="last"><a href="#"><img src="<?php bloginfo('template_url')?>/css/img/feat3_thumb.jpg" width="71" height="59" alt=""></a></li>
							</ul><!--.pagination-->
					</div><!-- slider -->
					
					<p class="button"><a href="#">Hire us</a></p>
					
				</div><!-- .featured -->
				
			</header>