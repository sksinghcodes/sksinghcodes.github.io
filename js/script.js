$(document).ready(function(){
	$(".nav-toggle-button").click(function(){
		$(".nav-toggle-button").toggleClass("active");
		$("nav").slideToggle();
		console.log("clicked");
	});

	console.log("connected");
});
