/**
 * Ananyoo Accessible Card Scroller — front-end behaviour.
 *
 * The scroll region works on its own (native scroll-snap, keyboard-focusable),
 * so this script is a pure ENHANCEMENT: it adds previous/next buttons, but
 * only when the cards actually overflow, so no-JS visitors — and pages where
 * everything already fits — never get dead controls. After a previous/next
 * press, once the scroll settles, focus is moved onto the card that just came
 * into view (the leading-edge card in the scroll direction); that card names
 * itself via aria-labelledby, so the screen reader announces its own heading
 * and text rather than a generic "showing items N to M" summary.
 *
 * @package AnanyooAccessibleCarousel
 */
( function () {
	'use strict';

	var reduce = window.matchMedia &&
		window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

	function init( root ) {
		var vp = root.querySelector( '.aac-scroller__viewport' );
		if ( ! vp ) { return; }

		var wantArrows = root.getAttribute( 'data-arrows' ) !== 'false';
		var track = vp.querySelector( '.aac-scroller__track' );

		// After a Previous/Next press we move keyboard focus onto the
		// newly-revealed card, so the screen reader announces THAT card's own
		// heading and text (WCAG 2.4.3 Focus Order, 4.1.2 Name/Role/Value) and
		// the user lands on it — instead of a generic "showing items N to M"
		// summary. pendingFocus holds the scroll direction (-1 / +1) until the
		// scroll settles; 0 means nothing is pending.
		var pendingFocus = 0;
		var settleTimer = null;
		var fallbackTimer = null;

		function overflowing() {
			return vp.scrollWidth - vp.clientWidth > 2;
		}

		// Build controls lazily; remove them again if the layout stops
		// overflowing (e.g. the window is widened).
		var controls = null;
		var prevBtn = null;
		var nextBtn = null;

		function buildControls() {
			if ( controls ) { return; }
			controls = document.createElement( 'div' );
			controls.className = 'aac-scroller__controls';

			prevBtn = makeBtn( 'aac-scroller__prev', '\u2039', txt( 'prev', 'Scroll to previous items' ) );
			nextBtn = makeBtn( 'aac-scroller__next', '\u203A', txt( 'next', 'Scroll to next items' ) );

			prevBtn.addEventListener( 'click', function () { scrollByPage( -1 ); requestFocus( -1 ); } );
			nextBtn.addEventListener( 'click', function () { scrollByPage( 1 ); requestFocus( 1 ); } );

			controls.appendChild( prevBtn );
			controls.appendChild( nextBtn );

			// Insert the controls AFTER the scroll viewport so keyboard focus
			// lands on the visible cards FIRST and reaches Previous/Next last,
			// and render them BELOW the cards — keeping DOM order, visual order
			// and focus order all in agreement (WCAG 2.4.3 Focus Order).
			root.appendChild( controls );
		}

		function removeControls() {
			if ( ! controls ) { return; }
			controls.parentNode.removeChild( controls );
			controls = prevBtn = nextBtn = null;
		}

		function step() {
			var card = vp.querySelector( '.aac-scroller__card' );
			var gap = track ? ( parseFloat( window.getComputedStyle( track ).columnGap ) || 0 ) : 0;
			if ( card ) {
				return Math.max( card.getBoundingClientRect().width + gap, vp.clientWidth * 0.9 );
			}
			return vp.clientWidth;
		}

		function scrollByPage( dir ) {
			vp.scrollBy( { left: dir * step(), behavior: reduce ? 'auto' : 'smooth' } );
		}

		function syncDisabled() {
			if ( ! controls ) { return; }
			var max = vp.scrollWidth - vp.clientWidth - 1;
			disable( prevBtn, vp.scrollLeft <= 1 );
			disable( nextBtn, vp.scrollLeft >= max );
		}

		// Keep arrows in sync on every scroll; once scrolling settles after a
		// Previous/Next press, move focus onto the newly-revealed card.
		function onScroll() {
			syncDisabled();
			if ( settleTimer ) { window.clearTimeout( settleTimer ); }
			settleTimer = window.setTimeout( function () {
				if ( pendingFocus ) { var d = pendingFocus; pendingFocus = 0; focusNewCard( d ); }
			}, 150 );
		}

		// Marks a focus move as due after a button press. The fallback covers
		// the case where the press caused no scroll (e.g. already at an end), so
		// the settle timer above would never fire.
		function requestFocus( dir ) {
			pendingFocus = dir;
			if ( fallbackTimer ) { window.clearTimeout( fallbackTimer ); }
			fallbackTimer = window.setTimeout( function () {
				if ( pendingFocus ) { var d = pendingFocus; pendingFocus = 0; focusNewCard( d ); }
			}, 600 );
		}

		// Move keyboard focus to the card at the leading edge of the scroll: the
		// last card now in view when going forward, the first when going back —
		// i.e. the card that just came into view. The card carries tabindex="-1"
		// and an aria-labelledby naming its heading + text, so focusing it makes
		// the screen reader read that card's own information.
		function focusNewCard( dir ) {
			if ( ! track ) { return; }
			var cards = track.children;
			var total = cards.length;
			if ( ! total ) { return; }
			var vpRect = vp.getBoundingClientRect();
			var first = -1, last = -1;
			for ( var i = 0; i < total; i++ ) {
				var r = cards[ i ].getBoundingClientRect();
				var shown = Math.min( r.right, vpRect.right ) - Math.max( r.left, vpRect.left );
				if ( shown > 0 && shown >= r.width * 0.5 ) {
					if ( first === -1 ) { first = i; }
					last = i;
				}
			}
			if ( first === -1 ) { return; }
			var card = cards[ dir > 0 ? last : first ];
			if ( ! card ) { return; }
			// Defensive: ensure the card can receive focus even if older markup
			// (rendered before this version) lacks the tabindex.
			if ( ! card.hasAttribute( 'tabindex' ) ) { card.setAttribute( 'tabindex', '-1' ); }
			card.focus();
		}

		function refresh() {
			if ( wantArrows && overflowing() ) {
				buildControls();
				syncDisabled();
			} else {
				removeControls();
			}
		}

		vp.addEventListener( 'scroll', onScroll, { passive: true } );
		window.addEventListener( 'resize', refresh );
		refresh();
		setupRovingFocus();

		// --- Roving focus: keep only the VISIBLE cards in the tab order ---
		//
		// The scroller shows a few cards at a time and the rest sit off-screen.
		// Tabbing through cards that cannot be seen is disorienting and fails the
		// "focus only the visible slides" expectation (WCAG 2.4.3, and it also
		// avoids focusing off-screen/obscured content, cf. 2.4.11). So every
		// card that is less than half inside the viewport has its focusable
		// contents set to tabindex="-1"; they are restored as the card scrolls
		// into view (via the Previous/Next buttons or the focusable scroll
		// region). Screen-reader browse mode is unaffected — nothing is hidden,
		// only removed from the Tab sequence. Falls back to leaving every card
		// tabbable when IntersectionObserver is unavailable.
		function setupRovingFocus() {
			if ( ! ( 'IntersectionObserver' in window ) || ! track ) { return; }

			var FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]';
			var cards = track.children;
			if ( ! cards.length ) { return; }

			function setCardTabbable( card, tabbable ) {
				var nodes = card.querySelectorAll( FOCUSABLE );
				Array.prototype.forEach.call( nodes, function ( el ) {
					if ( tabbable ) {
						if ( el.hasAttribute( 'data-aac-ti-orig' ) ) {
							var orig = el.getAttribute( 'data-aac-ti-orig' );
							if ( orig === '' ) { el.removeAttribute( 'tabindex' ); }
							else { el.setAttribute( 'tabindex', orig ); }
							el.removeAttribute( 'data-aac-ti-orig' );
						}
					} else if ( ! el.hasAttribute( 'data-aac-ti-orig' ) ) {
						el.setAttribute(
							'data-aac-ti-orig',
							el.hasAttribute( 'tabindex' ) ? el.getAttribute( 'tabindex' ) : ''
						);
						el.setAttribute( 'tabindex', '-1' );
					}
				} );
			}

			var io = new IntersectionObserver( function ( entries ) {
				entries.forEach( function ( entry ) {
					// "Visible" = at least half the card is inside the viewport.
					setCardTabbable( entry.target, entry.intersectionRatio >= 0.5 );
				} );
			}, { root: vp, threshold: [ 0, 0.5, 1 ] } );

			Array.prototype.forEach.call( cards, function ( card ) {
				io.observe( card );
			} );
		}

		// --- helpers -----------------------------------------------------
		function makeBtn( cls, glyph, label ) {
			var b = document.createElement( 'button' );
			b.type = 'button';
			b.className = 'aac-scroller__btn ' + cls;
			b.setAttribute( 'aria-label', label );
			var g = document.createElement( 'span' );
			g.setAttribute( 'aria-hidden', 'true' );
			g.textContent = glyph;
			b.appendChild( g );
			return b;
		}
		function disable( b, state ) {
			if ( ! b ) { return; }
			b.disabled = state;
			if ( state ) { b.setAttribute( 'aria-disabled', 'true' ); }
			else { b.removeAttribute( 'aria-disabled' ); }
		}
		function txt( key, fallback ) {
			return root.getAttribute( 'data-i18n-' + key ) || fallback;
		}
	}

	function ready() {
		Array.prototype.forEach.call(
			document.querySelectorAll( '.aac-scroller[data-aac-scroller]' ),
			init
		);
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', ready );
	} else {
		ready();
	}
} )();
