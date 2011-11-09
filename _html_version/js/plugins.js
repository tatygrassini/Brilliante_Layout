/*!
 * jQuery JavaScript Library v1.7
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Thu Nov 3 16:18:21 2011 -0400
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Check for digits
	rdigit = /\d/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context ? context.ownerDocument || context : document );

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.7",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.add( fn );

		return this;
	},

	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.fireWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).unbind( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery.Callbacks( "once memory" );

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNumeric: function( obj ) {
		return obj != null && rdigit.test( obj ) && !isNaN( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw msg;
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array, i ) {
		var len;

		if ( array ) {
			if ( indexOf ) {
				return indexOf.call( array, elem, i );
			}

			len = array.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in array && array[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( context, args ) {
			args = args || [];
			memory = !flags.memory || [ context, args ];
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ context, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( context, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!memory;
			}
		};

	return self;
};




var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			lists = {
				resolve: doneList,
				reject: failList,
				notify: progressList
			},
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
					deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
					return this;
				},
				always: function() {
					return deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
				},
				pipe: function( fnDone, fnFail, fnProgress ) {
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( {
							done: [ fnDone, "resolve" ],
							fail: [ fnFail, "reject" ],
							progress: [ fnProgress, "notify" ]
						}, function( handler, data ) {
							var fn = data[ 0 ],
								action = data[ 1 ],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								deferred[ handler ](function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								deferred[ handler ]( newDefer[ action ] );
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for ( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred = promise.promise({}),
			key;

		for ( key in lists ) {
			deferred[ key ] = lists[ key ].fire;
			deferred[ key + "With" ] = lists[ key ].fireWith;
		}

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});




jQuery.support = (function() {

	var div = document.createElement( "div" ),
		documentElement = document.documentElement,
		all,
		a,
		select,
		opt,
		input,
		marginDiv,
		support,
		fragment,
		body,
		testElementParent,
		testElement,
		testElementStyle,
		tds,
		events,
		eventName,
		i,
		isSupported;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/><nav></nav>";


	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName( "tbody" ).length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName( "link" ).length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute( "href" ) === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure unknown elements (like HTML5 elems) are handled appropriately
		unknownElems: !!div.getElementsByTagName( "nav" ).length,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");
	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	div.innerHTML = "";

	// Figure out if the W3C box model works as expected
	div.style.width = div.style.paddingLeft = "1px";

	// We don't want to do body-related feature tests on frameset
	// documents, which lack a body. So we use
	// document.getElementsByTagName("body")[0], which is undefined in
	// frameset documents, while document.body isn’t. (7398)
	body = document.getElementsByTagName("body")[ 0 ];
	// We use our own, invisible, body unless the body is already present
	// in which case we use a div (#9239)
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		jQuery.extend( testElementStyle, {
			position: "absolute",
			left: "-999px",
			top: "-999px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	support.boxModel = div.offsetWidth === 2;

	if ( "zoom" in div.style ) {
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		// (IE < 8 does this)
		div.style.display = "inline";
		div.style.zoom = 1;
		support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

		// Check if elements with layout shrink-wrap their children
		// (IE 6 does this)
		div.style.display = "";
		div.innerHTML = "<div style='width:4px;'></div>";
		support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
	}

	div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
	tds = div.getElementsByTagName( "td" );

	// Check if table cells still have offsetWidth/Height when they are set
	// to display:none and there are still other visible table cells in a
	// table row; if so, offsetWidth/Height are not reliable for use when
	// determining if an element has been hidden directly using
	// display:none (it is still safe to use offsets if a parent element is
	// hidden; don safety goggles and see bug #4512 for more information).
	// (only IE 8 fails this test)
	isSupported = ( tds[ 0 ].offsetHeight === 0 );

	tds[ 0 ].style.display = "";
	tds[ 1 ].style.display = "none";

	// Check if empty table cells still have offsetWidth/Height
	// (IE < 8 fail this test)
	support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );
	div.innerHTML = "";

	// Check if div with explicit width and no margin-right incorrectly
	// gets computed margin-right based on width of container. For more
	// info see bug #3333
	// Fails in WebKit before Feb 2011 nightlies
	// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
	if ( document.defaultView && document.defaultView.getComputedStyle ) {
		marginDiv = document.createElement( "div" );
		marginDiv.style.width = "0";
		marginDiv.style.marginRight = "0";
		div.appendChild( marginDiv );
		support.reliableMarginRight =
			( parseInt( ( document.defaultView.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
	}

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for( i in {
			submit: 1,
			change: 1,
			focusin: 1
		} ) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	// Run fixed position tests at doc ready to avoid a crash
	// related to the invisible body in IE8
	jQuery(function() {
		var container, outer, inner, table, td, offsetSupport,
			conMarginTop = 1,
			ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;",
			vb = "visibility:hidden;border:0;",
			style = "style='" + ptlm + "border:5px solid #000;padding:0;'",
			html = "<div " + style + "><div></div></div>" +
							"<table " + style + " cellpadding='0' cellspacing='0'>" +
							"<tr><td></td></tr></table>";

		// Reconstruct a container
		body = document.getElementsByTagName("body")[0];
		if ( !body ) {
			// Return for frameset docs that don't have a body
			// These tests cannot be done
			return;
		}

		container = document.createElement("div");
		container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore( container, body.firstChild );

		// Construct a test element
		testElement = document.createElement("div");
		testElement.style.cssText = ptlm + vb;

		testElement.innerHTML = html;
		container.appendChild( testElement );
		outer = testElement.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		offsetSupport = {
			doesNotAddBorder: ( inner.offsetTop !== 5 ),
			doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
		offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

		body.removeChild( container );
		testElement = container = null;

		jQuery.extend( support, offsetSupport );
	});

	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );

	// Null connected elements to avoid leaks in IE
	testElement = fragment = select = opt = body = marginDiv = div = input = null;

	return support;
})();

// Keep track of boxModel
jQuery.boxModel = jQuery.support.boxModel;




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var privateCache, thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ jQuery.expando ] : elem[ jQuery.expando ] && jQuery.expando,
			isEvents = name === "events";

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ jQuery.expando ] = id = ++jQuery.uuid;
			} else {
				id = jQuery.expando;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		privateCache = thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Users should not attempt to inspect the internal events object using jQuery.data,
		// it is undocumented and subject to change. But does anyone listen? No.
		if ( isEvents && !thisCache[ name ] ) {
			return privateCache.events;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = jQuery.expando,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support space separated names
				if ( jQuery.isArray( name ) ) {
					name = name;
				} else if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split( " " );
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		if ( jQuery.support.deleteExpando || !cache.setInterval ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the cache and need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );
			} else {
				elem[ jQuery.expando ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, attr, name,
			data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 && !jQuery._data( this[0], "parsedAttrs" ) ) {
					attr = this[0].attributes;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( this[0], name, data[ name ] );
						}
					}
					jQuery._data( this[0], "parsedAttrs", true );
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var $this = jQuery( this ),
					args = [ parts[0], value ];

				$this.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				$this.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				jQuery.isNumeric( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery._data( elem, deferDataKey );
	if ( defer &&
		( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
		( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery._data( elem, queueDataKey ) &&
				!jQuery._data( elem, markDataKey ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.fire();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = ( type || "fx" ) + "mark";
			jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
			if ( count ) {
				jQuery._data( elem, key, count );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		var q;
		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			q = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			hooks = {};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			jQuery._data( elem, type + ".run", hooks );
			fn.call( elem, function() {
				jQuery.dequeue( elem, type );
			}, hooks );
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue " + type + ".run", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function() {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
				count++;
				tmp.add( resolve );
			}
		}
		resolve();
		return defer.promise();
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.prop );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = ( value || "" ).split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return undefined;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( !("getAttribute" in elem) ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return undefined;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, l,
			i = 0;

		if ( elem.nodeType === 1 ) {
			attrNames = ( value || "" ).split( rspace );
			l = attrNames.length;

			for ( ; i < l; i++ ) {
				name = attrNames[ i ].toLowerCase();
				propName = jQuery.propFix[ name ] || name;

				// See #9699 for explanation of this approach (setting first, then removal)
				jQuery.attr( elem, name, "" );
				elem.removeAttribute( getSetAttribute ? name : propName );

				// Set corresponding property to false for boolean attributes
				if ( rboolean.test( name ) && propName in elem ) {
					elem[ propName ] = false;
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return undefined;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.nodeValue = value + "" );
		}
	};

	// Apply the nodeHook to tabindex
	jQuery.attrHooks.tabindex.set = nodeHook.set;

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = "" + value );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});




var rnamespaces = /\.(.*)$/,
	rformElems = /^(?:textarea|input|select)$/i,
	rperiod = /\./g,
	rspaces = / /g,
	rescape = /[^\w\s.|`]/g,
	rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
	rhoverHack = /\bhover(\.\S+)?/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
	quickParse = function( selector ) {
		var quick = rquickIs.exec( selector );
		if ( quick ) {
			//   0  1    2   3
			// [ _, tag, id, class ]
			quick[1] = ( quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
		}
		return quick;
	},
	quickIs = function( elem, m ) {
		return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || elem.id === m[2]) &&
			(!m[3] || m[3].test( elem.className ))
		);
	},
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = hoverHack(types).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Delegated event; pre-analyze selector so it's processed quickly on event dispatch
			if ( selector ) {
				handleObj.quick = quickParse( selector );
				if ( !handleObj.quick && jQuery.expr.match.POS.test( selector ) ) {
					handleObj.isPositional = true;
				}
			}

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector ) {

		var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			t, tns, type, namespaces, origCount,
			j, events, special, handle, eventType, handleObj;

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = hoverHack( types || "" ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				namespaces = namespaces? "." + namespaces : "";
				for ( j in events ) {
					jQuery.event.remove( elem, j + namespaces, handler, selector );
				}
				return;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

			// Only need to loop for special events or selective removal
			if ( handler || namespaces || selector || special.remove ) {
				for ( j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( !handler || handler.guid === handleObj.guid ) {
						if ( !namespaces || namespaces.test( handleObj.namespace ) ) {
							if ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) {
								eventType.splice( j--, 1 );

								if ( handleObj.selector ) {
									eventType.delegateCount--;
								}
								if ( special.remove ) {
									special.remove.call( elem, handleObj );
								}
							}
						}
					}
				}
			} else {
				// Removing all events
				eventType.length = 0;
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, [ "events", "handle" ], true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// triggerHandler() and global events don't bubble or run the default action
		if ( onlyHandlers || !elem ) {
			event.preventDefault();
		}

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			old = null;
			for ( cur = elem.parentNode; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old && old === elem.ownerDocument ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length; i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) ) {
				handle.apply( cur, data );
			}

			if ( event.isPropagationStopped() ) {
				break;
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments, 0 ),
			run_all = !event.exclusive && !event.namespace,
			specialHandle = ( jQuery.event.special[ event.type ] || {} ).handle,
			handlerQueue = [],
			i, j, cur, ret, selMatch, matched, matches, handleObj, sel, hit, related;

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Determine handlers that should run if there are delegated events
		// Avoid disabled elements in IE (#6911) and non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !event.target.disabled && !(event.button && event.type === "click") ) {

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {
				selMatch = {};
				matches = [];
				for ( i = 0; i < delegateCount; i++ ) {
					handleObj = handlers[ i ];
					sel = handleObj.selector;
					hit = selMatch[ sel ];

					if ( handleObj.isPositional ) {
						// Since .is() does not work for positionals; see http://jsfiddle.net/eJ4yd/3/
						hit = ( hit || (selMatch[ sel ] = jQuery( sel )) ).index( cur ) >= 0;
					} else if ( hit === undefined ) {
						hit = selMatch[ sel ] = ( handleObj.quick ? quickIs( cur, handleObj.quick ) : jQuery( cur ).is( sel ) );
					}
					if ( hit ) {
						matches.push( handleObj );
					}
				}
				if ( matches.length ) {
					handlerQueue.push({ elem: cur, matches: matches });
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( specialHandle || handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement wheelDelta".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
		if ( event.metaKey === undefined ) {
			event.metaKey = event.ctrlKey;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		focus: {
			delegateType: "focusin",
			noBubble: true
		},
		blur: {
			delegateType: "focusout",
			noBubble: true
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = jQuery.event.special[ fix ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector,
				oldType, ret;

			// For a real mouseover/out, always call the handler; for
			// mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || handleObj.origType === event.type || (related !== target && !jQuery.contains( target, related )) ) {
				oldType = event.type;
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = oldType;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !form._submit_attached ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						// Form was submitted, bubble the event up the tree
						if ( this.parentNode ) {
							jQuery.event.simulate( "submit", this.parentNode, event, true );
						}
					});
					form._submit_attached = true;
				}
			});
			// return undefined since we don't need an event listener
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed ) {
							this._just_changed = false;
							jQuery.event.simulate( "change", this, event, true );
						}
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					elem._change_attached = true;
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on.call( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			var handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace? handleObj.type + "." + handleObj.namespace : handleObj.type,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( var type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.bind( name, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					doneName = match[0];
					parent = elem.parentNode;
	
					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent[ expando ] = doneName;
					}
					
					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );
	
		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && ( 
			typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test( selector ) ? 
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];
		
		// Array (deprecated as of jQuery 1.7)
		if ( jQuery.isArray( selectors ) ) {
			var level = 1;

			while ( cur && cur.ownerDocument && cur !== context ) {
				for ( i = 0; i < selectors.length; i++ ) {

					if ( jQuery( cur ).is( selectors[ i ] ) ) {
						ret.push({ selector: selectors[ i ], elem: cur, level: level });
					}
				}

				cur = cur.parentNode;
				level++;
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until ),
			// The variable 'args' was introduced in
			// https://github.com/jquery/jquery/commit/52a0238
			// to work around a bug in Chrome 10 (Dev) and should be removed when the bug is fixed.
			// http://code.google.com/p/v8/issues/detail?id=1050
			args = slice.call(arguments);

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, args.join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}




function createSafeFragment( document ) {
	var list = nodeNames.split( " " ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr article aside audio canvas datalist details figcaption figure footer " +
		"header hgroup mark meter nav output progress section summary time video",
	rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames.replace(" ", "|") + ")", "i"),
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		return this.each(function() {
			jQuery( this ).wrapAll( html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery(arguments[0]);
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery(arguments[0]).toArray() );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || ( l > 1 && i < lastIndex ) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc,
	first = args[ 0 ];

	// nodes may contain either an explicit document object,
	// a jQuery collection or context object.
	// If nodes[0] contains a valid object to assign to doc
	if ( nodes && nodes[0] ) {
		doc = nodes[0].ownerDocument || nodes[0];
	}

  // Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(!jQuery.support.unknownElems && rnoshimcache.test( first )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ first ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ first ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	var nodeName = ( elem.nodeName || "" ).toLowerCase();
	if ( nodeName === "input" ) {
		fixDefaultChecked( elem );
	// Skip scripts, get other children
	} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var clone = elem.cloneNode(true),
				srcElements,
				destElements,
				i;

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName
			// instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType;

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [], j;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div");

					// Append wrapper element to unknown element safe doc fragment
					if ( context === document ) {
						// Use the fragment we've already created for this document
						safeFragment.appendChild( div );
					} else {
						// Use a fragment created with the owner document
						createSafeFragment( context ).appendChild( div );
					}

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

				} else {
					if ( ret[i].nodeType === 1 ) {
						var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id,
			cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,
	rrelNum = /^([\-+])=([\-+.\de]+)/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWH( elem, name, extra );
				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				return val;
			}
		},

		set: function( elem, value ) {
			if ( rnumpx.test( value ) ) {
				// ignore negative width and height values #1599
				value = parseFloat( value );

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				var ret;
				jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						ret = curCSS( elem, "margin-right", "marginRight" );
					} else {
						ret = elem.style.marginRight;
					}
				});
				return ret;
			}
		};
	}
});

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( !(defaultView = elem.ownerDocument.defaultView) ) {
			return undefined;
		}

		if ( (computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left, rsLeft, uncomputed,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret === null && style && (uncomputed = style[ name ]) ) {
			ret = uncomputed;
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ( ret || 0 );
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		which = name === "width" ? cssWidth : cssHeight;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			jQuery.each( which, function() {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + this ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + this ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + this + "Width" ) ) || 0;
				}
			});
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ] || 0;
	}
	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		jQuery.each( which, function() {
			val += parseFloat( jQuery.css( elem, "padding" + this ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + this + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + this ) ) || 0;
			}
		});
	}

	return val + "px";
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts,

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.bind( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			var isSuccess,
				success,
				error,
				statusText = nativeStatusText,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefiler, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					jQuery.error( e );
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for ( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for ( key in s.converters ) {
				if ( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if ( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for ( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
		( typeof s.data === "string" );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback );

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( display === "" && jQuery.css(elem, "display") === "none" ) {
						jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			var elem, display,
				i = 0,
				j = this.length;

			for ( ; i < j; i++ ) {
				elem = this[i];
				if ( elem.style ) {
					display = jQuery.css( elem, "display" );

					if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
						jQuery._data( elem, "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p, e,
				parts, start, end, unit,
				method;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			for ( p in prop ) {

				// property name normalization
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				val = prop[ name ];

				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {

						// inline-level elements accept inline-block;
						// block-level elements need to be inline with layout
						if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
							this.style.display = "inline-block";

						} else {
							this.style.zoom = 1;
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test( val ) ) {

					// Tracks whether to show or hide based on private
					// data attached to the element
					method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
					if ( method ) {
						jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
						e[ method ]();
					} else {
						e[ val ]();
					}

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ( (end || 1) / e.cur() ) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var i,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, i ) {
				var hooks = data[ i ];
				jQuery.removeData( elem, i, true );
				hooks.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( i in data ) {
					if ( data[ i ].stop && i.indexOf(".run") === i.length - 4 ) {
						stopQueue( this, data, i );
					}
				}
			} else if ( data[ i = type + ".run" ] && data[ i ].stop ){
				stopQueue( this, data, i );
			}

			for ( i = timers.length; i--; ) {
				if ( timers[ i ].elem === this && (type == null || timers[ i ].queue === type) ) {
					if ( gotoEnd ) {

						// force the next step to be the last
						timers[ i ]( true );
					} else {
						timers[ i ].saveState();
					}
					hadTimers = true;
					timers.splice( i, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ( ( -Math.cos( p*Math.PI ) / 2 ) + 0.5 ) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = fxNow || createFxNow();
		this.end = to;
		this.now = this.start = from;
		this.pos = this.state = 0;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

		function t( gotoEnd ) {
			return self.step( gotoEnd );
		}

		t.queue = this.options.queue;
		t.elem = this.elem;
		t.saveState = function() {
			if ( self.options.hide && jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
				jQuery._data( self.elem, "fxshow" + self.prop, self.start );
			}
		};

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval( fx.tick, fx.interval );
		}
	},

	// Simple 'show' function
	show: function() {
		var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any flash of content
		if ( dataShow !== undefined ) {
			// This show is picking up where a previous hide or show left off
			this.custom( this.cur(), dataShow );
		} else {
			this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
		}

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom( this.cur(), 0 );
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

// Adds width/height step functions
// Do not set anything below 0
jQuery.each([ "width", "height" ], function( i, prop ) {
	jQuery.fx.step[ prop ] = function( fx ) {
		jQuery.style( fx.elem, prop, Math.max(0, fx.now) );
	};
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );
		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( document.compatMode === "CSS1Compat" ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );
			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function( val ) {
		var elem, win;

		if ( val === undefined ) {
			elem = this[ 0 ];

			if ( !elem ) {
				return null;
			}

			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}

		// Set the scroll offset
		return this.each(function() {
			win = getWindow( this );

			if ( win ) {
				win.scrollTo(
					!i ? val : jQuery( win ).scrollLeft(),
					 i ? val : jQuery( win ).scrollTop()
				);

			} else {
				this[ method ] = val;
			}
		});
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			this[ type ]() :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			this[ type ]() :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}

		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
			var docElemProp = elem.document.documentElement[ "client" + name ],
				body = elem.document.body;
			return elem.document.compatMode === "CSS1Compat" && docElemProp ||
				body && body[ "client" + name ] || docElemProp;

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNumeric( ret ) ? ret : orig;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});


// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;
})( window );



/*
 * Copyright (c) 2009 Simo Kinnunen.
 * Licensed under the MIT license.
 *
 * @version 1.09i
 */
