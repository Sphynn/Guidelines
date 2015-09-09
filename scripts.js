// JavaScript Document

$(document).ready(function(){
	"use strict";

	//$("#Style-Guide").load("Style-Guidelines.html");
	//$("#HTML-Guide").load("HTML_CSS-Guidelines.html");
	//$("#PHP-Guide").load("PHP-Guidelines.html");

	$(".Article").each(function(){
		var Article = $(this);
		var file = $(this).attr("id");
		
		$.ajax({
			async: false,
			type: "GET",
			url: file + ".html",
			dataType: "html"
		})
		.done(function(data){
			Article.html(data).hide().fadeIn('slow');
		})
		.fail(function(){
			Article.html('Failed to load file...').hide().fadeIn('slow');
		});
	});

	$(".Heading:not(:first)").each(function(){
		var Current = $(this);
		var Title = Current.html();
		Current.attr("id", Title);
		var Section = "<a href='#" + Title + "' title='" + Title + "'>" + Title + "</a>";
		var List = '';

		Current.next(".Article").find("h2, h3").each(function(){
			var CurrentH = $(this);
			var Title = CurrentH.html();
			CurrentH.attr("id", Title);
			//var List2 = '';

			//CurrentH.next(".Guide").find("h3").each(function(){
				//var CurrentH2 = $(this);
				//var Title2 = CurrentH2.html();
				//CurrentH2.attr("id", Title2);
				//List2 += "";
			//});

			List += "<li><a href='#" + Title + "' title='" + Title + "'>" + Title + "</a></li>";
		});

		$("#ToC").append("<div class='Col'>" + Section + "<ul>" + List + "</ul></div>");
	});
});





//	$(".FadeIn").fadeTo(0, 0);
//	$(".FadeIn").each(function(index){
//		$(this).delay(100 * index).fadeTo(500, 1);
//	});

//	$("h1, h2, h3").each(function(){
//		var Current = $(this);
//		var Title = Current.html();
//		Current.attr("id", Title);
//		$("#ToC").append("<a href='#" + Title + "' title='" + Title + "'>" + Title + "</a><br>");
//	});

//setTimeout(function(){
//	"use strict";
//
//	$("#ToC").empty();
//	$(".Heading:not(:first)").each(function(){
//		var Current = $(this);
//		var Title = Current.html();
//		Current.attr("id", Title);
//		var Section = "<a href='#" + Title + "' title='" + Title + "'>" + Title + "</a>";
//		var List = '';
//
//		Current.next(".Section").find("h2").each(function(){
//			var CurrentH = $(this);
//			var Title = CurrentH.html();
//			CurrentH.attr("id", Title);
//			List += "<li><a href='#" + Title + "' title='" + Title + "'>" + Title + "</a></li>";
//		});
//
//		$("#ToC").append("<div class='Col'>" + Section + "<ul>" + List + "</ul></div>");
//	});
//}, 10000);