<?php
/**
 * Server-side render for the anacb/featured-products block.
 *
 * This is a thin adapter: it maps the block attributes to the shared config and
 * hands off to anacb_render_featured() (includes/woocommerce-featured.php), the
 * SAME renderer the [ananyoo_featured_products] shortcode uses. So the block and
 * the shortcode always produce identical, accessible markup — the block just
 * adds the editor UI and the live contrast check on top.
 *
 * @package AnanyooAccessibleCarousel
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner content (unused; dynamic block).
 * @var WP_Block $block      Block instance.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'anacb_render_featured' ) ) {
	return '';
}

$anacb_a = is_array( $attributes ) ? $attributes : array();

$anacb_get = function ( $key, $default ) use ( $anacb_a ) {
	return array_key_exists( $key, $anacb_a ) ? $anacb_a[ $key ] : $default;
};

$anacb_display = ( 'carousel' === $anacb_get( 'display', 'scroller' ) ) ? 'carousel' : 'scroller';

// The block wrapper carries alignment, spacing and anchor from block supports.
$anacb_wrapper = get_block_wrapper_attributes(
	array(
		'class' => 'aac-featured aac-featured--' . $anacb_display,
	)
);

// ServerSideRender previews the block over the REST block-renderer route, which
// is a REST request; front-end page views are not. Use that to show a helpful
// placeholder in the editor while still rendering nothing on the front end when
// there is nothing to show.
$anacb_is_editor = defined( 'REST_REQUEST' ) && REST_REQUEST;

$anacb_config = array(
	'display'        => $anacb_display,
	'style'          => $anacb_get( 'style', 'editorial' ),
	'count'          => $anacb_get( 'count', 8 ),
	'per_view'       => $anacb_get( 'perView', 3 ),
	'category'       => $anacb_get( 'category', '' ),
	'orderby'        => $anacb_get( 'orderby', 'date' ),
	'show_heading'   => (bool) $anacb_get( 'showHeading', true ),
	'heading'        => $anacb_get( 'heading', '' ),
	'heading_level'  => $anacb_get( 'headingLevel', 2 ),
	'intro'          => $anacb_get( 'intro', '' ),
	'show_image'     => (bool) $anacb_get( 'showImage', true ),
	'show_badge'     => (bool) $anacb_get( 'showBadge', true ),
	'show_title'     => (bool) $anacb_get( 'showTitle', true ),
	'show_subtitle'  => (bool) $anacb_get( 'showSubtitle', true ),
	'subtitle'       => $anacb_get( 'subtitleSource', 'excerpt' ),
	'subtitle_words' => $anacb_get( 'subtitleWords', 14 ),
	'show_price'     => (bool) $anacb_get( 'showPrice', true ),
	'show_cta'       => (bool) $anacb_get( 'showCta', true ),
	'cta'            => $anacb_get( 'ctaText', 'View' ),
	'cta_style'      => $anacb_get( 'ctaStyle', 'link' ),
	'badge_mode'     => $anacb_get( 'badgeMode', 'auto' ),
	'badge_bg'       => $anacb_get( 'badgeBg', '' ),
	'badge_text'     => $anacb_get( 'badgeText', '#ffffff' ),
	'label'          => $anacb_get( 'label', __( 'Featured products', 'ananyoo-accessible-carousel' ) ),
	'wrapper'        => $anacb_wrapper,
	'is_editor'      => $anacb_is_editor,
);

// Output is fully escaped inside the shared renderer.
echo anacb_render_featured( $anacb_config ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped within anacb_render_featured().
