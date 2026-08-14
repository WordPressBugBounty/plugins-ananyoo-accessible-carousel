/**
 * Accessible Hero Carousel — editor script (build-free, no JSX).
 *
 * @package AnanyooAccessibleCarousel
 */
( function ( blocks, blockEditor, components, element, i18n, data ) {
	'use strict';

	var el = element.createElement;
	var Fragment = element.Fragment;
	var __ = i18n.__;

	var useBlockProps        = blockEditor.useBlockProps;
	var InnerBlocks          = blockEditor.InnerBlocks;
	var InspectorControls    = blockEditor.InspectorControls;
	var PlainText            = blockEditor.PlainText;
	var MediaUpload          = blockEditor.MediaUpload;
	var MediaUploadCheck     = blockEditor.MediaUploadCheck;
	var PanelColorSettings   = blockEditor.PanelColorSettings;

	var PanelBody      = components.PanelBody;
	var ToggleControl  = components.ToggleControl;
	var RangeControl   = components.RangeControl;
	var TextControl    = components.TextControl;
	var SelectControl  = components.SelectControl;
	var Button         = components.Button;
	var Placeholder    = components.Placeholder;

	var useSelect   = data.useSelect;
	var useDispatch = data.useDispatch;
	var createBlocksFromInnerBlocksTemplate = blocks.createBlocksFromInnerBlocksTemplate;

	var SLIDE = 'anacb/slide';
	var CARD  = 'anacb/card';

	// Base URL for the bundled placeholder images (localised from PHP).
	var IMG = ( window.AnacbData && window.AnacbData.imgBase ) || '';

	/* ===================================================================== *
	 * WCAG helpers for the in-editor "Accessibility check" panel.
	 * These only READ the chosen values and show a pass/fail note; they never
	 * change the design. Every result uses an icon AND text AND colour, so it
	 * never relies on colour alone (WCAG 1.4.1).
	 * ===================================================================== */
	function hexToRgb( h ) {
		if ( ! h ) { return null; }
		h = String( h ).trim().replace( '#', '' );
		if ( 3 === h.length ) { h = h.split( '' ).map( function ( c ) { return c + c; } ).join( '' ); }
		if ( 6 !== h.length ) { return null; }
		var n = parseInt( h, 16 );
		if ( isNaN( n ) ) { return null; }
		return [ ( n >> 16 ) & 255, ( n >> 8 ) & 255, n & 255 ];
	}
	function relLum( rgb ) {
		var a = rgb.map( function ( v ) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow( ( v + 0.055 ) / 1.055, 2.4 ); } );
		return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
	}
	function contrastRatio( fg, bg ) {
		var f = hexToRgb( fg ), b = hexToRgb( bg );
		if ( ! f || ! b ) { return null; }
		var l1 = relLum( f ), l2 = relLum( b ), hi = Math.max( l1, l2 ), lo = Math.min( l1, l2 );
		return ( hi + 0.05 ) / ( lo + 0.05 );
	}
	// Convert a CSS size ('2rem', '18px', '1.4em') to px (16px root assumed).
	function toPx( size ) {
		if ( ! size ) { return 0; }
		var m = String( size ).match( /([\d.]+)\s*(px|rem|em)?/ );
		if ( ! m ) { return 0; }
		var n = parseFloat( m[1] );
		return ( m[2] && 'px' !== m[2] ) ? n * 16 : n;
	}
	// WCAG 1.4.3: large text (>=24px, or >=18.66px bold) needs 3:1, else 4.5:1.
	function neededFor( sizePx, bold ) {
		var big = sizePx >= 24 || ( bold && sizePx >= 18.66 );
		return big ? 3 : 4.5;
	}
	function a11yIcon( ok ) {
		var attrs = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', focusable: 'false', style: { flexShrink: 0, marginTop: '1px' } };
		return ok
			? el( 'svg', attrs, el( 'path', { d: 'M20 6 9 17l-5-5' } ) )
			: el( 'svg', attrs, el( 'path', { d: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' } ), el( 'line', { x1: 12, y1: 9, x2: 12, y2: 13 } ), el( 'line', { x1: 12, y1: 17, x2: 12.01, y2: 17 } ) );
	}
	function a11yRow( ok, title, detail ) {
		var box = {
			display: 'flex', alignItems: 'flex-start', gap: '8px', margin: '0 0 8px', padding: '8px 10px',
			borderRadius: '6px', border: '1px solid ' + ( ok ? '#8bd3a6' : '#efa9a4' ),
			borderLeft: '4px solid ' + ( ok ? '#0a7d3c' : '#c0342d' ),
			background: ok ? '#e7f5ec' : '#fdeaea', color: ok ? '#08542a' : '#8a1f1a',
			fontSize: '12.5px', lineHeight: 1.4
		};
		return el( 'div', { style: box, role: ok ? null : 'note' },
			a11yIcon( ok ),
			el( 'span', null,
				el( 'strong', null, title ),
				detail ? el( 'span', { style: { display: 'block', fontWeight: 400, marginTop: '2px' } }, detail ) : null
			)
		);
	}
	// A live contrast result for one foreground/background pair.
	function contrastRow( label, fg, bg, needed ) {
		var r = contrastRatio( fg, bg );
		if ( null === r ) {
			return a11yRow( true, label, __( 'Using theme colours — set both to check here.', 'ananyoo-accessible-carousel' ) );
		}
		var ok = r >= needed;
		var detail = __( 'Contrast', 'ananyoo-accessible-carousel' ) + ' ' + r.toFixed( 1 ) + ':1 — ' +
			( ok ? __( 'passes WCAG AA', 'ananyoo-accessible-carousel' ) : ( __( 'too low, needs', 'ananyoo-accessible-carousel' ) + ' ' + needed + ':1' ) );
		return a11yRow( ok, label, detail );
	}
	// Vague link phrases that fail WCAG 2.4.4 Link Purpose.
	var ANACB_VAGUE = [ 'click here', 'read more', 'here', 'more', 'link', 'learn more', 'details', 'this', 'go' ];
	function vagueLink( t ) {
		t = ( t || '' ).trim().toLowerCase();
		return '' !== t && ANACB_VAGUE.indexOf( t ) !== -1;
	}
	function a11yPanel( rows ) {
		return el( PanelBody, { title: __( 'Accessibility check', 'ananyoo-accessible-carousel' ), initialOpen: false },
			el( 'p', { style: { fontSize: '12px', color: '#50575e', margin: '0 0 10px' } },
				__( 'Live checks for this block. Fix any items marked with a warning before publishing — every check is shown with an icon, wording and colour.', 'ananyoo-accessible-carousel' ) ),
			rows
		);
	}

	/* --- On-insert "Choose a layout" picker --------------------------------
	 * When a parent block is first inserted (no inner blocks yet) we show a
	 * Placeholder offering the three designed looks plus "Start blank". Picking
	 * one fills the block with that look — built from the SAME design attributes
	 * as the patterns, so nothing is imposed on the neutral block itself.
	 * --------------------------------------------------------------------- */
	function heroBlocks( style ) {
		if ( 'blank' === style ) { return [ [ SLIDE ], [ SLIDE ] ]; }
		var map = {
			editorial: { box: '#16181d', hsize: '2rem',    shape: 'rounded', bg: '#ffffff', fg: '#16181d', link: false },
			soft:      { box: '#1f2937', hsize: '1.75rem', shape: 'pill',    bg: '#ffffff', fg: '#1f2937', link: false },
			minimal:   { box: '#111827', hsize: '1.75rem', link: true }
		};
		var d = map[ style ] || map.editorial;
		function s( img, pos, h, t, c ) {
			var at = { imageUrl: IMG ? IMG + img : '', heading: h, headingLevel: 3, headingFontSize: d.hsize, text: t, buttonText: c, buttonUrl: '#', boxPosition: pos, overlayColor: d.box, textColor: '#ffffff' };
			if ( d.link ) { at.ctaType = 'link'; }
			else { at.ctaType = 'button'; at.ctaBgColor = d.bg; at.ctaTextColor = d.fg; at.ctaShape = d.shape; at.ctaSize = 'medium'; }
			return [ SLIDE, at ];
		}
		return [
			s( 'aac-ph-1.jpg', 'left',   'Accessibility, built in', 'A hero that works for everyone — keyboard, screen reader, and touch.', 'Explore our work' ),
			s( 'aac-ph-2.jpg', 'right',  'Designed to WCAG 2.2 AA', 'Tested with JAWS, NVDA, VoiceOver and TalkBack.', 'See how we test' ),
			s( 'aac-ph-3.jpg', 'bottom', 'Inclusive by default', 'No autoplay traps, no keyboard dead ends.', 'Get in touch' )
		];
	}

	function cardBlocks( style ) {
		if ( 'blank' === style ) { return [ [ CARD ], [ CARD ], [ CARD ] ]; }
		var map = {
			editorial: { style: { color: { background: '#ffffff', text: '#1a1a1a' }, border: { width: '1px', color: '#e4e4e7', radius: '4px' } }, shape: 'rounded', bg: '#1a1a1a', fg: '#ffffff', link: false },
			soft:      { style: { color: { background: '#f7f7f8' }, border: { radius: '16px' } }, shape: 'pill', bg: '#1a1a1a', fg: '#ffffff', link: false },
			minimal:   { style: { border: { width: '1px', color: '#e4e4e7', radius: '0px' } }, link: true }
		};
		var d = map[ style ] || map.editorial;
		function c( img, h, t ) {
			var at = { imageUrl: IMG ? IMG + img : '', heading: h, headingLevel: 3, text: t, linkText: 'Learn more', linkUrl: '#', style: d.style };
			if ( d.link ) { at.ctaType = 'link'; }
			else { at.ctaType = 'button'; at.ctaBgColor = d.bg; at.ctaTextColor = d.fg; at.ctaShape = d.shape; at.ctaSize = 'medium'; }
			return [ CARD, at ];
		}
		return [
			c( 'aac-ph-1.jpg', 'Design', 'Flexible design tools and the power of blocks.' ),
			c( 'aac-ph-2.jpg', 'Build', 'See your site take shape in real time.' ),
			c( 'aac-ph-3.jpg', 'Extend', 'Add a store, analytics, or a newsletter.' ),
			c( 'aac-ph-4.jpg', 'Audit', 'Checked against WCAG 2.2 AA with axe and Lighthouse.' )
		];
	}

	// Small schematic thumbnail for each look (inline SVG — no bundled files).
	function thumb( style ) {
		var radius = 'soft' === style ? 8 : ( 'minimal' === style ? 0 : 2 );
		var children = [];
		var card = {
			x: 2, y: 2, width: 68, height: 48, rx: radius,
			fill: 'soft' === style ? '#f7f7f8' : '#ffffff',
			stroke: '#cbd5e1', strokeWidth: 2
		};
		if ( 'blank' === style ) { card.strokeDasharray = '4 3'; card.fill = '#fbfbfc'; }
		children.push( el( 'rect', card ) );

		if ( 'blank' === style ) {
			children.push( el( 'line', { x1: 36, y1: 17, x2: 36, y2: 35, stroke: '#9aa6b2', strokeWidth: 2, strokeLinecap: 'round' } ) );
			children.push( el( 'line', { x1: 27, y1: 26, x2: 45, y2: 26, stroke: '#9aa6b2', strokeWidth: 2, strokeLinecap: 'round' } ) );
		} else {
			children.push( el( 'rect', { x: 8, y: 8, width: 56, height: 17, rx: radius > 2 ? 4 : 1, fill: '#dfe5ec' } ) );
			children.push( el( 'rect', { x: 8, y: 30, width: 34, height: 3, rx: 1.5, fill: '#9aa6b2' } ) );
			if ( 'minimal' === style ) {
				children.push( el( 'rect', { x: 8, y: 40, width: 22, height: 2, rx: 1, fill: '#1a1a1a' } ) );
				children.push( el( 'rect', { x: 8, y: 43, width: 22, height: 1, fill: '#1a1a1a' } ) );
			} else {
				children.push( el( 'rect', { x: 8, y: 39, width: 26, height: 8, rx: 'soft' === style ? 4 : 2, fill: '#1a1a1a' } ) );
			}
		}

		var svgProps = { viewBox: '0 0 72 52', width: 72, height: 52, 'aria-hidden': 'true', focusable: 'false', xmlns: 'http://www.w3.org/2000/svg', style: { display: 'block' } };
		return el.apply( null, [ 'svg', svgProps ].concat( children ) );
	}

	function choiceButton( style, label, onPick ) {
		return el( Button, {
			variant: 'secondary',
			onClick: function () { onPick( style ); },
			style: { height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '10px', width: '108px' }
		},
			thumb( style ),
			el( 'span', { style: { fontSize: '12px', fontWeight: 600 } }, label )
		);
	}

	function layoutPicker( blockProps, label, onPick ) {
		return el( 'div', blockProps,
			el( Placeholder, {
				icon: 'layout',
				label: label,
				instructions: __( 'Pick a style to start with — every part is editable afterwards, and all three are accessible by default.', 'ananyoo-accessible-carousel' )
			},
				el( 'div', { style: { display: 'flex', flexWrap: 'wrap', gap: '10px' } },
					choiceButton( 'editorial', __( 'Editorial', 'ananyoo-accessible-carousel' ), onPick ),
					choiceButton( 'soft', __( 'Soft', 'ananyoo-accessible-carousel' ), onPick ),
					choiceButton( 'minimal', __( 'Minimal', 'ananyoo-accessible-carousel' ), onPick ),
					choiceButton( 'blank', __( 'Start blank', 'ananyoo-accessible-carousel' ), onPick )
				)
			)
		);
	}

	/* ===================================================================== *
	 * Parent: anacb/slider
	 * ===================================================================== */
	blocks.registerBlockType( 'anacb/slider', {
		edit: function ( props ) {
			var a = props.attributes;
			var set = props.setAttributes;
			var blockProps = useBlockProps( {
				className: 'aac-carousel--editor aac-layout-' + a.layout,
				style: { '--aac-card-bg': a.cardBg || '#cccccc' }
			} );
			var hasInner = useSelect( function ( s ) {
				return s( 'core/block-editor' ).getBlocks( props.clientId ).length > 0;
			}, [ props.clientId ] );
			var replaceInnerBlocks = useDispatch( 'core/block-editor' ).replaceInnerBlocks;

			if ( ! hasInner ) {
				return layoutPicker( blockProps, __( 'Choose a carousel layout', 'ananyoo-accessible-carousel' ), function ( style ) {
					if ( 'blank' !== style ) { set( { layout: 'overlay' } ); }
					replaceInnerBlocks( props.clientId, createBlocksFromInnerBlocksTemplate( heroBlocks( style ) ), false );
				} );
			}

			var inspector = el(
				InspectorControls,
				null,
				el(
					PanelBody,
					{ title: __( 'Carousel settings', 'ananyoo-accessible-carousel' ), initialOpen: true },
					el( TextControl, {
						label: __( 'Accessible label', 'ananyoo-accessible-carousel' ),
						help: __( 'Names the carousel region for screen reader users.', 'ananyoo-accessible-carousel' ),
						value: a.label,
						onChange: function ( v ) { set( { label: v } ); }
					} ),
					el( SelectControl, {
						label: __( 'Layout style', 'ananyoo-accessible-carousel' ),
						value: a.layout,
						options: [
							{ label: __( 'Card (controls below image)', 'ananyoo-accessible-carousel' ), value: 'card' },
							{ label: __( 'Overlay (controls over image)', 'ananyoo-accessible-carousel' ), value: 'overlay' }
						],
						help: __( 'Card places the text bar and controls in a panel below the image. Overlay floats the box and controls over the image.', 'ananyoo-accessible-carousel' ),
						onChange: function ( v ) { set( { layout: v } ); }
					} ),
					el( TextControl, {
						label: __( 'Maximum width', 'ananyoo-accessible-carousel' ),
						help: __( 'Any CSS value, e.g. 1200px, 90%, or 70rem. Leave blank to fill the container.', 'ananyoo-accessible-carousel' ),
						value: a.maxWidth,
						onChange: function ( v ) { set( { maxWidth: v } ); }
					} ),
					el( TextControl, {
						label: __( 'Slide height', 'ananyoo-accessible-carousel' ),
						help: __( 'Any CSS value, e.g. 500px, 70vh, or 30rem. Leave blank for the default height.', 'ananyoo-accessible-carousel' ),
						value: a.slideHeight,
						onChange: function ( v ) { set( { slideHeight: v } ); }
					} ),
					el( SelectControl, {
						label: __( 'Transition animation', 'ananyoo-accessible-carousel' ),
						value: a.animation,
						options: [
							{ label: __( 'None (instant)', 'ananyoo-accessible-carousel' ), value: 'none' },
							{ label: __( 'Fade', 'ananyoo-accessible-carousel' ), value: 'fade' },
							{ label: __( 'Slide', 'ananyoo-accessible-carousel' ), value: 'slide' }
						],
						help: __( 'Animation is disabled automatically for visitors who prefer reduced motion.', 'ananyoo-accessible-carousel' ),
						onChange: function ( v ) { set( { animation: v } ); }
					} ),
					el( ToggleControl, {
						label: __( 'Autoplay', 'ananyoo-accessible-carousel' ),
						help: __( 'Off is recommended. A pause/stop control is always shown when on.', 'ananyoo-accessible-carousel' ),
						checked: a.autoplay,
						onChange: function ( v ) { set( { autoplay: v } ); }
					} ),
					a.autoplay && el( ToggleControl, {
						label: __( 'Reading-time pacing', 'ananyoo-accessible-carousel' ),
						help: __( 'On: each slide stays long enough to read its own text (about 200 words a minute) so no slide advances too soon (WCAG 2.2.2). Off: use a fixed interval below.', 'ananyoo-accessible-carousel' ),
						checked: a.autoTime,
						onChange: function ( v ) { set( { autoTime: v } ); }
					} ),
					a.autoplay && el( RangeControl, {
						label: a.autoTime ? __( 'Minimum time per slide (seconds)', 'ananyoo-accessible-carousel' ) : __( 'Autoplay interval (seconds)', 'ananyoo-accessible-carousel' ),
						min: 4, max: 20,
						value: Math.round( a.interval / 1000 ),
						onChange: function ( v ) { set( { interval: v * 1000 } ); }
					} ),
					a.autoplay && el( ToggleControl, {
						label: __( 'Pause on mouse hover', 'ananyoo-accessible-carousel' ),
						help: __( 'On (recommended): auto-rotation pauses quietly while the mouse is over the carousel. Turn off for full-width or full-height carousels, where the mouse is nearly always over the slides and rotation would stay paused. Keyboard focus still pauses it, and the visible Pause button always works (WCAG 2.2.2).', 'ananyoo-accessible-carousel' ),
						checked: undefined === a.hoverPause ? true : a.hoverPause,
						onChange: function ( v ) { set( { hoverPause: v } ); }
					} ),
					el( ToggleControl, {
						label: __( 'Loop slides', 'ananyoo-accessible-carousel' ),
						checked: a.loop,
						onChange: function ( v ) { set( { loop: v } ); }
					} ),
					el( ToggleControl, {
						label: __( 'Show previous / next buttons', 'ananyoo-accessible-carousel' ),
						checked: a.showArrows,
						onChange: function ( v ) { set( { showArrows: v } ); }
					} ),
					el( ToggleControl, {
						label: __( 'Show slide dots', 'ananyoo-accessible-carousel' ),
						checked: a.showDots,
						onChange: function ( v ) { set( { showDots: v } ); }
					} ),
					a.showDots && el( SelectControl, {
						label: __( 'Slide navigation style', 'ananyoo-accessible-carousel' ),
						value: a.dotStyle,
						options: [
							{ label: __( 'Dots', 'ananyoo-accessible-carousel' ), value: 'dots' },
							{ label: __( 'Slide titles (tab list)', 'ananyoo-accessible-carousel' ), value: 'titles' }
						],
						help: __( 'Dots are compact; slide titles are easier to recognise and remember (WAI-ARIA Authoring Practices).', 'ananyoo-accessible-carousel' ),
						onChange: function ( v ) { set( { dotStyle: v } ); }
					} )
				),
				el(
					PanelColorSettings,
					{
						title: __( 'Card colour', 'ananyoo-accessible-carousel' ),
						initialOpen: false,
						colorSettings: [
							{
								value: a.cardBg,
								onChange: function ( v ) { set( { cardBg: v || '#cccccc' } ); },
								label: __( 'Card background', 'ananyoo-accessible-carousel' )
							}
						]
					}
				),
				el(
					PanelBody,
					{ title: __( 'Pause / stop control', 'ananyoo-accessible-carousel' ), initialOpen: false },
					! a.autoplay && el( 'p', { style: { fontStyle: 'italic', fontSize: '12px', margin: 0 } },
						__( 'Turn on Autoplay to configure the pause/stop control. Whenever autoplay is on, the control is always shown (WCAG 2.2.2) — these options only change its wording, position, and size.', 'ananyoo-accessible-carousel' )
					),
					a.autoplay && el( TextControl, {
						label: __( 'Pause button label', 'ananyoo-accessible-carousel' ),
						help: __( 'Shown while the carousel is auto-rotating. Used as both the visible text and the screen reader name, so the two always match (WCAG 2.5.3).', 'ananyoo-accessible-carousel' ),
						value: a.pauseLabel,
						onChange: function ( v ) { set( { pauseLabel: v } ); }
					} ),
					a.autoplay && el( TextControl, {
						label: __( 'Play button label', 'ananyoo-accessible-carousel' ),
						help: __( 'Shown after a visitor stops the auto-rotation.', 'ananyoo-accessible-carousel' ),
						value: a.playLabel,
						onChange: function ( v ) { set( { playLabel: v } ); }
					} ),
					a.autoplay && el( SelectControl, {
						label: __( 'Control position', 'ananyoo-accessible-carousel' ),
						value: a.pausePosition,
						options: [
							{ label: __( 'Right (default)', 'ananyoo-accessible-carousel' ), value: 'right' },
							{ label: __( 'Center (with the dots)', 'ananyoo-accessible-carousel' ), value: 'center' },
							{ label: __( 'Left (with the arrows)', 'ananyoo-accessible-carousel' ), value: 'left' }
						],
						help: __( 'Which part of the control bar holds the pause/stop button.', 'ananyoo-accessible-carousel' ),
						onChange: function ( v ) { set( { pausePosition: v } ); }
					} ),
					a.autoplay && el( SelectControl, {
						label: __( 'Control size', 'ananyoo-accessible-carousel' ),
						value: a.pauseSize,
						options: [
							{ label: __( 'Small', 'ananyoo-accessible-carousel' ), value: 'small' },
							{ label: __( 'Medium (default)', 'ananyoo-accessible-carousel' ), value: 'medium' },
							{ label: __( 'Large', 'ananyoo-accessible-carousel' ), value: 'large' }
						],
						help: __( 'All sizes keep at least a 44px touch target (WCAG 2.5.5).', 'ananyoo-accessible-carousel' ),
						onChange: function ( v ) { set( { pauseSize: v } ); }
					} )
				),
				el(
					PanelBody,
					{ title: __( 'Accessibility options', 'ananyoo-accessible-carousel' ), initialOpen: false },
					el( 'p', { style: { fontSize: '12px', color: '#50575e', margin: '0 0 10px' } },
						__( 'Optional visitor controls, off by default. Their small extra script and styles load only when switched on.', 'ananyoo-accessible-carousel' )
					),
					el( ToggleControl, {
						label: __( 'Offer a "View as list" reading mode', 'ananyoo-accessible-carousel' ),
						help: __( 'Adds a button that unfolds the carousel into a plain vertical list — helpful for cognitive, low-vision and motor users who prefer to read everything at once.', 'ananyoo-accessible-carousel' ),
						checked: a.readingMode,
						onChange: function ( v ) { set( { readingMode: v } ); }
					} ),
					el( ToggleControl, {
						label: __( 'Offer a dyslexia-friendly reading toggle', 'ananyoo-accessible-carousel' ),
						help: __( 'Adds a button that increases letter, word and line spacing and left-aligns the carousel text for easier reading.', 'ananyoo-accessible-carousel' ),
						checked: a.dyslexiaToggle,
						onChange: function ( v ) { set( { dyslexiaToggle: v } ); }
					} )
				)
			);

			var inner = el( 'div', blockProps,
				el( InnerBlocks, {
					allowedBlocks: [ SLIDE ],
					orientation: 'vertical',
					renderAppender: InnerBlocks.ButtonBlockAppender
				} )
			);

			return el( Fragment, null, inspector, inner );
		},

		// Dynamic block: persist inner slides; PHP render.php builds the markup.
		save: function () {
			return el( InnerBlocks.Content );
		}
	} );

	/* ===================================================================== *
	 * Child: anacb/slide
	 * ===================================================================== */
	blocks.registerBlockType( 'anacb/slide', {
		edit: function ( props ) {
			var a = props.attributes;
			var set = props.setAttributes;

			var style = {
				backgroundImage: a.imageUrl ? 'url("' + a.imageUrl + '")' : 'none'
			};
			var blockProps = useBlockProps( {
				className: 'aac-slide--editor aac-box-' + a.boxPosition,
				style: style
			} );

			var onSelectImage = function ( media ) {
				set( {
					imageId: media.id,
					imageUrl: media.url,
					imageAlt: media.alt || ''
				} );
			};

			var imageControls = el(
				PanelBody,
				{ title: __( 'Background image', 'ananyoo-accessible-carousel' ), initialOpen: true },
				el( MediaUploadCheck, null,
					el( MediaUpload, {
						onSelect: onSelectImage,
						allowedTypes: [ 'image' ],
						value: a.imageId,
						render: function ( o ) {
							return el( Button, {
								variant: 'secondary',
								onClick: o.open
							}, a.imageUrl ? __( 'Replace image', 'ananyoo-accessible-carousel' ) : __( 'Select image', 'ananyoo-accessible-carousel' ) );
						}
					} )
				),
				a.imageUrl && el( Button, {
					variant: 'link',
					isDestructive: true,
					onClick: function () { set( { imageId: undefined, imageUrl: '', imageAlt: '' } ); },
					style: { marginTop: '8px', display: 'block' }
				}, __( 'Remove image', 'ananyoo-accessible-carousel' ) ),
				el( ToggleControl, {
					label: __( 'Image is decorative', 'ananyoo-accessible-carousel' ),
					help: __( 'Leave on when the heading/text already convey the meaning. Turn off only if the image itself carries information.', 'ananyoo-accessible-carousel' ),
					checked: a.imageDecorative,
					onChange: function ( v ) { set( { imageDecorative: v } ); }
				} ),
				! a.imageDecorative && el( TextControl, {
					label: __( 'Image alt text', 'ananyoo-accessible-carousel' ),
					help: __( 'Describe what the image conveys.', 'ananyoo-accessible-carousel' ),
					value: a.imageAlt,
					onChange: function ( v ) { set( { imageAlt: v } ); }
				} )
			);

			var layoutControls = el(
				PanelBody,
				{ title: __( 'Content box', 'ananyoo-accessible-carousel' ), initialOpen: false },
				el( SelectControl, {
					label: __( 'Box position', 'ananyoo-accessible-carousel' ),
					value: a.boxPosition,
					options: [
						{ label: __( 'Left', 'ananyoo-accessible-carousel' ), value: 'left' },
						{ label: __( 'Right', 'ananyoo-accessible-carousel' ), value: 'right' },
						{ label: __( 'Bottom', 'ananyoo-accessible-carousel' ), value: 'bottom' }
					],
					onChange: function ( v ) { set( { boxPosition: v } ); }
				} ),
				el( SelectControl, {
					label: __( 'Heading level', 'ananyoo-accessible-carousel' ),
					value: String( a.headingLevel ),
					options: [
						{ label: 'H2', value: '2' },
						{ label: 'H3', value: '3' },
						{ label: 'H4', value: '4' }
					],
					help: __( 'Choose the level that fits this page outline.', 'ananyoo-accessible-carousel' ),
					onChange: function ( v ) { set( { headingLevel: parseInt( v, 10 ) } ); }
				} ),
				el( TextControl, {
					label: __( 'Button text', 'ananyoo-accessible-carousel' ),
					value: a.buttonText,
					onChange: function ( v ) { set( { buttonText: v } ); }
				} ),
				el( TextControl, {
					label: __( 'Button link (URL)', 'ananyoo-accessible-carousel' ),
					type: 'url',
					value: a.buttonUrl,
					onChange: function ( v ) { set( { buttonUrl: v } ); }
				} )
			);

			var designControls = el(
				PanelBody,
				{ title: __( 'Slide design', 'ananyoo-accessible-carousel' ), initialOpen: false },
				el( SelectControl, {
					label: __( 'Heading size', 'ananyoo-accessible-carousel' ),
					value: a.headingFontSize,
					options: [
						{ label: __( 'Default', 'ananyoo-accessible-carousel' ), value: '' },
						{ label: __( 'Small', 'ananyoo-accessible-carousel' ), value: '1.4rem' },
						{ label: __( 'Medium', 'ananyoo-accessible-carousel' ), value: '1.75rem' },
						{ label: __( 'Large', 'ananyoo-accessible-carousel' ), value: '2rem' },
						{ label: __( 'Extra large', 'ananyoo-accessible-carousel' ), value: '2.5rem' }
					],
					onChange: function ( v ) { set( { headingFontSize: v } ); }
				} ),
				el( SelectControl, {
					label: __( 'Text size', 'ananyoo-accessible-carousel' ),
					value: a.textFontSize,
					options: [
						{ label: __( 'Default', 'ananyoo-accessible-carousel' ), value: '' },
						{ label: __( 'Small', 'ananyoo-accessible-carousel' ), value: '0.9rem' },
						{ label: __( 'Large', 'ananyoo-accessible-carousel' ), value: '1.15rem' }
					],
					onChange: function ( v ) { set( { textFontSize: v } ); }
				} ),
				el( SelectControl, {
					label: __( 'Call to action style', 'ananyoo-accessible-carousel' ),
					value: a.ctaType,
					options: [
						{ label: __( 'Button', 'ananyoo-accessible-carousel' ), value: 'button' },
						{ label: __( 'Text link', 'ananyoo-accessible-carousel' ), value: 'link' }
					],
					help: __( 'A button keeps a 44px target; a link is underlined on the box.', 'ananyoo-accessible-carousel' ),
					onChange: function ( v ) { set( { ctaType: v } ); }
				} ),
				'button' === a.ctaType && el( SelectControl, {
					label: __( 'Button shape', 'ananyoo-accessible-carousel' ),
					value: a.ctaShape,
					options: [
						{ label: __( 'Square', 'ananyoo-accessible-carousel' ), value: 'square' },
						{ label: __( 'Rounded', 'ananyoo-accessible-carousel' ), value: 'rounded' },
						{ label: __( 'Pill', 'ananyoo-accessible-carousel' ), value: 'pill' }
					],
					onChange: function ( v ) { set( { ctaShape: v } ); }
				} ),
				'button' === a.ctaType && el( SelectControl, {
					label: __( 'Button size', 'ananyoo-accessible-carousel' ),
					value: a.ctaSize,
					options: [
						{ label: __( 'Small', 'ananyoo-accessible-carousel' ), value: 'small' },
						{ label: __( 'Medium', 'ananyoo-accessible-carousel' ), value: 'medium' },
						{ label: __( 'Large', 'ananyoo-accessible-carousel' ), value: 'large' }
					],
					onChange: function ( v ) { set( { ctaSize: v } ); }
				} )
			);

			var colorControls = el( PanelColorSettings, {
				title: __( 'Colours', 'ananyoo-accessible-carousel' ),
				initialOpen: false,
				colorSettings: [
					{ value: a.overlayColor, onChange: function ( v ) { set( { overlayColor: v || '#10151c' } ); }, label: __( 'Box background', 'ananyoo-accessible-carousel' ) },
					{ value: a.textColor, onChange: function ( v ) { set( { textColor: v || '#ffffff' } ); }, label: __( 'Text colour', 'ananyoo-accessible-carousel' ) },
					{ value: a.headingColor, onChange: function ( v ) { set( { headingColor: v || '' } ); }, label: __( 'Heading colour', 'ananyoo-accessible-carousel' ) },
					{ value: a.ctaBgColor, onChange: function ( v ) { set( { ctaBgColor: v || '' } ); }, label: __( 'Button background', 'ananyoo-accessible-carousel' ) },
					{ value: a.ctaTextColor, onChange: function ( v ) { set( { ctaTextColor: v || '' } ); }, label: __( 'Button text', 'ananyoo-accessible-carousel' ) }
				]
			},
			el( 'p', { style: { fontSize: '12px', fontStyle: 'italic' } },
				__( 'Live contrast results for these colours appear in the Accessibility check panel below (WCAG 1.4.3).', 'ananyoo-accessible-carousel' )
			) );

			// --- Accessibility check rows (Slide) ---
			var slBox  = a.overlayColor || '#10151c';
			var slText = a.textColor || '#ffffff';
			var slHead = a.headingColor || slText;
			var slHeadPx = toPx( a.headingFontSize ) || 32; // hero headings are large by default
			var slideRows = [
				contrastRow( __( 'Text on box background', 'ananyoo-accessible-carousel' ), slText, slBox, 4.5 ),
				contrastRow( __( 'Heading on box background', 'ananyoo-accessible-carousel' ), slHead, slBox, neededFor( slHeadPx, true ) )
			];
			if ( 'button' === a.ctaType ) {
				if ( a.ctaBgColor && a.ctaTextColor ) {
					slideRows.push( contrastRow( __( 'Button text on button', 'ananyoo-accessible-carousel' ), a.ctaTextColor, a.ctaBgColor, 4.5 ) );
				} else {
					slideRows.push( a11yRow( true, __( 'Button colours', 'ananyoo-accessible-carousel' ), __( 'Using theme colours — set both to check here.', 'ananyoo-accessible-carousel' ) ) );
				}
			}
			if ( a.imageUrl ) {
				if ( a.imageDecorative ) {
					slideRows.push( a11yRow( true, __( 'Background image', 'ananyoo-accessible-carousel' ), __( 'Marked decorative — no alt text needed.', 'ananyoo-accessible-carousel' ) ) );
				} else {
					var slAlt = !! ( a.imageAlt && a.imageAlt.trim() );
					slideRows.push( a11yRow( slAlt, __( 'Image alt text', 'ananyoo-accessible-carousel' ), slAlt ? __( 'Present.', 'ananyoo-accessible-carousel' ) : __( 'Add alt text, or mark the image decorative.', 'ananyoo-accessible-carousel' ) ) );
				}
			}
			var slHeadOk = !! ( a.heading && a.heading.trim() );
			slideRows.push( a11yRow( slHeadOk, __( 'Slide heading', 'ananyoo-accessible-carousel' ), slHeadOk ? __( 'Present.', 'ananyoo-accessible-carousel' ) : __( 'A heading helps screen-reader users scan slides.', 'ananyoo-accessible-carousel' ) ) );
			if ( a.buttonUrl && ! ( a.buttonText && a.buttonText.trim() ) ) {
				slideRows.push( a11yRow( false, __( 'Button text', 'ananyoo-accessible-carousel' ), __( 'The button has a link but no text.', 'ananyoo-accessible-carousel' ) ) );
			} else if ( vagueLink( a.buttonText ) ) {
				slideRows.push( a11yRow( false, __( 'Button text', 'ananyoo-accessible-carousel' ), __( 'Vague link text — say where it goes (WCAG 2.4.4).', 'ananyoo-accessible-carousel' ) ) );
			}

			var inspector = el( InspectorControls, null, imageControls, layoutControls, designControls, colorControls, a11yPanel( slideRows ) );

			var headingStyle = { color: a.textColor };
			if ( a.headingColor ) { headingStyle.color = a.headingColor; }
			if ( a.headingFontSize ) { headingStyle.fontSize = a.headingFontSize; }
			var textStyle = {};
			if ( a.textFontSize ) { textStyle.fontSize = a.textFontSize; }

			var shapeRadius = { square: '0', rounded: '6px', pill: '999px' };
			var slideSize = {
				small:  { padding: '0.35rem 0.85rem', fontSize: '0.85rem' },
				medium: { padding: '0.5rem 1rem', fontSize: '0.95rem' },
				large:  { padding: '0.7rem 1.4rem', fontSize: '1.1rem' }
			};
			var ssz = slideSize[ a.ctaSize ] || slideSize.medium;
			var cta = null;
			if ( a.buttonText ) {
				if ( 'link' === a.ctaType ) {
					cta = el( 'span', { className: 'aac-slide__link' }, a.buttonText );
				} else {
					cta = el( 'span', {
						className: 'aac-slide__btn',
						style: {
							background: a.ctaBgColor || undefined,
							color: a.ctaTextColor || undefined,
							borderRadius: shapeRadius[ a.ctaShape ] || '6px',
							padding: ssz.padding,
							fontSize: ssz.fontSize
						}
					}, a.buttonText );
				}
			}

			var box = el( 'div',
				{
					className: 'aac-slide__box aac-slide__box--' + a.boxPosition,
					style: { backgroundColor: a.overlayColor, color: a.textColor }
				},
				el( PlainText, {
					tagName: 'span',
					className: 'aac-slide__heading',
					style: headingStyle,
					value: a.heading,
					onChange: function ( v ) { set( { heading: v } ); },
					placeholder: __( 'Heading…', 'ananyoo-accessible-carousel' ),
					'aria-label': __( 'Slide heading', 'ananyoo-accessible-carousel' )
				} ),
				el( PlainText, {
					className: 'aac-slide__text',
					style: textStyle,
					value: a.text,
					onChange: function ( v ) { set( { text: v } ); },
					placeholder: __( 'Paragraph text…', 'ananyoo-accessible-carousel' ),
					'aria-label': __( 'Slide text', 'ananyoo-accessible-carousel' )
				} ),
				cta
			);

			return el( Fragment, null, inspector, el( 'div', blockProps, box ) );
		},

		// Dynamic block: PHP render.php builds the markup from attributes.
		save: function () {
			return null;
		}
	} );

	/* ===================================================================== *
	 * Parent: anacb/scroller  (accessible native scroll-snap card row)
	 * ===================================================================== */
	blocks.registerBlockType( 'anacb/scroller', {
		edit: function ( props ) {
			var a = props.attributes;
			var set = props.setAttributes;
			var blockProps = useBlockProps( {
				className: 'aac-scroller--editor',
				style: { '--aac-per-view': a.perView, '--aac-gap': ( a.gap || 0 ) + 'px' }
			} );
			var hasInner = useSelect( function ( s ) {
				return s( 'core/block-editor' ).getBlocks( props.clientId ).length > 0;
			}, [ props.clientId ] );
			var replaceInnerBlocks = useDispatch( 'core/block-editor' ).replaceInnerBlocks;

			if ( ! hasInner ) {
				return layoutPicker( blockProps, __( 'Choose a card layout', 'ananyoo-accessible-carousel' ), function ( style ) {
					replaceInnerBlocks( props.clientId, createBlocksFromInnerBlocksTemplate( cardBlocks( style ) ), false );
				} );
			}

			var inspector = el(
				InspectorControls,
				null,
				el(
					PanelBody,
					{ title: __( 'Scroller settings', 'ananyoo-accessible-carousel' ), initialOpen: true },
					el( TextControl, {
						label: __( 'Accessible label', 'ananyoo-accessible-carousel' ),
						help: __( 'Names the scroller region for screen reader users.', 'ananyoo-accessible-carousel' ),
						value: a.label,
						onChange: function ( v ) { set( { label: v } ); }
					} ),
					el( RangeControl, {
						label: __( 'Cards per view (desktop)', 'ananyoo-accessible-carousel' ),
						min: 1, max: 6,
						value: a.perView,
						help: __( 'Tablet shows at most 2 and mobile shows 1, automatically — this is the desktop count.', 'ananyoo-accessible-carousel' ),
						onChange: function ( v ) { set( { perView: v } ); }
					} ),
					el( RangeControl, {
						label: __( 'Gap between cards (px)', 'ananyoo-accessible-carousel' ),
						min: 0, max: 80,
						value: a.gap,
						onChange: function ( v ) { set( { gap: v } ); }
					} ),
					el( ToggleControl, {
						label: __( 'Show previous / next buttons', 'ananyoo-accessible-carousel' ),
						help: __( 'The row is always scrollable with the keyboard, touch and the scrollbar; these buttons are an extra. They appear only when the cards overflow.', 'ananyoo-accessible-carousel' ),
						checked: a.showArrows,
						onChange: function ( v ) { set( { showArrows: v } ); }
					} )
				)
			);

			var inner = el( 'div', blockProps,
				el( InnerBlocks, {
					allowedBlocks: [ CARD ],
					orientation: 'horizontal',
					renderAppender: InnerBlocks.ButtonBlockAppender
				} )
			);

			return el( Fragment, null, inspector, inner );
		},

		// Dynamic block: persist inner cards; PHP render.php builds the markup.
		save: function () {
			return el( InnerBlocks.Content );
		}
	} );

	/* ===================================================================== *
	 * Child: anacb/card
	 * ===================================================================== */
	blocks.registerBlockType( 'anacb/card', {
		edit: function ( props ) {
			var a = props.attributes;
			var set = props.setAttributes;

			var blockProps = useBlockProps( { className: 'aac-card--editor' } );

			var onSelectImage = function ( media ) {
				set( {
					imageId: media.id,
					imageUrl: media.url,
					imageAlt: media.alt || ''
				} );
			};

			var imageControls = el(
				PanelBody,
				{ title: __( 'Card image', 'ananyoo-accessible-carousel' ), initialOpen: true },
				el( MediaUploadCheck, null,
					el( MediaUpload, {
						onSelect: onSelectImage,
						allowedTypes: [ 'image' ],
						value: a.imageId,
						render: function ( o ) {
							return el( Button, {
								variant: 'secondary',
								onClick: o.open
							}, a.imageUrl ? __( 'Replace image', 'ananyoo-accessible-carousel' ) : __( 'Select image', 'ananyoo-accessible-carousel' ) );
						}
					} )
				),
				a.imageUrl && el( Button, {
					variant: 'link',
					isDestructive: true,
					onClick: function () { set( { imageId: undefined, imageUrl: '', imageAlt: '' } ); },
					style: { marginTop: '8px', display: 'block' }
				}, __( 'Remove image', 'ananyoo-accessible-carousel' ) ),
				el( ToggleControl, {
					label: __( 'Image is decorative', 'ananyoo-accessible-carousel' ),
					help: __( 'Leave on when the heading/text already convey the meaning.', 'ananyoo-accessible-carousel' ),
					checked: a.imageDecorative,
					onChange: function ( v ) { set( { imageDecorative: v } ); }
				} ),
				! a.imageDecorative && el( TextControl, {
					label: __( 'Image alt text', 'ananyoo-accessible-carousel' ),
					help: __( 'Describe what the image conveys.', 'ananyoo-accessible-carousel' ),
					value: a.imageAlt,
					onChange: function ( v ) { set( { imageAlt: v } ); }
				} )
			);

			var contentControls = el(
				PanelBody,
				{ title: __( 'Card content', 'ananyoo-accessible-carousel' ), initialOpen: false },
				el( SelectControl, {
					label: __( 'Heading level', 'ananyoo-accessible-carousel' ),
					value: String( a.headingLevel ),
					options: [
						{ label: 'H2', value: '2' },
						{ label: 'H3', value: '3' },
						{ label: 'H4', value: '4' }
					],
					help: __( 'Choose the level that fits this page outline.', 'ananyoo-accessible-carousel' ),
					onChange: function ( v ) { set( { headingLevel: parseInt( v, 10 ) } ); }
				} ),
				el( TextControl, {
					label: __( 'Link text', 'ananyoo-accessible-carousel' ),
					value: a.linkText,
					onChange: function ( v ) { set( { linkText: v } ); }
				} ),
				el( TextControl, {
					label: __( 'Link URL', 'ananyoo-accessible-carousel' ),
					type: 'url',
					value: a.linkUrl,
					onChange: function ( v ) { set( { linkUrl: v } ); }
				} )
			);

			var designControls = el(
				PanelBody,
				{ title: __( 'Card design', 'ananyoo-accessible-carousel' ), initialOpen: false },
				el( SelectControl, {
					label: __( 'Heading size', 'ananyoo-accessible-carousel' ),
					value: a.headingFontSize,
					options: [
						{ label: __( 'Default', 'ananyoo-accessible-carousel' ), value: '' },
						{ label: __( 'Small', 'ananyoo-accessible-carousel' ), value: '1.05rem' },
						{ label: __( 'Medium', 'ananyoo-accessible-carousel' ), value: '1.25rem' },
						{ label: __( 'Large', 'ananyoo-accessible-carousel' ), value: '1.5rem' },
						{ label: __( 'Extra large', 'ananyoo-accessible-carousel' ), value: '1.75rem' }
					],
					onChange: function ( v ) { set( { headingFontSize: v } ); }
				} ),
				el( SelectControl, {
					label: __( 'Call to action style', 'ananyoo-accessible-carousel' ),
					value: a.ctaType,
					options: [
						{ label: __( 'Text link', 'ananyoo-accessible-carousel' ), value: 'link' },
						{ label: __( 'Button', 'ananyoo-accessible-carousel' ), value: 'button' }
					],
					help: __( 'A button keeps a 44px target and the same accessible link text.', 'ananyoo-accessible-carousel' ),
					onChange: function ( v ) { set( { ctaType: v } ); }
				} ),
				'button' === a.ctaType && el( SelectControl, {
					label: __( 'Button shape', 'ananyoo-accessible-carousel' ),
					value: a.ctaShape,
					options: [
						{ label: __( 'Square', 'ananyoo-accessible-carousel' ), value: 'square' },
						{ label: __( 'Rounded', 'ananyoo-accessible-carousel' ), value: 'rounded' },
						{ label: __( 'Pill', 'ananyoo-accessible-carousel' ), value: 'pill' }
					],
					onChange: function ( v ) { set( { ctaShape: v } ); }
				} ),
				'button' === a.ctaType && el( SelectControl, {
					label: __( 'Button size', 'ananyoo-accessible-carousel' ),
					value: a.ctaSize,
					options: [
						{ label: __( 'Small', 'ananyoo-accessible-carousel' ), value: 'small' },
						{ label: __( 'Medium', 'ananyoo-accessible-carousel' ), value: 'medium' },
						{ label: __( 'Large', 'ananyoo-accessible-carousel' ), value: 'large' }
					],
					onChange: function ( v ) { set( { ctaSize: v } ); }
				} )
			);

			var cardColors = el(
				PanelColorSettings,
				{
					title: __( 'Card colours', 'ananyoo-accessible-carousel' ),
					initialOpen: false,
					colorSettings: [
						{ value: a.headingColor, onChange: function ( v ) { set( { headingColor: v || '' } ); }, label: __( 'Heading colour', 'ananyoo-accessible-carousel' ) },
						{ value: a.ctaBgColor, onChange: function ( v ) { set( { ctaBgColor: v || '' } ); }, label: __( 'Button background', 'ananyoo-accessible-carousel' ) },
						{ value: a.ctaTextColor, onChange: function ( v ) { set( { ctaTextColor: v || '' } ); }, label: __( 'Button text', 'ananyoo-accessible-carousel' ) }
					]
				},
				el( 'p', { style: { fontSize: '12px', fontStyle: 'italic' } },
					__( 'Live contrast results for these colours appear in the Accessibility check panel below (WCAG 1.4.3).', 'ananyoo-accessible-carousel' )
				)
			);

			// --- Accessibility check rows (Card) ---
			var cdBg   = ( a.style && a.style.color && a.style.color.background ) || '';
			var cdText = ( a.style && a.style.color && a.style.color.text ) || '';
			var cdHead = a.headingColor || cdText;
			var cdHeadPx = toPx( a.headingFontSize ) || 20; // card headings are bold; ~20px default
			var cardRows = [];
			if ( cdBg && cdText ) {
				cardRows.push( contrastRow( __( 'Text on card background', 'ananyoo-accessible-carousel' ), cdText, cdBg, 4.5 ) );
			} else {
				cardRows.push( a11yRow( true, __( 'Card text colour', 'ananyoo-accessible-carousel' ), __( 'Using theme colours — set the card background and text to check here.', 'ananyoo-accessible-carousel' ) ) );
			}
			if ( cdBg && cdHead ) {
				cardRows.push( contrastRow( __( 'Heading on card background', 'ananyoo-accessible-carousel' ), cdHead, cdBg, neededFor( cdHeadPx, true ) ) );
			}
			if ( 'button' === a.ctaType ) {
				cardRows.push( contrastRow( __( 'Button text on button', 'ananyoo-accessible-carousel' ), a.ctaTextColor || '#ffffff', a.ctaBgColor || '#1a1f36', 4.5 ) );
			}
			if ( a.imageUrl ) {
				if ( a.imageDecorative ) {
					cardRows.push( a11yRow( true, __( 'Card image', 'ananyoo-accessible-carousel' ), __( 'Marked decorative — no alt text needed.', 'ananyoo-accessible-carousel' ) ) );
				} else {
					var cdAlt = !! ( a.imageAlt && a.imageAlt.trim() );
					cardRows.push( a11yRow( cdAlt, __( 'Image alt text', 'ananyoo-accessible-carousel' ), cdAlt ? __( 'Present.', 'ananyoo-accessible-carousel' ) : __( 'Add alt text, or mark the image decorative.', 'ananyoo-accessible-carousel' ) ) );
				}
			}
			var cdHeadOk = !! ( a.heading && a.heading.trim() );
			cardRows.push( a11yRow( cdHeadOk, __( 'Card heading', 'ananyoo-accessible-carousel' ), cdHeadOk ? __( 'Present.', 'ananyoo-accessible-carousel' ) : __( 'A heading helps screen-reader users scan cards.', 'ananyoo-accessible-carousel' ) ) );
			if ( a.linkUrl && ! ( a.linkText && a.linkText.trim() ) ) {
				cardRows.push( a11yRow( false, __( 'Link text', 'ananyoo-accessible-carousel' ), __( 'The card has a link but no text.', 'ananyoo-accessible-carousel' ) ) );
			} else if ( vagueLink( a.linkText ) ) {
				cardRows.push( a11yRow( false, __( 'Link text', 'ananyoo-accessible-carousel' ), __( 'Vague link text — say where it goes (WCAG 2.4.4).', 'ananyoo-accessible-carousel' ) ) );
			}

			var inspector = el( InspectorControls, null, imageControls, contentControls, designControls, cardColors, a11yPanel( cardRows ) );

			var media = a.imageUrl
				? el( 'img', { className: 'aac-card__media', src: a.imageUrl, alt: '' } )
				: el( 'span', { className: 'aac-card__media aac-card__media--placeholder', 'aria-hidden': 'true' } );

			var headingStyle = {};
			if ( a.headingColor ) { headingStyle.color = a.headingColor; }
			if ( a.headingFontSize ) { headingStyle.fontSize = a.headingFontSize; }

			var shapeRadius = { square: '0', rounded: '8px', pill: '999px' };
			var cardSize = {
				small:  { padding: '0.4rem 0.9rem', fontSize: '0.85rem' },
				medium: { padding: '0.55rem 1.15rem', fontSize: '0.95rem' },
				large:  { padding: '0.75rem 1.5rem', fontSize: '1.1rem' }
			};
			var csz = cardSize[ a.ctaSize ] || cardSize.medium;
			var cta = null;
			if ( a.linkText ) {
				if ( 'button' === a.ctaType ) {
					cta = el( 'span', {
						className: 'aac-card__link aac-card__link--button',
						style: {
							background: a.ctaBgColor || '#1a1f36',
							color: a.ctaTextColor || '#ffffff',
							borderRadius: shapeRadius[ a.ctaShape ] || '8px',
							padding: csz.padding,
							fontSize: csz.fontSize
						}
					}, a.linkText );
				} else {
					cta = el( 'span', { className: 'aac-card__link' }, a.linkText );
				}
			}

			var body = el( 'div', { className: 'aac-card__body' },
				el( PlainText, {
					className: 'aac-card__heading',
					style: headingStyle,
					value: a.heading,
					onChange: function ( v ) { set( { heading: v } ); },
					placeholder: __( 'Card heading…', 'ananyoo-accessible-carousel' ),
					'aria-label': __( 'Card heading', 'ananyoo-accessible-carousel' )
				} ),
				el( PlainText, {
					className: 'aac-card__text',
					value: a.text,
					onChange: function ( v ) { set( { text: v } ); },
					placeholder: __( 'Card text…', 'ananyoo-accessible-carousel' ),
					'aria-label': __( 'Card text', 'ananyoo-accessible-carousel' )
				} ),
				cta
			);

			return el( Fragment, null, inspector, el( 'div', blockProps, media, body ) );
		},

		// Dynamic block: PHP render.php builds the markup from attributes.
		save: function () {
			return null;
		}
	} );

} )( window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n, window.wp.data );
