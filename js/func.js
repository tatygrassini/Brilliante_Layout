// -- Cufon ----------------------------------- 

Cufon.replace('h3, h4, .footer-content .time-meta, .footer-content .from-meta, .top-content li');
Cufon.replace('span.bio-title', {hover: 'true', textDecoration:'underline'});
Cufon.replace('h2');
Cufon.replace('.footer-widget h2', {letterSpacing: '-0.5px'}); // Another shitty CSS hack
Cufon.replace('li.sidebar-widget a:not(.recentcomments a,li.sidebar-widget a.rsswidget)');
Cufon.replace('#wp-calendar caption');
Cufon.replace('tbody');
Cufon.replace('.footer-content li a:not(.footer-content ul li span.entry-content a)');
Cufon.replace('.blogroll a)');

// -- slidejs -------------------------------
// CHANGE THE preloadImage VALUE TO YOUR ABSOLUTE THEME URL
$(function(){$('#slider').slides({preload:true,preloadImage:'http://brillante-layout.com/wp-content/themes/brilliante_layout/css/img/loading.gif',play:5000,effect:'fade',crossfade:true,slideSpeed:350,fadeSpeed:500,generateNextPrev:false,generatePagination:false});});

// FEEL FREE TO DELETE THE FOLLOWING CODE, ONCE YOU PLACE YOUR THREE WIDGETS ON THE FOOTER AREA
// -- Flickr Feed ----------------------------- 
$(function(){$.getJSON("http://api.flickr.com/services/feeds/groups_pool.gne?id=34778850@N00&lang=en-us&format=json&jsoncallback=?",displayImages);function displayImages(data){var htmlString="";$.each(data.items,function(i,item){var sourceSquare=(item.media.m).replace("_m.jpg","_s.jpg");htmlString+='<li><a href="'+item.link+'" target="_blank">';htmlString+='<img style="border: 3px solid #646464;margin: 0 10px 10px 0;height: 74px;width: 74px;overflow: hidden;float:left;" title="'+item.title+'" src="'+sourceSquare;htmlString+='" alt="';htmlString+=item.title+'" />';htmlString+='</a></li>';if(i==5)return false});$('ul.flickr').html(htmlString)}});
