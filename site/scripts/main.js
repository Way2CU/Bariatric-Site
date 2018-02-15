/**
 * Main JavaScript
 * Site Name
 *
 * Copyright (c) 2015. by Way2CU, http://way2cu.com
 * Authors:
 */

// create or use existing site scope
var Site = Site || {};

// make sure variable cache exists
Site.variable_cache = Site.variable_cache || {};


/**
 * Check if site is being displayed on mobile.
 * @return boolean
 */
Site.is_mobile = function() {
	var result = false;

	// check for cached value
	if ('mobile_version' in Site.variable_cache) {
		result = Site.variable_cache['mobile_version'];

	} else {
		// detect if site is mobile
		var elements = document.getElementsByName('viewport');

		// check all tags and find `meta`
		for (var i=0, count=elements.length; i<count; i++) {
			var tag = elements[i];

			if (tag.tagName == 'META') {
				result = true;
				break;
			}
		}

		// cache value so next time we are faster
		Site.variable_cache['mobile_version'] = result;
	}

	return result;
};

// Handle dialog properties
function handle_dialog_youtube(event){
	event.preventDefault();
	Site.video_dialog
		.set_title(language_handler.getText(null, 'dialog_video_title'))
		.set_content_from_url($(this).attr('href'))
		.set_size(600, -1)
		.open_when_ready();
};

/**
 * Function called when document and images have been completely loaded.
 */
Site.on_load = function() {
	// Create New caracal dialog object
	Site.video_dialog =  new Caracal.Dialog();

	if(!Site.is_mobile()) {
		// Capture link with class youtube and attach click event
		Site.youtube_link = document.querySelector('a.youtube');
		Site.youtube_link.addEventListener('click',handle_dialog_youtube);
	}

	$('form').on('dialog-show', function() {
		$('form').hide();
		$('div.send').hide();
		var thankyou = "/thankyou" + window.location.search;

		// handle analytics event
		$('form').on('analytics-event', function(event, data) {
			if (!data.error)
				dataLayer.push({
					'event':'leadSent'
				});
			window.location.replace(thankyou);
		});
		return false;
	});
};

// connect document `load` event with handler function
$(Site.on_load);
