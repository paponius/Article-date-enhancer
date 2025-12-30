/**
 * Shows video date
 * 
 * todo:
 * The A), B) and a bit of mess with data variable:
 * This script might show date and nothing more, but there could be some other useful info,
 * A) only show creation time, B) collect more info.
 * With B), data would be: [ { label: 'TEXT', value: COLLECTED_VALUE } ]
 * and will be passed directly to createPanelElement, which would create elements accordingly for label and value
 */

// should be outside of the isolation function, so DEBUG can be used in functions of script files included before this one.
var DEBUG = ( GM && GM.info.script.name.indexOf('DEBUG') !== -1 ) ? -1 : false;
// optional line
var DEBUG = ( GM && GM.info.script.name.split('DEBUG:')[1]?.substring(0,1)) || DEBUG;
var LOG = DEBUG || (GM && GM_info.script.name.includes('LOG'));
if (DEBUG == 's') { debugger; } // stop at beginning

(function() {
'use strict';

function createPanelElement(data) {
	//////
	/// Hook to site
	//
	// For logged-in layout. This selector targets toolbar elements on all slides, but querySelector returns only first, the current
	var elSiteToolbarLoggedIn = document.querySelector('[role="main"] [data-visualcompletion="ignore-dynamic"] + div');
	//
	// Anonymous
	var elSiteToolbarAnonym = document.querySelector('[role="main"] [aria-label="Previous card"] + div > div:nth-child(2)');
	//
	// another selector: When not fully loaded, there is no [role] and no [data-visualcompletion]
	// but it's useless, as that's a temp and is soon removed.
	// , [style*="x-paddingInlineEnd"] > div:not([class]) + div[class]:has(+ div[class]):not(:has(+ * + *))');
	//////

	var elSiteToolbar;
	var elPanel = document.getElementById('svd');
	if (!elPanel) {
		if (elSiteToolbarLoggedIn) {
			elSiteToolbar = elSiteToolbarLoggedIn;
			// elSiteToolbar.style.cssText += 'margin-top: 26px; height: 95%;';
		} else if (elSiteToolbarAnonym) {
			elSiteToolbar = elSiteToolbarAnonym;
			elSiteToolbar.style.cssText += 'margin-top: 26px; height: 95%;';
		} else { throw 'Can not find hook element. Check elSiteToolbar value'; }
		elSiteToolbar.style.cssText += 'flex-direction: column; justify-content: space-between;';

		elPanel = document.createElement('DIV');
		elPanel.id = 'svd';
		elPanel.style.cssText = 'border: 1px solid #ccc;';
		elPanel.style.cssText = `
				border: 1px solid #ccc;
				font-size: 12px;
				padding: 3px;
				background-color: #231b1b;
				color: #ccc;
				max-width: 64px;
				place-self: center;
				
			`;
	} else { elPanel.innerHTML = ''; }

	data.forEach( line => {
		elPanel.innerHTML += line + '<br>';
	});

	elSiteToolbar.insertBefore(elPanel, elSiteToolbar.firstChild);
}


function timeToLocale(timestamp) {
	return new Date(timestamp * 1000).toLocaleString();
}


function processJSONFromPage() {
	var time;
	var id = window.location.href.split('/').pop();
	var data = {allTS: []}; // B) if searching for more than just a timestamp

	for (const elJSON of document.querySelectorAll('script[type="application/json"]')) {
		let strJSON = elJSON.innerText;
		// skip the element before parsing it (faster?); with DEBUG:o continue, parse and again stringify the JSON to show it prettyfied 
		if (!strJSON.contains('creation_time') && DEBUG != 'o') { continue; }
		let objJSON;

		try {
			objJSON = JSON.parse(strJSON);
		} catch (error) {
			if (LOG) { console.warn('[show_video_date] <script> element contains broken JSON. Element content:', elJSON, strJSON); }
			if (DEBUG) { debugger; }
			continue;
		}

		if (DEBUG == 'o') { // observe all present JSON
			console.log('[show_video_date] JSON contents:', JSON.stringify(objJSON, null, '\t'));
			if (!strJSON.contains('creation_time')) {
				console.log('[show_video_date] The above JSON does not contain creation_time');
				continue;
			}
		}

		function searchObject(obj) {
			for (const prop in obj) {
				let foundData;
				// not searching for key with Object/Array value, can recurse right away
				if (obj[prop] instanceof Object) {
				// if (typeof obj[prop] === 'object') { // typeof would fail positive on null, and instanceof is faster
					foundData = searchObject(obj[prop]); // both Array and Objects
					if (foundData) { return foundData; }
				}
				if (obj instanceof Array) { continue; } // Optional. not interested in Array indexes. will this speed up the search?
				if (prop === "id" && obj[prop] === id) {
					const timestamp = obj.creation_story?.creation_time;

					// if (timestamp) { return timestamp; } // A) only timestamp was searched. end now

					data.timestamp = timestamp; // B)
					// debugger;
				}
				if (prop === "creation_time") {
					data.allTS.push(obj[prop]);
					// if (DEBUG) { debugger; }
				}
			}
			return false;
		}
		searchObject(objJSON); // B)
		time = data.timestamp; // B)

		// time = searchObject(objJSON); // A) when searching only for timestamp
		// if (time) { break; } // A)
		// if (DEBUG) { debugger; }
	}
	// if (DEBUG) { debugger; }
	if (time) {
		data.allTS.shift(); // that's the same as in time
		let panelTxt = [ 'Created:', timeToLocale(time), 'some dates:'].concat(data.allTS.map(item => timeToLocale(item)));
		createPanelElement(panelTxt);
	} else if (LOG) {
		console.error('[show_video_date] Could not find time for video ID (last part of this URL)', window.location.href);
	}
}


// todo replace by observer
// Monitor URL changes by checking periodically
let lastUrl = window.location.href;
setInterval(() => {
	const currentUrl = window.location.href;
	if (currentUrl !== lastUrl) {
		console.log(`URL changed from ${lastUrl} to ${currentUrl}`);
		lastUrl = currentUrl;
		processJSONFromPage();
	}
}, 5000);


// temp delay. needed for the hook element on site to appear. observer will solve that later.
setTimeout(processJSONFromPage, 2000);

})();
