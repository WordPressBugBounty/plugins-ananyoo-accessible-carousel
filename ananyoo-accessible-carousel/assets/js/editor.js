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
					a.autoplay && el( RangeControl, {
						label: __( 'Autoplay interval (seconds)', 'ananyoo-accessible-carousel' ),
						min: 4, max: 20,
						value: Math.round( a.interval / 1000 ),
						onChange: function ( v ) { set( { interval: v * 1000 } ); }
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
				__( 'Keep box / button background and text contrast at 4.5:1 or higher (WCAG 1.4.3).', 'ananyoo-accessible-carousel' )
			) );

			var inspector = el( InspectorControls, null, imageControls, layoutControls, designControls, colorControls );

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
					__( 'When the CTA is a button, keep its background and text contrast at 4.5:1 or higher (WCAG 1.4.3).', 'ananyoo-accessible-carousel' )
				)
			);

			var inspector = el( InspectorControls, null, imageControls, contentControls, designControls, cardColors );

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
