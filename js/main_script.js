(function() {

	var feeds = [];
	var feedsToRetrive = 10;
	var feedsDisplayTime = 5;
	var feedsLoaded = false;
		
	if(widget.preferences.feedsToRetrivePref && widget.preferences.feedsDisplayTimePref){
		feedsToRetrive = widget.preferences.feedsToRetrivePref;
		feedsDisplayTime = widget.preferences.feedsDisplayTimePref;
	}
	
	function addClass(elementId, clsName) {
		document.getElementById(elementId).className += " " + clsName;
	}
	
	function removeClass(elementId, clsName) {
		var reg = new RegExp("(\\s|^)" + clsName + "(\\s|$)");
		document.getElementById(elementId).className = document.getElementById(elementId).className.replace(reg, "");
	}
	
	function getFeedsFromUrl() {
		removeClass("feeds_container", "active");
		addClass("splash_screen_container", "active");
		addClass("loader_container", "active");
	
		var xhr = new XMLHttpRequest();
		
		xhr.open("GET", "http://feeds.feedburner.com/operaExtension", true);
		
		xhr.onreadystatechange = function() {
			if (this.readyState == 4) {
				parseRetrievedFeeds(this.responseXML);
			}
		}
		
		xhr.send(null);
	}

	function parseRetrievedFeeds(xhrResp) {
		var xmlFeeds = xhrResp.querySelectorAll("item, entry");
		
		if(xmlFeeds.length == 0) {
			document.getElementById("error_container").innerHTML = "No data retrived."
			return;
		}
		
		for(var i = 0; i < feedsToRetrive; i++) {
			feeds[i] = [];
			feeds[i][0] = "<div class='single_feed'><span class='single_feed_banner'><img src='img/stripe.png' /></span><span class='single_feed_img'><img src='" + xmlFeeds[i].querySelector("image").getAttribute("url") + "' /></span><span class='single_feed_title'>" + xmlFeeds[i].querySelector("subtitle").textContent + "</span></div>";
			feeds[i][1] = xmlFeeds[i].querySelector("origLink").textContent;
			
			//document.getElementById("feeds_container").innerHTML += feeds[i][0];
		}
		
		feedsLoaded = true;
	}
	
	document.addEventListener("DOMContentLoaded", function() {
		getFeedsFromUrl();
		
		var j = 0;
		
		var interval = window.setInterval(function() {
			if(feedsLoaded) {
				removeClass("loader_container", "active");
				removeClass("splash_screen_container", "active");
				addClass("feeds_container", "active");
				feedsLoaded = false;
			}
			document.getElementById("feeds_container").innerHTML = feeds[j][0];
			if (opera.contexts.speeddial) {
				opera.contexts.speeddial.url = feeds[j][1];
				opera.contexts.speeddial.title = "TED: Ideas worth spreading (" + (j + 1) + "/" + feedsToRetrive + ")";
			}
			j++;
			if(j == feedsToRetrive) {
				j = 0;
			}
		}, feedsDisplayTime * 1000);
		
		opera.extension.onmessage = function(event) {
			if(event.data === "TED_MSG_PREFS_CHANGED") {			
				if(widget.preferences.feedsToRetrivePref && widget.preferences.feedsDisplayTimePref){
					feedsToRetrive = widget.preferences.feedsToRetrivePref;
					feedsDisplayTime = widget.preferences.feedsDisplayTimePref;
					
					getFeedsFromUrl();
				}
			
				window.clearInterval(interval);
				
				j = 0;
				
				interval = window.setInterval(function() {
					if(feedsLoaded) {
						removeClass("loader_container", "active");
						removeClass("splash_screen_container", "active");
						addClass("feeds_container", "active");
						feedsLoaded = false;
					}				
					document.getElementById("feeds_container").innerHTML = feeds[j][0];
					if (opera.contexts.speeddial) {
						opera.contexts.speeddial.url = feeds[j][1];
						opera.contexts.speeddial.title = "TED: Ideas worth spreading (" + (j + 1) + "/" + feedsToRetrive + ")";
					}
					j++;
					if(j == feedsToRetrive) {
						j = 0;
					}
				}, feedsDisplayTime * 1000);
			}
		}
		
	}, false);

}());