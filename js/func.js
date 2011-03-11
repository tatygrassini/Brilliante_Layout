Cufon.replace('h3, h4, .twitter p.cufon, .top-content li');

Cufon.replace('.cat li a, .links li a', {hover: 'true', textDecoration:'underline'});

Cufon.replace('h2');


// Flickr Feed

// Don't execute any code until the DOM is ready!
$(document).ready(function(){					

	// Our very special jQuery JSON fucntion call to Flickr, gets details of the most recent 20 images			   
	$.getJSON("http://api.flickr.com/services/feeds/groups_pool.gne?id=998875@N22&lang=en-us&format=json&jsoncallback=?", displayImages);

	function displayImages(data) {																																   
		// Randomly choose where to start. A random number between 0 and the number of photos we grabbed (20) minus 9 (we are displaying 9 photos).
		var iStart = Math.floor(Math.random());	

		// Reset our counter to 0
		var iCount = 0;								

		// Start putting together the HTML string
		var htmlString = "<ul>";					

		// Now start cycling through our array of Flickr photo details
		$.each(data.items, function(i,item){

			// Let's only display 9 photos (a 3x3 grid), starting from a random point in the feed					
			if (iCount > iStart && iCount < (iStart + 7)) {

				// I only want the ickle square thumbnails
				var sourceSquare = (item.media.m).replace("_m.jpg", "_s.jpg");		

				// Here's where we piece together the HTML
				htmlString += '<li><a href="' + item.link + '" target="_blank">';
				htmlString += '<img src="' + sourceSquare + '" alt="' + item.title + '" title="' + item.title + '"/>';
				htmlString += '</a></li>';
			}
			// Increase our counter by 1
			iCount++;
		});		

	// Pop our HTML in the #images DIV	
	$('.flickr').html("<h2 class='notext-footer txt-flickr'>Watch us on flickr</h2>" + htmlString + "</ul>");

	// Close down the JSON function call
	}

// The end of our jQuery function	
});


