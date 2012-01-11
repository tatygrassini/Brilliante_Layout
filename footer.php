<footer>
<div class="footer-content">

<div class="footer-widget footer-first">
<?php if (dynamic_sidebar('footer1')) : else : ?>
<h2>Links</h2>
<ul>
<?php wp_list_bookmarks('title_li=&categorize=0&limit=6'); ?>
</ul>
<?php endif; ?>
</div>

<div class="footer-widget footer-second">
<?php if (dynamic_sidebar('footer2')) : else : ?>
<h2>Watch us on flickr</h2>
<ul class="flickr">
<!-- Pulling data from Flickr API with JSON and jQuery -->
</ul>
<?php endif; ?>
</div>

<div class="footer-widget footer-third last">
<?php if (dynamic_sidebar('footer3')) : else : ?>
<h2>Tweet tweet!</h2>
<div id="twitter">

<?php if(get_option('brilliante_layout_twitter_user')!=""){ ?>

      
<script src="//code.jquery.com/jquery-latest.js"></script>

<script>
typeof getTwitters!="function"&&function(){var a={},b=0;!function(a,b){function m(a){l=1;while(a=c.shift())a()}var c=[],d,e,f=!1,g=b.documentElement,h=g.doScroll,i="DOMContentLoaded",j="addEventListener",k="onreadystatechange",l=/^loade|c/.test(b.readyState);b[j]&&b[j](i,e=function(){b.removeEventListener(i,e,f),m()},f),h&&b.attachEvent(k,d=function(){/^c/.test(b.readyState)&&(b.detachEvent(k,d),m())}),a.domReady=h?function(b){self!=top?l?b():c.push(b):function(){try{g.doScroll("left")}catch(c){return setTimeout(function(){a.domReady(b)},50)}b()}()}:function(a){l?a():c.push(a)}}(a,document),window.getTwitters=function(c,d,e,f){b++,typeof d=="object"&&(f=d,d=f.id,e=f.count),e||(e=1),f?f.count=e:f={},!f.timeout&&typeof f.onTimeout=="function"&&(f.timeout=10),typeof f.clearContents=="undefined"&&(f.clearContents=!0),f.twitterTarget=c,typeof f.enableLinks=="undefined"&&(f.enableLinks=!0),a.domReady(function(a,b){return function(){function f(){a.target=document.getElementById(a.twitterTarget);if(!!a.target){var f={limit:e};f.includeRT&&(f.include_rts=!0),a.timeout&&(window["twitterTimeout"+b]=setTimeout(function(){twitterlib.cancel(),a.onTimeout.call(a.target)},a.timeout*1e3));var g="timeline";d.indexOf("#")===0&&(g="search"),d.indexOf("/")!==-1&&(g="list"),a.ignoreReplies&&(f.filter={not:new RegExp(/^@/)}),twitterlib.cache(!0),twitterlib[g](d,f,function(d,e){clearTimeout(window["twitterTimeout"+b]);var f=[],g=d.length>a.count?a.count:d.length;f=["<ul>"];for(var h=0;h<g;h++){d[h].time=twitterlib.time.relative(d[h].created_at);for(var i in d[h].user)d[h]["user_"+i]=d[h].user[i];a.template?f.push("<li>"+a.template.replace(/%([a-z_\-\.]*)%/ig,function(b,c){var e=d[h][c]+""||"";c=="text"&&(e=twitterlib.expandLinks(d[h])),c=="text"&&a.enableLinks&&(e=twitterlib.ify.clean(e));return e})+"</li>"):a.bigTemplate?f.push(twitterlib.render(d[h])):f.push(c(d[h]))}f.push("</ul>"),a.clearContents?a.target.innerHTML=f.join(""):a.target.innerHTML+=f.join(""),a.callback&&a.callback(d)})}}function c(b){var c=a.enableLinks?twitterlib.ify.clean(twitterlib.expandLinks(b)):twitterlib.expandLinks(b),d="<li>";a.prefix&&(d+='<li><span className="twitterPrefix">',d+=a.prefix.replace(/%(.*?)%/g,function(a,c){return b.user[c]}),d+="</span></li>"),d+='<span className="twitterStatus">'+twitterlib.time.relative(b.created_at)+"</span>",d+='<span className="twitterTime">'+b.text+"</span>",a.newwindow&&(d=d.replace(/<a href/gi,'<a target="_blank" href'));return d}typeof twitterlib=="undefined"?setTimeout(function(){var a=document.createElement("script");a.onload=a.onreadystatechange=function(){typeof window.twitterlib!="undefined"&&f()},a.src="//remy.github.com/twitterlib/twitterlib.js";var b=document.head||document.getElementsByTagName("head")[0];b.insertBefore(a,b.firstChild)},0):f()}}(f,b))}}()
getTwitters('twitter',{id:'<?php echo get_option('brilliante_layout_twitter_user'); ?>',count:1,enableLinks:true,ignoreReplies:true,clearContents:true,template:'<p style="font: italic 15px/23px Georgia,serif;color:#EDEDED;"><em>&ldquo;%text%&rdquo;</em></p> <p style="color:#EDEDED;line-height:23px;" class="cufon"><a href="http://twitter.com/%user_screen_name%/statuses/%id%/">%time%</a> <br />From&nbsp;%source%</p> <h4><a href="http://twitter.com/<?php echo get_option('brilliante_layout_twitter_user'); ?>/">Follow us on Twitter!</a></h4>',callback:function(){Cufon.replace('p.cufon, h4')}});
</script>

<?php } else { ?>

<script>
typeof getTwitters!="function"&&function(){var a={},b=0;!function(a,b){function m(a){l=1;while(a=c.shift())a()}var c=[],d,e,f=!1,g=b.documentElement,h=g.doScroll,i="DOMContentLoaded",j="addEventListener",k="onreadystatechange",l=/^loade|c/.test(b.readyState);b[j]&&b[j](i,e=function(){b.removeEventListener(i,e,f),m()},f),h&&b.attachEvent(k,d=function(){/^c/.test(b.readyState)&&(b.detachEvent(k,d),m())}),a.domReady=h?function(b){self!=top?l?b():c.push(b):function(){try{g.doScroll("left")}catch(c){return setTimeout(function(){a.domReady(b)},50)}b()}()}:function(a){l?a():c.push(a)}}(a,document),window.getTwitters=function(c,d,e,f){b++,typeof d=="object"&&(f=d,d=f.id,e=f.count),e||(e=1),f?f.count=e:f={},!f.timeout&&typeof f.onTimeout=="function"&&(f.timeout=10),typeof f.clearContents=="undefined"&&(f.clearContents=!0),f.twitterTarget=c,typeof f.enableLinks=="undefined"&&(f.enableLinks=!0),a.domReady(function(a,b){return function(){function f(){a.target=document.getElementById(a.twitterTarget);if(!!a.target){var f={limit:e};f.includeRT&&(f.include_rts=!0),a.timeout&&(window["twitterTimeout"+b]=setTimeout(function(){twitterlib.cancel(),a.onTimeout.call(a.target)},a.timeout*1e3));var g="timeline";d.indexOf("#")===0&&(g="search"),d.indexOf("/")!==-1&&(g="list"),a.ignoreReplies&&(f.filter={not:new RegExp(/^@/)}),twitterlib.cache(!0),twitterlib[g](d,f,function(d,e){clearTimeout(window["twitterTimeout"+b]);var f=[],g=d.length>a.count?a.count:d.length;f=["<ul>"];for(var h=0;h<g;h++){d[h].time=twitterlib.time.relative(d[h].created_at);for(var i in d[h].user)d[h]["user_"+i]=d[h].user[i];a.template?f.push("<li>"+a.template.replace(/%([a-z_\-\.]*)%/ig,function(b,c){var e=d[h][c]+""||"";c=="text"&&(e=twitterlib.expandLinks(d[h])),c=="text"&&a.enableLinks&&(e=twitterlib.ify.clean(e));return e})+"</li>"):a.bigTemplate?f.push(twitterlib.render(d[h])):f.push(c(d[h]))}f.push("</ul>"),a.clearContents?a.target.innerHTML=f.join(""):a.target.innerHTML+=f.join(""),a.callback&&a.callback(d)})}}function c(b){var c=a.enableLinks?twitterlib.ify.clean(twitterlib.expandLinks(b)):twitterlib.expandLinks(b),d="<li>";a.prefix&&(d+='<li><span className="twitterPrefix">',d+=a.prefix.replace(/%(.*?)%/g,function(a,c){return b.user[c]}),d+="</span></li>"),d+='<span className="twitterStatus">'+twitterlib.time.relative(b.created_at)+"</span>",d+='<span className="twitterTime">'+b.text+"</span>",a.newwindow&&(d=d.replace(/<a href/gi,'<a target="_blank" href'));return d}typeof twitterlib=="undefined"?setTimeout(function(){var a=document.createElement("script");a.onload=a.onreadystatechange=function(){typeof window.twitterlib!="undefined"&&f()},a.src="//remy.github.com/twitterlib/twitterlib.js";var b=document.head||document.getElementsByTagName("head")[0];b.insertBefore(a,b.firstChild)},0):f()}}(f,b))}}()
getTwitters('twitter',{id:'tatygrassini',count:1,enableLinks:true,ignoreReplies:true,clearContents:true,template:'<p style="font: italic 15px/23px Georgia,serif;color:#EDEDED;"><em>&ldquo;%text%&rdquo;</em></p> <p style="color:#EDEDED;line-height:23px;" class="cufon"><a href="http://twitter.com/%user_screen_name%/statuses/%id%/">%time%</a> <br />From&nbsp;%source%</p> <h4><a href="http://twitter.com/tatygrassini/">Follow us on Twitter!</a></h4>',callback:function(){Cufon.replace('p.cufon, h4')}});
</script>

<?php } ?>

</div>
<?php endif; ?>
</div>
</div><!-- .footer-content -->
</footer>
    
<div id="bottom">
<?php wp_nav_menu( array( 'theme_location' => 'primary', 'link_before' => '&nbsp;|&nbsp;')); ?>
      
<p>Copyright <?php echo date('Y'); ?> &minus; <a href="<?php bloginfo('url'); ?>" title="<?php bloginfo('name'); ?>"><?php bloginfo('name'); ?></a> &minus; All rights reserved</p>
</div><!-- #bottom -->

<script src="//code.jquery.com/jquery-latest.js"></script>
<script src="<?php bloginfo('template_url')?>/js/cufon-yui.js"></script>
<script src="<?php bloginfo('template_url')?>/js/frutiger.font.js"></script>
<script src="<?php bloginfo('template_url')?>/js/slides.min.jquery.js"></script>
<script src="<?php bloginfo('template_url')?>/js/func.js"></script>

<!--[if IE 6]>
<script src="<?php bloginfo('template_url')?>/js/belatedPNG.js"></script>
<script>
  DD_belatedPNG.fix('*');
</script>

<![endif]-->

<script>Cufon.now();</script>
<!-- Google Analytics and other scripts here -->
<?php wp_footer() ?>
    
</body>
</html>