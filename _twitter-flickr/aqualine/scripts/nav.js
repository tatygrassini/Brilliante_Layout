
$(document).ready(function() {
		$(".nav ul").css({display: "none"}); // Opera Fix 
		$(".nav li").hover(function(){ 
		$(this).find('ul:first').css({visibility: "visible",display: "none"}).stop(true,true).slideDown(200); },function(){ $(this).find('ul:first').slideUp(200); }); 
	});	
	


$(document).ready(function() {
		$(".nav-cats ul").css({display: "none"}); // Opera Fix 
		$(".nav-cats li").hover(function(){ 
		$(this).find('ul:first').css({visibility: "visible",display: "none"}).stop(true,true).slideDown(200); },function(){ $(this).find('ul:first').slideUp(200); }); 
	});	