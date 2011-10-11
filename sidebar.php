<aside>
<ul class="sidebar">
<?php if (dynamic_sidebar('sidebar')) : else : ?>

<li class="sidebar-widget">
<div class="sidebar-widget">
<h2><span>Author</span></h2>
<img class="avatar" width="99" height="99" alt="Mahmoud Khaled" src="http://1.gravatar.com/avatar/beb66a755ea479a2f10fc19c7c29c054?s=99&d=Gravatar+Logo&r=G">
<h4>Mahmoud Khaled</h4>
<p><em>Web &amp; Graphics Designer</em></p>
<p>Sectetur adipisicing elit, sf sed dos eiusmod tempor incididunt utto po Web and graphics designer!</p>
</div>
</li>

<li class="sidebar-widget">
<div class="sidebar-widget">
<h2><span>Categories</span></h2>
<ul>
<?php wp_list_categories('title_li='); ?>
</ul>
</div>
</li>

<li class="sidebar-widget">
<div class="sidebar-widget">
<h2><span><?php _e( 'Meta', 'brilliante_layout' ); ?></span></h2>
<ul>
<?php wp_register(); ?>
<li><?php wp_loginout(); ?></li>
<?php wp_meta(); ?>
</ul>
</div>
</li>

<?php endif; ?>
</ul>
</aside>
</div><!-- #content -->