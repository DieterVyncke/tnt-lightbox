"use strict";

const utils = {

	loadImage( src, cb ) {
		let img =  new Image();

		img.onload = () => {
			cb( img );
		};

		img.src = src;
	},

	proxy( c, f ) {
		return function() {
			return f.apply( c, arguments );
		};
	},

	startsWith( subject, search ) {
		return subject.substring( 0, search.length ) == search;
	}
};

export default utils;