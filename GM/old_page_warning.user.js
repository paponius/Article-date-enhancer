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
// @name           Old page warning and more date details
// @namespace      https://github.com/paponius/
// @description    Warn about old article, like The Guardian (https://www.theguardian.com/us-news/2025/feb/25/msnbc-layoffs-rachel-maddow). Also add more date info
// @author         papo
// @version        1.1.2
// @license        GPLv2
// @icon           https://archive.org/offshoot_assets/favicon.ico

// v1.0 2025-04-07
// v1.1 2025-12

// @match        https://*.nytimes.com/*
// @match        https://*.cnn.com/*
// @match        https://*.politico.eu/*
// @match        https://*.politico.com/*
// @match        https://*.reuters.com/*
// @match        https://*.bbc.com/*
// @match        https://*.bbc.co.uk/*

// @run-at document-idle

//// PERMISSIONS
// @grant          none

//// PROJECT FILES
// @require        https://github.com/paponius/UserScripts-papo/raw/master/src/old_page_warning.js?v0.9

// @noframes
// UserScript will not run in iFrames

// ==/UserScript==