var Cufon=(function(){var m=function(){return m.replace.apply(null,arguments)};var x=m.DOM={ready:(function(){var C=false,E={loaded:1,complete:1};var B=[],D=function(){if(C){return}C=true;for(var F;F=B.shift();F()){}};if(document.addEventListener){document.addEventListener("DOMContentLoaded",D,false);window.addEventListener("pageshow",D,false)}if(!window.opera&&document.readyState){(function(){E[document.readyState]?D():setTimeout(arguments.callee,10)})()}if(document.readyState&&document.createStyleSheet){(function(){try{document.body.doScroll("left");D()}catch(F){setTimeout(arguments.callee,1)}})()}q(window,"load",D);return function(F){if(!arguments.length){D()}else{C?F():B.push(F)}}})(),root:function(){return document.documentElement||document.body}};var n=m.CSS={Size:function(C,B){this.value=parseFloat(C);this.unit=String(C).match(/[a-z%]*$/)[0]||"px";this.convert=function(D){return D/B*this.value};this.convertFrom=function(D){return D/this.value*B};this.toString=function(){return this.value+this.unit}},addClass:function(C,B){var D=C.className;C.className=D+(D&&" ")+B;return C},color:j(function(C){var B={};B.color=C.replace(/^rgba\((.*?),\s*([\d.]+)\)/,function(E,D,F){B.opacity=parseFloat(F);return"rgb("+D+")"});return B}),fontStretch:j(function(B){if(typeof B=="number"){return B}if(/%$/.test(B)){return parseFloat(B)/100}return{"ultra-condensed":0.5,"extra-condensed":0.625,condensed:0.75,"semi-condensed":0.875,"semi-expanded":1.125,expanded:1.25,"extra-expanded":1.5,"ultra-expanded":2}[B]||1}),getStyle:function(C){var B=document.defaultView;if(B&&B.getComputedStyle){return new a(B.getComputedStyle(C,null))}if(C.currentStyle){return new a(C.currentStyle)}return new a(C.style)},gradient:j(function(F){var G={id:F,type:F.match(/^-([a-z]+)-gradient\(/)[1],stops:[]},C=F.substr(F.indexOf("(")).match(/([\d.]+=)?(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)/ig);for(var E=0,B=C.length,D;E<B;++E){D=C[E].split("=",2).reverse();G.stops.push([D[1]||E/(B-1),D[0]])}return G}),quotedList:j(function(E){var D=[],C=/\s*((["'])([\s\S]*?[^\\])\2|[^,]+)\s*/g,B;while(B=C.exec(E)){D.push(B[3]||B[1])}return D}),recognizesMedia:j(function(G){var E=document.createElement("style"),D,C,B;E.type="text/css";E.media=G;try{E.appendChild(document.createTextNode("/**/"))}catch(F){}C=g("head")[0];C.insertBefore(E,C.firstChild);D=(E.sheet||E.styleSheet);B=D&&!D.disabled;C.removeChild(E);return B}),removeClass:function(D,C){var B=RegExp("(?:^|\\s+)"+C+"(?=\\s|$)","g");D.className=D.className.replace(B,"");return D},supports:function(D,C){var B=document.createElement("span").style;if(B[D]===undefined){return false}B[D]=C;return B[D]===C},textAlign:function(E,D,B,C){if(D.get("textAlign")=="right"){if(B>0){E=" "+E}}else{if(B<C-1){E+=" "}}return E},textShadow:j(function(F){if(F=="none"){return null}var E=[],G={},B,C=0;var D=/(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)|(-?[\d.]+[a-z%]*)|,/ig;while(B=D.exec(F)){if(B[0]==","){E.push(G);G={};C=0}else{if(B[1]){G.color=B[1]}else{G[["offX","offY","blur"][C++]]=B[2]}}}E.push(G);return E}),textTransform:(function(){var B={uppercase:function(C){return C.toUpperCase()},lowercase:function(C){return C.toLowerCase()},capitalize:function(C){return C.replace(/\b./g,function(D){return D.toUpperCase()})}};return function(E,D){var C=B[D.get("textTransform")];return C?C(E):E}})(),whiteSpace:(function(){var D={inline:1,"inline-block":1,"run-in":1};var C=/^\s+/,B=/\s+$/;return function(H,F,G,E){if(E){if(E.nodeName.toLowerCase()=="br"){H=H.replace(C,"")}}if(D[F.get("display")]){return H}if(!G.previousSibling){H=H.replace(C,"")}if(!G.nextSibling){H=H.replace(B,"")}return H}})()};n.ready=(function(){var B=!n.recognizesMedia("all"),E=false;var D=[],H=function(){B=true;for(var K;K=D.shift();K()){}};var I=g("link"),J=g("style");function C(K){return K.disabled||G(K.sheet,K.media||"screen")}function G(M,P){if(!n.recognizesMedia(P||"all")){return true}if(!M||M.disabled){return false}try{var Q=M.cssRules,O;if(Q){search:for(var L=0,K=Q.length;O=Q[L],L<K;++L){switch(O.type){case 2:break;case 3:if(!G(O.styleSheet,O.media.mediaText)){return false}break;default:break search}}}}catch(N){}return true}function F(){if(document.createStyleSheet){return true}var L,K;for(K=0;L=I[K];++K){if(L.rel.toLowerCase()=="stylesheet"&&!C(L)){return false}}for(K=0;L=J[K];++K){if(!C(L)){return false}}return true}x.ready(function(){if(!E){E=n.getStyle(document.body).isUsable()}if(B||(E&&F())){H()}else{setTimeout(arguments.callee,10)}});return function(K){if(B){K()}else{D.push(K)}}})();function s(D){var C=this.face=D.face,B={"\u0020":1,"\u00a0":1,"\u3000":1};this.glyphs=D.glyphs;this.w=D.w;this.baseSize=parseInt(C["units-per-em"],10);this.family=C["font-family"].toLowerCase();this.weight=C["font-weight"];this.style=C["font-style"]||"normal";this.viewBox=(function(){var F=C.bbox.split(/\s+/);var E={minX:parseInt(F[0],10),minY:parseInt(F[1],10),maxX:parseInt(F[2],10),maxY:parseInt(F[3],10)};E.width=E.maxX-E.minX;E.height=E.maxY-E.minY;E.toString=function(){return[this.minX,this.minY,this.width,this.height].join(" ")};return E})();this.ascent=-parseInt(C.ascent,10);this.descent=-parseInt(C.descent,10);this.height=-this.ascent+this.descent;this.spacing=function(L,N,E){var O=this.glyphs,M,K,G,P=[],F=0,J=-1,I=-1,H;while(H=L[++J]){M=O[H]||this.missingGlyph;if(!M){continue}if(K){F-=G=K[H]||0;P[I]-=G}F+=P[++I]=~~(M.w||this.w)+N+(B[H]?E:0);K=M.k}P.total=F;return P}}function f(){var C={},B={oblique:"italic",italic:"oblique"};this.add=function(D){(C[D.style]||(C[D.style]={}))[D.weight]=D};this.get=function(H,I){var G=C[H]||C[B[H]]||C.normal||C.italic||C.oblique;if(!G){return null}I={normal:400,bold:700}[I]||parseInt(I,10);if(G[I]){return G[I]}var E={1:1,99:0}[I%100],K=[],F,D;if(E===undefined){E=I>400}if(I==500){I=400}for(var J in G){if(!k(G,J)){continue}J=parseInt(J,10);if(!F||J<F){F=J}if(!D||J>D){D=J}K.push(J)}if(I<F){I=F}if(I>D){I=D}K.sort(function(M,L){return(E?(M>=I&&L>=I)?M<L:M>L:(M<=I&&L<=I)?M>L:M<L)?-1:1});return G[K[0]]}}function r(){function D(F,G){if(F.contains){return F.contains(G)}return F.compareDocumentPosition(G)&16}function B(G){var F=G.relatedTarget;if(!F||D(this,F)){return}C(this,G.type=="mouseover")}function E(F){C(this,F.type=="mouseenter")}function C(F,G){setTimeout(function(){var H=d.get(F).options;m.replace(F,G?h(H,H.hover):H,true)},10)}this.attach=function(F){if(F.onmouseenter===undefined){q(F,"mouseover",B);q(F,"mouseout",B)}else{q(F,"mouseenter",E);q(F,"mouseleave",E)}}}function u(){var C=[],D={};function B(H){var E=[],G;for(var F=0;G=H[F];++F){E[F]=C[D[G]]}return E}this.add=function(F,E){D[F]=C.push(E)-1};this.repeat=function(){var E=arguments.length?B(arguments):C,F;for(var G=0;F=E[G++];){m.replace(F[0],F[1],true)}}}function A(){var D={},B=0;function C(E){return E.cufid||(E.cufid=++B)}this.get=function(E){var F=C(E);return D[F]||(D[F]={})}}function a(B){var D={},C={};this.extend=function(E){for(var F in E){if(k(E,F)){D[F]=E[F]}}return this};this.get=function(E){return D[E]!=undefined?D[E]:B[E]};this.getSize=function(F,E){return C[F]||(C[F]=new n.Size(this.get(F),E))};this.isUsable=function(){return !!B}}function q(C,B,D){if(C.addEventListener){C.addEventListener(B,D,false)}else{if(C.attachEvent){C.attachEvent("on"+B,function(){return D.call(C,window.event)})}}}function v(C,B){var D=d.get(C);if(D.options){return C}if(B.hover&&B.hoverables[C.nodeName.toLowerCase()]){b.attach(C)}D.options=B;return C}function j(B){var C={};return function(D){if(!k(C,D)){C[D]=B.apply(null,arguments)}return C[D]}}function c(F,E){var B=n.quotedList(E.get("fontFamily").toLowerCase()),D;for(var C=0;D=B[C];++C){if(i[D]){return i[D].get(E.get("fontStyle"),E.get("fontWeight"))}}return null}function g(B){return document.getElementsByTagName(B)}function k(C,B){return C.hasOwnProperty(B)}function h(){var C={},B,F;for(var E=0,D=arguments.length;B=arguments[E],E<D;++E){for(F in B){if(k(B,F)){C[F]=B[F]}}}return C}function o(E,M,C,N,F,D){var K=document.createDocumentFragment(),H;if(M===""){return K}var L=N.separate;var I=M.split(p[L]),B=(L=="words");if(B&&t){if(/^\s/.test(M)){I.unshift("")}if(/\s$/.test(M)){I.push("")}}for(var J=0,G=I.length;J<G;++J){H=z[N.engine](E,B?n.textAlign(I[J],C,J,G):I[J],C,N,F,D,J<G-1);if(H){K.appendChild(H)}}return K}function l(D,M){var C=D.nodeName.toLowerCase();if(M.ignore[C]){return}var E=!M.textless[C];var B=n.getStyle(v(D,M)).extend(M);var F=c(D,B),G,K,I,H,L,J;if(!F){return}for(G=D.firstChild;G;G=I){K=G.nodeType;I=G.nextSibling;if(E&&K==3){if(H){H.appendData(G.data);D.removeChild(G)}else{H=G}if(I){continue}}if(H){D.replaceChild(o(F,n.whiteSpace(H.data,B,H,J),B,M,G,D),H);H=null}if(K==1){if(G.firstChild){if(G.nodeName.toLowerCase()=="cufon"){z[M.engine](F,null,B,M,G,D)}else{arguments.callee(G,M)}}J=G}}}var t=" ".split(/\s+/).length==0;var d=new A();var b=new r();var y=new u();var e=false;var z={},i={},w={autoDetect:false,engine:null,forceHitArea:false,hover:false,hoverables:{a:true},ignore:{applet:1,canvas:1,col:1,colgroup:1,head:1,iframe:1,map:1,optgroup:1,option:1,script:1,select:1,style:1,textarea:1,title:1,pre:1},printable:true,selector:(window.Sizzle||(window.jQuery&&function(B){return jQuery(B)})||(window.dojo&&dojo.query)||(window.Ext&&Ext.query)||(window.YAHOO&&YAHOO.util&&YAHOO.util.Selector&&YAHOO.util.Selector.query)||(window.$$&&function(B){return $$(B)})||(window.$&&function(B){return $(B)})||(document.querySelectorAll&&function(B){return document.querySelectorAll(B)})||g),separate:"words",textless:{dl:1,html:1,ol:1,table:1,tbody:1,thead:1,tfoot:1,tr:1,ul:1},textShadow:"none"};var p={words:/\s/.test("\u00a0")?/[^\S\u00a0]+/:/\s+/,characters:"",none:/^/};m.now=function(){x.ready();return m};m.refresh=function(){y.repeat.apply(y,arguments);return m};m.registerEngine=function(C,B){if(!B){return m}z[C]=B;return m.set("engine",C)};m.registerFont=function(D){if(!D){return m}var B=new s(D),C=B.family;if(!i[C]){i[C]=new f()}i[C].add(B);return m.set("fontFamily",'"'+C+'"')};m.replace=function(D,C,B){C=h(w,C);if(!C.engine){return m}if(!e){n.addClass(x.root(),"cufon-active cufon-loading");n.ready(function(){n.addClass(n.removeClass(x.root(),"cufon-loading"),"cufon-ready")});e=true}if(C.hover){C.forceHitArea=true}if(C.autoDetect){delete C.fontFamily}if(typeof C.textShadow=="string"){C.textShadow=n.textShadow(C.textShadow)}if(typeof C.color=="string"&&/^-/.test(C.color)){C.textGradient=n.gradient(C.color)}else{delete C.textGradient}if(!B){y.add(D,arguments)}if(D.nodeType||typeof D=="string"){D=[D]}n.ready(function(){for(var F=0,E=D.length;F<E;++F){var G=D[F];if(typeof G=="string"){m.replace(C.selector(G),C,true)}else{l(G,C)}}});return m};m.set=function(B,C){w[B]=C;return m};return m})();Cufon.registerEngine("vml",(function(){var e=document.namespaces;if(!e){return}e.add("cvml","urn:schemas-microsoft-com:vml");e=null;var b=document.createElement("cvml:shape");b.style.behavior="url(#default#VML)";if(!b.coordsize){return}b=null;var h=(document.documentMode||0)<8;document.write(('<style type="text/css">cufoncanvas{text-indent:0;}@media screen{cvml\\:shape,cvml\\:rect,cvml\\:fill,cvml\\:shadow{behavior:url(#default#VML);display:block;antialias:true;position:absolute;}cufoncanvas{position:absolute;text-align:left;}cufon{display:inline-block;position:relative;vertical-align:'+(h?"middle":"text-bottom")+";}cufon cufontext{position:absolute;left:-10000in;font-size:1px;}a cufon{cursor:pointer}}@media print{cufon cufoncanvas{display:none;}}</style>").replace(/;/g,"!important;"));function c(i,j){return a(i,/(?:em|ex|%)$|^[a-z-]+$/i.test(j)?"1em":j)}function a(l,m){if(m==="0"){return 0}if(/px$/i.test(m)){return parseFloat(m)}var k=l.style.left,j=l.runtimeStyle.left;l.runtimeStyle.left=l.currentStyle.left;l.style.left=m.replace("%","em");var i=l.style.pixelLeft;l.style.left=k;l.runtimeStyle.left=j;return i}function f(l,k,j,n){var i="computed"+n,m=k[i];if(isNaN(m)){m=k.get(n);k[i]=m=(m=="normal")?0:~~j.convertFrom(a(l,m))}return m}var g={};function d(p){var q=p.id;if(!g[q]){var n=p.stops,o=document.createElement("cvml:fill"),i=[];o.type="gradient";o.angle=180;o.focus="0";o.method="sigma";o.color=n[0][1];for(var m=1,l=n.length-1;m<l;++m){i.push(n[m][0]*100+"% "+n[m][1])}o.colors=i.join(",");o.color2=n[l][1];g[q]=o}return g[q]}return function(ac,G,Y,C,K,ad,W){var n=(G===null);if(n){G=K.alt}var I=ac.viewBox;var p=Y.computedFontSize||(Y.computedFontSize=new Cufon.CSS.Size(c(ad,Y.get("fontSize"))+"px",ac.baseSize));var y,q;if(n){y=K;q=K.firstChild}else{y=document.createElement("cufon");y.className="cufon cufon-vml";y.alt=G;q=document.createElement("cufoncanvas");y.appendChild(q);if(C.printable){var Z=document.createElement("cufontext");Z.appendChild(document.createTextNode(G));y.appendChild(Z)}if(!W){y.appendChild(document.createElement("cvml:shape"))}}var ai=y.style;var R=q.style;var l=p.convert(I.height),af=Math.ceil(l);var V=af/l;var P=V*Cufon.CSS.fontStretch(Y.get("fontStretch"));var U=I.minX,T=I.minY;R.height=af;R.top=Math.round(p.convert(T-ac.ascent));R.left=Math.round(p.convert(U));ai.height=p.convert(ac.height)+"px";var F=Y.get("color");var ag=Cufon.CSS.textTransform(G,Y).split("");var L=ac.spacing(ag,f(ad,Y,p,"letterSpacing"),f(ad,Y,p,"wordSpacing"));if(!L.length){return null}var k=L.total;var x=-U+k+(I.width-L[L.length-1]);var ah=p.convert(x*P),X=Math.round(ah);var O=x+","+I.height,m;var J="r"+O+"ns";var u=C.textGradient&&d(C.textGradient);var o=ac.glyphs,S=0;var H=C.textShadow;var ab=-1,aa=0,w;while(w=ag[++ab]){var D=o[ag[ab]]||ac.missingGlyph,v;if(!D){continue}if(n){v=q.childNodes[aa];while(v.firstChild){v.removeChild(v.firstChild)}}else{v=document.createElement("cvml:shape");q.appendChild(v)}v.stroked="f";v.coordsize=O;v.coordorigin=m=(U-S)+","+T;v.path=(D.d?"m"+D.d+"xe":"")+"m"+m+J;v.fillcolor=F;if(u){v.appendChild(u.cloneNode(false))}var ae=v.style;ae.width=X;ae.height=af;if(H){var s=H[0],r=H[1];var B=Cufon.CSS.color(s.color),z;var N=document.createElement("cvml:shadow");N.on="t";N.color=B.color;N.offset=s.offX+","+s.offY;if(r){z=Cufon.CSS.color(r.color);N.type="double";N.color2=z.color;N.offset2=r.offX+","+r.offY}N.opacity=B.opacity||(z&&z.opacity)||1;v.appendChild(N)}S+=L[aa++]}var M=v.nextSibling,t,A;if(C.forceHitArea){if(!M){M=document.createElement("cvml:rect");M.stroked="f";M.className="cufon-vml-cover";t=document.createElement("cvml:fill");t.opacity=0;M.appendChild(t);q.appendChild(M)}A=M.style;A.width=X;A.height=af}else{if(M){q.removeChild(M)}}ai.width=Math.max(Math.ceil(p.convert(k*P)),0);if(h){var Q=Y.computedYAdjust;if(Q===undefined){var E=Y.get("lineHeight");if(E=="normal"){E="1em"}else{if(!isNaN(E)){E+="em"}}Y.computedYAdjust=Q=0.5*(a(ad,E)-parseFloat(ai.height))}if(Q){ai.marginTop=Math.ceil(Q)+"px";ai.marginBottom=Q+"px"}}return y}})());Cufon.registerEngine("canvas",(function(){var b=document.createElement("canvas");if(!b||!b.getContext||!b.getContext.apply){return}b=null;var a=Cufon.CSS.supports("display","inline-block");var e=!a&&(document.compatMode=="BackCompat"||/frameset|transitional/i.test(document.doctype.publicId));var f=document.createElement("style");f.type="text/css";f.appendChild(document.createTextNode(("cufon{text-indent:0;}@media screen,projection{cufon{display:inline;display:inline-block;position:relative;vertical-align:middle;"+(e?"":"font-size:1px;line-height:1px;")+"}cufon cufontext{display:-moz-inline-box;display:inline-block;width:0;height:0;overflow:hidden;text-indent:-10000in;}"+(a?"cufon canvas{position:relative;}":"cufon canvas{position:absolute;}")+"}@media print{cufon{padding:0;}cufon canvas{display:none;}}").replace(/;/g,"!important;")));document.getElementsByTagName("head")[0].appendChild(f);function d(p,h){var n=0,m=0;var g=[],o=/([mrvxe])([^a-z]*)/g,k;generate:for(var j=0;k=o.exec(p);++j){var l=k[2].split(",");switch(k[1]){case"v":g[j]={m:"bezierCurveTo",a:[n+~~l[0],m+~~l[1],n+~~l[2],m+~~l[3],n+=~~l[4],m+=~~l[5]]};break;case"r":g[j]={m:"lineTo",a:[n+=~~l[0],m+=~~l[1]]};break;case"m":g[j]={m:"moveTo",a:[n=~~l[0],m=~~l[1]]};break;case"x":g[j]={m:"closePath"};break;case"e":break generate}h[g[j].m].apply(h,g[j].a)}return g}function c(m,k){for(var j=0,h=m.length;j<h;++j){var g=m[j];k[g.m].apply(k,g.a)}}return function(V,w,P,t,C,W){var k=(w===null);if(k){w=C.getAttribute("alt")}var A=V.viewBox;var m=P.getSize("fontSize",V.baseSize);var B=0,O=0,N=0,u=0;var z=t.textShadow,L=[];if(z){for(var U=z.length;U--;){var F=z[U];var K=m.convertFrom(parseFloat(F.offX));var I=m.convertFrom(parseFloat(F.offY));L[U]=[K,I];if(I<B){B=I}if(K>O){O=K}if(I>N){N=I}if(K<u){u=K}}}var Z=Cufon.CSS.textTransform(w,P).split("");var E=V.spacing(Z,~~m.convertFrom(parseFloat(P.get("letterSpacing"))||0),~~m.convertFrom(parseFloat(P.get("wordSpacing"))||0));if(!E.length){return null}var h=E.total;O+=A.width-E[E.length-1];u+=A.minX;var s,n;if(k){s=C;n=C.firstChild}else{s=document.createElement("cufon");s.className="cufon cufon-canvas";s.setAttribute("alt",w);n=document.createElement("canvas");s.appendChild(n);if(t.printable){var S=document.createElement("cufontext");S.appendChild(document.createTextNode(w));s.appendChild(S)}}var aa=s.style;var H=n.style;var j=m.convert(A.height);var Y=Math.ceil(j);var M=Y/j;var G=M*Cufon.CSS.fontStretch(P.get("fontStretch"));var J=h*G;var Q=Math.ceil(m.convert(J+O-u));var o=Math.ceil(m.convert(A.height-B+N));n.width=Q;n.height=o;H.width=Q+"px";H.height=o+"px";B+=A.minY;H.top=Math.round(m.convert(B-V.ascent))+"px";H.left=Math.round(m.convert(u))+"px";var r=Math.max(Math.ceil(m.convert(J)),0)+"px";if(a){aa.width=r;aa.height=m.convert(V.height)+"px"}else{aa.paddingLeft=r;aa.paddingBottom=(m.convert(V.height)-1)+"px"}var X=n.getContext("2d"),D=j/A.height;X.scale(D,D*M);X.translate(-u,-B);X.save();function T(){var x=V.glyphs,ab,l=-1,g=-1,y;X.scale(G,1);while(y=Z[++l]){var ab=x[Z[l]]||V.missingGlyph;if(!ab){continue}if(ab.d){X.beginPath();if(ab.code){c(ab.code,X)}else{ab.code=d("m"+ab.d,X)}X.fill()}X.translate(E[++g],0)}X.restore()}if(z){for(var U=z.length;U--;){var F=z[U];X.save();X.fillStyle=F.color;X.translate.apply(X,L[U]);T()}}var q=t.textGradient;if(q){var v=q.stops,p=X.createLinearGradient(0,A.minY,0,A.maxY);for(var U=0,R=v.length;U<R;++U){p.addColorStop.apply(p,v[U])}X.fillStyle=p}else{X.fillStyle=P.get("color")}T();return s}})());



/*!
 * The following copyright notice may not be removed under any circumstances.
 * 
 * Copyright:
 * Š 1988, 1990, 1994, 2002 Adobe Systems Incorporated. All rights reserved.
 * 
 * Trademark:
 * Frutiger is a trademark of Linotype Corp. registered in the U.S. Patent and
 * Trademark Office and may be registered in certain other jurisdictions in the
 * name of Linotype Corp. or its licensee Linotype GmbH.
 * 
 * Full name:
 * FrutigerLTStd-Light
 * 
 * Designer:
 * Adrian Frutiger
 * 
 * Vendor URL:
 * http://www.adobe.com/type
 * 
 * License information:
 * http://www.adobe.com/type/legal.html
 */
Cufon.registerFont({"w":200,"face":{"font-family":"Frutiger LT Std","font-weight":300,"font-stretch":"normal","units-per-em":"360","panose-1":"2 11 4 2 2 2 4 2 2 4","ascent":"270","descent":"-90","x-height":"4","bbox":"-55 -328 360 90","underline-thickness":"18","underline-position":"-18","stemh":"19","stemv":"23","unicode-range":"U+0020-U+FB02"},"glyphs":{" ":{"w":100},"!":{"d":"85,-251r-5,190r-20,0r-5,-190r30,0xm55,0r0,-30r30,0r0,30r-30,0","w":140},"\"":{"d":"64,-173r0,-78r23,0r0,78r-23,0xm113,-173r0,-78r23,0r0,78r-23,0"},"#":{"d":"39,0r11,-79r-38,0r0,-19r40,0r8,-55r-38,0r0,-19r41,0r11,-79r22,0r-11,79r46,0r12,-79r22,0r-12,79r35,0r0,19r-37,0r-8,55r35,0r0,19r-38,0r-11,79r-22,0r11,-79r-46,0r-12,79r-21,0xm121,-98r8,-55r-47,0r-7,55r46,0"},"$":{"d":"111,-111r0,90v21,-6,35,-21,35,-48v0,-18,-15,-30,-35,-42xm93,-149r0,-83v-20,4,-38,16,-38,41v0,19,17,30,38,42xm93,-278r18,0r0,22v12,0,31,3,48,9r-3,22v-11,-6,-28,-9,-45,-9r0,95v30,16,60,34,60,72v0,41,-28,62,-60,69r0,30r-18,0r0,-28v-25,0,-48,-3,-62,-10r3,-26v15,9,36,17,59,14r0,-103v-30,-16,-62,-34,-62,-69v0,-35,26,-58,62,-64r0,-24"},"%":{"d":"208,-65v0,-39,17,-67,57,-67v40,0,57,28,57,67v0,39,-17,68,-57,68v-40,0,-57,-29,-57,-68xm265,-113v-48,2,-47,94,0,96v49,-2,48,-94,0,-96xm38,-186v0,-39,17,-68,57,-68v40,0,57,29,57,68v0,39,-17,67,-57,67v-40,0,-57,-28,-57,-67xm95,-234v-48,2,-48,93,0,95v48,-2,47,-93,0,-95xm95,8r149,-267r21,0r-149,267r-21,0","w":360},"&":{"d":"111,-135r66,73v16,-23,22,-49,22,-76r21,0v0,32,-9,66,-28,91r43,46r-32,0r-26,-28v-43,52,-157,46,-159,-37v0,-39,26,-60,59,-73v-15,-18,-32,-37,-32,-62v0,-68,126,-77,126,-3v0,39,-30,54,-60,69xm163,-44r-73,-81v-24,9,-47,30,-47,58v1,64,91,65,120,23xm69,-199v0,20,15,36,29,51v22,-10,49,-22,49,-52v0,-24,-15,-36,-36,-36v-21,0,-42,13,-42,37","w":240},"\u2019":{"d":"26,-173r21,-78r27,0r-28,78r-20,0","w":100,"k":{"\u2019":37,"s":40,"\u0161":40,"t":6}},"(":{"d":"92,50r-15,0v-31,-49,-62,-101,-62,-161v0,-60,31,-112,62,-161r15,0v-26,50,-54,103,-54,161v0,58,28,111,54,161","w":100},")":{"d":"8,-272r15,0v31,49,62,101,62,161v0,60,-31,112,-62,161r-15,0v26,-50,54,-103,54,-161v0,-58,-28,-111,-54,-161","w":100},"*":{"d":"90,-251r21,0r-3,55r52,-20r7,21r-53,15r35,42r-18,14r-31,-47r-30,47r-18,-14r34,-42r-53,-15r6,-21r53,20"},"+":{"d":"17,-79r0,-25r78,0r0,-79r25,0r0,79r79,0r0,25r-79,0r0,79r-25,0r0,-79r-78,0","w":216},",":{"d":"19,48r21,-78r31,0r-29,78r-23,0","w":100},"-":{"d":"15,-85r0,-24r90,0r0,24r-90,0","w":119},".":{"d":"35,0r0,-30r29,0r0,30r-29,0","w":100},"\/":{"d":"-11,4r97,-260r25,0r-97,260r-25,0","w":100},"0":{"d":"100,-232v-52,0,-58,64,-58,106v0,42,6,107,58,107v52,0,58,-65,58,-107v0,-42,-6,-106,-58,-106xm100,-254v67,0,83,69,83,128v0,53,-11,129,-83,129v-72,0,-82,-76,-82,-129v0,-59,15,-128,82,-128"},"1":{"d":"44,-204r57,-47r22,0r0,251r-24,0r0,-223r-41,35"},"2":{"d":"18,0r0,-22v38,-45,118,-106,118,-165v0,-56,-70,-53,-105,-27r-4,-23v50,-29,139,-24,136,49v-2,58,-76,122,-114,166r120,0r0,22r-151,0"},"3":{"d":"54,-120r0,-21v39,0,92,-2,92,-51v0,-49,-77,-47,-114,-27r-2,-23v53,-22,141,-18,141,50v0,31,-22,53,-53,61v33,1,53,28,53,61v2,68,-91,88,-153,62r3,-23v51,22,125,20,125,-41v0,-52,-50,-48,-92,-48"},"4":{"d":"128,-80r-1,-146r-96,146r97,0xm8,-58r0,-24r113,-169r32,0r0,171r37,0r0,22r-37,0r0,58r-25,0r0,-58r-120,0"},"5":{"d":"165,-251r0,21r-104,0r-2,81v54,-17,117,8,117,68v0,76,-77,99,-145,75r0,-26v45,25,116,17,120,-44v4,-61,-68,-65,-117,-49r2,-126r129,0"},"6":{"d":"100,3v-67,0,-80,-61,-80,-120v0,-91,55,-158,154,-131r-3,24v-10,-5,-27,-8,-41,-8v-65,-1,-85,53,-85,104v39,-53,138,-43,138,48v0,49,-32,83,-83,83xm104,-137v-36,0,-57,23,-57,56v0,31,17,62,54,62v37,0,57,-25,57,-59v0,-37,-19,-59,-54,-59"},"7":{"d":"50,0r100,-230r-129,0r0,-21r153,0r0,21r-97,230r-27,0"},"8":{"d":"24,-195v0,-80,150,-79,151,0v0,31,-27,51,-51,64v34,12,60,27,60,67v-2,93,-165,89,-167,0v0,-39,25,-55,58,-67v-26,-12,-51,-31,-51,-64xm159,-67v0,-32,-36,-42,-59,-54v-29,12,-59,22,-59,57v0,57,119,64,118,-3xm49,-193v0,29,30,43,51,53v23,-11,50,-27,50,-53v-1,-53,-101,-51,-101,0"},"9":{"d":"100,-254v67,0,80,60,80,119v0,91,-55,159,-153,132r2,-24v10,5,27,8,41,8v64,2,88,-55,85,-104v-39,51,-137,43,-137,-48v0,-49,31,-83,82,-83xm96,-114v36,0,57,-23,57,-56v0,-31,-17,-62,-54,-62v-37,0,-57,25,-57,59v0,37,19,59,54,59"},":":{"d":"64,-184r0,31r-29,0r0,-31r29,0xm35,0r0,-30r29,0r0,30r-29,0","w":100},";":{"d":"19,48r21,-78r31,0r-29,78r-23,0xm64,-184r0,31r-29,0r0,-31r29,0","w":100},"<":{"d":"199,-185r0,24r-155,70r155,70r0,24r-182,-83r0,-22","w":216},"=":{"d":"17,-115r0,-25r182,0r0,25r-182,0xm17,-42r0,-25r182,0r0,25r-182,0","w":216},">":{"d":"17,3r0,-24r155,-70r-155,-70r0,-24r182,83r0,22","w":216},"?":{"d":"32,-224r-1,-23v54,-19,122,-11,122,56v0,61,-65,67,-62,130r-23,0v-3,-70,59,-72,60,-130v1,-49,-61,-49,-96,-33xm66,0r0,-30r29,0r0,30r-29,0","w":180},"@":{"d":"96,-104v0,22,11,34,26,34v35,0,59,-46,59,-76v0,-25,-16,-32,-29,-32v-23,0,-56,31,-56,74xm222,-194v-11,39,-27,74,-34,116v0,4,1,8,7,8v27,0,53,-35,53,-77v0,-56,-50,-87,-104,-87v-60,0,-106,46,-106,108v0,63,46,109,106,109v41,0,75,-16,95,-40r22,0v-22,39,-66,61,-117,61v-86,0,-130,-65,-130,-130v0,-65,44,-130,130,-130v63,0,128,38,128,109v0,62,-51,99,-81,99v-16,0,-26,-7,-29,-22v-9,10,-21,22,-45,22v-28,0,-48,-24,-48,-54v0,-64,83,-140,123,-70r7,-22r23,0","w":288},"A":{"d":"5,0r103,-251r28,0r99,251r-25,0r-27,-67r-127,0r-27,67r-24,0xm174,-89r-54,-139r-55,139r109,0","w":240},"B":{"d":"29,0r0,-251v67,0,137,-8,139,62v1,33,-17,50,-46,58v32,6,54,26,54,59v-1,73,-73,74,-147,72xm54,-120r0,98v47,1,97,0,97,-49v0,-53,-50,-49,-97,-49xm54,-230r0,89v44,0,89,4,89,-47v0,-50,-46,-41,-89,-42"},"C":{"d":"205,-246r-2,23v-78,-34,-158,13,-158,97v0,85,79,133,158,98r2,22v-95,35,-184,-21,-184,-120v0,-97,87,-155,184,-120","w":240},"D":{"d":"54,-230r0,208v83,3,138,-21,138,-105v0,-92,-57,-108,-138,-103xm29,0r0,-251r62,0v90,0,126,52,126,125v-1,107,-80,132,-188,126","w":240},"E":{"d":"31,0r0,-251r123,0r0,21r-98,0r0,90r93,0r0,22r-93,0r0,96r102,0r0,22r-127,0","w":180},"F":{"d":"28,0r0,-251r119,0r0,21r-94,0r0,90r90,0r0,22r-90,0r0,118r-25,0","w":159,"k":{"A":20,"\u00c6":20,"\u00c1":20,"\u00c2":20,"\u00c4":20,"\u00c0":20,"\u00c5":20,"\u00c3":20,",":46,".":46}},"G":{"d":"203,-26r0,-88r-58,0r0,-22r83,0r0,125v-98,43,-205,-6,-205,-115v0,-101,97,-157,194,-118r-3,23v-79,-38,-166,8,-166,95v0,83,74,131,155,100","w":259},"H":{"d":"32,0r0,-251r25,0r0,111r127,0r0,-111r24,0r0,251r-24,0r0,-118r-127,0r0,118r-25,0","w":240},"I":{"d":"28,0r0,-251r25,0r0,251r-25,0","w":79},"J":{"d":"90,-251r0,186v3,49,-35,81,-85,65r0,-22v32,16,60,-7,60,-42r0,-187r25,0","w":119},"K":{"d":"34,0r0,-251r25,0r0,112r113,-112r32,0r-121,118r132,133r-34,0r-122,-126r0,126r-25,0","w":219},"L":{"d":"29,0r0,-251r25,0r0,229r100,0r0,22r-125,0","w":159,"k":{"T":33,"V":33,"W":20,"y":13,"\u00fd":13,"\u00ff":13,"Y":40,"\u00dd":40,"\u0178":40,"\u2019":35}},"M":{"d":"31,0r0,-251r38,0r92,221r92,-221r36,0r0,251r-25,0r0,-226r-92,226r-21,0r-95,-226r0,226r-25,0","w":320},"N":{"d":"28,0r0,-251r31,0r129,221r0,-221r24,0r0,251r-33,0r-126,-217r0,217r-25,0","w":240},"O":{"d":"19,-126v-1,-68,35,-130,111,-130v76,0,111,62,110,130v-1,77,-38,130,-110,130v-72,0,-110,-53,-111,-130xm130,-234v-116,1,-115,215,0,217v115,-1,116,-216,0,-217","w":259},"P":{"d":"31,0r0,-251v73,-3,142,-2,140,71v-1,59,-51,76,-115,71r0,109r-25,0xm56,-230r0,100v46,0,88,1,90,-50v2,-48,-41,-53,-90,-50","w":180,"k":{"A":27,"\u00c6":27,"\u00c1":27,"\u00c2":27,"\u00c4":27,"\u00c0":27,"\u00c5":27,"\u00c3":27,",":55,".":55}},"Q":{"d":"228,47r-33,0r-45,-44v-86,10,-130,-45,-131,-129v-1,-68,35,-130,111,-130v135,0,141,215,45,252xm130,-234v-116,1,-115,215,0,217v115,-1,116,-216,0,-217","w":259},"R":{"d":"57,-230r0,90v44,2,88,-1,88,-46v0,-51,-44,-43,-88,-44xm32,0r0,-251v69,-2,138,-6,138,65v0,33,-27,52,-56,59v20,3,25,13,33,30r43,97r-28,0r-36,-85v-17,-40,-31,-32,-69,-33r0,118r-25,0","k":{"T":-2,"V":-2,"W":-2,"y":-9,"\u00fd":-9,"\u00ff":-9,"Y":5,"\u00dd":5,"\u0178":5}},"S":{"d":"22,-6r2,-26v36,24,112,24,112,-37v0,-49,-115,-55,-115,-121v0,-58,71,-80,129,-57r-4,22v-34,-15,-100,-16,-100,34v0,50,115,51,115,124v0,73,-86,82,-139,61","w":180},"T":{"d":"78,0r0,-230r-74,0r0,-21r173,0r0,21r-74,0r0,230r-25,0","w":180,"k":{"\u00fc":33,"\u0161":40,"\u00f2":40,"\u00f6":40,"\u00e8":40,"\u00eb":40,"\u00ea":40,"\u00e3":40,"\u00e5":40,"\u00e0":40,"\u00e4":40,"\u00e2":40,"w":36,"y":40,"\u00fd":40,"\u00ff":40,"A":24,"\u00c6":24,"\u00c1":24,"\u00c2":24,"\u00c4":24,"\u00c0":24,"\u00c5":24,"\u00c3":24,",":40,".":40,"c":40,"\u00e7":40,"e":40,"\u00e9":40,"o":40,"\u00f8":40,"\u0153":40,"\u00f3":40,"\u00f4":40,"\u00f5":40,"-":46,"a":40,"\u00e6":40,"\u00e1":40,"i":-9,"\u0131":-9,"\u00ed":-9,"\u00ee":-9,"\u00ef":-9,"\u00ec":-9,"r":33,"s":40,"u":33,"\u00fa":33,"\u00fb":33,"\u00f9":33,":":40,";":36}},"U":{"d":"211,-251r0,163v0,74,-54,92,-91,92v-37,0,-91,-18,-91,-92r0,-163r25,0r0,163v0,41,22,71,66,71v101,-1,57,-143,66,-234r25,0","w":240},"V":{"d":"218,-251r-96,251r-26,0r-94,-251r26,0r81,226r84,-226r25,0","w":219,"k":{"\u00f6":20,"\u00f4":20,"\u00e8":20,"\u00eb":20,"\u00ea":20,"\u00e3":20,"\u00e5":20,"\u00e0":20,"\u00e4":20,"\u00e2":20,"y":6,"\u00fd":6,"\u00ff":6,"A":20,"\u00c6":20,"\u00c1":20,"\u00c2":20,"\u00c4":20,"\u00c0":20,"\u00c5":20,"\u00c3":20,",":46,".":46,"e":20,"\u00e9":20,"o":20,"\u00f8":20,"\u0153":20,"\u00f3":20,"\u00f2":20,"\u00f5":20,"-":20,"a":20,"\u00e6":20,"\u00e1":20,"i":-2,"\u0131":-2,"\u00ed":-2,"\u00ee":-2,"\u00ef":-2,"\u00ec":-2,"r":13,"u":13,"\u00fa":13,"\u00fb":13,"\u00fc":13,"\u00f9":13,":":27,";":27}},"W":{"d":"337,-251r-73,251r-30,0r-64,-223r-65,223r-30,0r-72,-251r26,0r62,223r65,-223r30,0r64,223r63,-223r24,0","w":339,"k":{"\u00fc":6,"\u00f6":6,"\u00ea":6,"\u00e4":13,"A":15,"\u00c6":15,"\u00c1":15,"\u00c2":15,"\u00c4":15,"\u00c0":15,"\u00c5":15,"\u00c3":15,",":27,".":27,"e":6,"\u00e9":6,"\u00eb":6,"\u00e8":6,"o":6,"\u00f8":6,"\u0153":6,"\u00f3":6,"\u00f4":6,"\u00f2":6,"\u00f5":6,"a":13,"\u00e6":13,"\u00e1":13,"\u00e2":13,"\u00e0":13,"\u00e5":13,"\u00e3":13,"i":-9,"\u0131":-9,"\u00ed":-9,"\u00ee":-9,"\u00ef":-9,"\u00ec":-9,"r":6,"u":6,"\u00fa":6,"\u00fb":6,"\u00f9":6,":":6,";":6}},"X":{"d":"3,0r93,-132r-84,-119r29,0r71,101r71,-101r28,0r-85,119r91,132r-30,0r-76,-114r-80,114r-28,0","w":219},"Y":{"d":"98,0r0,-107r-94,-144r29,0r77,122r79,-122r27,0r-94,144r0,107r-24,0","w":219,"k":{"\u00fc":27,"\u00f6":33,"v":20,"A":31,"\u00c6":31,"\u00c1":31,"\u00c2":31,"\u00c4":31,"\u00c0":31,"\u00c5":31,"\u00c3":31,",":44,".":36,"e":33,"\u00e9":33,"\u00ea":33,"\u00eb":33,"\u00e8":33,"o":33,"\u00f8":33,"\u0153":33,"\u00f3":33,"\u00f4":33,"\u00f2":33,"\u00f5":33,"q":33,"-":40,"a":33,"\u00e6":33,"\u00e1":33,"\u00e2":33,"\u00e4":33,"\u00e0":33,"\u00e5":33,"\u00e3":33,"i":3,"\u0131":3,"\u00ed":3,"\u00ee":3,"\u00ef":3,"\u00ec":3,"u":27,"\u00fa":27,"\u00fb":27,"\u00f9":27,":":33,";":33,"p":27}},"Z":{"d":"8,0r0,-22r131,-208r-128,0r0,-21r154,0r0,21r-130,208r134,0r0,22r-161,0","w":180},"[":{"d":"25,50r0,-322r58,0r0,17r-35,0r0,288r35,0r0,17r-58,0","w":100},"\\":{"d":"14,-256r97,260r-25,0r-97,-260r25,0","w":100},"]":{"d":"75,-272r0,322r-58,0r0,-17r36,0r0,-288r-36,0r0,-17r58,0","w":100},"^":{"d":"18,-95r78,-156r24,0r78,156r-26,0r-64,-131r-64,131r-26,0","w":216},"_":{"d":"0,27r180,0r0,18r-180,0r0,-18","w":180},"\u2018":{"d":"74,-251r-21,78r-27,0r28,-78r20,0","w":100,"k":{"\u2018":37}},"a":{"d":"134,0v-1,-9,2,-23,-1,-30v-10,22,-35,34,-58,34v-52,0,-61,-35,-61,-52v1,-64,67,-64,118,-64v11,-63,-57,-67,-96,-41r0,-22v49,-24,117,-19,118,55r2,120r-22,0xm77,-15v58,0,55,-46,55,-78v-42,0,-92,3,-93,45v0,24,17,33,38,33","w":180},"b":{"d":"26,0r0,-270r23,0r1,117v3,-9,21,-35,57,-35v54,0,76,40,76,96v0,54,-26,96,-76,96v-27,1,-44,-12,-58,-33r0,29r-23,0xm158,-92v0,-36,-12,-76,-55,-76v-41,0,-54,43,-54,76v0,33,14,77,54,77v43,0,55,-41,55,-77"},"c":{"d":"150,-181r-2,22v-53,-25,-108,6,-108,67v0,59,52,94,108,69r2,21v-74,25,-135,-21,-135,-90v0,-75,69,-113,135,-89","w":159},"d":{"d":"174,-270r0,270r-23,0v-1,-9,2,-22,-1,-29v-12,23,-31,33,-57,33v-50,0,-75,-42,-75,-96v0,-56,21,-96,75,-96v37,0,52,27,58,35r0,-117r23,0xm42,-92v0,36,12,77,55,77v40,0,54,-44,54,-77v0,-33,-14,-76,-54,-76v-43,0,-55,40,-55,76"},"e":{"d":"152,-29r0,23v-16,6,-37,10,-54,10v-61,0,-83,-41,-83,-96v0,-56,31,-96,77,-96v56,1,75,47,73,103r-125,0v0,39,20,70,60,70v17,0,41,-7,52,-14xm40,-105r100,0v0,-32,-12,-63,-46,-63v-33,0,-54,33,-54,63","w":180},"f":{"d":"44,0r0,-164r-37,0r0,-20r37,0v-6,-53,9,-104,70,-87r-2,20v-5,-3,-12,-4,-18,-4v-36,2,-25,41,-27,71r41,0r0,20r-41,0r0,164r-23,0","w":119,"k":{"\u2019":-6,"f":6,"\ufb01":6,"\ufb02":6,"\u00df":6}},"g":{"d":"97,-168v-77,1,-74,147,-2,149v77,0,76,-152,2,-149xm174,-184v-9,111,39,261,-86,262v-24,0,-47,-7,-56,-10r2,-23v14,7,34,13,54,13v57,1,66,-45,63,-94v-12,27,-33,36,-56,36v-59,0,-77,-51,-77,-92v0,-56,21,-96,75,-96v25,-1,40,5,58,25r0,-21r23,0"},"h":{"d":"28,0r0,-270r23,0r1,117v10,-20,30,-35,57,-35v88,-1,57,108,63,188r-23,0v-8,-65,27,-168,-44,-168v-74,0,-50,97,-54,168r-23,0"},"i":{"d":"28,0r0,-184r23,0r0,184r-23,0xm51,-263r0,30r-23,0r0,-30r23,0","w":79},"j":{"d":"-10,76r0,-20v25,8,38,-7,38,-33r0,-207r23,0r0,210v5,38,-23,60,-61,50xm51,-263r0,30r-23,0r0,-30r23,0","w":79},"k":{"d":"28,0r0,-270r23,0r0,162r82,-76r29,0r-89,82r100,102r-31,0r-91,-94r0,94r-23,0","w":180},"l":{"d":"28,0r0,-270r23,0r0,270r-23,0","w":79},"m":{"d":"273,0r-23,0r0,-122v0,-26,-10,-46,-39,-46v-25,0,-49,20,-49,66r0,102r-23,0r0,-122v0,-26,-10,-46,-39,-46v-25,0,-49,20,-49,66r0,102r-23,0r-1,-184r22,0v1,10,-2,24,1,32v7,-13,18,-36,57,-36v16,0,43,7,49,39v8,-22,30,-39,59,-39v82,0,53,112,58,188","w":299},"n":{"d":"28,0r-1,-184r22,0v1,10,-2,25,1,33v8,-17,21,-37,59,-37v88,0,58,108,63,188r-23,0v-6,-63,23,-168,-44,-168v-77,0,-49,97,-54,168r-23,0"},"o":{"d":"14,-92v0,-50,27,-96,86,-96v59,0,86,46,86,96v0,50,-27,96,-86,96v-59,0,-86,-46,-86,-96xm39,-92v0,42,21,77,61,77v40,0,61,-35,61,-77v0,-42,-21,-76,-61,-76v-40,0,-61,34,-61,76"},"p":{"d":"26,76r0,-260r23,0r-1,34v6,-10,20,-38,59,-38v54,0,76,40,76,96v0,54,-26,96,-76,96v-30,1,-45,-13,-58,-35r0,107r-23,0xm158,-92v0,-36,-12,-76,-55,-76v-40,0,-54,43,-54,76v0,33,14,77,54,77v43,0,55,-41,55,-77"},"q":{"d":"174,-184r0,260r-23,0r-1,-107v-11,24,-28,35,-57,35v-50,0,-75,-42,-75,-96v0,-56,21,-96,75,-96v40,0,51,29,58,34r0,-30r23,0xm42,-92v0,36,12,77,55,77v40,0,54,-44,54,-77v0,-33,-14,-76,-54,-76v-43,0,-55,40,-55,76"},"r":{"d":"28,0r-1,-184r23,0r0,36v10,-25,31,-47,63,-38r0,24v-78,-14,-61,86,-62,162r-23,0","w":119,"k":{",":33,".":33,"c":6,"\u00e7":6,"d":6,"e":6,"\u00e9":6,"\u00ea":6,"\u00eb":6,"\u00e8":6,"n":-6,"\u00f1":-6,"o":6,"\u00f8":6,"\u0153":6,"\u00f3":6,"\u00f4":6,"\u00f6":6,"\u00f2":6,"\u00f5":6,"q":6,"-":20}},"s":{"d":"12,-4r2,-23v28,17,88,20,89,-21v0,-44,-88,-37,-88,-90v0,-53,57,-58,105,-42r-2,20v-28,-11,-81,-17,-81,22v0,34,91,30,91,90v0,59,-69,59,-116,44","w":140},"t":{"d":"108,-184r0,20r-42,0r0,119v-4,26,24,37,45,26r2,18v-5,2,-17,5,-28,5v-40,0,-42,-28,-42,-61r0,-107r-36,0r0,-20r36,0r0,-44r23,-8r0,52r42,0","w":119},"u":{"d":"172,-184r1,184r-22,0v-1,-10,2,-25,-1,-33v-8,17,-21,37,-59,37v-88,1,-58,-108,-63,-188r23,0v6,64,-23,169,44,169v77,0,49,-97,54,-169r23,0"},"v":{"d":"157,-184r-65,184r-26,0r-63,-184r25,0r52,159r53,-159r24,0","w":159,"k":{",":27,".":27}},"w":{"d":"278,-184r-61,184r-27,0r-51,-159r-50,159r-27,0r-59,-184r24,0r49,159r51,-159r28,0r49,159r51,-159r23,0","w":280,"k":{",":20,".":20}},"x":{"d":"3,0r64,-97r-58,-87r28,0r44,69r44,-69r26,0r-57,87r63,97r-28,0r-48,-79r-52,79r-26,0","w":159},"y":{"d":"28,-184r52,153r53,-153r24,0r-74,211v-11,33,-29,61,-71,48r2,-20v34,14,48,-19,54,-53r-65,-186r25,0","w":159,"k":{",":33,".":33}},"z":{"d":"12,0r0,-19r110,-145r-106,0r0,-20r132,0r0,20r-110,145r110,0r0,19r-136,0","w":159},"{":{"d":"98,-272r0,17v-49,-11,-34,52,-34,93v0,35,-22,49,-30,51v8,2,30,16,30,52v0,37,-18,102,34,92r0,17v-60,13,-56,-48,-56,-105v0,-26,-9,-47,-28,-47r0,-18v65,-5,-21,-171,84,-152","w":100},"|":{"d":"28,-270r25,0r0,360r-25,0r0,-360","w":79},"}":{"d":"2,50r0,-17v49,11,34,-52,34,-93v0,-35,22,-49,30,-51v-8,-2,-30,-16,-30,-52v0,-37,18,-102,-34,-92r0,-17v60,-13,56,48,56,105v0,26,9,47,28,47r0,18v-65,5,21,171,-84,152","w":100},"~":{"d":"70,-117v24,-1,57,26,77,27v14,0,23,-14,31,-27r13,19v-8,15,-21,32,-45,32v-24,0,-56,-25,-77,-26v-14,0,-23,13,-31,26r-13,-18v8,-15,21,-33,45,-33","w":216},"\u00a1":{"d":"55,68r5,-191r20,0r5,191r-30,0xm85,-184r0,31r-30,0r0,-31r30,0","w":140},"\u00a2":{"d":"86,-30r46,-138v-74,-7,-93,99,-46,138xm147,-212r16,0r-9,27v8,1,14,3,17,4r-2,22v-6,-3,-14,-5,-21,-7r-48,145v21,10,46,6,68,-2r3,21v-24,7,-55,9,-78,1r-11,34r-17,0r13,-40v-75,-43,-44,-202,61,-180"},"\u00a3":{"d":"24,0r0,-22r37,0r0,-103r-33,0r0,-19r33,0v-2,-59,8,-107,79,-110v19,0,34,5,40,8r-3,22v-6,-4,-19,-8,-37,-8v-55,2,-54,45,-54,88r60,0r0,19r-60,0r0,103r89,0r0,22r-151,0"},"\u2044":{"d":"-55,8r149,-267r20,0r-148,267r-21,0","w":60},"\u00a5":{"d":"88,0r0,-63r-52,0r0,-17r52,0v-1,-9,1,-21,-1,-29r-51,0r0,-18r41,0r-70,-124r27,0r66,121r68,-121r25,0r-70,124r42,0r0,18v-16,2,-39,-3,-52,2r0,27r52,0r0,17r-52,0r0,63r-25,0"},"\u0192":{"d":"165,-151r0,20r-45,0r-26,130v-11,63,-32,89,-85,75r6,-19v38,12,49,-18,57,-60r24,-126r-40,0r0,-20r44,0v5,-55,26,-123,92,-97r-5,18v-45,-25,-56,34,-64,79r42,0"},"\u00a7":{"d":"64,-161v-17,-8,-30,-21,-30,-41v1,-60,76,-60,118,-46r-3,21v-24,-12,-90,-17,-90,21v0,47,108,38,108,100v0,22,-13,35,-27,49v15,8,28,22,28,42v0,71,-80,64,-134,48r3,-21v37,17,106,23,106,-26v0,-45,-111,-34,-111,-98v0,-21,17,-37,32,-49xm81,-152v-9,4,-24,20,-24,39v0,30,43,35,65,47v10,-8,22,-20,22,-36v-1,-34,-40,-37,-63,-50"},"\u00a4":{"d":"10,-51r20,-20v-25,-30,-27,-78,0,-109r-20,-20r15,-16r21,20v30,-25,79,-25,109,0r19,-20r16,16r-19,20v25,30,24,79,0,109r19,20r-16,16r-19,-20v-28,25,-80,26,-109,0r-21,20xm100,-58v38,0,65,-32,65,-68v0,-36,-27,-67,-65,-67v-37,0,-64,32,-64,67v0,39,28,68,64,68"},"'":{"d":"39,-173r0,-78r23,0r0,78r-23,0","w":100},"\u201c":{"d":"93,-251r-22,78r-27,0r28,-78r21,0xm156,-251r-21,78r-27,0r27,-78r21,0"},"\u00ab":{"d":"104,-171r-47,74r47,74r-21,0r-50,-74r50,-74r21,0xm167,-171r-47,74r47,74r-21,0r-50,-74r50,-74r21,0"},"\u2039":{"d":"86,-171r-48,74r48,74r-22,0r-50,-74r50,-74r22,0","w":100},"\u203a":{"d":"14,-23r48,-74r-48,-74r22,0r50,74r-50,74r-22,0","w":100},"\ufb01":{"d":"145,0r0,-184r23,0r0,184r-23,0xm168,-263r0,30r-23,0r0,-30r23,0xm44,0r0,-164r-37,0r0,-20r37,0v-6,-53,9,-104,70,-87r-2,20v-5,-3,-12,-4,-18,-4v-36,2,-25,41,-27,71r41,0r0,20r-41,0r0,164r-23,0"},"\ufb02":{"d":"145,0r0,-270r23,0r0,270r-23,0xm44,0r0,-164r-37,0r0,-20r37,0v-6,-53,9,-104,70,-87r-2,20v-5,-3,-12,-4,-18,-4v-36,2,-25,41,-27,71r41,0r0,20r-41,0r0,164r-23,0"},"\u2013":{"d":"0,-87r0,-20r180,0r0,20r-180,0","w":180},"\u2020":{"d":"89,0r0,-164r-63,0r0,-20r63,0r0,-67r22,0r0,67r64,0r0,20r-64,0r0,164r-22,0"},"\u2021":{"d":"26,-68r0,-19r63,0r0,-77r-63,0r0,-20r63,0r0,-67r22,0r0,67r64,0r0,20r-64,0r0,77r64,0r0,19r-64,0r0,68r-22,0r0,-68r-63,0"},"\u00b7":{"d":"33,-112v1,-22,33,-23,34,0v-1,22,-33,23,-34,0","w":100},"\u00b6":{"d":"92,39r0,-154v-44,0,-75,-30,-75,-67v0,-79,90,-70,169,-69r0,290r-23,0r0,-271r-48,0r0,271r-23,0","w":216},"\u2022":{"d":"27,-126v0,-35,28,-63,63,-63v35,0,63,28,63,63v0,35,-28,63,-63,63v-35,0,-63,-28,-63,-63","w":180},"\u201a":{"d":"26,48r21,-78r27,0r-28,78r-20,0","w":100},"\u201e":{"d":"44,48r22,-78r27,0r-28,78r-21,0xm108,48r21,-78r27,0r-28,78r-20,0"},"\u201d":{"d":"108,-173r21,-78r27,0r-28,78r-20,0xm44,-173r22,-78r27,0r-28,78r-21,0"},"\u00bb":{"d":"96,-23r48,-74r-48,-74r21,0r50,74r-50,74r-21,0xm33,-23r48,-74r-48,-74r21,0r50,74r-50,74r-21,0"},"\u2026":{"d":"46,0r0,-30r29,0r0,30r-29,0xm166,0r0,-30r29,0r0,30r-29,0xm285,0r0,-30r30,0r0,30r-30,0","w":360},"\u2030":{"d":"15,-190v0,-34,9,-64,48,-64v39,0,47,30,47,64v0,34,-8,64,-47,64v-39,0,-48,-31,-48,-64xm38,-190v0,18,0,46,25,46v25,0,24,-28,24,-46v0,-18,1,-47,-24,-47v-25,0,-25,29,-25,47xm137,-61v0,-31,7,-64,47,-64v40,0,48,33,48,64v0,31,-8,64,-48,64v-40,0,-47,-33,-47,-64xm159,-61v0,18,0,46,25,46v25,0,25,-28,25,-46v0,-18,0,-47,-25,-47v-25,0,-25,29,-25,47xm250,-61v0,-31,7,-64,47,-64v40,0,48,33,48,64v0,31,-8,64,-48,64v-40,0,-47,-33,-47,-64xm273,-61v0,18,-1,46,24,46v25,0,25,-28,25,-46v0,-18,0,-47,-25,-47v-25,0,-24,29,-24,47xm39,8r149,-267r20,0r-148,267r-21,0","w":360},"\u00bf":{"d":"148,40r1,23v-53,18,-122,12,-122,-55v0,-61,66,-67,62,-131r23,0v3,70,-59,73,-60,131v-1,49,61,48,96,32xm114,-184r0,31r-29,0r0,-31r29,0","w":180},"`":{"d":"27,-258r33,52r-16,0r-45,-52r28,0","w":79},"\u00b4":{"d":"19,-206r34,-52r28,0r-45,52r-17,0","w":79},"\u02c6":{"d":"-8,-206r33,-52r30,0r33,52r-16,0r-32,-37r-32,37r-16,0","w":79},"\u02dc":{"d":"88,-250v-10,47,-39,29,-69,23v-9,0,-13,4,-16,13r-13,0v3,-15,12,-33,29,-33v19,1,48,20,56,-3r13,0","w":79},"\u00af":{"d":"-4,-221r0,-19r88,0r0,19r-88,0","w":79},"\u02d8":{"d":"-4,-252r10,0v9,28,58,29,67,0r11,0v-3,24,-19,42,-44,42v-25,0,-41,-18,-44,-42","w":79},"\u02d9":{"d":"27,-217r0,-31r27,0r0,31r-27,0","w":79},"\u00a8":{"d":"57,-217r0,-31r27,0r0,31r-27,0xm-4,-217r0,-31r27,0r0,31r-27,0","w":79},"\u02da":{"d":"5,-233v0,-19,15,-34,35,-34v19,0,35,15,35,34v0,19,-16,34,-35,34v-20,0,-35,-15,-35,-34xm18,-233v0,12,10,21,22,21v12,0,22,-9,22,-21v0,-12,-10,-22,-22,-22v-12,0,-22,10,-22,22","w":79},"\u00b8":{"d":"27,31r10,-31r10,0r-7,19v19,-4,38,3,38,23v1,35,-59,24,-75,17r2,-14v7,7,50,21,51,-3v0,-14,-17,-15,-29,-11","w":79},"\u02dd":{"d":"50,-206r33,-52r29,0r-46,52r-16,0xm-12,-206r34,-52r28,0r-45,52r-17,0","w":79},"\u02db":{"d":"70,63v12,3,17,-18,26,-11v-2,25,-68,36,-68,-3v0,-26,29,-48,54,-49v-25,20,-31,33,-31,45v0,11,7,18,19,18","w":79},"\u02c7":{"d":"88,-258r-33,52r-30,0r-33,-52r16,0r32,37r32,-37r16,0","w":79},"\u2014":{"d":"0,-87r0,-20r360,0r0,20r-360,0","w":360},"\u00c6":{"d":"172,-89r-1,-143r-89,143r90,0xm0,0r157,-251r137,0r0,21r-97,0r0,90r92,0r0,22r-92,0r0,96r101,0r0,22r-126,0r0,-67r-103,0r-42,67r-27,0","w":320},"\u00aa":{"d":"87,-143v-1,-5,2,-14,-1,-17v-10,32,-85,23,-77,-12v0,-39,43,-40,77,-40v0,-16,1,-26,-26,-28v-13,0,-24,2,-35,8r0,-16v28,-14,78,-11,79,33r1,72r-18,0xm52,-155v38,-2,34,-25,34,-42v-26,0,-59,3,-59,23v0,14,11,19,25,19","w":117},"\u0141":{"d":"29,-112r0,-139r25,0r0,121r63,-44r0,25r-63,44r0,83r100,0r0,22r-125,0r0,-87r-26,18r0,-25","w":159,"k":{"T":33,"V":33,"W":20,"y":13,"\u00fd":13,"\u00ff":13,"Y":40,"\u00dd":40,"\u0178":40,"\u2019":35}},"\u00d8":{"d":"60,-61r128,-147v-14,-16,-33,-26,-58,-26v-83,1,-105,108,-70,173xm199,-192r-128,147v14,17,33,28,59,28v83,-1,106,-110,69,-175xm235,-262r14,12r-32,38v50,78,17,216,-87,216v-33,0,-58,-11,-76,-30r-30,34r-14,-12r32,-36v-48,-77,-22,-216,88,-216v32,0,56,12,74,30","w":259},"\u0152":{"d":"294,-251r0,21r-97,0r0,90r92,0r0,22r-92,0r0,96r101,0r0,22r-179,3v-136,-1,-136,-257,0,-257v56,0,116,3,175,3xm172,-22r0,-208v-13,-1,-27,-2,-46,-2v-12,0,-82,0,-82,106v0,106,70,107,82,107v19,0,33,-2,46,-3","w":320},"\u00ba":{"d":"8,-197v0,-31,17,-59,57,-59v40,0,57,27,57,59v0,30,-17,57,-57,57v-40,0,-57,-26,-57,-57xm27,-197v0,24,14,42,38,42v24,0,38,-18,38,-42v0,-23,-14,-43,-38,-43v-24,0,-38,20,-38,43","w":129},"\u00e6":{"d":"80,-15v43,-1,56,-31,54,-70v-34,0,-93,-4,-93,40v0,19,21,30,39,30xm270,-29r0,23v-43,19,-113,10,-123,-27v-21,30,-47,37,-70,37v-36,0,-60,-17,-60,-49v0,-64,70,-60,117,-60v1,-35,-5,-63,-41,-63v-19,0,-38,4,-55,15r0,-22v39,-17,95,-24,113,20v13,-20,35,-33,59,-33v56,1,75,47,73,103r-124,0v-2,41,14,69,59,70v17,0,41,-7,52,-14xm159,-105r99,0v0,-32,-12,-63,-46,-63v-32,0,-53,31,-53,63","w":299},"\u0131":{"d":"28,0r0,-184r23,0r0,184r-23,0","w":79},"\u0142":{"d":"28,0r0,-123r-23,19r0,-25r23,-19r0,-122r23,0r0,104r24,-19r0,25r-24,19r0,141r-23,0","w":79},"\u00f8":{"d":"50,-46r91,-105v-40,-40,-102,-3,-102,59v0,17,4,33,11,46xm151,-137r-91,105v40,41,101,1,101,-60v0,-17,-3,-32,-10,-45xm181,-196r12,10r-26,30v40,58,18,162,-67,160v-23,0,-41,-7,-55,-19r-26,29r-12,-10r27,-31v-41,-58,-20,-163,66,-161v24,0,43,7,56,20"},"\u0153":{"d":"181,-105r101,0v0,-32,-15,-63,-47,-63v-35,0,-54,26,-54,63xm307,-85r-126,0v0,39,21,70,61,70v17,0,40,-7,51,-14r0,23v-45,18,-109,11,-124,-27v-13,22,-36,37,-70,37v-59,0,-86,-46,-86,-96v0,-50,27,-96,86,-96v31,0,56,12,69,40v13,-26,35,-40,66,-40v56,1,76,48,73,103xm38,-92v0,42,21,77,61,77v45,0,57,-35,57,-77v0,-39,-11,-76,-57,-76v-40,0,-61,34,-61,76","w":320},"\u00df":{"d":"28,0r0,-195v0,-46,23,-79,72,-79v79,0,92,118,20,129v38,6,62,28,62,68v0,57,-49,94,-109,75r2,-21v41,19,82,-8,82,-54v0,-43,-29,-56,-72,-55r0,-20v35,2,58,-20,59,-55v0,-27,-17,-48,-44,-48v-26,0,-49,14,-49,68r0,187r-23,0"},"\u00b9":{"d":"84,-254r0,152r-21,0r0,-132r-27,21r-8,-12v18,-10,25,-32,56,-29","w":129},"\u00ac":{"d":"17,-115r0,-25r182,0r0,99r-25,0r0,-74r-157,0","w":216},"\u00b5":{"d":"28,76r0,-260r23,0v6,64,-23,169,44,169v77,0,49,-97,54,-169r23,0r1,184r-22,0v-1,-10,2,-25,-1,-33v-4,28,-63,51,-99,27r0,82r-23,0"},"\u2122":{"d":"70,-102r0,-132r-47,0r0,-17r117,0r0,17r-47,0r0,132r-23,0xm172,-102r0,-149r37,0r44,115r44,-115r36,0r0,149r-22,0r-1,-130r-50,130r-15,0r-50,-130r0,130r-23,0","w":356},"\u00d0":{"d":"29,-140r0,-111v110,-6,189,20,188,125v-1,107,-80,132,-188,126r0,-118r-25,0r0,-22r25,0xm54,-230r0,90r76,0r0,22r-76,0r0,96v83,3,138,-21,138,-105v0,-87,-56,-105,-138,-103","w":240},"\u00bd":{"d":"42,8r160,-267r20,0r-159,267r-21,0xm77,-254r0,152r-20,0r0,-132r-28,21r-8,-12v18,-10,25,-32,56,-29xm181,0r0,-15v25,-24,76,-59,76,-94v0,-33,-45,-28,-67,-14r-3,-18v33,-18,92,-17,91,31v-1,44,-45,68,-70,93r71,0r0,17r-98,0","w":300},"\u00b1":{"d":"17,-97r0,-25r78,0r0,-61r25,0r0,61r79,0r0,25r-79,0r0,61r-25,0r0,-61r-78,0xm17,0r0,-25r182,0r0,25r-182,0","w":216},"\u00de":{"d":"31,0r0,-251r25,0r0,47v65,-4,116,9,115,71v-1,59,-51,76,-115,71r0,62r-25,0xm56,-183r0,99v45,0,88,2,90,-49v1,-48,-41,-53,-90,-50","w":180},"\u00bc":{"d":"234,-50v-1,-25,2,-54,-1,-77r-57,77r58,0xm155,-33r0,-17r75,-102r25,0r0,102r20,0r0,17r-20,0r0,33r-21,0r0,-33r-79,0xm47,8r159,-267r21,0r-160,267r-20,0xm81,-254r0,152r-20,0r0,-132r-28,21r-7,-12v18,-10,24,-32,55,-29","w":300},"\u00f7":{"d":"17,-79r0,-25r182,0r0,25r-182,0xm85,-162v0,-13,11,-23,23,-23v12,0,23,11,23,23v0,12,-11,23,-23,23v-12,0,-23,-11,-23,-23xm85,-21v0,-13,11,-23,23,-23v12,0,23,11,23,23v0,12,-11,24,-23,24v-12,0,-23,-12,-23,-24","w":216},"\u00a6":{"d":"28,-243r25,0r0,126r-25,0r0,-126xm28,-63r25,0r0,126r-25,0r0,-126","w":79},"\u00b0":{"d":"72,-237v-22,0,-39,14,-39,37v0,21,19,36,39,36v20,0,39,-15,39,-36v0,-23,-17,-37,-39,-37xm72,-254v31,0,57,22,57,54v0,32,-26,53,-57,53v-31,0,-57,-21,-57,-53v0,-32,26,-54,57,-54","w":144},"\u00fe":{"d":"26,76r0,-346r23,0r1,120v4,-10,18,-38,57,-38v54,0,76,40,76,96v0,54,-26,96,-76,96v-30,1,-45,-13,-58,-37r0,109r-23,0xm158,-92v0,-36,-12,-76,-55,-76v-40,0,-54,43,-54,76v0,33,14,77,54,77v43,0,55,-41,55,-77"},"\u00be":{"d":"241,-50v-1,-25,2,-54,-1,-77r-57,77r58,0xm162,-33r0,-17r75,-102r24,0r0,102r21,0r0,17r-21,0r0,33r-20,0r0,-33r-79,0xm75,8r159,-267r21,0r-160,267r-20,0xm42,-171r0,-18v23,0,55,1,59,-26v-7,-33,-51,-23,-73,-13r-1,-19v36,-13,92,-11,95,31v1,19,-17,30,-35,36v23,1,35,17,35,37v-2,45,-63,50,-103,37r2,-19v28,13,81,13,81,-20v0,-31,-37,-25,-60,-26","w":300},"\u00b2":{"d":"16,-102r0,-15v25,-24,76,-59,76,-94v0,-33,-44,-30,-67,-15r-3,-18v34,-17,92,-15,91,32v-1,44,-44,67,-70,92r71,0r0,18r-98,0","w":129},"\u00ae":{"d":"14,-126v0,-72,58,-130,130,-130v72,0,130,58,130,130v0,72,-58,130,-130,130v-72,0,-130,-58,-130,-130xm39,-126v0,62,45,111,105,111v60,0,105,-49,105,-111v0,-62,-45,-110,-105,-110v-60,0,-105,48,-105,110xm94,-50r0,-152v50,0,111,-8,111,43v0,24,-15,42,-39,42r43,67r-26,0r-43,-67r-21,0r0,67r-25,0xm119,-183r0,47v28,-1,62,7,61,-24v-1,-28,-34,-23,-61,-23","w":288},"\u2212":{"d":"17,-79r0,-25r182,0r0,25r-182,0","w":216},"\u00f0":{"d":"39,-92v0,42,21,77,61,77v40,0,61,-35,61,-77v0,-42,-21,-76,-61,-76v-40,0,-61,34,-61,76xm76,-203r-10,-15r32,-21v-14,-9,-30,-14,-48,-18r4,-17v26,4,48,11,66,22r38,-23r11,15r-34,20v69,50,79,244,-35,244v-59,0,-86,-46,-86,-96v0,-50,27,-96,86,-96v23,0,42,11,57,29v-6,-28,-21,-51,-42,-68"},"\u00d7":{"d":"91,-93r-65,-64r17,-18r65,65r65,-65r18,18r-65,64r65,66r-18,18r-65,-66r-65,66r-17,-18","w":216},"\u00b3":{"d":"36,-171r0,-18v22,0,55,0,58,-26v-7,-33,-51,-23,-73,-13r-1,-19v37,-13,92,-11,95,31v1,19,-16,30,-34,36v23,1,35,17,35,37v0,45,-64,50,-104,37r2,-19v28,13,81,13,81,-20v0,-30,-36,-25,-59,-26","w":129},"\u00a9":{"d":"39,-126v0,62,45,111,105,111v60,0,105,-49,105,-111v0,-62,-45,-110,-105,-110v-60,0,-105,48,-105,110xm191,-101r22,0v-17,94,-149,58,-142,-25v-11,-85,129,-115,141,-27r-21,0v-18,-61,-101,-35,-95,27v-8,60,85,88,95,25xm14,-126v0,-72,58,-130,130,-130v72,0,130,58,130,130v0,72,-58,130,-130,130v-72,0,-130,-58,-130,-130","w":288},"\u00c1":{"d":"5,0r103,-251r28,0r99,251r-25,0r-27,-67r-127,0r-27,67r-24,0xm174,-89r-54,-139r-55,139r109,0xm99,-261r34,-52r28,0r-45,52r-17,0","w":240},"\u00c2":{"d":"5,0r103,-251r28,0r99,251r-25,0r-27,-67r-127,0r-27,67r-24,0xm174,-89r-54,-139r-55,139r109,0xm72,-261r33,-52r30,0r33,52r-16,0r-32,-37r-31,37r-17,0","w":240},"\u00c4":{"d":"5,0r103,-251r28,0r99,251r-25,0r-27,-67r-127,0r-27,67r-24,0xm174,-89r-54,-139r-55,139r109,0xm138,-273r0,-30r27,0r0,30r-27,0xm76,-273r0,-30r27,0r0,30r-27,0","w":240},"\u00c0":{"d":"5,0r103,-251r28,0r99,251r-25,0r-27,-67r-127,0r-27,67r-24,0xm174,-89r-54,-139r-55,139r109,0xm107,-313r34,52r-17,0r-45,-52r28,0","w":240},"\u00c5":{"d":"5,0r103,-251r28,0r99,251r-25,0r-27,-67r-127,0r-27,67r-24,0xm174,-89r-54,-139r-55,139r109,0xm86,-294v0,-19,14,-34,34,-34v19,0,35,15,35,34v0,19,-16,34,-35,34v-20,0,-34,-15,-34,-34xm99,-294v0,12,9,21,21,21v12,0,22,-9,22,-21v0,-12,-10,-21,-22,-21v-12,0,-21,9,-21,21","w":240},"\u00c3":{"d":"5,0r103,-251r28,0r99,251r-25,0r-27,-67r-127,0r-27,67r-24,0xm174,-89r-54,-139r-55,139r109,0xm168,-305v-9,47,-41,28,-69,22v-9,0,-12,4,-15,13r-13,0v3,-15,12,-32,29,-32v21,-1,47,21,55,-3r13,0","w":240},"\u00c7":{"d":"205,-246r-2,23v-78,-34,-158,13,-158,97v0,85,79,133,158,98r2,22v-16,9,-44,10,-63,10r-5,15v19,-4,38,3,38,23v0,35,-60,25,-76,17r3,-14v7,7,50,21,50,-3v1,-15,-17,-14,-29,-11r9,-28v-71,-5,-111,-56,-111,-129v0,-97,87,-155,184,-120","w":240},"\u00c9":{"d":"31,0r0,-251r123,0r0,21r-98,0r0,90r93,0r0,22r-93,0r0,96r102,0r0,22r-127,0xm69,-261r34,-52r28,0r-45,52r-17,0","w":180},"\u00ca":{"d":"31,0r0,-251r123,0r0,21r-98,0r0,90r93,0r0,22r-93,0r0,96r102,0r0,22r-127,0xm42,-261r33,-52r30,0r33,52r-16,0r-32,-37r-32,37r-16,0","w":180},"\u00cb":{"d":"31,0r0,-251r123,0r0,21r-98,0r0,90r93,0r0,22r-93,0r0,96r102,0r0,22r-127,0xm107,-273r0,-30r27,0r0,30r-27,0xm46,-273r0,-30r27,0r0,30r-27,0","w":180},"\u00c8":{"d":"31,0r0,-251r123,0r0,21r-98,0r0,90r93,0r0,22r-93,0r0,96r102,0r0,22r-127,0xm77,-313r34,52r-17,0r-45,-52r28,0","w":180},"\u00cd":{"d":"28,0r0,-251r25,0r0,251r-25,0xm19,-261r34,-52r28,0r-45,52r-17,0","w":79},"\u00ce":{"d":"28,0r0,-251r25,0r0,251r-25,0xm-8,-261r33,-52r30,0r33,52r-16,0r-32,-37r-32,37r-16,0","w":79},"\u00cf":{"d":"28,0r0,-251r25,0r0,251r-25,0xm57,-273r0,-30r27,0r0,30r-27,0xm-4,-273r0,-30r27,0r0,30r-27,0","w":79},"\u00cc":{"d":"28,0r0,-251r25,0r0,251r-25,0xm27,-313r33,52r-16,0r-45,-52r28,0","w":79},"\u00d1":{"d":"28,0r0,-251r31,0r129,221r0,-221r24,0r0,251r-33,0r-126,-217r0,217r-25,0xm168,-305v-9,47,-41,28,-69,22v-9,0,-12,4,-15,13r-13,0v3,-15,12,-32,29,-32v21,-1,47,21,55,-3r13,0","w":240},"\u00d3":{"d":"19,-126v-1,-68,35,-130,111,-130v76,0,111,62,110,130v-1,77,-38,130,-110,130v-72,0,-110,-53,-111,-130xm130,-234v-116,1,-115,215,0,217v115,-1,116,-216,0,-217xm109,-261r34,-52r28,0r-45,52r-17,0","w":259},"\u00d4":{"d":"19,-126v-1,-68,35,-130,111,-130v76,0,111,62,110,130v-1,77,-38,130,-110,130v-72,0,-110,-53,-111,-130xm130,-234v-116,1,-115,215,0,217v115,-1,116,-216,0,-217xm82,-261r33,-52r30,0r33,52r-16,0r-32,-37r-32,37r-16,0","w":259},"\u00d6":{"d":"19,-126v-1,-68,35,-130,111,-130v76,0,111,62,110,130v-1,77,-38,130,-110,130v-72,0,-110,-53,-111,-130xm130,-234v-116,1,-115,215,0,217v115,-1,116,-216,0,-217xm147,-273r0,-30r27,0r0,30r-27,0xm86,-273r0,-30r27,0r0,30r-27,0","w":259},"\u00d2":{"d":"19,-126v-1,-68,35,-130,111,-130v76,0,111,62,110,130v-1,77,-38,130,-110,130v-72,0,-110,-53,-111,-130xm130,-234v-116,1,-115,215,0,217v115,-1,116,-216,0,-217xm117,-313r33,52r-16,0r-45,-52r28,0","w":259},"\u00d5":{"d":"19,-126v-1,-68,35,-130,111,-130v76,0,111,62,110,130v-1,77,-38,130,-110,130v-72,0,-110,-53,-111,-130xm130,-234v-116,1,-115,215,0,217v115,-1,116,-216,0,-217xm178,-305v-9,46,-41,29,-69,22v-9,0,-13,4,-16,13r-13,0v3,-15,12,-32,29,-32v21,0,47,21,56,-3r13,0","w":259},"\u0160":{"d":"22,-6r2,-26v36,24,112,24,112,-37v0,-49,-115,-55,-115,-121v0,-58,71,-80,129,-57r-4,22v-34,-15,-100,-16,-100,34v0,50,115,51,115,124v0,73,-86,82,-139,61xm138,-313r-33,52r-30,0r-33,-52r16,0r32,37r32,-37r16,0","w":180},"\u00da":{"d":"211,-251r0,163v0,74,-54,92,-91,92v-37,0,-91,-18,-91,-92r0,-163r25,0r0,163v0,41,22,71,66,71v101,-1,57,-143,66,-234r25,0xm99,-261r34,-52r28,0r-45,52r-17,0","w":240},"\u00db":{"d":"211,-251r0,163v0,74,-54,92,-91,92v-37,0,-91,-18,-91,-92r0,-163r25,0r0,163v0,41,22,71,66,71v101,-1,57,-143,66,-234r25,0xm72,-261r33,-52r30,0r33,52r-16,0r-32,-37r-31,37r-17,0","w":240},"\u00dc":{"d":"211,-251r0,163v0,74,-54,92,-91,92v-37,0,-91,-18,-91,-92r0,-163r25,0r0,163v0,41,22,71,66,71v101,-1,57,-143,66,-234r25,0xm138,-273r0,-30r27,0r0,30r-27,0xm76,-273r0,-30r27,0r0,30r-27,0","w":240},"\u00d9":{"d":"211,-251r0,163v0,74,-54,92,-91,92v-37,0,-91,-18,-91,-92r0,-163r25,0r0,163v0,41,22,71,66,71v101,-1,57,-143,66,-234r25,0xm107,-313r34,52r-17,0r-45,-52r28,0","w":240},"\u00dd":{"d":"98,0r0,-107r-94,-144r29,0r77,122r79,-122r27,0r-94,144r0,107r-24,0xm89,-261r34,-52r28,0r-45,52r-17,0","w":219,"k":{"v":20,"A":31,"\u00c6":31,"\u00c1":31,"\u00c2":31,"\u00c4":31,"\u00c0":31,"\u00c5":31,"\u00c3":31,",":44,".":36,"e":33,"\u00e9":33,"\u00ea":33,"\u00eb":33,"\u00e8":33,"o":33,"\u00f8":33,"\u0153":33,"\u00f3":33,"\u00f4":33,"\u00f6":33,"\u00f2":33,"\u00f5":33,"q":33,"-":40,"a":33,"\u00e6":33,"\u00e1":33,"\u00e2":33,"\u00e4":33,"\u00e0":33,"\u00e5":33,"\u00e3":33,"i":3,"\u0131":3,"\u00ed":3,"\u00ee":3,"\u00ef":3,"\u00ec":3,"u":27,"\u00fa":27,"\u00fb":27,"\u00fc":27,"\u00f9":27,":":33,";":33,"p":27}},"\u0178":{"d":"98,0r0,-107r-94,-144r29,0r77,122r79,-122r27,0r-94,144r0,107r-24,0xm127,-273r0,-30r27,0r0,30r-27,0xm66,-273r0,-30r27,0r0,30r-27,0","w":219,"k":{"v":20,"A":31,"\u00c6":31,"\u00c1":31,"\u00c2":31,"\u00c4":31,"\u00c0":31,"\u00c5":31,"\u00c3":31,",":44,".":36,"e":33,"\u00e9":33,"\u00ea":33,"\u00eb":33,"\u00e8":33,"o":33,"\u00f8":33,"\u0153":33,"\u00f3":33,"\u00f4":33,"\u00f6":33,"\u00f2":33,"\u00f5":33,"q":33,"-":40,"a":33,"\u00e6":33,"\u00e1":33,"\u00e2":33,"\u00e4":33,"\u00e0":33,"\u00e5":33,"\u00e3":33,"i":3,"\u0131":3,"\u00ed":3,"\u00ee":3,"\u00ef":3,"\u00ec":3,"u":27,"\u00fa":27,"\u00fb":27,"\u00fc":27,"\u00f9":27,":":33,";":33,"p":27}},"\u017d":{"d":"8,0r0,-22r131,-208r-128,0r0,-21r154,0r0,21r-130,208r134,0r0,22r-161,0xm138,-313r-33,52r-30,0r-33,-52r16,0r32,37r32,-37r16,0","w":180},"\u00e1":{"d":"134,0v-1,-9,2,-23,-1,-30v-10,22,-35,34,-58,34v-52,0,-61,-35,-61,-52v1,-64,67,-64,118,-64v11,-63,-57,-67,-96,-41r0,-22v49,-24,117,-19,118,55r2,120r-22,0xm77,-15v58,0,55,-46,55,-78v-42,0,-92,3,-93,45v0,24,17,33,38,33xm69,-203r34,-52r28,0r-45,52r-17,0","w":180},"\u00e2":{"d":"134,0v-1,-9,2,-23,-1,-30v-10,22,-35,34,-58,34v-52,0,-61,-35,-61,-52v1,-64,67,-64,118,-64v11,-63,-57,-67,-96,-41r0,-22v49,-24,117,-19,118,55r2,120r-22,0xm77,-15v58,0,55,-46,55,-78v-42,0,-92,3,-93,45v0,24,17,33,38,33xm42,-203r33,-52r30,0r33,52r-16,0r-32,-36r-32,36r-16,0","w":180},"\u00e4":{"d":"134,0v-1,-9,2,-23,-1,-30v-10,22,-35,34,-58,34v-52,0,-61,-35,-61,-52v1,-64,67,-64,118,-64v11,-63,-57,-67,-96,-41r0,-22v49,-24,117,-19,118,55r2,120r-22,0xm77,-15v58,0,55,-46,55,-78v-42,0,-92,3,-93,45v0,24,17,33,38,33xm107,-214r0,-30r27,0r0,30r-27,0xm46,-214r0,-30r27,0r0,30r-27,0","w":180},"\u00e0":{"d":"134,0v-1,-9,2,-23,-1,-30v-10,22,-35,34,-58,34v-52,0,-61,-35,-61,-52v1,-64,67,-64,118,-64v11,-63,-57,-67,-96,-41r0,-22v49,-24,117,-19,118,55r2,120r-22,0xm77,-15v58,0,55,-46,55,-78v-42,0,-92,3,-93,45v0,24,17,33,38,33xm77,-255r34,52r-17,0r-45,-52r28,0","w":180},"\u00e5":{"d":"134,0v-1,-9,2,-23,-1,-30v-10,22,-35,34,-58,34v-52,0,-61,-35,-61,-52v1,-64,67,-64,118,-64v11,-63,-57,-67,-96,-41r0,-22v49,-24,117,-19,118,55r2,120r-22,0xm77,-15v58,0,55,-46,55,-78v-42,0,-92,3,-93,45v0,24,17,33,38,33xm55,-233v0,-19,15,-34,35,-34v19,0,35,15,35,34v0,19,-16,34,-35,34v-20,0,-35,-15,-35,-34xm68,-233v0,12,10,21,22,21v12,0,22,-9,22,-21v0,-12,-10,-22,-22,-22v-12,0,-22,10,-22,22","w":180},"\u00e3":{"d":"134,0v-1,-9,2,-23,-1,-30v-10,22,-35,34,-58,34v-52,0,-61,-35,-61,-52v1,-64,67,-64,118,-64v11,-63,-57,-67,-96,-41r0,-22v49,-24,117,-19,118,55r2,120r-22,0xm77,-15v58,0,55,-46,55,-78v-42,0,-92,3,-93,45v0,24,17,33,38,33xm138,-247v-10,47,-39,29,-69,23v-9,0,-13,4,-16,13r-13,0v3,-15,12,-32,29,-32v0,0,47,21,56,-4r13,0","w":180},"\u00e7":{"d":"150,-181r-2,22v-53,-25,-108,6,-108,67v0,59,52,94,108,69r2,21v-15,5,-30,6,-48,6r-6,15v19,-4,39,4,39,23v0,35,-60,25,-76,17r2,-14v7,7,50,21,51,-3v0,-14,-17,-15,-29,-11r10,-27v-53,-5,-78,-48,-78,-96v0,-75,69,-113,135,-89","w":159},"\u00e9":{"d":"152,-29r0,23v-16,6,-37,10,-54,10v-61,0,-83,-41,-83,-96v0,-56,31,-96,77,-96v56,1,75,47,73,103r-125,0v0,39,20,70,60,70v17,0,41,-7,52,-14xm40,-105r100,0v0,-32,-12,-63,-46,-63v-33,0,-54,33,-54,63xm69,-203r34,-52r28,0r-45,52r-17,0","w":180},"\u00ea":{"d":"152,-29r0,23v-16,6,-37,10,-54,10v-61,0,-83,-41,-83,-96v0,-56,31,-96,77,-96v56,1,75,47,73,103r-125,0v0,39,20,70,60,70v17,0,41,-7,52,-14xm40,-105r100,0v0,-32,-12,-63,-46,-63v-33,0,-54,33,-54,63xm42,-203r33,-52r30,0r33,52r-16,0r-32,-36r-32,36r-16,0","w":180},"\u00eb":{"d":"152,-29r0,23v-16,6,-37,10,-54,10v-61,0,-83,-41,-83,-96v0,-56,31,-96,77,-96v56,1,75,47,73,103r-125,0v0,39,20,70,60,70v17,0,41,-7,52,-14xm40,-105r100,0v0,-32,-12,-63,-46,-63v-33,0,-54,33,-54,63xm107,-214r0,-30r27,0r0,30r-27,0xm46,-214r0,-30r27,0r0,30r-27,0","w":180},"\u00e8":{"d":"152,-29r0,23v-16,6,-37,10,-54,10v-61,0,-83,-41,-83,-96v0,-56,31,-96,77,-96v56,1,75,47,73,103r-125,0v0,39,20,70,60,70v17,0,41,-7,52,-14xm40,-105r100,0v0,-32,-12,-63,-46,-63v-33,0,-54,33,-54,63xm77,-255r34,52r-17,0r-45,-52r28,0","w":180},"\u00ed":{"d":"28,0r0,-184r23,0r0,184r-23,0xm19,-203r34,-52r28,0r-45,52r-17,0","w":79},"\u00ee":{"d":"28,0r0,-184r23,0r0,184r-23,0xm-8,-203r33,-52r30,0r33,52r-16,0r-32,-36r-32,36r-16,0","w":79},"\u00ef":{"d":"28,0r0,-184r23,0r0,184r-23,0xm57,-214r0,-30r27,0r0,30r-27,0xm-4,-214r0,-30r27,0r0,30r-27,0","w":79},"\u00ec":{"d":"28,0r0,-184r23,0r0,184r-23,0xm27,-255r33,52r-16,0r-45,-52r28,0","w":79},"\u00f1":{"d":"28,0r-1,-184r22,0v1,10,-2,25,1,33v8,-17,21,-37,59,-37v88,0,58,108,63,188r-23,0v-6,-63,23,-168,-44,-168v-77,0,-49,97,-54,168r-23,0xm148,-247v-10,47,-39,29,-69,23v-9,0,-13,4,-16,13r-13,0v3,-15,13,-32,30,-32v0,0,46,21,55,-4r13,0"},"\u00f3":{"d":"14,-92v0,-50,27,-96,86,-96v59,0,86,46,86,96v0,50,-27,96,-86,96v-59,0,-86,-46,-86,-96xm39,-92v0,42,21,77,61,77v40,0,61,-35,61,-77v0,-42,-21,-76,-61,-76v-40,0,-61,34,-61,76xm79,-203r34,-52r28,0r-45,52r-17,0"},"\u00f4":{"d":"14,-92v0,-50,27,-96,86,-96v59,0,86,46,86,96v0,50,-27,96,-86,96v-59,0,-86,-46,-86,-96xm39,-92v0,42,21,77,61,77v40,0,61,-35,61,-77v0,-42,-21,-76,-61,-76v-40,0,-61,34,-61,76xm52,-203r33,-52r30,0r33,52r-16,0r-32,-36r-32,36r-16,0"},"\u00f6":{"d":"14,-92v0,-50,27,-96,86,-96v59,0,86,46,86,96v0,50,-27,96,-86,96v-59,0,-86,-46,-86,-96xm39,-92v0,42,21,77,61,77v40,0,61,-35,61,-77v0,-42,-21,-76,-61,-76v-40,0,-61,34,-61,76xm117,-214r0,-30r27,0r0,30r-27,0xm56,-214r0,-30r27,0r0,30r-27,0"},"\u00f2":{"d":"14,-92v0,-50,27,-96,86,-96v59,0,86,46,86,96v0,50,-27,96,-86,96v-59,0,-86,-46,-86,-96xm39,-92v0,42,21,77,61,77v40,0,61,-35,61,-77v0,-42,-21,-76,-61,-76v-40,0,-61,34,-61,76xm87,-255r34,52r-17,0r-45,-52r28,0"},"\u00f5":{"d":"14,-92v0,-50,27,-96,86,-96v59,0,86,46,86,96v0,50,-27,96,-86,96v-59,0,-86,-46,-86,-96xm39,-92v0,42,21,77,61,77v40,0,61,-35,61,-77v0,-42,-21,-76,-61,-76v-40,0,-61,34,-61,76xm148,-247v-10,47,-39,29,-69,23v-9,0,-13,4,-16,13r-13,0v3,-15,13,-32,30,-32v0,0,46,21,55,-4r13,0"},"\u0161":{"d":"12,-4r2,-23v28,17,88,20,89,-21v0,-44,-88,-37,-88,-90v0,-53,57,-58,105,-42r-2,20v-28,-11,-81,-17,-81,22v0,34,91,30,91,90v0,59,-69,59,-116,44xm118,-255r-33,52r-30,0r-33,-52r17,0r31,37r32,-37r16,0","w":140},"\u00fa":{"d":"172,-184r1,184r-22,0v-1,-10,2,-25,-1,-33v-8,17,-21,37,-59,37v-88,1,-58,-108,-63,-188r23,0v6,64,-23,169,44,169v77,0,49,-97,54,-169r23,0xm79,-203r34,-52r28,0r-45,52r-17,0"},"\u00fb":{"d":"172,-184r1,184r-22,0v-1,-10,2,-25,-1,-33v-8,17,-21,37,-59,37v-88,1,-58,-108,-63,-188r23,0v6,64,-23,169,44,169v77,0,49,-97,54,-169r23,0xm52,-203r33,-52r30,0r33,52r-16,0r-32,-36r-32,36r-16,0"},"\u00fc":{"d":"172,-184r1,184r-22,0v-1,-10,2,-25,-1,-33v-8,17,-21,37,-59,37v-88,1,-58,-108,-63,-188r23,0v6,64,-23,169,44,169v77,0,49,-97,54,-169r23,0xm117,-214r0,-30r27,0r0,30r-27,0xm56,-214r0,-30r27,0r0,30r-27,0"},"\u00f9":{"d":"172,-184r1,184r-22,0v-1,-10,2,-25,-1,-33v-8,17,-21,37,-59,37v-88,1,-58,-108,-63,-188r23,0v6,64,-23,169,44,169v77,0,49,-97,54,-169r23,0xm87,-255r34,52r-17,0r-45,-52r28,0"},"\u00fd":{"d":"28,-184r52,153r53,-153r24,0r-74,211v-11,33,-29,61,-71,48r2,-20v34,14,48,-19,54,-53r-65,-186r25,0xm59,-203r34,-52r28,0r-45,52r-17,0","w":159,"k":{",":33,".":33}},"\u00ff":{"d":"28,-184r52,153r53,-153r24,0r-74,211v-11,33,-29,61,-71,48r2,-20v34,14,48,-19,54,-53r-65,-186r25,0xm97,-214r0,-30r27,0r0,30r-27,0xm36,-214r0,-30r27,0r0,30r-27,0","w":159,"k":{",":33,".":33}},"\u017e":{"d":"12,0r0,-19r110,-145r-106,0r0,-20r132,0r0,20r-110,145r110,0r0,19r-136,0xm128,-255r-33,52r-30,0r-33,-52r16,0r32,37r32,-37r16,0","w":159},"\u2126":{"d":"74,-19v-27,-23,-50,-62,-50,-113v0,-71,47,-119,107,-119v64,0,106,55,106,118v0,53,-26,94,-51,114r56,0r0,19r-85,0r0,-14v29,-18,57,-58,57,-115v0,-47,-28,-103,-83,-103v-51,0,-85,46,-85,103v0,54,29,97,57,115r0,14r-84,0r0,-19r55,0","w":261},"\u03bc":{"d":"28,76r0,-260r23,0v6,64,-23,169,44,169v77,0,49,-97,54,-169r23,0r1,184r-22,0v-1,-10,2,-25,-1,-33v-4,28,-63,51,-99,27r0,82r-23,0"},"\u03c0":{"d":"193,-164r-30,0v1,48,-4,130,5,164r-21,0v-12,-29,-6,-118,-7,-164r-69,0v-2,48,-14,131,-27,164r-22,0v14,-37,25,-114,27,-164v-24,0,-33,2,-41,5r-4,-15v41,-17,132,-6,191,-9","w":202},"\u20ac":{"d":"204,-247r-5,23v-61,-27,-126,4,-136,65r123,0r-4,17r-122,0v-1,11,-1,22,0,33r116,0r-4,17r-109,0v11,61,74,93,136,65r2,23v-79,26,-151,-13,-164,-88r-32,0r4,-17r26,0v-1,-11,-1,-22,0,-33r-30,0r4,-17r29,0v14,-75,86,-117,166,-88"},"\u2113":{"d":"152,-53r11,10v-15,28,-37,44,-65,44v-42,-1,-58,-32,-58,-72v-6,5,-15,11,-22,17r-7,-13r28,-24r0,-99v0,-65,29,-84,54,-84v30,0,43,25,43,56v0,45,-31,88,-76,132v-3,43,18,69,42,69v23,0,41,-20,50,-36xm60,-193r0,84v33,-35,60,-71,60,-108v0,-23,-8,-40,-28,-40v-14,0,-32,16,-32,64","w":171},"\u212e":{"d":"64,-51v35,62,142,58,182,3r21,0v-26,30,-67,50,-113,50v-78,0,-142,-57,-142,-128v0,-71,64,-128,142,-128v80,1,145,57,143,132r-233,1r0,70xm244,-201v-32,-61,-147,-58,-180,1v2,23,-3,52,2,71r178,-2r0,-70","w":308},"\u2202":{"d":"36,-243r-8,-16v68,-45,148,-8,148,114v0,81,-31,146,-92,146v-46,0,-69,-41,-69,-81v0,-55,36,-90,76,-90v35,0,57,25,62,36v10,-94,-53,-158,-117,-109xm38,-81v0,36,18,63,48,63v36,0,59,-44,64,-93v-6,-16,-25,-41,-55,-41v-31,0,-57,32,-57,71","w":194},"\u220f":{"d":"240,-226r-40,0r0,260r-22,0r0,-260r-106,0r0,260r-22,0r0,-260r-41,0r0,-21r231,0r0,21","w":249},"\u2211":{"d":"190,34r-182,0r0,-15r99,-125r-94,-125r0,-16r172,0r0,20r-141,1r89,117r-96,122r153,0r0,21","w":198},"\u2219":{"d":"33,-112v1,-22,33,-23,34,0v-1,22,-33,23,-34,0","w":100},"\u221a":{"d":"203,-293r-80,347r-20,0r-59,-166r-27,9r-5,-14r46,-17v17,54,42,102,54,161r74,-320r17,0","w":203},"\u221e":{"d":"208,-157v31,0,51,23,51,55v0,33,-26,55,-54,55v-23,0,-41,-15,-66,-43v-19,22,-39,43,-68,43v-29,0,-53,-24,-53,-54v0,-32,24,-56,56,-56v27,0,47,22,66,44v19,-21,38,-44,68,-44xm35,-101v0,22,15,39,39,39v23,0,42,-24,57,-39v-16,-19,-34,-42,-60,-42v-23,0,-36,20,-36,42xm206,-143v-25,0,-45,28,-58,41v24,26,40,40,59,40v23,0,36,-21,36,-40v0,-26,-16,-41,-37,-41","w":277},"\u222b":{"d":"50,-214v0,-61,20,-98,69,-82r-4,16v-36,-13,-44,20,-44,68v0,55,4,123,4,180v0,66,-21,99,-71,82r4,-16v38,10,47,-11,47,-66v0,-57,-5,-127,-5,-182","w":124},"\u2248":{"d":"66,-152v44,0,83,56,110,1r10,8v-9,18,-24,34,-46,34v-24,0,-50,-28,-77,-28v-17,0,-27,13,-36,27r-10,-8v11,-21,28,-34,49,-34xm66,-92v44,0,82,56,110,1r10,8v-9,18,-24,33,-46,33v-24,0,-50,-27,-76,-27v-17,0,-28,13,-37,27r-10,-9v11,-21,28,-33,49,-33","w":203},"\u2260":{"d":"143,-179r-17,37r59,0r0,15r-65,0r-25,53r90,0r0,15r-96,0r-20,43r-12,-6r17,-37r-55,0r0,-15r62,0r24,-53r-86,0r0,-15r93,0r19,-42","w":203},"\u2264":{"d":"184,-33r-163,-81r0,-16r163,-80r0,18r-146,70r146,71r0,18xm185,-3r-167,0r0,-15r167,0r0,15","w":203},"\u2265":{"d":"21,-210r163,80r0,16r-163,81r0,-18r146,-71r-146,-70r0,-18xm184,-3r-165,0r0,-15r165,0r0,15","w":203},"\u25ca":{"d":"183,-123r-72,139r-19,0r-72,-139r73,-140r18,0xm162,-123r-61,-121v-17,43,-41,80,-60,120r61,121v17,-42,41,-80,60,-120","w":203},"\u00a0":{"w":100},"\u00ad":{"d":"15,-85r0,-24r90,0r0,24r-90,0","w":119},"\u02c9":{"d":"-4,-221r0,-19r88,0r0,19r-88,0","w":79},"\u03a9":{"d":"74,-19v-27,-23,-50,-62,-50,-113v0,-71,47,-119,107,-119v64,0,106,55,106,118v0,53,-26,94,-51,114r56,0r0,19r-85,0r0,-14v29,-18,57,-58,57,-115v0,-47,-28,-103,-83,-103v-51,0,-85,46,-85,103v0,54,29,97,57,115r0,14r-84,0r0,-19r55,0","w":261},"\u2215":{"d":"-55,8r149,-267r20,0r-148,267r-21,0","w":60},"\u2206":{"d":"12,0r0,-16r92,-238r26,0r91,237r0,17r-209,0xm34,-18r163,0r-82,-210","w":232},"\u2010":{"d":"15,-85r0,-24r90,0r0,24r-90,0","w":119}}});
/*!
 * The following copyright notice may not be removed under any circumstances.
 * 
 * Copyright:
 * Š 1988, 1990, 1994, 2002 Adobe Systems Incorporated. All rights reserved.
 * 
 * Trademark:
 * Frutiger is a trademark of Linotype Corp. registered in the U.S. Patent and
 * Trademark Office and may be registered in certain other jurisdictions in the
 * name of Linotype Corp. or its licensee Linotype GmbH.
 * 
 * Full name:
 * FrutigerLTStd-Bold
 * 
 * Designer:
 * Adrian Frutiger
 * 
 * Vendor URL:
 * http://www.adobe.com/type
 * 
 * License information:
 * http://www.adobe.com/type/legal.html
 */
Cufon.registerFont({"w":200,"face":{"font-family":"Frutiger LT Std","font-weight":700,"font-stretch":"normal","units-per-em":"360","panose-1":"2 11 7 3 3 5 4 2 2 4","ascent":"270","descent":"-90","x-height":"4","bbox":"-60 -337 360 90","underline-thickness":"18","underline-position":"-18","stemh":"35","stemv":"50","unicode-range":"U+0020-U+FB02"},"glyphs":{" ":{"w":100},"!":{"d":"49,-74r-7,-177r56,0r-8,177r-41,0xm45,0r0,-50r50,0r0,50r-50,0","w":140},"\"":{"d":"98,-161r0,-90r43,0r0,90r-43,0xm32,-161r0,-90r44,0r0,90r-44,0","w":173},"#":{"d":"178,-103r0,29r-33,0r-11,74r-31,0r10,-74r-37,0r-10,74r-32,0r10,-74r-32,0r0,-29r36,0r6,-46r-31,0r0,-28r36,0r10,-74r32,0r-10,74r36,0r11,-74r31,0r-10,74r29,0r0,28r-33,0r-6,46r29,0xm123,-149r-37,0r-6,46r37,0"},"$":{"d":"93,-156r0,-56v-23,7,-29,48,0,56xm110,-95r0,55v27,-9,28,-46,0,-55xm93,-282r17,0r0,26v21,0,41,3,59,9r-5,42v-17,-7,-34,-11,-54,-11r0,67v32,13,74,25,74,77v0,47,-33,70,-74,75r0,29r-17,0r0,-28v-29,0,-42,-3,-68,-9r5,-46v19,10,40,19,63,15r0,-67v-32,-13,-72,-26,-72,-76v0,-49,33,-71,72,-76r0,-27"},"%":{"d":"262,-24v33,0,33,-75,0,-75v-19,0,-23,22,-23,37v0,15,4,38,23,38xm262,4v-39,0,-60,-24,-60,-66v0,-42,21,-66,60,-66v39,0,60,24,60,66v0,42,-21,66,-60,66xm99,-123v-39,0,-61,-24,-61,-66v0,-42,22,-67,61,-67v39,0,59,25,59,67v0,42,-20,66,-59,66xm99,-152v19,0,22,-22,22,-37v0,-15,-3,-38,-22,-38v-33,0,-33,75,0,75xm88,8r156,-267r29,0r-155,267r-30,0","w":360},"&":{"d":"156,-48r-56,-63v-41,13,-38,80,12,78v17,0,33,-4,44,-15xm112,-158v13,-6,32,-21,32,-36v0,-18,-13,-26,-27,-26v-14,0,-29,8,-29,26v0,14,14,26,24,36xm140,-132r46,50v12,-14,15,-35,16,-54r44,0v-1,32,-13,62,-33,86r45,50r-61,0r-17,-22v-47,48,-158,28,-158,-47v0,-30,13,-52,53,-69v-19,-18,-35,-31,-35,-60v2,-74,146,-82,148,-1v0,35,-21,51,-48,67","w":259},"\u2019":{"d":"12,-161r23,-90r53,0r-33,90r-43,0","w":100,"k":{"\u2019":25,"s":27,"\u0161":27,"t":6}},"(":{"d":"72,-272r45,0v-67,88,-68,232,0,322r-45,0v-76,-90,-76,-234,0,-322","w":119},")":{"d":"48,50r-45,0v67,-90,68,-234,0,-322r45,0v76,88,76,232,0,322","w":119},"*":{"d":"174,-182r-50,11r35,39r-33,23r-26,-44r-27,44r-33,-23r35,-39r-49,-11r12,-38r48,21r-6,-52r41,0r-6,52r48,-21"},"+":{"d":"89,-110r0,-72r38,0r0,72r72,0r0,38r-72,0r0,72r-38,0r0,-72r-72,0r0,-38r72,0","w":216},",":{"d":"8,40r23,-90r53,0r-33,90r-43,0","w":100},"-":{"d":"107,-77r-94,0r0,-40r94,0r0,40","w":119},".":{"d":"25,0r0,-50r50,0r0,50r-50,0","w":100},"\/":{"d":"8,4r87,-260r38,0r-88,260r-37,0","w":140},"0":{"d":"100,-33v38,0,37,-60,37,-92v0,-32,0,-93,-37,-93v-37,0,-37,61,-37,93v0,32,0,92,37,92xm100,4v-77,0,-87,-76,-87,-129v0,-63,19,-131,87,-131v73,0,88,73,88,131v0,58,-15,129,-88,129"},"1":{"d":"28,-192r74,-59r45,0r0,251r-51,0r0,-194r-42,35"},"2":{"d":"182,0r-167,0r0,-42v23,-23,108,-94,108,-140v0,-49,-72,-36,-99,-14r-3,-42v58,-32,153,-25,153,56v0,53,-54,102,-95,142r103,0r0,40"},"3":{"d":"16,-4r3,-43v36,16,104,23,109,-24v4,-38,-39,-40,-80,-39r0,-40v38,2,81,-4,79,-33v-3,-47,-68,-36,-100,-20r-3,-40v56,-19,147,-30,153,52v3,35,-23,49,-47,61v32,4,48,28,48,59v0,85,-94,82,-162,67"},"4":{"d":"51,-90r63,0r-1,-109xm6,-52r0,-41r94,-158r62,0r0,161r32,0r0,38r-32,0r0,52r-48,0r0,-52r-108,0"},"5":{"d":"176,-251r0,37r-96,0r-2,54v51,-10,105,4,105,79v0,47,-33,85,-98,85v-19,0,-42,-3,-59,-7r1,-45v31,18,106,23,105,-32v-1,-48,-61,-49,-102,-36r2,-135r144,0"},"6":{"d":"172,-247r-6,41v-13,-6,-27,-10,-44,-10v-43,-1,-61,43,-59,78v36,-53,122,-17,122,52v0,54,-27,90,-84,90v-70,0,-85,-58,-85,-117v0,-68,22,-143,103,-143v18,0,36,3,53,9xm100,-125v-24,0,-34,22,-34,47v0,24,10,45,35,45v45,-1,44,-93,-1,-92"},"7":{"d":"18,-212r0,-39r162,0r0,41r-89,210r-55,0r93,-212r-111,0"},"8":{"d":"13,-68v-1,-29,18,-46,46,-63v-25,-11,-42,-32,-42,-58v0,-45,34,-67,80,-67v44,0,84,19,84,61v0,23,-14,49,-42,60v33,15,49,37,49,66v0,51,-37,73,-87,73v-49,0,-88,-21,-88,-72xm65,-188v0,22,23,32,40,38v33,-8,40,-68,-3,-68v-18,0,-37,10,-37,30xm95,-110v-42,10,-42,77,6,77v20,0,36,-13,36,-34v0,-25,-21,-36,-42,-43"},"9":{"d":"28,-5r7,-40v13,6,27,10,44,10v44,1,62,-43,59,-79v-36,52,-122,18,-122,-51v0,-54,26,-91,83,-91v70,0,86,58,86,117v0,68,-23,143,-104,143v-18,0,-36,-3,-53,-9xm100,-126v24,0,34,-23,34,-48v0,-24,-10,-44,-35,-44v-45,1,-44,93,1,92"},":":{"d":"25,-135r0,-50r50,0r0,50r-50,0xm25,0r0,-50r50,0r0,50r-50,0","w":100},";":{"d":"8,40r23,-90r53,0r-33,90r-43,0xm25,-135r0,-50r50,0r0,50r-50,0","w":100},"<":{"d":"199,-34r0,37r-182,-79r0,-31r182,-78r0,37r-134,57","w":216},"=":{"d":"199,-149r0,37r-182,0r0,-37r182,0xm199,-71r0,38r-182,0r0,-38r182,0","w":216},">":{"d":"17,-34r134,-57r-134,-57r0,-37r182,78r0,31r-182,79r0,-37","w":216},"?":{"d":"66,-73v-3,-60,46,-69,53,-112v-4,-46,-66,-35,-97,-19r-4,-40v60,-21,153,-21,153,53v0,50,-65,71,-61,118r-44,0xm63,0r0,-50r50,0r0,50r-50,0","w":180},"@":{"d":"149,-161v-39,-3,-59,73,-13,76v38,3,59,-73,13,-76xm227,-51r31,0v-68,95,-244,67,-245,-75v0,-72,59,-130,140,-130v58,0,122,32,122,106v0,74,-67,100,-91,100v-11,0,-17,-7,-20,-18v-29,36,-92,12,-92,-41v0,-67,75,-118,116,-64r4,-17r30,0r-22,100v0,3,1,5,5,5v18,0,41,-19,41,-64v0,-59,-51,-73,-93,-73v-60,0,-102,45,-102,96v0,91,106,124,176,75","w":288},"A":{"d":"165,-97r-37,-104r-36,104r73,0xm3,0r98,-251r57,0r99,251r-56,0r-22,-58r-102,0r-22,58r-52,0","w":259},"B":{"d":"80,-112r0,72v35,0,75,2,75,-35v0,-42,-38,-37,-75,-37xm80,-212r0,62v31,0,68,3,68,-30v0,-36,-36,-32,-68,-32xm29,0r0,-251v78,5,161,-24,169,64v3,31,-22,50,-50,57v34,3,58,26,58,57v0,98,-93,68,-177,73","w":219},"C":{"d":"210,-46r2,42v-98,25,-195,-11,-195,-117v0,-107,95,-159,195,-124r-4,42v-66,-37,-139,6,-139,78v0,73,76,110,141,79","w":219},"D":{"d":"29,0r0,-251v115,-3,214,-3,214,125v0,127,-98,130,-214,126xm80,-212r0,172v64,6,110,-20,110,-86v0,-66,-46,-92,-110,-86","w":259},"E":{"d":"29,0r0,-251r148,0r0,39r-97,0r0,62r89,0r0,40r-89,0r0,70r98,0r0,40r-149,0"},"F":{"d":"29,0r0,-251r140,0r0,39r-89,0r0,62r85,0r0,40r-85,0r0,110r-51,0","w":180,"k":{"A":11,"\u00c6":11,"\u00c1":11,"\u00c2":11,"\u00c4":11,"\u00c0":11,"\u00c5":11,"\u00c3":11,",":46,".":46}},"G":{"d":"229,-245r-4,42v-70,-34,-156,1,-156,78v0,62,52,104,119,86r0,-65r-53,0r0,-40r101,0r0,135v-102,33,-219,5,-219,-112v0,-115,108,-157,212,-124","w":259},"H":{"d":"29,0r0,-251r51,0r0,101r100,0r0,-101r51,0r0,251r-51,0r0,-110r-100,0r0,110r-51,0","w":259},"I":{"d":"25,0r0,-251r50,0r0,251r-50,0","w":100},"J":{"d":"8,0r0,-44v7,3,14,4,24,4v33,0,33,-26,33,-44r0,-167r50,0r0,191v0,27,-18,64,-69,64v-14,0,-24,0,-38,-4","w":140},"K":{"d":"29,0r0,-251r51,0r0,108r90,-108r62,0r-103,118r108,133r-66,0r-91,-117r0,117r-51,0","w":240},"L":{"d":"29,0r0,-251r51,0r0,211r97,0r0,40r-148,0","w":180,"k":{"T":33,"V":33,"W":20,"y":13,"\u00fd":13,"\u00ff":13,"Y":40,"\u00dd":40,"\u0178":40,"\u2019":27}},"M":{"d":"29,0r0,-251r81,0r60,190r60,-190r81,0r0,251r-49,0r0,-207r-68,207r-48,0r-69,-207r0,207r-48,0","w":339},"N":{"d":"27,0r0,-251r62,0r96,188r0,-188r48,0r0,251r-61,0r-97,-188r0,188r-48,0","w":259},"O":{"d":"17,-126v0,-77,43,-130,123,-130v79,0,123,54,123,130v0,76,-43,130,-123,130v-81,0,-123,-53,-123,-130xm140,-216v-96,1,-96,180,0,181v97,-1,96,-180,0,-181","w":280},"P":{"d":"75,-212r0,77v34,1,66,-1,66,-37v0,-36,-30,-42,-66,-40xm25,0r0,-251v82,-1,168,-7,168,76v0,66,-52,83,-118,80r0,95r-50,0","k":{"A":27,"\u00c6":27,"\u00c1":27,"\u00c2":27,"\u00c4":27,"\u00c0":27,"\u00c5":27,"\u00c3":27,",":61,".":61}},"Q":{"d":"257,48r-61,0r-44,-44v-87,5,-136,-49,-135,-130v0,-77,43,-130,123,-130v138,0,162,200,60,247xm140,-216v-96,1,-96,180,0,181v97,-1,96,-180,0,-181","w":280},"R":{"d":"75,-212r0,68v34,0,70,2,70,-35v0,-36,-37,-33,-70,-33xm25,0r0,-251v78,4,168,-21,173,68v1,31,-22,52,-52,59v14,1,21,15,26,26r41,98r-56,0r-31,-78v-7,-25,-22,-27,-51,-26r0,104r-50,0","w":219,"k":{"T":6,"V":6,"W":6,"Y":13,"\u00dd":13,"\u0178":13}},"S":{"d":"169,-247r-5,42v-33,-13,-91,-25,-91,24v0,44,111,25,111,109v1,79,-92,87,-159,67r5,-46v31,19,101,29,101,-17v0,-48,-110,-28,-110,-111v1,-80,85,-88,148,-68"},"T":{"d":"75,0r0,-212r-72,0r0,-39r194,0r0,39r-72,0r0,212r-50,0","k":{"\u00fc":33,"\u0161":40,"\u00f2":40,"\u00f6":40,"\u00e8":40,"\u00eb":40,"\u00ea":40,"\u00e3":40,"\u00e5":40,"\u00e0":40,"\u00e4":40,"\u00e2":40,"w":40,"y":40,"\u00fd":40,"\u00ff":40,"A":29,"\u00c6":29,"\u00c1":29,"\u00c2":29,"\u00c4":29,"\u00c0":29,"\u00c5":29,"\u00c3":29,",":40,".":40,"c":40,"\u00e7":40,"e":40,"\u00e9":40,"o":40,"\u00f8":40,"\u0153":40,"\u00f3":40,"\u00f4":40,"\u00f5":40,"-":42,"a":40,"\u00e6":40,"\u00e1":40,"r":33,"s":40,"u":33,"\u00fa":33,"\u00fb":33,"\u00f9":33,":":26,";":30}},"U":{"d":"27,-91r0,-160r51,0v9,79,-31,216,52,216v83,0,43,-138,52,-216r51,0r0,160v0,67,-39,95,-103,95v-64,0,-103,-28,-103,-95","w":259},"V":{"d":"90,0r-86,-251r54,0r65,197r63,-197r51,0r-85,251r-62,0","w":240,"k":{"\u00f6":20,"\u00f4":20,"\u00e8":20,"\u00eb":20,"\u00ea":20,"\u00e3":20,"\u00e5":20,"\u00e0":20,"\u00e4":20,"\u00e2":20,"y":6,"\u00fd":6,"\u00ff":6,"A":27,"\u00c6":27,"\u00c1":27,"\u00c2":27,"\u00c4":27,"\u00c0":27,"\u00c5":27,"\u00c3":27,",":46,".":46,"e":20,"\u00e9":20,"o":20,"\u00f8":20,"\u0153":20,"\u00f3":20,"\u00f2":20,"\u00f5":20,"-":20,"a":20,"\u00e6":20,"\u00e1":20,"r":13,"u":13,"\u00fa":13,"\u00fb":13,"\u00fc":13,"\u00f9":13,":":12,";":17,"i":-4,"\u0131":-4,"\u00ed":-4,"\u00ee":-4,"\u00ef":-4,"\u00ec":-4}},"W":{"d":"70,0r-66,-251r53,0r47,201r43,-201r68,0r45,201r47,-201r49,0r-65,251r-65,0r-46,-201r-45,201r-65,0","w":360,"k":{"\u00fc":6,"\u00f6":6,"\u00ea":6,"\u00e4":13,"A":13,"\u00c6":13,"\u00c1":13,"\u00c2":13,"\u00c4":13,"\u00c0":13,"\u00c5":13,"\u00c3":13,",":27,".":27,"e":6,"\u00e9":6,"\u00eb":6,"\u00e8":6,"o":6,"\u00f8":6,"\u0153":6,"\u00f3":6,"\u00f4":6,"\u00f2":6,"\u00f5":6,"-":10,"a":13,"\u00e6":13,"\u00e1":13,"\u00e2":13,"\u00e0":13,"\u00e5":13,"\u00e3":13,"r":6,"u":6,"\u00fa":6,"\u00fb":6,"\u00f9":6,":":2,";":6}},"X":{"d":"4,0r82,-131r-75,-120r58,0r53,89r54,-89r54,0r-76,120r83,131r-60,0r-58,-98r-59,98r-56,0","w":240},"Y":{"d":"96,0r0,-99r-92,-152r59,0r59,105r61,-105r53,0r-90,152r0,99r-50,0","w":240,"k":{"\u00fc":27,"\u00f6":33,"v":20,"A":35,"\u00c6":35,"\u00c1":35,"\u00c2":35,"\u00c4":35,"\u00c0":35,"\u00c5":35,"\u00c3":35,",":40,".":40,"e":33,"\u00e9":33,"\u00ea":33,"\u00eb":33,"\u00e8":33,"o":33,"\u00f8":33,"\u0153":33,"\u00f3":33,"\u00f4":33,"\u00f2":33,"\u00f5":33,"q":33,"-":40,"a":33,"\u00e6":33,"\u00e1":33,"\u00e2":33,"\u00e4":33,"\u00e0":33,"\u00e5":33,"\u00e3":33,"u":27,"\u00fa":27,"\u00fb":27,"\u00f9":27,":":33,";":33,"i":3,"\u0131":3,"\u00ed":3,"\u00ee":3,"\u00ef":3,"\u00ec":3,"p":27}},"Z":{"d":"13,0r0,-41r118,-171r-113,0r0,-39r167,0r0,41r-119,170r121,0r0,40r-174,0"},"[":{"d":"26,50r0,-322r81,0r0,35r-35,0r0,252r35,0r0,35r-81,0","w":119},"\\":{"d":"95,4r-88,-260r38,0r87,260r-37,0","w":140},"]":{"d":"13,-272r81,0r0,322r-81,0r0,-35r35,0r0,-252r-35,0r0,-35","w":119},"^":{"d":"61,-113r-37,0r67,-138r34,0r67,138r-37,0r-47,-100","w":216},"_":{"d":"0,27r180,0r0,18r-180,0r0,-18","w":180},"\u2018":{"d":"12,-161r33,-90r43,0r-23,90r-53,0","w":100,"k":{"\u2018":25}},"a":{"d":"13,-51v0,-61,60,-65,121,-63v3,-57,-72,-43,-99,-20r-2,-42v60,-27,142,-20,144,64r3,112r-42,0v-3,-10,0,-24,-3,-28v-25,51,-122,39,-122,-23xm59,-54v0,31,53,28,64,6v8,-10,11,-24,11,-38v-33,0,-75,-3,-75,32"},"b":{"d":"73,-93v0,26,11,60,43,60v32,0,41,-34,41,-60v0,-25,-9,-59,-40,-59v-31,0,-44,33,-44,59xm25,0r0,-270r48,0r1,108v13,-18,30,-28,55,-28v57,0,78,46,78,97v0,51,-21,97,-78,97v-21,0,-43,-7,-57,-27r0,23r-47,0","w":219},"c":{"d":"149,-184r-4,39v-38,-19,-82,1,-82,51v0,51,47,75,87,52r3,40v-73,22,-140,-15,-140,-92v0,-71,63,-114,136,-90","w":159},"d":{"d":"63,-93v0,26,9,60,41,60v60,0,58,-119,-1,-119v-31,0,-40,34,-40,59xm148,0r0,-21v-14,18,-34,25,-57,25v-57,0,-78,-46,-78,-97v0,-51,21,-97,78,-97v25,-1,40,10,56,26r0,-106r48,0r0,270r-47,0","w":219},"e":{"d":"59,-111r82,0v-1,-23,-12,-43,-39,-43v-27,0,-41,18,-43,43xm174,-50r0,40v-68,35,-161,5,-161,-82v0,-54,28,-98,86,-98v69,0,88,47,88,112r-128,0v2,58,79,54,115,28"},"f":{"d":"42,0r0,-150r-35,0r0,-35r35,0v-10,-67,32,-102,95,-85r-4,40v-14,-14,-48,-4,-42,22r0,23r42,0r0,35r-42,0r0,150r-49,0","w":140,"k":{"\u2019":-6,"f":6,"\ufb01":6,"\ufb02":6,"\u00df":6}},"g":{"d":"104,-37v30,0,43,-27,43,-58v0,-32,-12,-57,-40,-57v-61,1,-58,115,-3,115xm149,-185r46,0r0,167v0,50,-20,98,-98,98v-19,0,-41,-3,-64,-13r4,-41v15,8,39,16,54,16v52,1,58,-42,55,-72v-9,16,-30,30,-57,30v-55,0,-76,-44,-76,-94v0,-45,23,-96,78,-96v25,-1,43,11,58,30r0,-25","w":219},"h":{"d":"25,0r0,-270r48,0r1,110v12,-18,33,-30,58,-30v86,-1,59,110,63,190r-48,0r0,-99v0,-23,0,-53,-31,-53v-65,0,-37,90,-43,152r-48,0","w":219},"i":{"d":"26,0r0,-185r48,0r0,185r-48,0xm26,-219r0,-46r48,0r0,46r-48,0","w":100},"j":{"d":"-5,77r1,-35v26,-1,30,-6,30,-35r0,-192r48,0r0,199v0,26,-8,66,-56,66v-8,0,-17,-1,-23,-3xm26,-219r0,-46r48,0r0,46r-48,0","w":100},"k":{"d":"26,0r0,-270r48,0r1,159r57,-74r57,0r-69,82r78,103r-61,0r-63,-90r0,90r-48,0"},"l":{"d":"26,0r0,-270r48,0r0,270r-48,0","w":100},"m":{"d":"24,0r0,-185r45,0v1,8,-2,20,1,26v28,-44,90,-41,110,2v11,-22,35,-33,58,-33v86,1,50,113,58,190r-48,0r0,-111v0,-17,0,-41,-28,-41v-59,0,-29,94,-36,152r-48,0r0,-111v0,-17,0,-41,-28,-41v-59,0,-29,94,-36,152r-48,0","w":320},"n":{"d":"25,0r0,-185r46,0r0,25v35,-54,124,-32,124,43r0,117r-48,0r0,-99v0,-23,0,-53,-31,-53v-65,0,-37,90,-43,152r-48,0","w":219},"o":{"d":"13,-91v0,-61,42,-99,97,-99v55,0,97,38,97,99v0,53,-35,95,-97,95v-61,0,-97,-42,-97,-95xm63,-97v0,31,10,64,47,64v65,-1,64,-119,0,-119v-31,0,-47,27,-47,55","w":219},"p":{"d":"25,76r0,-261r46,0v1,8,-2,20,1,26v11,-18,29,-31,57,-31v57,0,78,46,78,97v0,51,-21,97,-79,97v-22,1,-37,-6,-55,-25r0,97r-48,0xm117,-152v-31,0,-44,33,-44,59v0,26,11,60,43,60v32,0,41,-34,41,-60v0,-25,-9,-59,-40,-59","w":219},"q":{"d":"147,76r-1,-97v-17,21,-33,25,-54,25v-58,0,-79,-46,-79,-97v0,-51,21,-97,79,-97v28,-1,43,14,57,31r0,-26r46,0r0,261r-48,0xm103,-152v-31,0,-40,34,-40,59v0,26,9,60,41,60v60,0,58,-119,-1,-119","w":219},"r":{"d":"26,0r0,-185r43,0r0,42v2,-20,31,-57,66,-45r0,48v-4,-3,-13,-4,-22,-4v-60,0,-33,88,-39,144r-48,0","w":140,"k":{",":33,".":33,"c":6,"\u00e7":6,"d":6,"e":6,"\u00e9":6,"\u00ea":6,"\u00eb":6,"\u00e8":6,"n":-6,"\u00f1":-6,"o":6,"\u00f8":6,"\u0153":6,"\u00f3":6,"\u00f4":6,"\u00f6":6,"\u00f2":6,"\u00f5":6,"q":6,"-":20}},"s":{"d":"138,-183r-3,36v-23,-7,-72,-18,-72,13v0,30,84,11,84,78v0,63,-77,69,-132,52r3,-39v25,13,71,24,79,-11v0,-36,-84,-11,-84,-78v0,-60,77,-66,125,-51","w":159},"t":{"d":"99,4v-74,3,-56,-85,-58,-154r-36,0r0,-35r36,0r0,-37r48,-16r0,53r43,0r0,35r-43,0r0,86v-5,27,25,38,45,26r1,38v-10,3,-22,4,-36,4","w":140},"u":{"d":"195,-185r0,185r-46,0r0,-25v-35,50,-124,33,-124,-43r0,-117r48,0r0,99v0,23,0,53,31,53v65,0,37,-90,43,-152r48,0","w":219},"v":{"d":"73,0r-69,-185r52,0r47,135r45,-135r48,0r-69,185r-54,0","k":{",":27,".":27}},"w":{"d":"67,0r-63,-185r51,0r42,137r37,-137r56,0r41,137r39,-137r46,0r-57,185r-57,0r-41,-141r-39,141r-55,0","w":320,"k":{",":20,".":20}},"x":{"d":"67,-97r-57,-88r57,0r36,60r36,-60r51,0r-56,88r63,97r-58,0r-41,-69r-42,69r-53,0"},"y":{"d":"57,-185r46,135r44,-135r49,0r-69,184v-14,53,-45,97,-112,76r4,-36v24,8,60,1,56,-30r-71,-194r53,0","k":{",":33,".":33}},"z":{"d":"17,-148r0,-37r147,0r0,39r-92,109r95,0r0,37r-154,0r0,-39r94,-109r-90,0","w":180},"{":{"d":"6,-95r0,-31v13,0,30,-8,30,-34r0,-64v2,-43,37,-51,80,-48r0,29v-50,-11,-34,48,-34,88v0,34,-25,43,-40,44v15,1,40,8,40,47v0,35,-20,96,34,86r0,28v-43,3,-80,-4,-80,-48r0,-61v0,-28,-17,-36,-30,-36","w":119},"|":{"d":"21,-270r38,0r0,360r-38,0r0,-360","w":79},"}":{"d":"113,-126r0,31v-13,0,-29,8,-29,36r0,61v-2,43,-37,51,-80,48r0,-28v49,11,34,-46,34,-86v0,-39,25,-46,40,-47v-15,-1,-40,-10,-40,-44v0,-36,21,-97,-34,-88r0,-29v43,-3,80,4,80,48v0,37,-7,103,29,98","w":119},"~":{"d":"150,-60v-41,-2,-92,-52,-112,1r-13,-32v8,-15,20,-31,43,-31v45,1,86,52,110,-1r13,32v-9,15,-22,31,-41,31","w":216},"\u00a1":{"d":"42,66r8,-178r40,0r8,178r-56,0xm44,-135r0,-50r51,0r0,50r-51,0","w":140},"\u00a2":{"d":"93,-52r30,-100v-41,1,-54,68,-30,100xm144,-219r21,0r-10,33v4,0,8,1,12,2r-4,39v-5,-3,-12,-5,-19,-6r-35,113v16,10,46,3,59,-4r3,40v-19,6,-51,9,-74,3r-10,31r-20,0r11,-37v-80,-38,-55,-206,57,-184"},"\u00a3":{"d":"19,0r0,-37r32,0r0,-79r-27,0r0,-29r27,0v-13,-86,56,-129,133,-104r-2,39v-35,-16,-87,2,-80,41r0,24r52,0r0,29r-52,0r0,79r80,0r0,37r-163,0"},"\u2044":{"d":"-60,8r150,-267r30,0r-150,267r-30,0","w":60},"\u00a5":{"d":"204,-251r-62,118r35,0r0,29r-50,0v-4,4,-3,14,-3,22r53,0r0,29r-53,0r0,53r-48,0r0,-53r-53,0r0,-29r53,0v0,-8,1,-18,-3,-22r-50,0r0,-29r36,0r-63,-118r51,0r55,111r55,-111r47,0"},"\u0192":{"d":"45,-146r41,0v11,-53,16,-115,81,-110v10,0,20,2,30,4r-7,38v-22,-9,-41,-1,-46,25r-9,43r44,0r-5,29r-44,0r-22,118v-4,24,-15,79,-68,79v-13,0,-25,0,-37,-4r7,-35v28,8,46,-12,45,-31r25,-127r-41,0"},"\u00a7":{"d":"61,-111v0,23,47,31,65,42v8,-6,13,-16,13,-27v0,-25,-36,-28,-65,-42v-6,5,-13,15,-13,27xm162,-248r-4,39v-27,-9,-83,-22,-86,15v-3,37,105,25,105,91v0,19,-10,37,-27,46v15,9,25,24,25,41v-3,69,-87,74,-147,55r4,-42v18,8,40,15,60,15v20,0,37,-6,37,-25v0,-37,-105,-27,-105,-90v0,-23,9,-38,27,-48v-16,-11,-25,-23,-25,-43v0,-63,79,-71,136,-54"},"\u00a4":{"d":"172,-220r22,21r-21,21v22,31,21,72,0,103r21,21r-22,21r-20,-21v-30,22,-73,23,-103,0r-21,21r-22,-21r21,-21v-22,-31,-21,-72,0,-103r-21,-21r22,-21r21,21v30,-23,73,-22,103,0xm50,-126v0,28,23,51,50,51v27,0,50,-23,50,-51v0,-28,-23,-52,-50,-52v-27,0,-50,24,-50,52"},"'":{"d":"28,-161r0,-90r44,0r0,90r-44,0","w":100},"\u201c":{"d":"12,-161r33,-90r43,0r-23,90r-53,0xm85,-161r33,-90r43,0r-23,90r-53,0","w":173},"\u00ab":{"d":"98,-97r42,-74r46,0r-40,74r40,74r-46,0xm18,-97r42,-74r45,0r-39,74r39,74r-45,0"},"\u2039":{"d":"18,-97r42,-74r45,0r-39,74r39,74r-45,0","w":119},"\u203a":{"d":"102,-97r-42,74r-46,0r40,-74r-40,-74r46,0","w":119},"\ufb01":{"d":"166,0r0,-185r48,0r0,185r-48,0xm166,-219r0,-46r48,0r0,46r-48,0xm42,0r0,-150r-35,0r0,-35r35,0v-10,-67,32,-102,95,-85r-4,40v-14,-14,-48,-4,-42,22r0,23r42,0r0,35r-42,0r0,150r-49,0","w":240},"\ufb02":{"d":"166,0r0,-270r48,0r0,270r-48,0xm42,0r0,-150r-35,0r0,-35r35,0v-10,-67,32,-102,95,-85r-4,40v-14,-14,-48,-4,-42,22r0,23r42,0r0,35r-42,0r0,150r-49,0","w":240},"\u2013":{"d":"0,-80r0,-33r180,0r0,33r-180,0","w":180},"\u2020":{"d":"21,-157r0,-37r56,0r0,-57r46,0r0,57r56,0r0,37r-56,0r0,157r-46,0r0,-157r-56,0"},"\u2021":{"d":"21,-165r0,-35r56,0r0,-51r46,0r0,51r56,0r0,35r-56,0r0,77r56,0r0,35r-56,0r0,53r-46,0r0,-53r-56,0r0,-35r56,0r0,-77r-56,0"},"\u00b7":{"d":"50,-75v-17,0,-28,-11,-28,-27v0,-16,11,-28,28,-28v17,0,28,12,28,28v0,16,-11,27,-28,27","w":100},"\u00b6":{"d":"80,45r0,-168v-50,0,-79,-25,-79,-63v-1,-87,111,-61,192,-65r0,296r-38,0r0,-267r-38,0r0,267r-37,0","w":223},"\u2022":{"d":"27,-126v0,-35,28,-62,63,-62v35,0,63,27,63,62v0,35,-28,63,-63,63v-35,0,-63,-28,-63,-63","w":180},"\u201a":{"d":"12,40r23,-90r53,0r-33,90r-43,0","w":100},"\u201e":{"d":"85,40r23,-90r53,0r-33,90r-43,0xm12,40r23,-90r53,0r-33,90r-43,0","w":173},"\u201d":{"d":"12,-161r23,-90r53,0r-33,90r-43,0xm85,-161r23,-90r53,0r-33,90r-43,0","w":173},"\u00bb":{"d":"102,-97r-42,74r-46,0r40,-74r-40,-74r46,0xm183,-97r-43,74r-45,0r39,-74r-39,-74r45,0"},"\u2026":{"d":"85,0r-50,0r0,-50r50,0r0,50xm205,0r-50,0r0,-50r50,0r0,50xm325,0r-50,0r0,-50r50,0r0,50","w":360},"\u2030":{"d":"54,-157v18,0,18,-18,18,-36v0,-18,0,-37,-18,-37v-18,0,-18,19,-18,37v0,18,0,36,18,36xm54,-131v-40,0,-51,-28,-51,-63v0,-35,11,-62,51,-62v39,0,51,27,51,62v0,35,-12,63,-51,63xm185,-22v18,0,18,-18,18,-36v0,-18,0,-36,-18,-36v-18,0,-18,18,-18,36v0,18,0,36,18,36xm185,4v-40,0,-51,-28,-51,-63v0,-35,11,-61,51,-61v39,0,51,26,51,61v0,35,-12,63,-51,63xm306,4v-40,0,-51,-28,-51,-63v0,-35,11,-61,51,-61v39,0,51,26,51,61v0,35,-12,63,-51,63xm306,-22v18,0,18,-18,18,-36v0,-18,0,-36,-18,-36v-18,0,-18,18,-18,36v0,18,0,36,18,36xm26,8r155,-267r29,0r-154,267r-30,0","w":360},"\u00bf":{"d":"114,-112v3,60,-47,69,-53,112v6,48,66,35,97,18r4,40v-59,22,-153,20,-153,-52v0,-50,65,-71,61,-118r44,0xm117,-185r0,50r-51,0r0,-50r51,0","w":180},"`":{"d":"60,-263r30,52r-30,0r-50,-52r50,0","w":100},"\u00b4":{"d":"10,-211r30,-52r50,0r-50,52r-30,0","w":100},"\u02c6":{"d":"33,-263r36,0r38,52r-32,0r-25,-31r-25,31r-32,0","w":100},"\u02dc":{"d":"79,-220v-23,0,-38,-12,-56,-13v-13,0,-17,9,-17,16r-20,0v0,-22,16,-44,37,-44v20,0,35,15,55,15v11,0,16,-7,16,-17r20,0v0,24,-13,43,-35,43","w":100},"\u00af":{"d":"102,-222r-104,0r0,-29r104,0r0,29","w":100},"\u02d8":{"d":"-9,-263r23,0v5,38,67,38,72,0r23,0v-2,32,-27,55,-59,55v-32,0,-58,-23,-59,-55","w":100},"\u02d9":{"d":"71,-219r-42,0r0,-42r42,0r0,42","w":100},"\u00a8":{"d":"66,-261r42,0r0,42r-42,0r0,-42xm34,-219r-42,0r0,-42r42,0r0,42","w":100},"\u02da":{"d":"12,-247v0,-21,17,-38,38,-38v21,0,39,17,39,38v0,21,-18,39,-39,39v-21,0,-38,-18,-38,-39xm31,-247v0,10,8,19,19,19v10,0,19,-9,19,-19v0,-11,-9,-19,-19,-19v-11,0,-19,8,-19,19","w":100},"\u00b8":{"d":"27,72r7,-19v12,4,43,12,44,-7v1,-15,-19,-14,-30,-10v-13,-13,9,-24,15,-36r23,0v-4,7,-15,13,-16,20v19,-5,44,-1,44,22v2,45,-61,42,-87,30","w":100},"\u02dd":{"d":"-25,-210r30,-53r49,0r-49,53r-30,0xm46,-211r30,-52r49,0r-49,52r-30,0","w":100},"\u02db":{"d":"22,48v1,-26,27,-50,61,-48v-14,11,-30,25,-30,44v0,22,29,18,35,5r14,2v-8,35,-83,43,-80,-3","w":100},"\u02c7":{"d":"69,-211r-36,0r-40,-52r32,0r25,31r25,-31r32,0","w":100},"\u2014":{"d":"0,-80r0,-33r360,0r0,33r-360,0","w":360},"\u00c6":{"d":"181,-97r-9,-117r-62,117r71,0xm3,0r138,-251r179,0r0,39r-97,0r5,62r84,0r0,40r-80,0r6,70r84,0r0,40r-133,0r-4,-58r-97,0r-31,58r-54,0","w":339},"\u00aa":{"d":"120,-141r-30,0v-1,-5,1,-12,-2,-15v-15,31,-78,22,-78,-14v0,-41,42,-40,77,-40v0,-36,-44,-25,-64,-13r0,-24v37,-17,95,-15,95,40v0,23,1,47,2,66xm41,-172v12,25,49,7,46,-19v-19,0,-44,-3,-46,19","w":129},"\u0141":{"d":"29,0r0,-87r-26,15r0,-33r26,-16r0,-130r51,0r0,101r60,-36r0,33r-60,36r0,77r97,0r0,40r-148,0","w":180,"k":{"T":33,"V":33,"W":20,"y":13,"\u00fd":13,"\u00ff":13,"Y":40,"\u00dd":40,"\u0178":40,"\u2019":27}},"\u00d8":{"d":"82,-70r101,-130v-11,-10,-25,-16,-43,-16v-71,1,-86,91,-58,146xm197,-183r-102,130v11,11,26,18,45,18v72,0,86,-94,57,-148xm231,-262r16,14r-19,25v23,23,35,57,35,97v0,76,-43,130,-123,130v-30,0,-54,-7,-73,-20r-21,26r-16,-13r21,-27v-23,-22,-34,-56,-34,-96v0,-77,43,-130,123,-130v28,0,52,7,71,19","w":280},"\u0152":{"d":"176,-40r0,-172v-64,-12,-107,24,-107,88v0,57,44,99,107,84xm320,-251r0,39r-93,0r0,62r85,0r0,40r-85,0r0,70r95,0r0,40v-144,-9,-300,53,-305,-124v-3,-114,91,-140,209,-127r94,0","w":339},"\u00ba":{"d":"72,-256v34,0,63,23,63,59v0,37,-28,59,-63,59v-35,0,-64,-22,-64,-59v0,-36,30,-59,64,-59xm73,-234v-22,0,-30,18,-30,37v0,20,6,37,29,37v23,0,28,-18,28,-37v0,-18,-6,-37,-27,-37","w":142},"\u00e6":{"d":"180,-111r81,0v0,-23,-11,-43,-38,-43v-28,0,-43,19,-43,43xm294,-50r0,40v-43,22,-112,21,-141,-19v-29,49,-140,48,-140,-22v0,-61,63,-65,121,-63v5,-54,-74,-46,-101,-20r-1,-42v42,-17,99,-25,129,10v14,-15,33,-24,63,-24v66,0,83,55,83,112r-127,0v0,58,79,54,114,28xm59,-51v0,11,10,20,27,20v35,0,48,-18,48,-55v-35,-1,-72,-1,-75,35","w":320},"\u0131":{"d":"74,0r-48,0r0,-185r48,0r0,185","w":100},"\u0142":{"d":"26,0r0,-105r-26,15r0,-33r26,-16r0,-131r48,0r0,103r26,-16r0,33r-26,16r0,134r-48,0","w":100},"\u00f8":{"d":"70,-60r68,-83v-47,-33,-96,29,-68,83xm150,-127r-69,83v7,7,16,11,29,11v48,0,55,-58,40,-94xm185,-198r14,12r-19,23v53,55,25,167,-70,167v-22,0,-42,-5,-57,-15r-20,24r-14,-12r20,-24v-57,-56,-14,-167,71,-167v21,0,40,5,55,15","w":219},"\u0153":{"d":"110,-154v-63,0,-65,121,0,123v36,0,48,-30,48,-61v0,-31,-12,-62,-48,-62xm327,-78r-121,0v0,57,72,56,106,29r2,39v-6,4,-23,14,-58,14v-31,0,-59,-6,-75,-30v-58,67,-168,17,-168,-65v0,-93,116,-131,166,-67v14,-21,40,-32,65,-32v67,0,83,54,83,112xm206,-111r75,0v-1,-23,-11,-43,-37,-43v-24,0,-38,21,-38,43","w":339},"\u00df":{"d":"74,0r-48,0v8,-114,-38,-276,88,-274v40,0,82,22,82,66v0,32,-16,56,-48,64v36,5,61,33,61,67v0,60,-56,90,-115,75r1,-37v30,7,64,11,64,-43v0,-32,-27,-41,-57,-41r0,-38v27,0,44,-12,44,-39v0,-20,-10,-37,-32,-37v-28,0,-40,27,-40,51r0,186","w":219},"\u00b9":{"d":"4,-217r50,-36r34,0r0,151r-37,0r0,-115r-28,22","w":129},"\u00ac":{"d":"162,-39r0,-73r-145,0r0,-37r182,0r0,110r-37,0","w":216},"\u00b5":{"d":"25,76r0,-261r48,0r0,99v0,23,0,53,31,53v65,0,37,-90,43,-152r48,0r0,185r-46,0r0,-25v-9,25,-50,42,-76,17r0,84r-48,0","w":219},"\u2122":{"d":"167,-102r0,-149r53,0r35,93r36,-93r52,0r0,149r-36,0r0,-105r-38,105r-27,0r-39,-105r0,105r-36,0xm59,-102r0,-120r-42,0r0,-29r122,0r0,29r-42,0r0,120r-38,0","w":360},"\u00d0":{"d":"29,0r0,-121r-23,0r0,-31r23,0r0,-99v115,-3,214,-3,214,125v0,127,-98,130,-214,126xm80,-121r0,81v64,6,110,-20,110,-86v0,-66,-46,-92,-110,-86r0,60r52,0r0,31r-52,0","w":259},"\u00bd":{"d":"48,8r150,-267r30,0r-150,267r-30,0xm4,-217r50,-36r33,0r0,151r-37,0r0,-115r-28,22xm288,-108v0,31,-43,65,-61,77r61,0r0,31r-108,0r0,-30v15,-5,68,-53,66,-74v-1,-28,-44,-20,-60,-7r-2,-31v37,-21,104,-18,104,34","w":300},"\u00b1":{"d":"89,-135r0,-47r38,0r0,47r72,0r0,38r-72,0r0,48r-38,0r0,-48r-72,0r0,-38r72,0xm17,0r0,-37r182,0r0,37r-182,0","w":216},"\u00de":{"d":"75,0r-50,0r0,-251r50,0r0,41v63,-2,118,12,118,77v0,67,-52,82,-118,79r0,54xm75,-170r0,77v35,1,66,-2,66,-38v0,-36,-30,-41,-66,-39"},"\u00bc":{"d":"194,-57r42,0v-1,-20,2,-44,-1,-62xm164,-28r0,-31r65,-93r45,0r0,95r17,0r0,29r-17,0r0,28r-38,0r0,-28r-72,0xm59,8r150,-267r30,0r-150,267r-30,0xm7,-217r50,-36r34,0r0,151r-37,0r0,-115r-28,22","w":300},"\u00f7":{"d":"199,-72r-182,0r0,-38r182,0r0,38xm108,-190v17,0,28,11,28,27v0,16,-11,28,-28,28v-17,0,-28,-12,-28,-28v0,-16,11,-27,28,-27xm108,8v-17,0,-28,-11,-28,-27v0,-16,11,-28,28,-28v17,0,28,12,28,28v0,16,-11,27,-28,27","w":216},"\u00a6":{"d":"21,-243r38,0r0,126r-38,0r0,-126xm21,-63r38,0r0,126r-38,0r0,-126","w":79},"\u00b0":{"d":"72,-229v-19,0,-32,12,-32,31v0,19,13,32,32,32v19,0,32,-13,32,-32v0,-19,-13,-31,-32,-31xm72,-256v32,0,58,26,58,58v0,33,-25,58,-58,58v-33,0,-58,-25,-58,-58v0,-32,26,-58,58,-58","w":144},"\u00fe":{"d":"25,76r0,-346r48,0r1,109v9,-15,27,-29,55,-29v57,0,78,46,78,97v0,51,-21,97,-78,97v-29,1,-42,-11,-56,-25r0,97r-48,0xm117,-152v-31,0,-44,33,-44,59v0,26,11,60,43,60v32,0,41,-34,41,-60v0,-25,-9,-59,-40,-59","w":219},"\u00be":{"d":"240,-57r0,-62r-41,62r41,0xm278,-28r0,28r-38,0r0,-28r-72,0r0,-31r65,-93r45,0r0,95r17,0r0,29r-17,0xm63,8r150,-267r30,0r-150,267r-30,0xm12,-217r-2,-30v39,-15,98,-16,104,28v3,20,-12,32,-30,39v21,1,32,17,32,35v0,50,-65,52,-111,40r2,-30v24,8,67,14,70,-12v2,-20,-31,-18,-49,-16r0,-30v21,0,47,2,49,-17v-5,-26,-45,-18,-65,-7","w":300},"\u00b2":{"d":"119,-209v0,31,-43,65,-61,77r62,0r0,30r-109,0r0,-29v15,-5,67,-54,66,-75v-1,-29,-45,-20,-60,-6r-2,-32v38,-21,104,-17,104,35","w":129},"\u00ae":{"d":"14,-126v0,-72,58,-130,130,-130v72,0,130,58,130,130v0,72,-58,130,-130,130v-72,0,-130,-58,-130,-130xm51,-126v0,60,41,102,93,102v51,0,93,-42,93,-102v0,-60,-42,-101,-93,-101v-52,0,-93,41,-93,101xm92,-54r0,-144v50,0,112,-8,112,43v0,26,-16,36,-38,38r38,63r-32,0r-34,-61r-15,0r0,61r-31,0xm123,-139v22,-2,52,7,50,-19v-1,-22,-29,-16,-50,-17r0,36","w":288},"\u2212":{"d":"199,-72r-182,0r0,-38r182,0r0,38","w":216},"\u00f0":{"d":"111,-148v-32,0,-48,32,-48,58v0,26,12,57,47,57v63,0,62,-115,1,-115xm52,-214r30,-19v-13,-8,-26,-14,-36,-18r22,-24v16,6,32,13,46,21r33,-21r19,17r-30,19v42,32,70,78,70,137v0,68,-35,106,-96,106v-61,0,-97,-42,-97,-95v0,-68,69,-117,129,-83v-8,-17,-22,-33,-38,-45r-33,22","w":219},"\u00d7":{"d":"82,-91r-58,-58r26,-26r58,58r58,-58r26,26r-58,58r58,58r-26,26r-58,-59r-58,59r-26,-26","w":216},"\u00b3":{"d":"17,-217r-2,-30v38,-15,97,-16,103,28v3,20,-11,32,-29,39v21,1,32,17,32,35v0,50,-66,52,-112,40r2,-30v25,8,64,14,68,-12v3,-21,-30,-17,-47,-16r0,-30v21,0,44,2,47,-17v-3,-27,-43,-17,-62,-7","w":129},"\u00a9":{"d":"237,-126v0,-60,-42,-101,-93,-101v-52,0,-93,41,-93,101v0,60,41,102,93,102v51,0,93,-42,93,-102xm182,-105r30,0v-5,35,-32,55,-63,55v-45,0,-73,-34,-73,-77v0,-84,125,-107,135,-22r-29,0v-16,-46,-75,-27,-71,22v-7,48,62,67,71,22xm14,-126v0,-72,58,-130,130,-130v72,0,130,58,130,130v0,72,-58,130,-130,130v-72,0,-130,-58,-130,-130","w":288},"\u00c1":{"d":"165,-97r-37,-104r-36,104r73,0xm3,0r98,-251r57,0r99,251r-56,0r-22,-58r-102,0r-22,58r-52,0xm100,-267r30,-53r50,0r-50,53r-30,0","w":259},"\u00c2":{"d":"165,-97r-37,-104r-36,104r73,0xm3,0r98,-251r57,0r99,251r-56,0r-22,-58r-102,0r-22,58r-52,0xm113,-320r36,0r38,53r-32,0r-25,-31r-25,31r-32,0","w":259},"\u00c4":{"d":"165,-97r-37,-104r-36,104r73,0xm3,0r98,-251r57,0r99,251r-56,0r-22,-58r-102,0r-22,58r-52,0xm146,-318r42,0r0,42r-42,0r0,-42xm114,-276r-42,0r0,-42r42,0r0,42","w":259},"\u00c0":{"d":"165,-97r-37,-104r-36,104r73,0xm3,0r98,-251r57,0r99,251r-56,0r-22,-58r-102,0r-22,58r-52,0xm130,-320r29,53r-29,0r-50,-53r50,0","w":259},"\u00c5":{"d":"165,-97r-37,-104r-36,104r73,0xm3,0r98,-251r57,0r99,251r-56,0r-22,-58r-102,0r-22,58r-52,0xm92,-298v0,-21,17,-39,38,-39v21,0,38,18,38,39v0,21,-17,38,-38,38v-21,0,-38,-17,-38,-38xm111,-298v0,10,8,19,19,19v10,0,19,-9,19,-19v0,-11,-9,-19,-19,-19v-11,0,-19,8,-19,19","w":259},"\u00c3":{"d":"165,-97r-37,-104r-36,104r73,0xm3,0r98,-251r57,0r99,251r-56,0r-22,-58r-102,0r-22,58r-52,0xm159,-276v-22,0,-38,-14,-56,-14v-13,0,-17,9,-17,16r-20,0v0,-22,16,-44,37,-44v20,0,36,16,55,16v11,0,16,-8,16,-18r20,0v0,24,-13,44,-35,44","w":259},"\u00c7":{"d":"210,-46r2,42v-20,4,-40,9,-62,8v-3,5,-12,11,-12,16v19,-5,43,0,43,22v2,45,-61,42,-87,30r8,-19v12,4,44,12,44,-7v0,-15,-20,-14,-31,-10v-13,-12,8,-23,14,-34v-67,-7,-112,-47,-112,-123v0,-107,95,-159,195,-124r-4,42v-66,-37,-139,6,-139,78v0,73,76,110,141,79","w":219},"\u00c9":{"d":"29,0r0,-251r148,0r0,39r-97,0r0,62r89,0r0,40r-89,0r0,70r98,0r0,40r-149,0xm71,-267r29,-53r50,0r-50,53r-29,0"},"\u00ca":{"d":"29,0r0,-251r148,0r0,39r-97,0r0,62r89,0r0,40r-89,0r0,70r98,0r0,40r-149,0xm83,-320r36,0r38,53r-32,0r-25,-31r-25,31r-32,0"},"\u00cb":{"d":"29,0r0,-251r148,0r0,39r-97,0r0,62r89,0r0,40r-89,0r0,70r98,0r0,40r-149,0xm116,-318r42,0r0,42r-42,0r0,-42xm84,-276r-42,0r0,-42r42,0r0,42"},"\u00c8":{"d":"29,0r0,-251r148,0r0,39r-97,0r0,62r89,0r0,40r-89,0r0,70r98,0r0,40r-149,0xm100,-320r30,53r-30,0r-50,-53r50,0"},"\u00cd":{"d":"25,0r0,-251r50,0r0,251r-50,0xm21,-267r29,-53r50,0r-50,53r-29,0","w":100},"\u00ce":{"d":"25,0r0,-251r50,0r0,251r-50,0xm33,-320r36,0r38,53r-32,0r-25,-31r-25,31r-32,0","w":100},"\u00cf":{"d":"25,0r0,-251r50,0r0,251r-50,0xm66,-318r42,0r0,42r-42,0r0,-42xm34,-276r-42,0r0,-42r42,0r0,42","w":100},"\u00cc":{"d":"25,0r0,-251r50,0r0,251r-50,0xm50,-320r30,53r-30,0r-50,-53r50,0","w":100},"\u00d1":{"d":"27,0r0,-251r62,0r96,188r0,-188r48,0r0,251r-61,0r-97,-188r0,188r-48,0xm159,-276v-22,0,-38,-14,-56,-14v-13,0,-17,9,-17,16r-20,0v0,-22,16,-44,37,-44v20,0,36,16,55,16v11,0,16,-8,16,-18r20,0v0,24,-13,44,-35,44","w":259},"\u00d3":{"d":"17,-126v0,-77,43,-130,123,-130v79,0,123,54,123,130v0,76,-43,130,-123,130v-81,0,-123,-53,-123,-130xm140,-216v-96,1,-96,180,0,181v97,-1,96,-180,0,-181xm111,-267r29,-53r50,0r-50,53r-29,0","w":280},"\u00d4":{"d":"17,-126v0,-77,43,-130,123,-130v79,0,123,54,123,130v0,76,-43,130,-123,130v-81,0,-123,-53,-123,-130xm140,-216v-96,1,-96,180,0,181v97,-1,96,-180,0,-181xm123,-320r36,0r38,53r-32,0r-25,-31r-25,31r-32,0","w":280},"\u00d6":{"d":"17,-126v0,-77,43,-130,123,-130v79,0,123,54,123,130v0,76,-43,130,-123,130v-81,0,-123,-53,-123,-130xm140,-216v-96,1,-96,180,0,181v97,-1,96,-180,0,-181xm156,-318r42,0r0,42r-42,0r0,-42xm124,-276r-42,0r0,-42r42,0r0,42","w":280},"\u00d2":{"d":"17,-126v0,-77,43,-130,123,-130v79,0,123,54,123,130v0,76,-43,130,-123,130v-81,0,-123,-53,-123,-130xm140,-216v-96,1,-96,180,0,181v97,-1,96,-180,0,-181xm140,-320r30,53r-30,0r-50,-53r50,0","w":280},"\u00d5":{"d":"17,-126v0,-77,43,-130,123,-130v79,0,123,54,123,130v0,76,-43,130,-123,130v-81,0,-123,-53,-123,-130xm140,-216v-96,1,-96,180,0,181v97,-1,96,-180,0,-181xm169,-276v-22,0,-38,-14,-56,-14v-13,0,-17,9,-17,16r-20,0v0,-22,16,-44,37,-44v20,0,36,16,55,16v11,0,16,-8,16,-18r20,0v0,24,-13,44,-35,44","w":280},"\u0160":{"d":"169,-247r-5,42v-33,-13,-91,-25,-91,24v0,44,111,25,111,109v1,79,-92,87,-159,67r5,-46v31,19,101,29,101,-17v0,-48,-110,-28,-110,-111v1,-80,85,-88,148,-68xm119,-267r-36,0r-40,-53r32,0r25,31r25,-31r32,0"},"\u00da":{"d":"27,-91r0,-160r51,0v9,79,-31,216,52,216v83,0,43,-138,52,-216r51,0r0,160v0,67,-39,95,-103,95v-64,0,-103,-28,-103,-95xm100,-267r30,-53r50,0r-50,53r-30,0","w":259},"\u00db":{"d":"27,-91r0,-160r51,0v9,79,-31,216,52,216v83,0,43,-138,52,-216r51,0r0,160v0,67,-39,95,-103,95v-64,0,-103,-28,-103,-95xm113,-320r36,0r38,53r-32,0r-25,-31r-25,31r-32,0","w":259},"\u00dc":{"d":"27,-91r0,-160r51,0v9,79,-31,216,52,216v83,0,43,-138,52,-216r51,0r0,160v0,67,-39,95,-103,95v-64,0,-103,-28,-103,-95xm146,-318r42,0r0,42r-42,0r0,-42xm114,-276r-42,0r0,-42r42,0r0,42","w":259},"\u00d9":{"d":"27,-91r0,-160r51,0v9,79,-31,216,52,216v83,0,43,-138,52,-216r51,0r0,160v0,67,-39,95,-103,95v-64,0,-103,-28,-103,-95xm130,-320r29,53r-29,0r-50,-53r50,0","w":259},"\u00dd":{"d":"96,0r0,-99r-92,-152r59,0r59,105r61,-105r53,0r-90,152r0,99r-50,0xm91,-267r30,-53r49,0r-49,53r-30,0","w":240,"k":{"v":20,"A":35,"\u00c6":35,"\u00c1":35,"\u00c2":35,"\u00c4":35,"\u00c0":35,"\u00c5":35,"\u00c3":35,",":40,".":40,"e":33,"\u00e9":33,"\u00ea":33,"\u00eb":33,"\u00e8":33,"o":33,"\u00f8":33,"\u0153":33,"\u00f3":33,"\u00f4":33,"\u00f6":33,"\u00f2":33,"\u00f5":33,"q":33,"-":40,"a":33,"\u00e6":33,"\u00e1":33,"\u00e2":33,"\u00e4":33,"\u00e0":33,"\u00e5":33,"\u00e3":33,"u":27,"\u00fa":27,"\u00fb":27,"\u00fc":27,"\u00f9":27,":":33,";":33,"i":3,"\u0131":3,"\u00ed":3,"\u00ee":3,"\u00ef":3,"\u00ec":3,"p":27}},"\u0178":{"d":"96,0r0,-99r-92,-152r59,0r59,105r61,-105r53,0r-90,152r0,99r-50,0xm136,-318r42,0r0,42r-42,0r0,-42xm104,-276r-42,0r0,-42r42,0r0,42","w":240,"k":{"v":20,"A":35,"\u00c6":35,"\u00c1":35,"\u00c2":35,"\u00c4":35,"\u00c0":35,"\u00c5":35,"\u00c3":35,",":40,".":40,"e":33,"\u00e9":33,"\u00ea":33,"\u00eb":33,"\u00e8":33,"o":33,"\u00f8":33,"\u0153":33,"\u00f3":33,"\u00f4":33,"\u00f6":33,"\u00f2":33,"\u00f5":33,"q":33,"-":40,"a":33,"\u00e6":33,"\u00e1":33,"\u00e2":33,"\u00e4":33,"\u00e0":33,"\u00e5":33,"\u00e3":33,"u":27,"\u00fa":27,"\u00fb":27,"\u00fc":27,"\u00f9":27,":":33,";":33,"i":3,"\u0131":3,"\u00ed":3,"\u00ee":3,"\u00ef":3,"\u00ec":3,"p":27}},"\u017d":{"d":"13,0r0,-41r118,-171r-113,0r0,-39r167,0r0,41r-119,170r121,0r0,40r-174,0xm119,-267r-36,0r-40,-53r32,0r25,31r25,-31r32,0"},"\u00e1":{"d":"13,-51v0,-61,60,-65,121,-63v3,-57,-72,-43,-99,-20r-2,-42v60,-27,142,-20,144,64r3,112r-42,0v-3,-10,0,-24,-3,-28v-25,51,-122,39,-122,-23xm59,-54v0,31,53,28,64,6v8,-10,11,-24,11,-38v-33,0,-75,-3,-75,32xm73,-211r30,-52r50,0r-50,52r-30,0"},"\u00e2":{"d":"13,-51v0,-61,60,-65,121,-63v3,-57,-72,-43,-99,-20r-2,-42v60,-27,142,-20,144,64r3,112r-42,0v-3,-10,0,-24,-3,-28v-25,51,-122,39,-122,-23xm59,-54v0,31,53,28,64,6v8,-10,11,-24,11,-38v-33,0,-75,-3,-75,32xm83,-263r36,0r38,52r-32,0r-25,-31r-25,31r-32,0"},"\u00e4":{"d":"13,-51v0,-61,60,-65,121,-63v3,-57,-72,-43,-99,-20r-2,-42v60,-27,142,-20,144,64r3,112r-42,0v-3,-10,0,-24,-3,-28v-25,51,-122,39,-122,-23xm59,-54v0,31,53,28,64,6v8,-10,11,-24,11,-38v-33,0,-75,-3,-75,32xm116,-261r42,0r0,42r-42,0r0,-42xm84,-219r-42,0r0,-42r42,0r0,42"},"\u00e0":{"d":"13,-51v0,-61,60,-65,121,-63v3,-57,-72,-43,-99,-20r-2,-42v60,-27,142,-20,144,64r3,112r-42,0v-3,-10,0,-24,-3,-28v-25,51,-122,39,-122,-23xm59,-54v0,31,53,28,64,6v8,-10,11,-24,11,-38v-33,0,-75,-3,-75,32xm94,-263r29,52r-29,0r-50,-52r50,0"},"\u00e5":{"d":"13,-51v0,-61,60,-65,121,-63v3,-57,-72,-43,-99,-20r-2,-42v60,-27,142,-20,144,64r3,112r-42,0v-3,-10,0,-24,-3,-28v-25,51,-122,39,-122,-23xm59,-54v0,31,53,28,64,6v8,-10,11,-24,11,-38v-33,0,-75,-3,-75,32xm62,-247v0,-21,17,-38,38,-38v21,0,39,17,39,38v0,21,-18,39,-39,39v-21,0,-38,-18,-38,-39xm81,-247v0,10,8,19,19,19v10,0,19,-9,19,-19v0,-11,-9,-19,-19,-19v-11,0,-19,8,-19,19"},"\u00e3":{"d":"13,-51v0,-61,60,-65,121,-63v3,-57,-72,-43,-99,-20r-2,-42v60,-27,142,-20,144,64r3,112r-42,0v-3,-10,0,-24,-3,-28v-25,51,-122,39,-122,-23xm59,-54v0,31,53,28,64,6v8,-10,11,-24,11,-38v-33,0,-75,-3,-75,32xm129,-220v-23,0,-38,-12,-56,-13v-13,0,-17,9,-17,16r-20,0v0,-22,16,-44,37,-44v20,0,36,15,56,15v11,0,15,-7,15,-17r20,0v0,24,-13,43,-35,43"},"\u00e7":{"d":"149,-184r-4,39v-38,-19,-82,1,-82,51v0,51,47,75,87,52r3,40v-12,4,-24,6,-40,6v-4,5,-13,11,-13,16v19,-5,44,-1,44,22v2,45,-61,42,-87,30r7,-19v12,4,43,12,44,-7v1,-16,-20,-14,-31,-10v-11,-13,8,-22,14,-33v-52,-5,-78,-45,-78,-97v0,-71,63,-114,136,-90","w":159},"\u00e9":{"d":"59,-111r82,0v-1,-23,-12,-43,-39,-43v-27,0,-41,18,-43,43xm174,-50r0,40v-68,35,-161,5,-161,-82v0,-54,28,-98,86,-98v69,0,88,47,88,112r-128,0v2,58,79,54,115,28xm73,-211r30,-52r50,0r-50,52r-30,0"},"\u00ea":{"d":"59,-111r82,0v-1,-23,-12,-43,-39,-43v-27,0,-41,18,-43,43xm174,-50r0,40v-68,35,-161,5,-161,-82v0,-54,28,-98,86,-98v69,0,88,47,88,112r-128,0v2,58,79,54,115,28xm83,-263r36,0r38,52r-32,0r-25,-31r-25,31r-32,0"},"\u00eb":{"d":"59,-111r82,0v-1,-23,-12,-43,-39,-43v-27,0,-41,18,-43,43xm174,-50r0,40v-68,35,-161,5,-161,-82v0,-54,28,-98,86,-98v69,0,88,47,88,112r-128,0v2,58,79,54,115,28xm116,-261r42,0r0,42r-42,0r0,-42xm84,-219r-42,0r0,-42r42,0r0,42"},"\u00e8":{"d":"59,-111r82,0v-1,-23,-12,-43,-39,-43v-27,0,-41,18,-43,43xm174,-50r0,40v-68,35,-161,5,-161,-82v0,-54,28,-98,86,-98v69,0,88,47,88,112r-128,0v2,58,79,54,115,28xm94,-263r29,52r-29,0r-50,-52r50,0"},"\u00ed":{"d":"74,0r-48,0r0,-185r48,0r0,185xm23,-211r30,-52r50,0r-50,52r-30,0","w":100},"\u00ee":{"d":"74,0r-48,0r0,-185r48,0r0,185xm33,-263r36,0r38,52r-32,0r-25,-31r-25,31r-32,0","w":100},"\u00ef":{"d":"74,0r-48,0r0,-185r48,0r0,185xm66,-261r42,0r0,42r-42,0r0,-42xm34,-219r-42,0r0,-42r42,0r0,42","w":100},"\u00ec":{"d":"74,0r-48,0r0,-185r48,0r0,185xm44,-263r29,52r-29,0r-50,-52r50,0","w":100},"\u00f1":{"d":"25,0r0,-185r46,0r0,25v35,-54,124,-32,124,43r0,117r-48,0r0,-99v0,-23,0,-53,-31,-53v-65,0,-37,90,-43,152r-48,0xm139,-220v-22,0,-38,-12,-55,-13v-13,0,-18,9,-18,16r-20,0v0,-22,16,-44,37,-44v20,0,36,15,56,15v11,0,15,-7,15,-17r20,0v0,24,-13,43,-35,43","w":219},"\u00f3":{"d":"13,-91v0,-61,42,-99,97,-99v55,0,97,38,97,99v0,53,-35,95,-97,95v-61,0,-97,-42,-97,-95xm63,-97v0,31,10,64,47,64v65,-1,64,-119,0,-119v-31,0,-47,27,-47,55xm84,-211r29,-52r50,0r-50,52r-29,0","w":219},"\u00f4":{"d":"13,-91v0,-61,42,-99,97,-99v55,0,97,38,97,99v0,53,-35,95,-97,95v-61,0,-97,-42,-97,-95xm63,-97v0,31,10,64,47,64v65,-1,64,-119,0,-119v-31,0,-47,27,-47,55xm93,-263r36,0r38,52r-32,0r-24,-31r-26,31r-32,0","w":219},"\u00f6":{"d":"13,-91v0,-61,42,-99,97,-99v55,0,97,38,97,99v0,53,-35,95,-97,95v-61,0,-97,-42,-97,-95xm63,-97v0,31,10,64,47,64v65,-1,64,-119,0,-119v-31,0,-47,27,-47,55xm126,-261r42,0r0,42r-42,0r0,-42xm94,-219r-42,0r0,-42r42,0r0,42","w":219},"\u00f2":{"d":"13,-91v0,-61,42,-99,97,-99v55,0,97,38,97,99v0,53,-35,95,-97,95v-61,0,-97,-42,-97,-95xm63,-97v0,31,10,64,47,64v65,-1,64,-119,0,-119v-31,0,-47,27,-47,55xm104,-263r30,52r-30,0r-50,-52r50,0","w":219},"\u00f5":{"d":"13,-91v0,-61,42,-99,97,-99v55,0,97,38,97,99v0,53,-35,95,-97,95v-61,0,-97,-42,-97,-95xm63,-97v0,31,10,64,47,64v65,-1,64,-119,0,-119v-31,0,-47,27,-47,55xm139,-220v-22,0,-38,-12,-55,-13v-13,0,-18,9,-18,16r-20,0v0,-22,16,-44,37,-44v20,0,36,15,56,15v11,0,15,-7,15,-17r20,0v0,24,-13,43,-35,43","w":219},"\u0161":{"d":"138,-183r-3,36v-23,-7,-72,-18,-72,13v0,30,84,11,84,78v0,63,-77,69,-132,52r3,-39v25,13,71,24,79,-11v0,-36,-84,-11,-84,-78v0,-60,77,-66,125,-51xm99,-211r-36,0r-40,-52r32,0r25,31r25,-31r32,0","w":159},"\u00fa":{"d":"195,-185r0,185r-46,0r0,-25v-35,50,-124,33,-124,-43r0,-117r48,0r0,99v0,23,0,53,31,53v65,0,37,-90,43,-152r48,0xm84,-211r29,-52r50,0r-50,52r-29,0","w":219},"\u00fb":{"d":"195,-185r0,185r-46,0r0,-25v-35,50,-124,33,-124,-43r0,-117r48,0r0,99v0,23,0,53,31,53v65,0,37,-90,43,-152r48,0xm93,-263r36,0r38,52r-32,0r-24,-31r-26,31r-32,0","w":219},"\u00fc":{"d":"195,-185r0,185r-46,0r0,-25v-35,50,-124,33,-124,-43r0,-117r48,0r0,99v0,23,0,53,31,53v65,0,37,-90,43,-152r48,0xm126,-261r42,0r0,42r-42,0r0,-42xm94,-219r-42,0r0,-42r42,0r0,42","w":219},"\u00f9":{"d":"195,-185r0,185r-46,0r0,-25v-35,50,-124,33,-124,-43r0,-117r48,0r0,99v0,23,0,53,31,53v65,0,37,-90,43,-152r48,0xm104,-263r30,52r-30,0r-50,-52r50,0","w":219},"\u00fd":{"d":"57,-185r46,135r44,-135r49,0r-69,184v-14,53,-45,97,-112,76r4,-36v24,8,60,1,56,-30r-71,-194r53,0xm73,-211r30,-52r50,0r-50,52r-30,0","k":{",":33,".":33}},"\u00ff":{"d":"57,-185r46,135r44,-135r49,0r-69,184v-14,53,-45,97,-112,76r4,-36v24,8,60,1,56,-30r-71,-194r53,0xm116,-261r42,0r0,42r-42,0r0,-42xm84,-219r-42,0r0,-42r42,0r0,42","k":{",":33,".":33}},"\u017e":{"d":"17,-148r0,-37r147,0r0,39r-92,109r95,0r0,37r-154,0r0,-39r94,-109r-90,0xm109,-211r-36,0r-40,-52r32,0r25,31r25,-31r32,0","w":180},"\u2126":{"d":"14,-35v16,-1,35,2,49,-1v-22,-21,-44,-56,-44,-102v0,-64,44,-117,109,-117v122,-1,131,167,61,220r50,0r0,35r-93,0r0,-26v23,-15,45,-48,45,-105v0,-45,-22,-88,-63,-88v-40,0,-65,38,-65,89v0,52,22,90,45,104r0,26r-94,0r0,-35","w":254},"\u03bc":{"d":"25,76r0,-261r48,0r0,99v0,23,0,53,31,53v65,0,37,-90,43,-152r48,0r0,185r-46,0r0,-25v-9,25,-50,42,-76,17r0,84r-48,0","w":219},"\u03c0":{"d":"206,-152r-26,0v1,46,-3,116,4,152r-41,0v-11,-31,-4,-107,-6,-152r-52,0v-2,40,-10,115,-23,152r-42,0v12,-41,22,-111,23,-152v-18,0,-28,1,-36,4r-5,-28v41,-21,143,-9,207,-12","w":214},"\u20ac":{"d":"215,-246r-10,38v-49,-22,-103,-1,-116,46r106,0r-6,22r-105,0v-1,9,-1,19,0,28r99,0r-5,22r-89,0v13,47,65,67,116,47r2,40v-82,23,-158,-11,-173,-87r-35,0r5,-22r27,0v-1,-9,-1,-19,0,-28r-32,0r5,-22r31,0v18,-78,97,-113,180,-84"},"\u2113":{"d":"158,-64r18,18v-28,73,-139,60,-137,-15v-6,4,-14,10,-20,15r-10,-23v10,-9,20,-16,29,-25r0,-91v0,-64,29,-91,63,-91v34,0,49,28,49,63v0,43,-27,84,-71,126v-3,32,11,56,33,56v20,0,36,-17,46,-33xm79,-186r0,59v26,-29,44,-60,44,-87v0,-19,-5,-31,-20,-31v-11,0,-24,13,-24,59","w":182},"\u212e":{"d":"65,-50v36,62,143,60,185,4r20,0v-26,30,-68,50,-114,50v-80,0,-144,-58,-144,-130v0,-72,64,-130,144,-130v81,1,147,58,145,134r-236,1r0,71xm248,-202v-35,-59,-135,-59,-179,-8v-8,18,-5,59,-2,81r181,-2r0,-71","w":313},"\u2202":{"d":"37,-230r-13,-32v69,-48,163,-9,163,116v0,89,-37,149,-100,149v-50,0,-73,-46,-73,-85v0,-57,35,-94,77,-94v30,0,49,21,54,30v3,-54,-21,-101,-61,-101v-22,0,-38,9,-47,17xm56,-81v1,27,13,48,36,48v28,0,45,-41,49,-77v-20,-56,-88,-29,-85,29","w":204},"\u220f":{"d":"248,-212r-37,0r0,247r-42,0r0,-247r-81,0r0,247r-42,0r0,-247r-37,0r0,-39r239,0r0,39","w":257},"\u2211":{"d":"193,35r-185,0r0,-28r88,-115r-84,-113r0,-30r175,0r0,37r-118,1r75,98r-83,110r132,0r0,40","w":199},"\u2219":{"d":"50,-75v-17,0,-28,-11,-28,-27v0,-16,11,-28,28,-28v17,0,28,12,28,28v0,16,-11,27,-28,27","w":100},"\u221a":{"d":"214,-300r-80,351r-35,0r-54,-159r-26,11r-7,-24r59,-24r38,117v4,11,3,24,8,30v1,-8,2,-20,5,-32r62,-270r30,0","w":211},"\u221e":{"d":"206,-162v31,0,58,23,55,59v-5,73,-83,82,-121,20v-18,23,-38,41,-67,41v-30,0,-56,-25,-56,-60v0,-36,25,-60,59,-60v27,0,46,16,65,40v15,-18,33,-40,65,-40xm42,-101v0,19,14,35,35,35v21,0,36,-19,50,-35v-15,-19,-28,-38,-52,-38v-21,0,-33,16,-33,38xm205,-66v45,-1,40,-73,-2,-73v-22,0,-38,23,-50,36v22,27,34,37,52,37","w":278},"\u222b":{"d":"49,-213v0,-69,25,-106,83,-92r-5,30v-34,-13,-41,20,-41,66v0,58,6,110,6,174v0,70,-30,110,-85,90r5,-30v35,11,42,-11,42,-60v0,-64,-5,-118,-5,-178","w":140},"\u2248":{"d":"66,-161v31,0,45,25,69,26v14,0,23,-10,33,-26r15,14v-11,21,-27,37,-48,37v-23,0,-47,-27,-72,-27v-16,0,-24,13,-33,26r-16,-14v10,-21,30,-36,52,-36xm66,-95v44,0,76,52,102,0r15,14v-11,21,-27,37,-48,37v-23,0,-47,-27,-72,-27v-16,0,-24,13,-33,26r-16,-14v10,-21,30,-36,52,-36","w":198},"\u2260":{"d":"145,-183r-15,32r50,0r0,25r-59,0r-22,49r81,0r0,25r-90,0r-18,41r-20,-8r15,-33r-50,0r0,-25r59,0r22,-49r-81,0r0,-25r90,0r18,-41","w":198},"\u2264":{"d":"179,-35r-160,-81r0,-27r160,-79r0,29r-135,64r135,64r0,30xm181,4r-163,0r0,-26r163,0r0,26","w":198},"\u2265":{"d":"20,-222r160,80r0,26r-160,81r0,-30r135,-65r-135,-63r0,-29xm180,4r-162,0r0,-26r162,0r0,26","w":198},"\u25ca":{"d":"193,-125r-71,142r-35,0r-69,-142r71,-142r34,0xm155,-124r-50,-109v-12,39,-34,71,-49,107v16,36,37,69,49,109v14,-38,33,-71,50,-107","w":211},"\u00a0":{"w":100},"\u00ad":{"d":"107,-77r-94,0r0,-40r94,0r0,40","w":119},"\u02c9":{"d":"102,-222r-104,0r0,-29r104,0r0,29","w":100},"\u03a9":{"d":"14,-35v16,-1,35,2,49,-1v-22,-21,-44,-56,-44,-102v0,-64,44,-117,109,-117v122,-1,131,167,61,220r50,0r0,35r-93,0r0,-26v23,-15,45,-48,45,-105v0,-45,-22,-88,-63,-88v-40,0,-65,38,-65,89v0,52,22,90,45,104r0,26r-94,0r0,-35","w":254},"\u2215":{"d":"-60,8r150,-267r30,0r-150,267r-30,0","w":60},"\u2206":{"d":"10,0r0,-26r83,-230r51,0r81,230r0,26r-215,0xm54,-35r125,0r-41,-109r-22,-65v-17,55,-42,120,-62,174","w":235},"\u2010":{"d":"107,-77r-94,0r0,-40r94,0r0,40","w":119}}});


/***
 * Twitter JS v2.0.0
 * http://code.google.com/p/twitterjs/
 * Copyright (c) 2009 Remy Sharp / MIT License
 * $Date$
 */
 /*
  MIT (MIT-LICENSE.txt)
 */
typeof getTwitters!="function"&&function(){var a={},b=0;!function(a,b){function m(a){l=1;while(a=c.shift())a()}var c=[],d,e,f=!1,g=b.documentElement,h=g.doScroll,i="DOMContentLoaded",j="addEventListener",k="onreadystatechange",l=/^loade|c/.test(b.readyState);b[j]&&b[j](i,e=function(){b.removeEventListener(i,e,f),m()},f),h&&b.attachEvent(k,d=function(){/^c/.test(b.readyState)&&(b.detachEvent(k,d),m())}),a.domReady=h?function(b){self!=top?l?b():c.push(b):function(){try{g.doScroll("left")}catch(c){return setTimeout(function(){a.domReady(b)},50)}b()}()}:function(a){l?a():c.push(a)}}(a,document),window.getTwitters=function(c,d,e,f){b++,typeof d=="object"&&(f=d,d=f.id,e=f.count),e||(e=1),f?f.count=e:f={},!f.timeout&&typeof f.onTimeout=="function"&&(f.timeout=10),typeof f.clearContents=="undefined"&&(f.clearContents=!0),f.twitterTarget=c,typeof f.enableLinks=="undefined"&&(f.enableLinks=!0),a.domReady(function(a,b){return function(){function f(){a.target=document.getElementById(a.twitterTarget);if(!!a.target){var f={limit:e};f.includeRT&&(f.include_rts=!0),a.timeout&&(window["twitterTimeout"+b]=setTimeout(function(){twitterlib.cancel(),a.onTimeout.call(a.target)},a.timeout*1e3));var g="timeline";d.indexOf("#")===0&&(g="search"),d.indexOf("/")!==-1&&(g="list"),a.ignoreReplies&&(f.filter={not:new RegExp(/^@/)}),twitterlib.cache(!0),twitterlib[g](d,f,function(d,e){clearTimeout(window["twitterTimeout"+b]);var f=[],g=d.length>a.count?a.count:d.length;f=["<ul>"];for(var h=0;h<g;h++){d[h].time=twitterlib.time.relative(d[h].created_at);for(var i in d[h].user)d[h]["user_"+i]=d[h].user[i];a.template?f.push("<li>"+a.template.replace(/%([a-z_\-\.]*)%/ig,function(b,c){var e=d[h][c]+""||"";c=="text"&&(e=twitterlib.expandLinks(d[h])),c=="text"&&a.enableLinks&&(e=twitterlib.ify.clean(e));return e})+"</li>"):a.bigTemplate?f.push(twitterlib.render(d[h])):f.push(c(d[h]))}f.push("</ul>"),a.clearContents?a.target.innerHTML=f.join(""):a.target.innerHTML+=f.join(""),a.callback&&a.callback(d)})}}function c(b){var c=a.enableLinks?twitterlib.ify.clean(twitterlib.expandLinks(b)):twitterlib.expandLinks(b),d="<li>";a.prefix&&(d+='<li><span className="twitterPrefix">',d+=a.prefix.replace(/%(.*?)%/g,function(a,c){return b.user[c]}),d+=" </span></li>"),d+='<span className="twitterStatus">'+twitterlib.time.relative(b.created_at)+"</span> ",d+='<span className="twitterTime">'+b.text+"</span>",a.newwindow&&(d=d.replace(/<a href/gi,'<a target="_blank" href'));return d}typeof twitterlib=="undefined"?setTimeout(function(){var a=document.createElement("script");a.onload=a.onreadystatechange=function(){typeof window.twitterlib!="undefined"&&f()},a.src="http://remy.github.com/twitterlib/twitterlib.js";var b=document.head||document.getElementsByTagName("head")[0];b.insertBefore(a,b.firstChild)},0):f()}}(f,b))}}()


