<?php
/**
 * Block patterns (ready-made templates) for the Ananyoo blocks.
 *
 * Six designed starting points: three hero (carousel) looks and three card
 * (scroller) looks — Editorial, Soft, and Minimal. Each is built ENTIRELY from
 * the blocks' own design attributes (CTA style/shape/size/colour, heading size,
 * box/card colour and border), so they need no extra plugin CSS. The palette is
 * deliberately neutral and every colour pair is >= 4.5:1, so each pattern is
 * accessible out of the box on any theme and fully recolourable.
 *
 * Images are tiny bundled neutral placeholders; users replace them with their
 * own. To save a configured layout as their OWN template, users use WordPress's
 * built-in "Create pattern" on the block toolbar.
 *
 * @package AnanyooAccessibleCarousel
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the pattern category and all bundled patterns.
 */
function anacb_register_patterns() {

	if ( ! function_exists( 'register_block_pattern' ) || ! function_exists( 'register_block_pattern_category' ) ) {
		return;
	}

	register_block_pattern_category(
		'ananyoo',
		array( 'label' => __( 'Accessible Carousel', 'ananyoo-accessible-carousel' ) )
	);

	$anacb_img = ANACB_URL . 'assets/images/';
	$anacb_patterns = array();

	/* ===== HERO — EDITORIAL ============================================= */
	$anacb_patterns['ananyoo/hero-editorial'] = array(
		'title'       => __( 'Hero — Editorial', 'ananyoo-accessible-carousel' ),
		'description' => __( 'High-contrast hero carousel with solid buttons and crisp corners. Neutral and AA by default.', 'ananyoo-accessible-carousel' ),
		'content'     => <<<'HTML'
<!-- wp:anacb/slider {"label":"Featured","layout":"overlay","align":"wide"} -->
<!-- wp:anacb/slide {"imageUrl":"ANACB_IMG_BASE/aac-ph-1.jpg","heading":"Accessibility, built in","headingLevel":3,"headingFontSize":"2rem","text":"A hero that works for everyone — keyboard, screen reader, and touch.","buttonText":"Explore our work","buttonUrl":"#","boxPosition":"left","overlayColor":"#16181d","textColor":"#ffffff","ctaType":"button","ctaBgColor":"#ffffff","ctaTextColor":"#16181d","ctaShape":"rounded","ctaSize":"medium"} /-->
<!-- wp:anacb/slide {"imageUrl":"ANACB_IMG_BASE/aac-ph-2.jpg","heading":"Designed to WCAG 2.2 AA","headingLevel":3,"headingFontSize":"2rem","text":"Tested with JAWS, NVDA, VoiceOver and TalkBack.","buttonText":"See how we test","buttonUrl":"#","boxPosition":"right","overlayColor":"#16181d","textColor":"#ffffff","ctaType":"button","ctaBgColor":"#ffffff","ctaTextColor":"#16181d","ctaShape":"rounded","ctaSize":"medium"} /-->
<!-- wp:anacb/slide {"imageUrl":"ANACB_IMG_BASE/aac-ph-3.jpg","heading":"Inclusive by default","headingLevel":3,"headingFontSize":"2rem","text":"No autoplay traps, no keyboard dead ends, full reduced-motion support.","buttonText":"Get in touch","buttonUrl":"#","boxPosition":"bottom","overlayColor":"#16181d","textColor":"#ffffff","ctaType":"button","ctaBgColor":"#ffffff","ctaTextColor":"#16181d","ctaShape":"rounded","ctaSize":"medium"} /-->
<!-- /wp:anacb/slider -->
HTML,
	);

	/* ===== HERO — SOFT ================================================== */
	$anacb_patterns['ananyoo/hero-soft'] = array(
		'title'       => __( 'Hero — Soft', 'ananyoo-accessible-carousel' ),
		'description' => __( 'Rounded hero carousel with pill buttons. Friendly, neutral, and AA by default.', 'ananyoo-accessible-carousel' ),
		'content'     => <<<'HTML'
<!-- wp:anacb/slider {"label":"Featured","layout":"overlay","align":"wide"} -->
<!-- wp:anacb/slide {"imageUrl":"ANACB_IMG_BASE/aac-ph-4.jpg","heading":"Accessibility, built in","headingLevel":3,"headingFontSize":"1.75rem","text":"A hero that works for everyone — keyboard, screen reader, and touch.","buttonText":"Explore our work","buttonUrl":"#","boxPosition":"left","overlayColor":"#1f2937","textColor":"#ffffff","ctaType":"button","ctaBgColor":"#ffffff","ctaTextColor":"#1f2937","ctaShape":"pill","ctaSize":"medium"} /-->
<!-- wp:anacb/slide {"imageUrl":"ANACB_IMG_BASE/aac-ph-5.jpg","heading":"Designed to WCAG 2.2 AA","headingLevel":3,"headingFontSize":"1.75rem","text":"Tested with JAWS, NVDA, VoiceOver and TalkBack.","buttonText":"See how we test","buttonUrl":"#","boxPosition":"right","overlayColor":"#1f2937","textColor":"#ffffff","ctaType":"button","ctaBgColor":"#ffffff","ctaTextColor":"#1f2937","ctaShape":"pill","ctaSize":"medium"} /-->
<!-- wp:anacb/slide {"imageUrl":"ANACB_IMG_BASE/aac-ph-6.jpg","heading":"Inclusive by default","headingLevel":3,"headingFontSize":"1.75rem","text":"No autoplay traps, no keyboard dead ends, full reduced-motion support.","buttonText":"Get in touch","buttonUrl":"#","boxPosition":"bottom","overlayColor":"#1f2937","textColor":"#ffffff","ctaType":"button","ctaBgColor":"#ffffff","ctaTextColor":"#1f2937","ctaShape":"pill","ctaSize":"medium"} /-->
<!-- /wp:anacb/slider -->
HTML,
	);

	/* ===== HERO — MINIMAL =============================================== */
	$anacb_patterns['ananyoo/hero-minimal'] = array(
		'title'       => __( 'Hero — Minimal', 'ananyoo-accessible-carousel' ),
		'description' => __( 'Flat hero carousel with an underlined text-link call to action. The lightest, most restrained look.', 'ananyoo-accessible-carousel' ),
		'content'     => <<<'HTML'
<!-- wp:anacb/slider {"label":"Featured","layout":"overlay","align":"wide"} -->
<!-- wp:anacb/slide {"imageUrl":"ANACB_IMG_BASE/aac-ph-1.jpg","heading":"Accessibility, built in","headingLevel":3,"headingFontSize":"1.75rem","text":"A hero that works for everyone — keyboard, screen reader, and touch.","buttonText":"Explore our work","buttonUrl":"#","boxPosition":"bottom","overlayColor":"#111827","textColor":"#ffffff","ctaType":"link"} /-->
<!-- wp:anacb/slide {"imageUrl":"ANACB_IMG_BASE/aac-ph-2.jpg","heading":"Designed to WCAG 2.2 AA","headingLevel":3,"headingFontSize":"1.75rem","text":"Tested with JAWS, NVDA, VoiceOver and TalkBack.","buttonText":"See how we test","buttonUrl":"#","boxPosition":"bottom","overlayColor":"#111827","textColor":"#ffffff","ctaType":"link"} /-->
<!-- wp:anacb/slide {"imageUrl":"ANACB_IMG_BASE/aac-ph-3.jpg","heading":"Inclusive by default","headingLevel":3,"headingFontSize":"1.75rem","text":"No autoplay traps, no keyboard dead ends, full reduced-motion support.","buttonText":"Get in touch","buttonUrl":"#","boxPosition":"bottom","overlayColor":"#111827","textColor":"#ffffff","ctaType":"link"} /-->
<!-- /wp:anacb/slider -->
HTML,
	);

	/* ===== CARDS — EDITORIAL ============================================ */
	$anacb_patterns['ananyoo/cards-editorial'] = array(
		'title'       => __( 'Cards — Editorial', 'ananyoo-accessible-carousel' ),
		'description' => __( 'Bordered cards with solid buttons and crisp corners. Neutral and AA by default.', 'ananyoo-accessible-carousel' ),
		'content'     => <<<'HTML'
<!-- wp:anacb/scroller {"label":"Features","perView":3,"align":"wide"} -->
<!-- wp:anacb/card {"imageUrl":"ANACB_IMG_BASE/aac-ph-1.jpg","heading":"Design","headingLevel":3,"text":"Flexible design tools and the power of blocks.","linkText":"Learn more","linkUrl":"#","style":{"color":{"background":"#ffffff","text":"#1a1a1a"},"border":{"width":"1px","color":"#e4e4e7","radius":"4px"}},"ctaType":"button","ctaBgColor":"#1a1a1a","ctaTextColor":"#ffffff","ctaShape":"rounded","ctaSize":"medium"} /-->
<!-- wp:anacb/card {"imageUrl":"ANACB_IMG_BASE/aac-ph-2.jpg","heading":"Build","headingLevel":3,"text":"See your site take shape in real time.","linkText":"Learn more","linkUrl":"#","style":{"color":{"background":"#ffffff","text":"#1a1a1a"},"border":{"width":"1px","color":"#e4e4e7","radius":"4px"}},"ctaType":"button","ctaBgColor":"#1a1a1a","ctaTextColor":"#ffffff","ctaShape":"rounded","ctaSize":"medium"} /-->
<!-- wp:anacb/card {"imageUrl":"ANACB_IMG_BASE/aac-ph-3.jpg","heading":"Extend","headingLevel":3,"text":"Add a store, analytics, or a newsletter.","linkText":"Learn more","linkUrl":"#","style":{"color":{"background":"#ffffff","text":"#1a1a1a"},"border":{"width":"1px","color":"#e4e4e7","radius":"4px"}},"ctaType":"button","ctaBgColor":"#1a1a1a","ctaTextColor":"#ffffff","ctaShape":"rounded","ctaSize":"medium"} /-->
<!-- wp:anacb/card {"imageUrl":"ANACB_IMG_BASE/aac-ph-4.jpg","heading":"Audit","headingLevel":3,"text":"Checked against WCAG 2.2 AA with axe and Lighthouse.","linkText":"Learn more","linkUrl":"#","style":{"color":{"background":"#ffffff","text":"#1a1a1a"},"border":{"width":"1px","color":"#e4e4e7","radius":"4px"}},"ctaType":"button","ctaBgColor":"#1a1a1a","ctaTextColor":"#ffffff","ctaShape":"rounded","ctaSize":"medium"} /-->
<!-- /wp:anacb/scroller -->
HTML,
	);

	/* ===== CARDS — SOFT ================================================= */
	$anacb_patterns['ananyoo/cards-soft'] = array(
		'title'       => __( 'Cards — Soft', 'ananyoo-accessible-carousel' ),
		'description' => __( 'Rounded cards on a light surface with pill buttons. Friendly, neutral, and AA by default.', 'ananyoo-accessible-carousel' ),
		'content'     => <<<'HTML'
<!-- wp:anacb/scroller {"label":"Features","perView":3,"align":"wide"} -->
<!-- wp:anacb/card {"imageUrl":"ANACB_IMG_BASE/aac-ph-5.jpg","heading":"Design","headingLevel":3,"text":"Flexible design tools and the power of blocks.","linkText":"Learn more","linkUrl":"#","style":{"color":{"background":"#f7f7f8"},"border":{"radius":"16px"}},"ctaType":"button","ctaBgColor":"#1a1a1a","ctaTextColor":"#ffffff","ctaShape":"pill","ctaSize":"medium"} /-->
<!-- wp:anacb/card {"imageUrl":"ANACB_IMG_BASE/aac-ph-6.jpg","heading":"Build","headingLevel":3,"text":"See your site take shape in real time.","linkText":"Learn more","linkUrl":"#","style":{"color":{"background":"#f7f7f8"},"border":{"radius":"16px"}},"ctaType":"button","ctaBgColor":"#1a1a1a","ctaTextColor":"#ffffff","ctaShape":"pill","ctaSize":"medium"} /-->
<!-- wp:anacb/card {"imageUrl":"ANACB_IMG_BASE/aac-ph-1.jpg","heading":"Extend","headingLevel":3,"text":"Add a store, analytics, or a newsletter.","linkText":"Learn more","linkUrl":"#","style":{"color":{"background":"#f7f7f8"},"border":{"radius":"16px"}},"ctaType":"button","ctaBgColor":"#1a1a1a","ctaTextColor":"#ffffff","ctaShape":"pill","ctaSize":"medium"} /-->
<!-- wp:anacb/card {"imageUrl":"ANACB_IMG_BASE/aac-ph-2.jpg","heading":"Audit","headingLevel":3,"text":"Checked against WCAG 2.2 AA with axe and Lighthouse.","linkText":"Learn more","linkUrl":"#","style":{"color":{"background":"#f7f7f8"},"border":{"radius":"16px"}},"ctaType":"button","ctaBgColor":"#1a1a1a","ctaTextColor":"#ffffff","ctaShape":"pill","ctaSize":"medium"} /-->
<!-- /wp:anacb/scroller -->
HTML,
	);

	/* ===== CARDS — MINIMAL ============================================== */
	$anacb_patterns['ananyoo/cards-minimal'] = array(
		'title'       => __( 'Cards — Minimal', 'ananyoo-accessible-carousel' ),
		'description' => __( 'Flat, square, bordered cards with an underlined text-link call to action. The lightest look.', 'ananyoo-accessible-carousel' ),
		'content'     => <<<'HTML'
<!-- wp:anacb/scroller {"label":"Features","perView":3,"align":"wide"} -->
<!-- wp:anacb/card {"imageUrl":"ANACB_IMG_BASE/aac-ph-3.jpg","heading":"Design","headingLevel":3,"text":"Flexible design tools and the power of blocks.","linkText":"Learn more","linkUrl":"#","style":{"border":{"width":"1px","color":"#e4e4e7","radius":"0px"}},"ctaType":"link"} /-->
<!-- wp:anacb/card {"imageUrl":"ANACB_IMG_BASE/aac-ph-4.jpg","heading":"Build","headingLevel":3,"text":"See your site take shape in real time.","linkText":"Learn more","linkUrl":"#","style":{"border":{"width":"1px","color":"#e4e4e7","radius":"0px"}},"ctaType":"link"} /-->
<!-- wp:anacb/card {"imageUrl":"ANACB_IMG_BASE/aac-ph-5.jpg","heading":"Extend","headingLevel":3,"text":"Add a store, analytics, or a newsletter.","linkText":"Learn more","linkUrl":"#","style":{"border":{"width":"1px","color":"#e4e4e7","radius":"0px"}},"ctaType":"link"} /-->
<!-- wp:anacb/card {"imageUrl":"ANACB_IMG_BASE/aac-ph-6.jpg","heading":"Audit","headingLevel":3,"text":"Checked against WCAG 2.2 AA with axe and Lighthouse.","linkText":"Learn more","linkUrl":"#","style":{"border":{"width":"1px","color":"#e4e4e7","radius":"0px"}},"ctaType":"link"} /-->
<!-- /wp:anacb/scroller -->
HTML,
	);

	foreach ( $anacb_patterns as $anacb_slug => $anacb_pattern ) {
		register_block_pattern(
			$anacb_slug,
			array(
				'title'       => $anacb_pattern['title'],
				'description' => $anacb_pattern['description'],
				'categories'  => array( 'ananyoo' ),
				'content'     => str_replace( 'ANACB_IMG_BASE/', $anacb_img, $anacb_pattern['content'] ),
			)
		);
	}
}
add_action( 'init', 'anacb_register_patterns', 11 );
