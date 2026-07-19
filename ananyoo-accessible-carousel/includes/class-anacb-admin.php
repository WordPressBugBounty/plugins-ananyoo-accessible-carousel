<?php
/**
 * Admin integration for Ananyoo Accessible Carousel.
 *
 * Adds a top-level "Accessible Carousel" menu pointing at an About / how-to
 * page (this is a block plugin, so there are no global settings to configure),
 * registers a branded block category so the plugin's blocks group together in
 * the editor inserter, and adds helpful links on the Plugins screen.
 *
 * @package AnanyooAccessibleCarousel
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Anacb_Admin {

	/**
	 * Menu + page slug.
	 */
	const MENU_SLUG = 'ananyoo-accessible-carousel';

	/**
	 * Capability. This is an informational page aimed at the people who build
	 * pages with the blocks, so it uses edit_posts rather than manage_options.
	 */
	const CAPABILITY = 'edit_posts';

	/**
	 * Branded block category slug.
	 */
	const CATEGORY_SLUG = 'ananyoo-accessible';

	/**
	 * Hook everything up.
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'register_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
		add_filter( 'block_categories_all', array( $this, 'register_block_category' ), 10, 1 );

		if ( defined( 'ANACB_BASENAME' ) ) {
			add_filter( 'plugin_action_links_' . ANACB_BASENAME, array( $this, 'action_links' ) );
			add_filter( 'plugin_row_meta', array( $this, 'row_meta' ), 10, 2 );
		}
	}

	/**
	 * Register the top-level admin menu.
	 */
	public function register_menu() {
		add_menu_page(
			__( 'Accessible Carousel', 'ananyoo-accessible-carousel' ),
			__( 'Accessible Carousel', 'ananyoo-accessible-carousel' ),
			self::CAPABILITY,
			self::MENU_SLUG,
			array( $this, 'render_about_page' ),
			'dashicons-images-alt2',
			81
		);
	}

	/**
	 * Render the About / how-to page.
	 */
	public function render_about_page() {
		require ANACB_PATH . 'admin/views/about-page.php';
	}

	/**
	 * Enqueue the admin stylesheet only on our page.
	 *
	 * @param string $hook Current admin page hook suffix.
	 */
	public function enqueue_admin_assets( $hook ) {
		if ( strpos( (string) $hook, self::MENU_SLUG ) === false ) {
			return;
		}
		wp_enqueue_style(
			'anacb-admin',
			ANACB_URL . 'admin/css/admin.css',
			array(),
			ANACB_VERSION
		);
	}

	/**
	 * Add a branded block category so the plugin's blocks group together in the
	 * editor inserter. Prepended so it appears near the top of the list.
	 *
	 * @param array $categories Existing block categories.
	 * @return array
	 */
	public function register_block_category( $categories ) {
		foreach ( (array) $categories as $cat ) {
			if ( isset( $cat['slug'] ) && self::CATEGORY_SLUG === $cat['slug'] ) {
				return $categories; // Already present.
			}
		}
		return array_merge(
			array(
				array(
					'slug'  => self::CATEGORY_SLUG,
					'title' => __( 'Ananyoo Accessible Blocks', 'ananyoo-accessible-carousel' ),
					'icon'  => null,
				),
			),
			(array) $categories
		);
	}

	/**
	 * Add a "How to use" link next to Deactivate on the Plugins screen.
	 *
	 * @param array $links Existing action links.
	 * @return array
	 */
	public function action_links( $links ) {
		$url      = admin_url( 'admin.php?page=' . self::MENU_SLUG );
		$settings = '<a href="' . esc_url( $url ) . '">' . esc_html__( 'Settings', 'ananyoo-accessible-carousel' ) . '</a>';
		$how      = '<a href="' . esc_url( $url ) . '">' . esc_html__( 'How to use', 'ananyoo-accessible-carousel' ) . '</a>';
		array_unshift( $links, $settings, $how );
		return $links;
	}

	/**
	 * Add Demo / Support links under the plugin description on the Plugins
	 * screen.
	 *
	 * @param array  $meta  Existing row meta links.
	 * @param string $file  Plugin file currently being processed.
	 * @return array
	 */
	public function row_meta( $meta, $file ) {
		if ( defined( 'ANACB_BASENAME' ) && ANACB_BASENAME === $file ) {
			$meta[] = '<a href="' . esc_url( 'https://showcase.ananyoo.com/accessible-carousel/' ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Live demo', 'ananyoo-accessible-carousel' ) . '</a>';
			$meta[] = '<a href="' . esc_url( 'https://wordpress.org/support/plugin/ananyoo-accessible-carousel/' ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Support', 'ananyoo-accessible-carousel' ) . '</a>';
		}
		return $meta;
	}
}
