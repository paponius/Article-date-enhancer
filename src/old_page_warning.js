

// should be outside of the isolation function, so DEBUG can be used in functions of script files included before this one.
var DEBUG = ( GM && GM.info.script.name.indexOf('DEBUG') !== -1 ) ? -1 : false;
// optional line
var DEBUG = ( GM && GM.info.script.name.split('DEBUG:')[1]?.substring(0,1)) || DEBUG;
var LOG = DEBUG || (GM && GM_info.script.name.includes('LOG'));
if (DEBUG == 's') { debugger; } // stop at beginning


/* BBC has API: e.g. https://www.bbc.co.uk/future/data/site/future/article/... */
(function() {
'use strict';

if (LOG) { console.log('[old_page_warning] START'); }
var dateNow = new Date();
var dateEpochNow = Date.parse(dateNow);
var dateEpochRefOld = dateNow.setMonth(dateNow.getMonth()-1);
var elDate, datePage, dateStr, dateEpochPage, hndInject;

if (DEBUG) { debugger; }

/* 
Common variables inside the switch block:
  declared above `switch`, can be used in `case`:
    must use:	dateEpochPage  [Number] Date of the page
				hndInject      [Function] Handler to run when notice needs injection (or define function inline)
    may use:	elDate         [Element]
				datePage       [String] Raw date of the page
				dateStr        [String] Date of the page, when Raw date is not directly parsable by `new Date`
  declare inside handler function:
				elRef          [HTMLEl] Reference element for notice injection
Template:
	case location.hostname.includes('XXX.com'):
		elDate = document.querySelector('');
		if (!elDate) { console.error("[old_page_warning] Can't find the time element. Selectors failed."); }
		datePage = elDate.getAttribute('datetime');
		--- OR ---
		datePage = elDate.textContent;
		dateEpochPage = Date.parse(datePage);
		checkAge(dateEpochPage, elWarn => {
		--- OR ---
		checkAge(dateEpochPage, elWarn => setTimeout( () => {
			var elRef = document.querySelector('SELECTOR');
			if (!elRef) { console.error("[old_page_warning] Can't find the reference element for injection."); }
			elRef.before(elWarn);
			--- OR ---
			elRef.prepend(elWarn);
			--- OR ---
			elRef.after(elWarn);
			elWarn.after(document.createElement('div'));
		});
		--- OR ---
		}, 3200));
		break;
 */
switch (true) {

	case location.hostname.includes('nytimes.com'):
		// todo: add additional timeout, after the page is processed by a plugin the notice is removed
	   // time datetime="2022-06-13T13:00:07-04:00" class="css-1gu861y e16638kd2"
		datePage = document.querySelector('time[datetime]').getAttribute('datetime');
		// todo: split it to two lines: elDate = 
		// if (!elDate) { console.error("[old_page_warning] Can't find the time element. Selectors failed."); }

		dateEpochPage = Date.parse(datePage);
		hndInject = el => { if (LOG) { console.log('[old_page_warning]', el); } setTimeout(() => {
			var elRef = document.querySelector('article#story h1[data-testid="headline"]');
			if (!elRef) { console.error("[old_page_warning] Can't find the reference element for injection."); }
			elRef.prepend(el);
			el.after(document.createElement('div'));
		}, 3000);};
		checkAge(dateEpochPage, hndInject);
		break;
	case location.hostname.includes('cnn.com'):
		datePage = document.querySelector('.timestamp.vossi-timestamp').textContent;
		// todo: split it to two lines: elDate = 
		// if (!elDate) { console.error("[old_page_warning] Can't find the time element. Selectors failed."); }

		// "    Updated          10:55 PM EDT, Tue March 19, 2024      "
		dateStr = datePage.match(/\s([A-z]+\s[A-z]+\s\d+,\s\d+)/)[1];
		dateEpochPage = Date.parse(dateStr);
		hndInject = function(el) {
			var elRef = document.querySelector('.vossi-headline-text');
			if (!elRef) { console.error("[old_page_warning] Can't find the reference element for injection."); }
			elRef.before(el);
		};
		checkAge(dateEpochPage, hndInject);
		break;
	case location.hostname.includes('politico.eu'):
		datePage = document.querySelector('.article-meta__date-time > .date-time__date').textContent;
		// todo: split it to two lines: elDate = 
		// if (!elDate) { console.error("[old_page_warning] Can't find the time element. Selectors failed."); }

		// February 23, 2025
		dateEpochPage = Date.parse(datePage);
		hndInject = function(el) {
			var elRef = document.querySelector('h1.hero__title');
			if (!elRef) { console.error("[old_page_warning] Can't find the reference element for injection."); }
			elRef.before(el);
		};
		checkAge(dateEpochPage, hndInject);
		break;
	case location.hostname.includes('politico.com'):
		elDate = document.querySelector('.story-meta__updated > time[datetime], .story-meta__timestamp > time[datetime], .article-lead time[datetime]');
		if (!elDate) { console.error("[old_page_warning] Can't find the time element. Selectors failed."); }

		datePage = elDate.getAttribute('datetime');
		dateEpochPage = Date.parse(datePage);
		hndInject = function(el) {
			var elRef = document.querySelector('.media-item--story .headline, .article-lead h1');
			if (!elRef) { console.error("[old_page_warning] Can't find the reference element for injection."); }
			elRef.before(el);
		};
		checkAge(dateEpochPage, hndInject);
		break;
	case location.hostname.includes('reuters.com'):
		// 2509 adding `-module` variants. `[class*="info-content__author-date__"], [class*="info-content-module__author-date__"]` were not found now
		elDate = (document.querySelector(':is([class*="info-content__author-date__"], [class*="info-content-module__author-date__"]) :is([class*="date-line__date___"], [class*="date-line-module__date___"]):not(:last-child)') ||
						  document.querySelector(':is([class*="default-article-header__info-content__"], [class*="default-article-header-module__info-content__"]) :is([class*="date-line__date__"], [class*="date-line-module__date__"]):not(:last-child)')
						 );
		if (!elDate) { console.error("[old_page_warning] Can't find the time element. Selectors failed."); }

		// datePage = document.querySelector('[class*="info-content__author-date__"] [class*="date-line__date___"]:not(:last-child)').textContent;
		datePage = elDate.textContent;
		// February 23, 2025
		dateEpochPage = Date.parse(datePage);
		hndInject = function(el) {
			if (DEBUG) { debugger; }
			var elRef = document.querySelector(':is([class*="default-article-header__heading__"], [class*="default-article-header-module__heading__"]) h1[data-testid="Heading"]');
			if (!elRef) { console.error("[old_page_warning] Can't find the reference element for injection."); }
			elRef.before(el);
			el.after(document.createElement('div'));
			//width: max-content;
		};
		checkAge(dateEpochPage, hndInject);
		break;

	case location.hostname.includes('bbc.co.uk'): {
		if (DEBUG) { debugger; }
		// partially copied from my show_video_date.js
		let elScript, strJSON; // declared before `for`, so it can be used in `console.error`

		// body > script[nonce=""]: "window.__INITIAL_DATA__="{\"data\":{\"global-n ... ";
		for (elScript of document.querySelectorAll('script')) {
			if (!elScript) { continue; }
			const strScript = elScript?.innerText;
			// if (strJSON.substring(0, 24) === 'window.__INITIAL_DATA__=')
			if (strScript.startsWith('window.__INITIAL_DATA__="')) {
				// Best way is to copy the content from orig page, then paste in VSCode and it will show errors.
				// Replace in VSCode what is wrong until it can be prettified. `"` are escaped with triple `\`: {\"text\":\"\\\"I'm in
				// cut out 25 chars from start, 2 from end, put aside triple `\`, remove single `\`, return triple `\` as one
				strJSON = strScript.substring(25, strScript.length - 2).replaceAll('\\\\\\', '~~~').replaceAll('\\"', '"').replaceAll('~~~', '\\');
				if (strJSON.length) { break; }
			}
		}
		let objJSON;
		try {
			objJSON = JSON.parse(strJSON);
		} catch (error) {
			console.error('[old_page_warning] <script> element contains broken JSON. Element content:', elScript, strJSON);
			if (DEBUG) { debugger; }
			// continue;
		}

		let firstPublished = objJSON.stores?.article?.metadata?.firstPublished;
		setTimeout( () => {
			var isPublishUpdated = false;
			var elDate1 = document.querySelector('main#main-content ul[class*="-MetadataStripContainer"] li');
			let lastPublished = objJSON.stores?.article?.metadata?.lastPublished;
			if (lastPublished && lastPublished !== firstPublished) {
				var elDate2 = elDate1.cloneNode(true);
				var elText2 = elDate2.querySelector('time');
				elText2.textContent = 'Last Published: ' + timeToLocale(lastPublished);
				elDate1.after(elDate2);
				isPublishUpdated = true;
			}
			let lastUpdated = objJSON.stores?.article?.metadata?.lastUpdated;
			if (lastUpdated && lastUpdated !== firstPublished && lastUpdated !== lastPublished) {
				var elDate3 = elDate1.cloneNode(true);
				var elText3 = elDate3.querySelector('time');
				elText3.textContent = 'Last Updated: ' + timeToLocale(lastUpdated);
				// elDate2.after(elDate3);
				elDate1.parentNode.appendChild(elDate3);
			}
			if (isPublishUpdated) {
				elDate1.querySelector('time').textContent = 'First Published: ' + timeToLocale(firstPublished);
			} else {
				elDate1.querySelector('time').textContent = 'Published: ' + timeToLocale(firstPublished);
			}
			// if (cntDates === 3) { elDate1.parentNode.style.flexDirection = 'column'; }
		}, 3000);

		checkAge(firstPublished, elWarn => setTimeout( () => {
			// I took this from my Dark UC.
			var elRef = document.querySelector('main#main-content ul[class*="-MetadataStripContainer"] li:last-child');
			if (!elRef) { console.error("[old_page_warning] Can't find the reference element for injection."); }
			elRef.after(elWarn);
			// elWarn.after(document.createElement('div'));
		}, 3000));
		break; }

	case location.hostname.includes('bbc.com'): { // wrap because shares a lot of variable names with the one above, can't use `let` twice
		if (DEBUG) { debugger; }
		// partially copied from my show_video_date.js
		let elScript, strJSON;

		elScript = document.getElementById('__NEXT_DATA__');
		strJSON = elScript?.innerText; // if null continue to show console error

		let objJSON;
		try {
			objJSON = JSON.parse(strJSON);
		} catch (error) {
			console.error('[old_page_warning] <script> element contains broken JSON. Element content:', elScript, strJSON);
			if (DEBUG) { debugger; }
			// continue;
		}

		let firstPublished = objJSON.props?.pageProps?.metadata?.firstPublished;
		let elDate1 = document.querySelector(':where(body > #__next main#main-content > article) :is([data-testid="byline"], [data-testid="byline-new"]) time');
		// on .com layout, this el. is not reloaded twice, can be set right away
		elDate1.textContent = 'Published: ' + timeToLocale(firstPublished);
		setTimeout( () => {
			var isPublishUpdated = false;
			var cntDates = 1;
			var elDate2; // need in second `if`` block too
			let lastPublished = objJSON.props?.pageProps?.metadata?.lastPublished;
			if (lastPublished && lastPublished !== firstPublished) {
				elDate2 = elDate1.cloneNode(true);
				elDate2.textContent = 'Last Published: ' + timeToLocale(lastPublished);
				elDate1.after(elDate2);
				cntDates++;
				isPublishUpdated = true;
			}
			let lastUpdated = objJSON.props?.pageProps?.metadata?.lastUpdated;
			if (lastUpdated && lastUpdated !== firstPublished && lastUpdated !== lastPublished) {
				let elDate3 = elDate1.cloneNode(true);
				elDate3.textContent = 'Last Updated: ' + timeToLocale(lastUpdated);
				// elDate1.parentNode.appendChild(elDate3); // there is share toolbar, can't append last
				if (cntDates === 1) { elDate1.after(elDate3); } else { elDate2.after(elDate3); }
				cntDates++;
			}
			if (isPublishUpdated) { elDate1.textContent = 'First Published: ' + timeToLocale(firstPublished); }

			if (cntDates === 3) { elDate1.parentNode.style.flexDirection = 'column'; }
		}, 3000);

		// setTimeout: the page/or some elements will refresh during loading (great Next design)
		checkAge(firstPublished, elWarn => setTimeout( () => {
			// I took this from my Dark UC.
			var elRef = document.querySelector(':where(body > #__next main#main-content > article) :is([data-testid="byline"], [data-testid="byline-new"]) time:last-of-type');
			if (!elRef) { console.error("[old_page_warning] Can't find the reference element for injection."); }
			elRef.after(elWarn);
			// elWarn.after(document.createElement('div'));
		}, 3200));
		break; }
}

// function addTimeBlock(date, elToClone, selText, text, hndInject) {}

function timeToLocale(timestamp) {
	var date = new Date(timestamp);
	var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'
		// , second: 'numeric', fractionalSecondDigits: 3
	};
	var fmt = new Intl.DateTimeFormat('en-GB', options);
	return fmt.format(date);
}

function checkAge(dateEpochPage, hndInject) {
	// 86400 day, *30 = 2592000
	var ageMonths = Math.round((((dateEpochNow - dateEpochPage) / 1000) / 2592000) * 10) / 10;
	//if (LOG) { console.log('[old_page_warning] oldarticle:',ageMonths,' months',dateEpochPage,dateEpochRefOld); }
	if (dateEpochPage < dateEpochRefOld) {
		//alert('old');
	}
	if (ageMonths < 1) { return; }

	var txtCSS = `.old-article {
	  font-family: GuardianTextSans,"Guardian Text Sans Web","Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif;
	  font-size: 1.0625rem;
	  line-height: 1.3;
	  font-weight: 400;
	  font-style: normal;
	  --source-text-decoration-thickness: 2px;
	  color: #121212;
	  background-color: #FFE500;
	  display: inline-block;
	  padding:
	6px 10px;
		padding-left: 10px;
		/* maybe not here, for all, but per site */
		width: max-content;
	}
	.old-article > strong {
	  font-weight: bold;
	}
	/* on some sites (politico), a style sets svg to be block */
	.old-article > svg {
	  display: inline;
	}
	`;
	var elStyle = document.createElement('style');
	elStyle.type = 'text/css';
	document.head.appendChild(elStyle);
	elStyle.appendChild(document.createTextNode(txtCSS));

	var elWarn = document.createElement('div');
	elWarn.classList.add('old-article');
	elWarn.innerHTML = `This article is more than <strong>${ageMonths} months old</strong>`;
	/* alt:
	elWarn.textContent = `This article is more than `;

	var elStrong = document.createElement('strong');
	elStrong.textContent = `${ageMonths} months old`;
	elWarn.appendChild(elStrong);
	*/
	var elSVG = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	elSVG.setAttribute('width',11);
	elSVG.setAttribute('height',11);
	elSVG.setAttribute('viewBox', '0 0 11 11');
	elSVG.setAttribute('fill', 'currentColor');
	var elPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
	elPath.setAttribute('d','M5.4 0C2.4 0 0 2.4 0 5.4s2.4 5.4 5.4 5.4 5.4-2.4 5.4-5.4S8.4 0 5.4 0zm3 6.8H4.7V1.7h.7L6 5.4l2.4.6v.8z');

	elSVG.appendChild(elPath);
	elWarn.prepend(elSVG);
	// document.body.appendChild(elWarn);
	hndInject(elWarn);
	/*
	<div aria-hidden="true" class="dcr-13832xi"><svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor"><path d="M5.4 0C2.4 0 0 2.4 0 5.4s2.4 5.4 5.4 5.4 5.4-2.4 5.4-5.4S8.4 0 5.4 0zm3 6.8H4.7V1.7h.7L6 5.4l2.4.6v.8z"></path></svg> This article is more than <strong>1 month old</strong></div>
	*/
} // END checkAge()

}());
