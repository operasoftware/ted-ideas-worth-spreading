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
		document.getElementById(elementId).className = clsName;
	}
	
	function removeClass(elementId, clsName) {
		var reg = new RegExp("(\\s|^)" + clsName + "(\\s|$)");
		document.getElementById(elementId).className = document.getElementById(elementId).className.replace(reg, "");
	}
	
	function getFeedsFromUrl() {
		removeClass("error_container", "active");
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
		
		if(xmlFeeds == "undefined" || xhrResp.childNodes.length == 0) {
			removeClass("feeds_container", "active");
			removeClass("loader_container", "active");
			removeClass("splash_screen_container", "active");
			addClass("error_container", "active");
			document.getElementById("error_container").innerHTML = "Error!<br /><br />No data retrived. Please check your connection and try again."
			return;
		}
		
		document.getElementById("feeds_container").innerHTML = "<span class='ted_banner'><img src='img/stripe.png' /></span>";
		
		for(var i = 0; i < feedsToRetrive; i++) {
			feeds[i] = [];
			feeds[i][0] = xmlFeeds[i].querySelector("image").getAttribute("url");
			feeds[i][1] = xmlFeeds[i].querySelector("subtitle").textContent;
			feeds[i][2] = xmlFeeds[i].querySelector("origLink").textContent;
			
			if(feeds[i][0].replace(/\s/g, "") == "") {
				feeds[i][0] = "img/default.png";
			}
			
			document.getElementById("feeds_container").innerHTML += "<div class='single_feed'><span class='single_feed_img'><img src='" + feeds[i][0] + "' /></span><span class='single_feed_title'>" + feeds[i][1] + "</span></div>";
		}
		
		feedsLoaded = true;
	}
	
	document.addEventListener("DOMContentLoaded", function() {
		getFeedsFromUrl();

		var j = 0;
		var feedsCntEl = document.getElementById("feeds_container");
		var reg = new RegExp("(\\s|^)active(\\s|$)");
		
		var interval = window.setInterval(function() {
			if(feedsLoaded) {
				removeClass("error_container", "active");
				removeClass("loader_container", "active");
				removeClass("splash_screen_container", "active");
				addClass("feeds_container", "active");
				feedsLoaded = false;
			}
			
			feedsCntEl.children[j+1].className += " active";
			
			if(j == 0 && feedsCntEl.children[feedsToRetrive].className.indexOf("active") != -1) {
				feedsCntEl.children[feedsToRetrive].className = feedsCntEl.children[feedsToRetrive].className.replace(reg, "");
			} else {
				feedsCntEl.children[j].className = feedsCntEl.children[j].className.replace(reg, "");
			}
			
			
			if (opera.contexts.speeddial) {
				opera.contexts.speeddial.url = feeds[j][2];
				//opera.contexts.speeddial.title = "TED: Ideas worth spreading (" + (j + 1) + "/" + feedsToRetrive + ")";
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
						removeClass("error_container", "active");
						removeClass("loader_container", "active");
						removeClass("splash_screen_container", "active");
						addClass("feeds_container", "active");
						feedsLoaded = false;
					}
					
					feedsCntEl.children[j+1].className += " active";
			
					if(j == 0 && feedsCntEl.children[feedsToRetrive].className.indexOf("active") != -1) {
						feedsCntEl.children[feedsToRetrive].className = feedsCntEl.children[feedsToRetrive].className.replace(reg, "");
					} else {
						feedsCntEl.children[j].className = feedsCntEl.children[j].className.replace(reg, "");
					}
					
					if (opera.contexts.speeddial) {
						opera.contexts.speeddial.url = feeds[j][2];
						//opera.contexts.speeddial.title = "TED: Ideas worth spreading (" + (j + 1) + "/" + feedsToRetrive + ")";
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