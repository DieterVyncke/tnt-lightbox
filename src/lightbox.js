"use strict";

import util from './utils';

class Lightbox {

	constructor( elements ) {

		this.elements = elements;
		this.count = elements.length;
		this.index = null;
		this.body = document.querySelector( 'body' );
		this.opened = false;

		this.build();
	}

	build() {

		this.overlay = document.createElement( 'div' );
		this.overlay.className += 'tnt-lightbox-overlay hidden';
		document.body.appendChild( this.overlay );

		this.closeButton = document.createElement( 'button' );
		this.closeButton.classList.add( 'tnt-lightbox-close' );
		this.overlay.appendChild( this.closeButton );

		this.prev = document.createElement( 'button' );
		this.prev.classList.add( 'tnt-lightbox-prev' );
		this.overlay.appendChild( this.prev );

		this.next = document.createElement( 'button' );
		this.next.classList.add( 'tnt-lightbox-next' );
		this.overlay.appendChild( this.next );

		this.box = document.createElement( 'div' );
		this.overlay.appendChild( this.box );

		for( let i = 0; i < this.elements.length; i++ ) {
			this.elements[ i ].addEventListener( 'click', e => { this.click( e ) } );
		}

		this.prev.addEventListener( 'click', () => { this.openPrev() } );
		this.next.addEventListener( 'click', () => { this.openNext() } );
		this.closeButton.addEventListener( 'click', () => { this.close() } );

		document.addEventListener( 'keydown', e => {
			if( this.opened ) {
				switch( e.keyCode ) {
					case 27:
						this.close();
						break;
					case 37:
						this.openPrev();
						break;
					case 39:
						this.openNext();
						break;
				}
			}
		} );
	}

	close() {
		this.opened = false;
		this.toggleClass();

		this.box.innerHTML = '';
		this.overlay.classList.add( 'hidden' );
	}

	click( event ) {
		this.opened = true;
		this.toggleClass();

		this.open( event.currentTarget );
		event.preventDefault();
	}

	openNext() {
		this.openByIndex( this.index + 1 );
	}

	openPrev() {
		this.openByIndex( this.index - 1 );
	}

	openByIndex( currentIndex ) {
		console.log( currentIndex );

		if( currentIndex >= 0 && currentIndex < this.elements.length ) {
			let element = this.elements[ currentIndex ];
			this.open( element );
		}
	}

	open( el ) {

		let currentIndex = this.getIndex( el );
		let url = el.getAttribute( 'href' );

		if( currentIndex >= 0 ) {

			let urlSplit = url.split( '.' );
			let extension = urlSplit[ urlSplit.length - 1 ];

			let iframe = null;

			this.index = currentIndex;
			this.box.innerHTML = '';
			this.overlay.classList.remove( 'hidden' );
			this.overlay.classList.add( 'loading' );

			if( currentIndex === 0 ) {
				this.hide( this.prev );
			} else {
				this.show( this.prev );
			}

			if( currentIndex === this.count -1 ) {
				this.hide( this.next );
			} else {
				this.show( this.next );
			}

			if( util.startsWith( url, 'https://www.vimeo.com/' ) ) {

				let videoId = url.replace( 'https://www.vimeo.com/', '' );

				iframe = document.createElement( 'iframe' );
				iframe.setAttribute( 'src', 'https://player.vimeo.com/video/' + videoId + '?color=7a7d80' + '&autoplay=true' + '&quality=1080p' );
				iframe.setAttribute( 'frameborder', 0 );
				iframe.setAttribute( 'webkitallowfullscreen', true );
				iframe.setAttribute( 'mozallowfullscreen', true );
				iframe.setAttribute( 'allowfullscreen', true );
				this.box.appendChild( iframe );

				this.overlay.classList.remove( 'loading' );

			} else if( util.startsWith( url, 'https://www.youtube.com/' ) ) {

				let videoId = url.replace( 'https://www.youtube.com/watch?v=', '' );

				iframe = document.createElement( 'iframe' );
				iframe.setAttribute( 'src', 'https://www.youtube.com/embed/' + videoId + '?rel=0' );
				iframe.setAttribute( 'frameborder', 0 );
				iframe.setAttribute( 'webkitallowfullscreen', true );
				iframe.setAttribute( 'mozallowfullscreen', true );
				iframe.setAttribute( 'allowfullscreen', true );
				this.box.appendChild( iframe );

				this.overlay.classList.remove( 'loading' );

			} else if( extension.match( /(jpg|png)/ ) ) {

				util.loadImage( url, img => {
					this.box.appendChild( img );
					this.overlay.classList.remove( 'loading' );
				} );
			}

			if( el.getAttribute( 'data-description' ) ) {
				this.description = document.createElement( 'p' );
				this.description.innerHTML = el.getAttribute( 'data-description' );
				this.box.appendChild( this.description );
			}
		}
	}

	getIndex( el ) {
		return [ ...this.elements ].indexOf( el );
	}

	toggleClass()
	{
		this.opened ? this.body.classList.add( 'lightbox-open' ) : this.body.classList.remove( 'lightbox-open' );
	}

	hide( el ) {
		return el.style.display = 'none';
	}

	show( el ) {
		return el.style.display = 'inline-block';
	}
}

export default Lightbox;
