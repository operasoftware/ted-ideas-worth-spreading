(function() {

	var feeds = [];
	var feedsLoaded = false;
	
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
		
		feeds[0] = [];
		feeds[0][0] = xmlFeeds[0].querySelector("image").getAttribute("url");
		feeds[0][1] = xmlFeeds[0].querySelector("subtitle").textContent;
		feeds[0][2] = xmlFeeds[0].querySelector("origLink").textContent;
		
		if(feeds[0][0].replace(/\s/g, "") == "") {
			feeds[0][0] = "img/default.png";
		}
		
		document.getElementById("feeds_container").innerHTML += "<div class='single_feed'><span class='single_feed_img'><img src='" + feeds[0][0] + "' /></span><span class='single_feed_title'>" + feeds[0][1] + "</span></div>";
	
		feedsLoaded = true;
	}
	
	document.addEventListener("DOMContentLoaded", function() {
		getFeedsFromUrl();
		
		window.setTimeout(function() {
			if(feedsLoaded) {
				removeClass("error_container", "active");
				removeClass("loader_container", "active");
				removeClass("splash_screen_container", "active");
				addClass("feeds_container", "active");
				feedsLoaded = false;
			}
			
			if (opera.contexts.speeddial) {
				opera.contexts.speeddial.url = feeds[0][2];
			}
		}, 1500);
		
		window.setInterval(function() {
			
			getFeedsFromUrl();
			
			window.setTimeout(function() {
				if(feedsLoaded) {
					removeClass("error_container", "active");
					removeClass("loader_container", "active");
					removeClass("splash_screen_container", "active");
					addClass("feeds_container", "active");
					feedsLoaded = false;
				}
				
				if (opera.contexts.speeddial) {
					opera.contexts.speeddial.url = feeds[0][2];
				}
			}, 1500);
		
		}, 43200000);
		
	}, false);

}());