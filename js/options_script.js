window.addEventListener("DOMContentLoaded", function() {
	
	var videosToRetrive = document.getElementById("videos_to_fetch");
	var videosDisplayTime = document.getElementById("thumb_display_time");
	var savePrefsBtn = document.getElementById("save_preferences");
	
	if(widget.preferences.feedsToRetrivePref && widget.preferences.feedsDisplayTimePref){
		videosToRetrive.value = widget.preferences.feedsToRetrivePref;
		videosDisplayTime.value = widget.preferences.feedsDisplayTimePref;
	}
	
	videosToRetrive.addEventListener("change", function() {
		savePrefsBtn.removeAttribute("disabled");
	}, false);
	
	videosDisplayTime.addEventListener("change", function() {
		savePrefsBtn.removeAttribute("disabled");
	}, false);
	
	savePrefsBtn.addEventListener("click", function() {
		if((videosToRetrive && videosDisplayTime) && (videosToRetrive.value.replace(/\s/g, "") != "" && videosDisplayTime.value.replace(/\s/g, "") != "")) {
			if(!isNaN(videosToRetrive.value) && !isNaN(videosDisplayTime.value)) {
				if(videosToRetrive.value <= 100 && videosToRetrive.value > 0 && videosDisplayTime.value > 0) {
					widget.preferences.feedsToRetrivePref = videosToRetrive.value;
					widget.preferences.feedsDisplayTimePref = videosDisplayTime.value;
					savePrefsBtn.setAttribute("disabled", "disabled");
					
					opera.extension.postMessage('TED_MSG_PREFS_CHANGED');
				} else {
						videosToRetrive.value = widget.preferences.feedsToRetrivePref;
						videosDisplayTime.value = widget.preferences.feedsDisplayTimePref;
						savePrefsBtn.setAttribute("disabled", "disabled");
				}
			} else {
				videosToRetrive.value = widget.preferences.feedsToRetrivePref;
				videosDisplayTime.value = widget.preferences.feedsDisplayTimePref;
				savePrefsBtn.setAttribute("disabled", "disabled");
			}
		} else {
			videosToRetrive.value = widget.preferences.feedsToRetrivePref;
			videosDisplayTime.value = widget.preferences.feedsDisplayTimePref;
			savePrefsBtn.setAttribute("disabled", "disabled");
		}
	}, false);
	
}, false);