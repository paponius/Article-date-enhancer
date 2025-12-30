// This is a GreaseMonkey User Script file.
// It contains only the Metadata Block.
// All JavaScript code is in separate files, to make development more portable and easier.
//
// Safety
// Greasy Fork (greasyfork.org) requires that the whole code is in this file, so that user can review what they are installing.
// I do that for simple scripts up to 100 lines long. But I argue that it's not practical for longer scripts.
// And on the contrary, when a program is split into multiple files based on semantic, it's much easier to inspect and understood.
// If someone really want to inspect such longer script, they'll probably do so in DevTools.
// And in GM, external scripts are concatenated together with this file anyway.
//
// Performance
// External JS files (which are included using require Key in metadata) are cached. They are downloaded only once per version change.
//
// Advantage of external files in development
// External JS files can be edited in external IDE. (Code in this file can not) This makes development much easier.
// One file can be Grease Monkey specific, while the rest can be generic. That same files can than be used within a WebExtension.
// v2.0


// ==UserScript==
// @name           Show video date
// @namespace      https://github.com/paponius/
// @description    Show video date, Facebook, Instagram later
// @author         papo
// @version        0.9.0
// @license        GPLv2
// ###icon           https://www.google.com/s2/favicons?sz=64&domain=yyy.yy

// @match          https://www.instagram.com/reel/*
// @match          https://www.facebook.com/reel/*
// YYY match          *://*.yyy.com/yyy/yyy*/*


//// PERMISSIONS
// @grant          none
// ###grant          GM.getValue
// ###grant          GM.setValue
// ###grant          GM.xmlHttpRequest
// ###grant          GM.getResourceUrl
// ###grant          GM.deleteValue
// ###grant          GM.listValues
// ###grant          GM_getValue
// ###grant          GM_setValue
// ###grant          GM_xmlhttpRequest
// ###grant          GM_registerMenuCommand
//
// Add only required permissions. If any is added, "@grant none" must be removed.

// @require        https://github.com/paponius/UserScripts-papo/raw/master/src/show_video_date.js?v0.9

// @noframes
// UserScript will not run in iFrames

// ==/UserScript==
