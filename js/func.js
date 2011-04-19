// -- Cufon ----------------------------------- 

Cufon.replace('h3, h4, .twitter p.cufon, .top-content li');
Cufon.replace('.cat li a, .links li a', {hover: 'true', textDecoration:'underline'});
Cufon.replace('h2');

// -- slidejs ------------------------------- 

			$(function(){
				$('#slider').slides({
					preload: true,
					preloadImage: 'css/img/loading.gif',
					effect: 'slide, fade',
					crossfade: true,
					slideSpeed: 350,
					fadeSpeed: 500,
					generateNextPrev: false,
					generatePagination: false
				});
			});
			
			
// -- Flickr Feed ----------------------------- 

// Don't execute any code until the DOM is ready!
$(document).ready(function(){					

	// Our very special jQuery JSON fucntion call to Flickr, gets details of the most recent 20 images			   
	$.getJSON("http://api.flickr.com/services/feeds/groups_pool.gne?id=34778850@N00&lang=en-us&format=json&jsoncallback=?", displayImages);

function displayImages(data) {

    // Start putting together the HTML string
    var htmlString = "";	
    
    // Now start cycling through our array of Flickr photo details
    $.each(data.items, function(i,item){
    
        // I only want the ickle square thumbnails
        var sourceSquare = (item.media.m).replace("_m.jpg", "_s.jpg");
        
        // Here's where we piece together the HTML
        htmlString += '<li><a href="' + item.link + '" target="_blank">';
        htmlString += '<img title="' + item.title + '" src="' + sourceSquare;
        htmlString += '" alt="'; htmlString += item.title + '" />';
        htmlString += '</a></li>';
        
        // Returns the last 6 images
    		if ( i == 5 ) return false;
    });
    
    // Pop our HTML in the flickr class DIV
    $('.flickr ul').html(htmlString);
    
    // Close down the JSON function call
}

// The end of our jQuery function	
});

// -- twitterjs ------------------------------- 

getTwitters('twitter', { 
			  id: 'tatygrassini', // Here's where you type your Twitter ID
			  count: 1, 
			  enableLinks: true, 
			  ignoreReplies: true, 
			  clearContents: true,

			  template: '<p><em>&ldquo;%text%&rdquo;</em></p> <p class="cufon"><a href="http://twitter.com/%user_screen_name%/statuses/%id%/">%time%</a> <br />From&nbsp;%source%</p> <h4><a href="http://twitter.com/%user_screen_name%/">Follow us on Twitter!</a></h4>',

				callback: function() {
		          Cufon.replace('p.cufon, h4'); // This hack helps styling Twitter texts with Cufón
		        }
			});