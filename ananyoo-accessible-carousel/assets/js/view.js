/**
 * Accessible Hero Carousel — front-end behaviour.
 *
 * Built to the W3C/WAI Carousels tutorial:
 *   - Controls (prev/next, dots, stop/start) are real <button>s created here,
 *     so no-JS visitors keep a clean, readable <ul> list.
 *   - A visually hidden polite live region announces "Item x of y" on
 *     user-initiated changes only (auto-rotation stays silent so it does not
 *     draw screen reader users away from their place).
 *   - Keyboard focus is never moved by next/prev or by auto-advance.
 *   - Auto-rotation can be stopped/started (WCAG 2.2.2), pauses on hover and
 *     focus, and never runs under prefers-reduced-motion.
 *
 * @package AnanyooAccessibleCarousel
 */
( function () {
	'use strict';

	var reduceMotion = window.matchMedia &&
		window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

	function init( root ) {
		var track = root.querySelector( '.aac-carousel__track' );
		var status = root.querySelector( '.aac-carousel__status' );
		if ( ! track ) { return; }

		var slides = Array.prototype.slice.call(
			track.querySelectorAll( ':scope > .aac-slide' )
		);
		if ( slides.length < 2 ) {
			if ( slides[ 0 ] ) { slides[ 0 ].classList.add( 'is-active' ); }
			return;
		}

		var opts = {
			autoplay: root.getAttribute( 'data-autoplay' ) === 'true' && ! reduceMotion,
			interval: parseInt( root.getAttribute( 'data-interval' ), 10 ) || 6000,
			loop:     root.getAttribute( 'data-loop' ) !== 'false',
			arrows:   root.getAttribute( 'data-arrows' ) !== 'false',
			dots:     root.getAttribute( 'data-dots' ) !== 'false',
			dotStyle: root.getAttribute( 'data-dot-style' ) === 'titles' ? 'titles' : 'dots',
			autoTime: root.getAttribute( 'data-auto-time' ) !== 'false',
			readingMode: root.getAttribute( 'data-reading-mode' ) === 'true',
			dyslexia:    root.getAttribute( 'data-dyslexia' ) === 'true',
			pausePos:  root.getAttribute( 'data-pause-position' ) || 'right',
			pauseSize: root.getAttribute( 'data-pause-size' ) || 'medium'
		};
		if ( [ 'left', 'center', 'right' ].indexOf( opts.pausePos ) === -1 ) { opts.pausePos = 'right'; }
		if ( [ 'small', 'medium', 'large' ].indexOf( opts.pauseSize ) === -1 ) { opts.pauseSize = 'medium'; }

		var index = 0;
		var timer = null;
		var userStopped = false;

		root.classList.add( 'is-enhanced' );

		// --- Navigation bar (built in JS, sits BELOW the image) -------------
		// Three zones: arrows (left), dots (center), pause (right).
		var navbar = document.createElement( 'div' );
		navbar.className = 'aac-carousel__nav';

		var navLeft = document.createElement( 'div' );
		navLeft.className = 'aac-carousel__nav-left';
		var navCenter = document.createElement( 'div' );
		navCenter.className = 'aac-carousel__nav-center';
		var navRight = document.createElement( 'div' );
		navRight.className = 'aac-carousel__nav-right';

		// Visible slide-position indicator (e.g. "2 / 5"). The screen-reader
		// announcement is handled by the polite live region, so this is
		// aria-hidden to avoid a double announcement — it is here to help
		// sighted, low-vision and cognitive users see where they are.
		var countEl = document.createElement( 'span' );
		countEl.className = 'aac-carousel__count';
		countEl.setAttribute( 'aria-hidden', 'true' );
		countEl.textContent = '1 / ' + slides.length;
		navRight.appendChild( countEl );

		var prevBtn, nextBtn;
		if ( opts.arrows ) {
			var aacChevron = function ( d ) {
				return '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="' + d + '" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
			};
			prevBtn = button( 'aac-carousel__arrow aac-carousel__prev', '' );
			nextBtn = button( 'aac-carousel__arrow aac-carousel__next', '' );
			prevBtn.innerHTML = aacChevron( 'M14.5 5 8 12l6.5 7' );
			nextBtn.innerHTML = aacChevron( 'M9.5 5 16 12l-6.5 7' );
			prevBtn.setAttribute( 'aria-label', txt( 'prev', 'Previous slide' ) );
			nextBtn.setAttribute( 'aria-label', txt( 'next', 'Next slide' ) );
			prevBtn.addEventListener( 'click', function () { stop( true ); go( index - 1, true ); syncStop(); } );
			nextBtn.addEventListener( 'click', function () { stop( true ); go( index + 1, true ); syncStop(); } );
			navLeft.appendChild( prevBtn );
			navLeft.appendChild( nextBtn );
		}

		// --- Dots (center) ---------------------------------------------------
		// The dots live in their own role="group" so the pause control can share
		// the center zone (when positioned there) without being announced as part
		// of the "Choose slide" group.
		var dots = [];
		if ( opts.dots ) {
			var dotsGroup = document.createElement( 'div' );
			dotsGroup.className = 'aac-carousel__dots';
			dotsGroup.setAttribute( 'role', 'group' );
			dotsGroup.setAttribute( 'aria-label', txt( 'choose', 'Choose slide to display' ) );
			var useTitles = 'titles' === opts.dotStyle;
			if ( useTitles ) {
				dotsGroup.classList.add( 'aac-carousel__dots--titles' );
				navCenter.classList.add( 'aac-carousel__nav-center--titles' );
			}
			slides.forEach( function ( s, i ) {
				var d = button( 'aac-carousel__dot' + ( useTitles ? ' aac-carousel__dot--title' : '' ), '' );
				if ( useTitles ) {
					var h = s.querySelector( '.aac-slide__heading' );
					var title = h ? h.textContent.trim() : '';
					if ( ! title ) { title = txt( 'slide', 'Slide' ) + ' ' + ( i + 1 ); }
					d.textContent = title;
					d.setAttribute( 'aria-label', title );
				} else {
					d.setAttribute( 'aria-label', txt( 'slide', 'Slide' ) + ' ' + ( i + 1 ) );
				}
				d.addEventListener( 'click', function () { stop( true ); go( i, true ); syncStop(); } );
				dotsGroup.appendChild( d );
				dots.push( d );
			} );
			navCenter.appendChild( dotsGroup );
		}

		// --- Pause / play with icon + text label -----------------------------
		// Always built when autoplay is on (WCAG 2.2.2). Its zone and size come
		// from the block options; its accessible name is the visible label, so
		// the two always match (WCAG 2.5.3 Label in Name).
		var stopBtn = null;
		if ( opts.autoplay ) {
			stopBtn = document.createElement( 'button' );
			stopBtn.type = 'button';
			stopBtn.className = 'aac-carousel__pause aac-carousel__pause--' + opts.pauseSize;
			var pIcon = document.createElement( 'span' );
			pIcon.className = 'aac-carousel__pause-icon';
			pIcon.setAttribute( 'aria-hidden', 'true' );
			var pLabel = document.createElement( 'span' );
			pLabel.className = 'aac-carousel__pause-label';
			stopBtn.appendChild( pIcon );
			stopBtn.appendChild( pLabel );
			stopBtn.addEventListener( 'click', function () {
				// Toggle the visitor's chosen state, not the transient timer:
				// while hovering, the timer is already held, so a timer check
				// here would wrongly restart rotation when the visitor is
				// trying to stop it.
				if ( userStopped ) { userStopped = false; start(); } else { stop( true ); }
				syncStop();
			} );
			var pauseZone = navRight;
			if ( 'left' === opts.pausePos ) { pauseZone = navLeft; }
			else if ( 'center' === opts.pausePos ) { pauseZone = navCenter; }
			pauseZone.appendChild( stopBtn );
		}

		navbar.appendChild( navLeft );
		navbar.appendChild( navCenter );
		navbar.appendChild( navRight );
		root.appendChild( navbar );

		// Whether visual transitions are active for this carousel.
		var animated = root.className.indexOf( 'aac-anim-none' ) === -1 && ! reduceMotion;

		// When a slide's transition finishes, reveal it to assistive tech.
		// Per W3C: during a transition the incoming slide is visible but kept
		// aria-hidden; aria-hidden is removed only once the transition ends, so
		// the visual state and the accessibility tree stay in sync.
		track.addEventListener( 'transitionend', function ( e ) {
			var slide = e.target;
			if ( slide.classList && slide.classList.contains( 'aac-slide' ) ) {
				slide.classList.remove( 'in-transition' );
				if ( slide.classList.contains( 'is-active' ) ) {
					slide.removeAttribute( 'aria-hidden' );
					setSlideFocusable( slide, true );
				}
			}
		} );

		// --- Navigation ------------------------------------------------------
		function go( next, announce ) {
			var n = slides.length;
			if ( next < 0 ) { next = opts.loop ? n - 1 : 0; }
			else if ( next >= n ) { next = opts.loop ? 0 : n - 1; }
			index = next;

			slides.forEach( function ( s, i ) { setSlide( s, i === index ); } );
			dots.forEach( function ( d, i ) {
				if ( i === index ) { d.setAttribute( 'aria-current', 'true' ); }
				else { d.removeAttribute( 'aria-current' ); }
			} );

			if ( ! opts.loop && opts.arrows ) {
				disable( prevBtn, index === 0 );
				disable( nextBtn, index === n - 1 );
			}

			// Visible position indicator always tracks the current slide.
			if ( countEl ) {
				countEl.textContent = ( index + 1 ) + ' / ' + n;
			}

			// Announce only for user-initiated changes; stay silent on autoplay.
			// Speak the slide's own title so the change is meaningful, not just
			// "Item 2 of 5" (ARIA live region; WCAG 4.1.3 Status Messages).
			if ( announce && status ) {
				var msg = txt( 'slide', 'Slide' ) + ' ' + ( index + 1 ) + ' ' + txt( 'of', 'of' ) + ' ' + n;
				var head = slides[ index ].querySelector( '.aac-slide__heading' );
				var htitle = head ? head.textContent.trim() : '';
				if ( htitle ) { msg += ': ' + htitle; }
				status.textContent = msg;
			}
		}

		function setSlide( slide, active ) {
			if ( active ) {
				if ( animated ) {
					// Become visible but stay hidden from AT until the
					// transition completes (transitionend handler reveals it).
					// While hidden, its controls stay out of the tab order.
					slide.setAttribute( 'aria-hidden', 'true' );
					setSlideFocusable( slide, false );
					slide.classList.add( 'in-transition' );
					slide.classList.add( 'is-active' );
					// Safety net: if transitionend never fires, reveal anyway.
					window.clearTimeout( slide._aacReveal );
					slide._aacReveal = window.setTimeout( function () {
						if ( slide.classList.contains( 'is-active' ) ) {
							slide.classList.remove( 'in-transition' );
							slide.removeAttribute( 'aria-hidden' );
							setSlideFocusable( slide, true );
						}
					}, 700 );
				} else {
					// No animation: reveal immediately, no transition to wait on.
					slide.classList.remove( 'in-transition' );
					slide.classList.add( 'is-active' );
					slide.removeAttribute( 'aria-hidden' );
					setSlideFocusable( slide, true );
				}
			} else {
				slide.classList.remove( 'is-active' );
				slide.classList.remove( 'in-transition' );
				slide.setAttribute( 'aria-hidden', 'true' );
				setSlideFocusable( slide, false );
			}
		}

		// --- Auto-rotation ---------------------------------------------------
		// Time (ms) the current slide stays before auto-advancing. With
		// reading-time pacing on, it is derived from the slide's own text
		// (~200 words/minute plus a base minimum) so no slide advances before
		// it can be read (WCAG 2.2.2); otherwise the fixed interval is used.
		function slideTime() {
			if ( ! opts.autoTime ) { return opts.interval; }
			var words = ( slides[ index ].textContent || '' ).trim().split( /\s+/ ).filter( Boolean ).length;
			var ms = 2500 + Math.round( ( words / 200 ) * 60000 );
			return Math.max( opts.interval, Math.min( ms, 20000 ) );
		}
		function schedule() {
			window.clearTimeout( timer );
			timer = window.setTimeout( function () { go( index + 1, false ); schedule(); }, slideTime() );
		}
		function start() {
			if ( ! opts.autoplay || userStopped || timer ) { return; }
			schedule();
		}
		function stop( byUser ) {
			if ( timer ) { window.clearTimeout( timer ); timer = null; }
			if ( byUser ) { userStopped = true; }
		}
		function syncStop() {
			if ( ! stopBtn ) { return; }
			// The control reflects the visitor's CHOSEN state (auto-rotation on
			// or off), never the transient hover/focus hold. So it reads
			// "Pause" from the moment the carousel loads with autoplay, and
			// flips only when the visitor acts (stop/start button, arrows,
			// dots, keyboard, swipe) — hovering must not toggle a control the
			// visitor did not touch.
			var playing = ! userStopped;
			// Visible text label (e.g. "Pause" / "Play"). This text is also the
			// button's accessible name — the icon is aria-hidden and no aria-label
			// overrides it — so the visible label and the accessible name always
			// match, satisfying WCAG 2.5.3 (Label in Name) whatever the author
			// types in the block settings.
			var label = stopBtn.querySelector( '.aac-carousel__pause-label' );
			if ( label ) {
				label.textContent = playing ? txt( 'pause', 'Pause' ) : txt( 'play', 'Play' );
			}
			stopBtn.classList.toggle( 'is-playing', playing );
		}

		// Pause on hover and focus (WCAG 2.2.2); resume only when neither hold
		// is active and the user did not stop it. These holds are transient, so
		// they never touch the stop/start button's visible state (syncStop is
		// intentionally NOT called here).
		var hoverHold = false;
		var focusHold = false;
		function hold() { if ( timer ) { window.clearTimeout( timer ); timer = null; } }
		root.addEventListener( 'mouseenter', function () { hoverHold = true; hold(); } );
		root.addEventListener( 'mouseleave', function () { hoverHold = false; resume(); } );
		root.addEventListener( 'focusin', function () { focusHold = true; hold(); } );
		root.addEventListener( 'focusout', function ( e ) { if ( ! root.contains( e.relatedTarget ) ) { focusHold = false; resume(); } } );
		function resume() { if ( opts.autoplay && ! userStopped && ! hoverHold && ! focusHold && ! timer ) { start(); } }

		// --- Touch (supplements buttons; never the only way) -----------------
		var sx = null;
		track.addEventListener( 'touchstart', function ( e ) { sx = e.changedTouches[ 0 ].clientX; }, { passive: true } );
		track.addEventListener( 'touchend', function ( e ) {
			if ( sx === null ) { return; }
			var dx = e.changedTouches[ 0 ].clientX - sx;
			if ( Math.abs( dx ) > 40 ) { stop( true ); go( index + ( dx < 0 ? 1 : -1 ), true ); syncStop(); }
			sx = null;
		}, { passive: true } );

		// --- Keyboard: Left/Right move slides; Home/End jump first/last -------
		// Follows the WAI-ARIA Authoring Practices for carousels. The keys are
		// ignored when focus is in a form field, so typing is never hijacked.
		root.addEventListener( 'keydown', function ( e ) {
			var t = e.target;
			var tag = t && t.tagName ? t.tagName.toLowerCase() : '';
			if ( 'input' === tag || 'textarea' === tag || 'select' === tag || ( t && t.isContentEditable ) ) { return; }
			var handled = true;
			if ( 'ArrowLeft' === e.key ) { go( index - 1, true ); }
			else if ( 'ArrowRight' === e.key ) { go( index + 1, true ); }
			else if ( 'Home' === e.key ) { go( 0, true ); }
			else if ( 'End' === e.key ) { go( slides.length - 1, true ); }
			else { handled = false; }
			if ( handled ) { stop( true ); syncStop(); e.preventDefault(); }
		} );

		// --- Opt-in visitor modes: "View as list" and "Easier reading" -------
		// Only built when the author turned them on; off until the visitor
		// presses the button, so the default carousel is unchanged.
		if ( opts.readingMode || opts.dyslexia ) {
			var tools = document.createElement( 'div' );
			tools.className = 'aac-carousel__tools';

			if ( opts.readingMode ) {
				var listBtn = document.createElement( 'button' );
				listBtn.type = 'button';
				listBtn.className = 'aac-carousel__mode aac-carousel__mode--list';
				listBtn.setAttribute( 'aria-pressed', 'false' );
				listBtn.textContent = txt( 'listview', 'View as list' );
				listBtn.addEventListener( 'click', function () {
					var on = root.classList.toggle( 'aac-reading-list' );
					listBtn.setAttribute( 'aria-pressed', on ? 'true' : 'false' );
					listBtn.textContent = on ? txt( 'carouselview', 'View as carousel' ) : txt( 'listview', 'View as list' );
					if ( on ) {
						stop( true );
						slides.forEach( function ( s ) {
							s.classList.remove( 'in-transition' );
							s.removeAttribute( 'aria-hidden' );
							setSlideFocusable( s, true );
						} );
					} else {
						slides.forEach( function ( s, i ) {
							if ( i === index ) { s.removeAttribute( 'aria-hidden' ); setSlideFocusable( s, true ); }
							else { s.setAttribute( 'aria-hidden', 'true' ); setSlideFocusable( s, false ); }
						} );
					}
				} );
				tools.appendChild( listBtn );
			}

			if ( opts.dyslexia ) {
				var dysBtn = document.createElement( 'button' );
				dysBtn.type = 'button';
				dysBtn.className = 'aac-carousel__mode aac-carousel__mode--dyslexia';
				dysBtn.setAttribute( 'aria-pressed', 'false' );
				dysBtn.textContent = txt( 'easyread', 'Easier reading' );
				dysBtn.addEventListener( 'click', function () {
					var on = root.classList.toggle( 'aac-dyslexia' );
					dysBtn.setAttribute( 'aria-pressed', on ? 'true' : 'false' );
					dysBtn.textContent = on ? txt( 'easyreadoff', 'Normal reading' ) : txt( 'easyread', 'Easier reading' );
				} );
				tools.appendChild( dysBtn );
			}

			var skipEl = root.querySelector( '.aac-skip-link' );
			if ( skipEl && skipEl.nextSibling ) { root.insertBefore( tools, skipEl.nextSibling ); }
			else { root.insertBefore( tools, root.firstChild ); }
		}

		// --- Helpers ---------------------------------------------------------
		function button( cls, glyph ) {
			var b = document.createElement( 'button' );
			b.type = 'button';
			b.className = 'aac-carousel__btn ' + cls;
			if ( glyph ) {
				var g = document.createElement( 'span' );
				g.setAttribute( 'aria-hidden', 'true' );
				g.textContent = glyph;
				b.appendChild( g );
			}
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

		// Keep focusability in sync with aria-hidden: a slide that is hidden
		// from assistive tech must not contain anything in the tab order, or it
		// fails WCAG 4.1.2. We stash each control's original tabindex so we can
		// restore it exactly when the slide is revealed.
		function setSlideFocusable( slide, canFocus ) {
			var els = slide.querySelectorAll( 'a[href], button, input, select, textarea, iframe, [tabindex]' );
			Array.prototype.forEach.call( els, function ( el ) {
				if ( canFocus ) {
					if ( el.hasAttribute( 'data-aac-ti' ) ) {
						var prev = el.getAttribute( 'data-aac-ti' );
						if ( '' === prev ) { el.removeAttribute( 'tabindex' ); }
						else { el.setAttribute( 'tabindex', prev ); }
						el.removeAttribute( 'data-aac-ti' );
					}
				} else if ( ! el.hasAttribute( 'data-aac-ti' ) ) {
					el.setAttribute( 'data-aac-ti', el.getAttribute( 'tabindex' ) || '' );
					el.setAttribute( 'tabindex', '-1' );
				}
			} );
		}

		// --- Boot ------------------------------------------------------------
		// Reveal the first slide immediately (no transition to wait on) and
		// hide the rest, so the initial state is never stuck aria-hidden.
		slides.forEach( function ( s, i ) {
			s.classList.remove( 'in-transition' );
			if ( i === 0 ) {
				s.classList.add( 'is-active' );
				s.removeAttribute( 'aria-hidden' );
				setSlideFocusable( s, true );
			} else {
				s.classList.remove( 'is-active' );
				s.setAttribute( 'aria-hidden', 'true' );
				setSlideFocusable( s, false );
			}
		} );
		index = 0;
		if ( dots[ 0 ] ) { dots[ 0 ].setAttribute( 'aria-current', 'true' ); }
		if ( ! opts.loop && opts.arrows ) { disable( prevBtn, true ); }

		syncStop();
		start();
	}

	function ready() {
		Array.prototype.forEach.call(
			document.querySelectorAll( '.aac-carousel[data-aac]' ),
			init
		);
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', ready );
	} else {
		ready();
	}
} )();
