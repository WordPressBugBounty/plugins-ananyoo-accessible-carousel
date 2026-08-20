<?php
/**
 * Plugin Name:       Accessible Carousel & Slider – WCAG AA Compliant Slideshow
 * Plugin URI:        https://ananyoo.com/ananyoo-accessible-carousel-block-plugin/
 * Description:        WCAG 2.2 AA compliant carousel, slider & slideshow blocks: keyboard & screen-reader friendly, pause control, no autoplay, plus a card scroller.
 * Version:           2.9.3
 * Requires at least: 6.5
 * Requires PHP:      7.4
 * Author:            Shivaji Mitra (Ananyoo)
 * Author URI:        https://ananyoo.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       ananyoo-accessible-carousel
 * Domain Path:       /languages
 *
 * @package AnanyooAccessibleCarousel
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct file access.
}

define( 'ANACB_VERSION', '2.9.3' );
define( 'ANACB_PATH', plugin_dir_path( __FILE__ ) );
define( 'ANACB_URL', plugin_dir_url( __FILE__ ) );
define( 'ANACB_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Register shared assets, then register the dynamic blocks.
 *
 * Scripts are registered with explicit dependencies and no build step, so the
 * shipped file is the file that runs. Each block.json references these handles.
 */
function anacb_register() {

	// --- Editor script (handles all four blocks) -------------------------
	wp_register_script(
		'aac-editor',
		ANACB_URL . 'assets/js/editor.js',
		array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n', 'wp-data', 'wp-server-side-render' ),
		ANACB_VERSION,
		true
	);
	wp_set_script_translations( 'aac-editor', 'ananyoo-accessible-carousel' );
	wp_localize_script(
		'aac-editor',
		'AnacbData',
		array( 'imgBase' => ANACB_URL . 'assets/images/' )
	);

	// --- Carousel front-end behaviour ------------------------------------
	wp_register_script(
		'aac-view',
		ANACB_URL . 'assets/js/view.js',
		array(),
		ANACB_VERSION,
		true
	);

	// --- Scroller front-end behaviour (separate, loads only when used) ---
	wp_register_script(
		'aac-scroller-view',
		ANACB_URL . 'assets/js/scroller-view.js',
		array(),
		ANACB_VERSION,
		true
	);

	// --- Styles ----------------------------------------------------------
	wp_register_style( 'aac-style', ANACB_URL . 'assets/css/style.css', array(), ANACB_VERSION );
	wp_register_style( 'aac-scroller-style', ANACB_URL . 'assets/css/scroller.css', array(), ANACB_VERSION );
	wp_register_style( 'aac-editor-style', ANACB_URL . 'assets/css/editor.css', array(), ANACB_VERSION );

	// block.json carries "render": "file:./render.php", so core wires up rendering.
	register_block_type( ANACB_PATH . 'blocks/slider' );
	register_block_type( ANACB_PATH . 'blocks/slide' );
	register_block_type( ANACB_PATH . 'blocks/scroller' );
	register_block_type( ANACB_PATH . 'blocks/card' );
	register_block_type( ANACB_PATH . 'blocks/featured-products' );
}
add_action( 'init', 'anacb_register' );

// --- Block patterns (ready-made templates) -------------------------------
require_once ANACB_PATH . 'includes/patterns.php';

// --- WooCommerce "Featured products" source ------------------------------
// Adds the [ananyoo_featured_products] shortcode, which renders your featured
// WooCommerce products inside the accessible card scroller. The file guards
// itself when WooCommerce is not active, so it is safe to load unconditionally.
require_once ANACB_PATH . 'includes/woocommerce-featured.php';

// --- Admin: top-level menu, About/how-to page, branded block category and
// Plugins-screen links. Loaded only in the admin (includes the block editor).
if ( is_admin() ) {
	require_once ANACB_PATH . 'includes/class-anacb-admin.php';
	new Anacb_Admin();
}
