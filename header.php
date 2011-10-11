<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8 />
<title><?php bloginfo('name'); ?></title>

<link rel="shortcut icon" href="favicon.ico" >

<link rel="stylesheet" media="screen" href="<?php bloginfo('template_url')?>/css/style.css" />

<!--[if lte IE 9]>
<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>

<link rel="stylesheet" media="screen" href="<?php bloginfo('template_url')?>/css/ie.css" />
<![endif]-->

<?php wp_head(); ?>
</head>

<?php echo is_single() || is_page() || is_search() ? "<body class='single'>" : "<body>"; ?>

<header>
<div class="top">
<div class="top-content">

<nav>
<?php wp_nav_menu( array( 'theme_location' => 'primary' ) ); ?>
</nav>

<div class="block">

<p><a href="<?php bloginfo('rss2_url'); ?>">Grab our feeds</a></p>

<form id="search" action="<?php get_option('home') ?>" method="get">
<input name="s" id="s" class="search_input" placeholder="Search...">
<input type="submit" class="search_submit" value="Go">
</form>

</div><!-- .block -->

</div><!-- .top-content -->
</div><!-- .top -->

<div class="logo">
<a href="<?php bloginfo('url'); ?>"><h1 class="notext"><?php bloginfo('name'); ?></h1></a>
<p><?php bloginfo ('description'); ?></p>
</div><!-- .logo -->