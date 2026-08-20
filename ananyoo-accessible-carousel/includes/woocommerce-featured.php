<?php
/**
 * WooCommerce "Featured products" source for the Accessible components.
 *
 * Renders the products you have marked "Featured" in WooCommerce inside the
 * plugin's OWN accessible components — either the card scroller or the hero
 * carousel — so the keyboard operation, roving focus, focus-moves-to-revealed
 * behaviour and WCAG guarantees are exactly the same as the blocks; only the
 * source of the cards is WooCommerce.
 *
 * Two front doors share ONE renderer (anacb_render_featured):
 *   - the [ananyoo_featured_products] shortcode (quick drop-in), and
 *   - the anacb/featured-products block (full sidebar UI + live contrast check).
 *
 * Usage (shortcode):
 *   [ananyoo_featured_products count="8" per_view="3"]
 *   [ananyoo_featured_products display="carousel" style="overlay"]
 *   [ananyoo_featured_products category="magazines" subtitle="category"]
 *
 * @package AnanyooAccessibleCarousel
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Deterministic, WCAG-safe badge colour for a product category.
 *
 * Every colour returned reaches at least 4.5:1 contrast with white text, so the
 * badge label never fails WCAG 1.4.3 (unlike a bright #F49C26 amber, which does
 * not pass with white). A few common category words get a fixed colour so the
 * palette feels intentional; anything else is hashed to a stable colour.
 *
 * @param string $slug Category slug.
 * @param string $name Category name.
 * @return string Hex colour.
 */
function anacb_pf_badge_color( $slug, $name ) {
	$palette = array( '#B3540A', '#A60641', '#0E1B36', '#3B5BDB', '#C2255C', '#0F766E' );
	$hint    = strtolower( $slug . ' ' . $name );

	if ( false !== strpos( $hint, 'magazine' ) ) {
		return '#3B5BDB';
	}
	if ( false !== strpos( $hint, 'book' ) ) {
		return '#B3540A';
	}
	if ( false !== strpos( $hint, 'event' ) ) {
		return '#C2255C';
	}
	if ( false !== strpos( $hint, 'audio' ) || false !== strpos( $hint, 'podcast' ) || false !== strpos( $hint, 'music' ) ) {
		return '#0F766E';
	}

	$sum = 0;
	$len = strlen( $slug );
	for ( $i = 0; $i < $len; $i++ ) {
		$sum += ord( $slug[ $i ] );
	}
	return $palette[ $sum % count( $palette ) ];
}

/**
 * Normalise a raw config array (from the shortcode or the block) to safe,
 * clamped values with predictable types.
 *
 * @param array $config Raw config.
 * @return array Clean config.
 */
function anacb_pf_normalize( $config ) {
	$d = array(
		'display'        => 'scroller', // scroller | carousel.
		'style'          => '',         // scroller: editorial|soft|minimal ; carousel: card|overlay.
		'count'          => 8,
		'per_view'       => 3,
		'category'       => '',
		'orderby'        => 'date',     // date | menu_order | title.
		'show_heading'   => false,
		'heading'        => '',
		'heading_level'  => 2,
		'intro'          => '',
		'show_image'     => true,
		'show_badge'     => true,
		'show_title'     => true,
		'show_subtitle'  => true,
		'subtitle'       => 'excerpt',  // excerpt | category | none.
		'subtitle_words' => 14,
		'show_price'     => true,
		'show_cta'       => true,
		'cta'            => __( 'View', 'ananyoo-accessible-carousel' ),
		'cta_style'      => 'link',     // link | button.
		'badge_mode'     => 'auto',     // auto | custom.
		'badge_bg'       => '',
		'badge_text'     => '#ffffff',
		'label'          => __( 'Featured products', 'ananyoo-accessible-carousel' ),
		'wrapper'        => '',
		'is_editor'      => false,
	);

	$c = array_merge( $d, is_array( $config ) ? $config : array() );

	$c['display'] = in_array( $c['display'], array( 'scroller', 'carousel' ), true ) ? $c['display'] : 'scroller';

	if ( 'carousel' === $c['display'] ) {
		$c['style'] = in_array( $c['style'], array( 'card', 'overlay' ), true ) ? $c['style'] : 'card';
	} else {
		$c['style'] = in_array( $c['style'], array( 'editorial', 'soft', 'minimal' ), true ) ? $c['style'] : 'editorial';
	}

	$c['count']          = max( 1, min( 24, (int) $c['count'] ) );
	$c['per_view']       = max( 1, min( 6, (int) $c['per_view'] ) );
	$c['orderby']        = in_array( $c['orderby'], array( 'date', 'menu_order', 'title' ), true ) ? $c['orderby'] : 'date';
	$c['heading_level']  = max( 2, min( 4, (int) $c['heading_level'] ) );
	$c['subtitle']       = in_array( $c['subtitle'], array( 'excerpt', 'category', 'none' ), true ) ? $c['subtitle'] : 'excerpt';
	$c['subtitle_words'] = max( 5, min( 60, (int) $c['subtitle_words'] ) );
	$c['cta_style']      = in_array( $c['cta_style'], array( 'link', 'button' ), true ) ? $c['cta_style'] : 'link';
	$c['badge_mode']     = in_array( $c['badge_mode'], array( 'auto', 'custom' ), true ) ? $c['badge_mode'] : 'auto';

	// Booleans.
	foreach ( array( 'show_heading', 'show_image', 'show_badge', 'show_title', 'show_subtitle', 'show_price', 'show_cta', 'is_editor' ) as $b ) {
		$c[ $b ] = (bool) $c[ $b ];
	}

	// Colours (custom badge only).
	$bg = sanitize_hex_color( (string) $c['badge_bg'] );
	$tx = sanitize_hex_color( (string) $c['badge_text'] );
	$c['badge_bg']   = $bg ? $bg : '';
	$c['badge_text'] = $tx ? $tx : '#ffffff';
	if ( '' === $c['badge_bg'] ) {
		$c['badge_mode'] = 'auto'; // No custom colour supplied → fall back to auto.
	}

	// Text.
	$c['heading'] = sanitize_text_field( (string) $c['heading'] );
	$c['intro']   = sanitize_text_field( (string) $c['intro'] );
	$c['label']   = sanitize_text_field( (string) $c['label'] );
	$c['cta']     = sanitize_text_field( (string) $c['cta'] );
	if ( '' === $c['cta'] ) {
		$c['cta'] = __( 'View', 'ananyoo-accessible-carousel' );
	}
	if ( '' === $c['label'] ) {
		$c['label'] = ( '' !== $c['heading'] ) ? $c['heading'] : __( 'Featured products', 'ananyoo-accessible-carousel' );
	}

	return $c;
}

/**
 * Query the featured products for a config.
 *
 * @param array $c Clean config.
 * @return array WC_Product[] (may be empty).
 */
function anacb_pf_query( $c ) {
	$args = array(
		'featured' => true,
		'status'   => 'publish',
		'limit'    => $c['count'],
		'return'   => 'objects',
	);

	switch ( $c['orderby'] ) {
		case 'title':
			$args['orderby'] = 'title';
			$args['order']   = 'ASC';
			break;
		case 'menu_order':
			$args['orderby'] = 'menu_order';
			$args['order']   = 'ASC';
			break;
		default:
			$args['orderby'] = 'date';
			$args['order']   = 'DESC';
	}

	if ( '' !== trim( (string) $c['category'] ) ) {
		$args['category'] = array_map( 'sanitize_title', array_map( 'trim', explode( ',', (string) $c['category'] ) ) );
	}

	$products = wc_get_products( $args );
	return is_array( $products ) ? $products : array();
}

/**
 * Extract the raw fields a card/slide needs from one product.
 *
 * @param WC_Product $product Product.
 * @param array      $c       Clean config.
 * @return array
 */
function anacb_pf_fields( $product, $c ) {
	$pid  = $product->get_id();
	$name = $product->get_name();

	// First category → badge.
	$cat_name = '';
	$cat_slug = '';
	$terms    = get_the_terms( $pid, 'product_cat' );
	if ( $terms && ! is_wp_error( $terms ) ) {
		$first    = array_shift( $terms );
		$cat_name = $first->name;
		$cat_slug = $first->slug;
	}

	// Subtitle.
	$sub = '';
	if ( $c['show_subtitle'] ) {
		if ( 'category' === $c['subtitle'] ) {
			$sub = $cat_name;
		} elseif ( 'excerpt' === $c['subtitle'] ) {
			$sub = wp_trim_words( wp_strip_all_tags( $product->get_short_description() ), $c['subtitle_words'], '…' );
		}
	}

	// Badge colour.
	if ( 'custom' === $c['badge_mode'] ) {
		$badge_bg = $c['badge_bg'];
		$badge_tx = $c['badge_text'];
	} else {
		$badge_bg = anacb_pf_badge_color( $cat_slug, $cat_name );
		$badge_tx = '#ffffff';
	}

	return array(
		'pid'       => $pid,
		'name'      => $name,
		'url'       => $product->get_permalink(),
		'img_id'    => $product->get_image_id(),
		'cat_name'  => $cat_name,
		'cat_slug'  => $cat_slug,
		'sub'       => $sub,
		'price'     => $c['show_price'] ? $product->get_price_html() : '',
		'badge_bg'  => $badge_bg,
		'badge_tx'  => $badge_tx,
	);
}

/**
 * The category badge span (shared markup).
 *
 * @param array $f Product fields.
 * @param array $c Clean config.
 * @param string $extra_class Extra class.
 * @return string
 */
function anacb_pf_badge( $f, $c, $extra_class = '' ) {
	if ( ! $c['show_badge'] || '' === $f['cat_name'] ) {
		return '';
	}
	$cls = 'aac-pf-badge' . ( $extra_class ? ' ' . $extra_class : '' );
	return '<span class="' . esc_attr( $cls ) . '" style="background-color:' . esc_attr( $f['badge_bg'] ) . ';color:' . esc_attr( $f['badge_tx'] ) . '">' . esc_html( $f['cat_name'] ) . '</span>';
}

/**
 * Render the featured products as the accessible CARD SCROLLER.
 *
 * @param array  $products   WC_Product[].
 * @param array  $c          Clean config.
 * @param string $region_lbl aria-label / aria-labelledby attribute string.
 * @return string
 */
function anacb_pf_render_scroller( $products, $c, $region_lbl ) {
	$vp_label = sprintf(
		/* translators: %s: the scroller's accessible label. */
		__( '%s. Use the left and right arrow keys to scroll.', 'ananyoo-accessible-carousel' ),
		$c['label']
	);
	$vp_style = sprintf( '--aac-per-view:%d;--aac-gap:24px;', $c['per_view'] );
	$skin     = 'aac-skin-' . $c['style'];

	$cta_class = 'aac-scroller__link';
	if ( 'button' === $c['cta_style'] ) {
		$cta_class .= ' aac-scroller__link--button aac-scroller__link--rounded aac-scroller__link--md';
	}

	ob_start();
	?>
	<section class="aac-scroller aac-scroller--products <?php echo esc_attr( $skin ); ?>" data-aac-scroller data-arrows="true" <?php echo $region_lbl; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built from esc_attr below. ?>>
		<div class="aac-scroller__viewport" tabindex="0" role="group" aria-label="<?php echo esc_attr( $vp_label ); ?>" style="<?php echo esc_attr( $vp_style ); ?>">
			<ul class="aac-scroller__track">
				<?php
				foreach ( $products as $product ) :
					if ( ! is_object( $product ) ) {
						continue;
					}
					$f   = anacb_pf_fields( $product, $c );
					$uid = wp_unique_id( 'aac-pf-' );
					$hid = $uid . '-h';
					$tid = $uid . '-t';

					// Image.
					$img_html = '';
					if ( $c['show_image'] ) {
						if ( $f['img_id'] ) {
							$img_html = wp_get_attachment_image(
								$f['img_id'],
								'medium_large',
								false,
								array(
									'class'    => 'aac-scroller__media',
									'alt'      => $f['name'],
									'loading'  => 'lazy',
									'decoding' => 'async',
								)
							);
						} else {
							$ph       = function_exists( 'wc_placeholder_img_src' ) ? wc_placeholder_img_src( 'medium_large' ) : '';
							$img_html = '<img class="aac-scroller__media" src="' . esc_url( $ph ) . '" alt="' . esc_attr( $f['name'] ) . '" loading="lazy" decoding="async" />';
						}
					}

					$label_ids = $hid;
					if ( '' !== $f['sub'] ) {
						$label_ids .= ' ' . $tid;
					}

					$heading_class = 'aac-scroller__heading';
					if ( ! $c['show_title'] ) {
						// Keep the name for assistive tech even when hidden — the card still needs a name.
						$heading_class .= ' aac-visually-hidden';
					}
					?>
					<li class="aac-scroller__card aac-scroller__card--product aac-pf-card" tabindex="-1">
						<?php if ( '' !== $img_html || anacb_pf_badge( $f, $c ) ) : ?>
							<span class="aac-pf-media">
								<?php echo $img_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built with wp_get_attachment_image()/esc_url() above. ?>
								<?php echo anacb_pf_badge( $f, $c ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in anacb_pf_badge(). ?>
							</span>
						<?php endif; ?>
						<div class="aac-scroller__body aac-pf-overlay">
							<h3 class="<?php echo esc_attr( $heading_class ); ?>" id="<?php echo esc_attr( $hid ); ?>">
								<?php if ( '' !== $f['url'] ) : ?>
									<a class="aac-pf-cardlink" href="<?php echo esc_url( $f['url'] ); ?>"><?php echo esc_html( $f['name'] ); ?></a>
								<?php else : ?>
									<?php echo esc_html( $f['name'] ); ?>
								<?php endif; ?>
							</h3>
							<?php if ( '' !== $f['sub'] ) : ?>
								<p class="aac-scroller__text" id="<?php echo esc_attr( $tid ); ?>"><?php echo esc_html( $f['sub'] ); ?></p>
							<?php endif; ?>
							<?php if ( '' !== $f['price'] ) : ?>
								<p class="aac-pf-price"><?php echo wp_kses_post( $f['price'] ); ?></p>
							<?php endif; ?>
						</div>
					</li>
					<?php
				endforeach;
				?>
			</ul>
		</div>
	</section>
	<?php
	return ob_get_clean();
}

/**
 * Render the featured products as the accessible HERO CAROUSEL (one product
 * per slide). Autoplay is OFF by default, so there is no motion — it becomes a
 * clean one-at-a-time product showcase, driven by the plugin's own view.js
 * (skip link, polite live region, dots, full keyboard support).
 *
 * @param array  $products   WC_Product[].
 * @param array  $c          Clean config.
 * @param string $region_lbl aria-label / aria-labelledby attribute string.
 * @return string
 */
function anacb_pf_render_carousel( $products, $c, $region_lbl ) {
	$layout  = 'aac-layout-' . $c['style']; // card | overlay.
	$skip_id = wp_unique_id( 'aac-skip-' );

	$cta_class = 'aac-slide__link';
	if ( 'button' === $c['cta_style'] ) {
		$cta_class = 'aac-slide__btn aac-slide__btn--rounded aac-slide__btn--md';
	}

	ob_start();
	?>
	<section class="aac-carousel <?php echo esc_attr( $layout ); ?> aac-anim-none aac-carousel--products"
		data-aac data-autoplay="false" data-interval="6000" data-loop="true" data-arrows="true" data-dots="true"
		data-dot-style="dots" data-auto-time="true" data-hover-pause="true" data-reading-mode="false" data-dyslexia="false"
		data-i18n-pause="<?php esc_attr_e( 'Pause', 'ananyoo-accessible-carousel' ); ?>"
		data-i18n-play="<?php esc_attr_e( 'Play', 'ananyoo-accessible-carousel' ); ?>"
		data-pause-position="right" data-pause-size="medium"
		data-i18n-slide="<?php esc_attr_e( 'Slide', 'ananyoo-accessible-carousel' ); ?>"
		data-i18n-of="<?php esc_attr_e( 'of', 'ananyoo-accessible-carousel' ); ?>"
		aria-roledescription="<?php esc_attr_e( 'carousel', 'ananyoo-accessible-carousel' ); ?>"
		<?php echo $region_lbl; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built from esc_attr below. ?>>
		<a class="aac-skip-link" href="#<?php echo esc_attr( $skip_id ); ?>"><?php esc_html_e( 'Skip carousel', 'ananyoo-accessible-carousel' ); ?></a>
		<ul class="aac-carousel__track">
			<?php
			foreach ( $products as $product ) :
				if ( ! is_object( $product ) ) {
					continue;
				}
				$f = anacb_pf_fields( $product, $c );

				$img_url = '';
				if ( $c['show_image'] ) {
					if ( $f['img_id'] ) {
						$img_url = wp_get_attachment_image_url( $f['img_id'], 'large' );
					}
					if ( ! $img_url && function_exists( 'wc_placeholder_img_src' ) ) {
						$img_url = wc_placeholder_img_src( 'large' );
					}
				}

				$heading_class = 'aac-slide__heading';
				if ( ! $c['show_title'] ) {
					$heading_class .= ' aac-visually-hidden';
				}
				?>
				<li class="aac-slide">
					<?php if ( $img_url ) : ?>
						<img class="aac-slide__bg" src="<?php echo esc_url( $img_url ); ?>" alt="" role="presentation" loading="lazy" decoding="async" />
					<?php endif; ?>
					<div class="aac-slide__box aac-slide__box--left">
						<?php echo anacb_pf_badge( $f, $c, 'aac-slide__badge' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in anacb_pf_badge(). ?>
						<h3 class="<?php echo esc_attr( $heading_class ); ?>"><?php echo esc_html( $f['name'] ); ?></h3>
						<?php if ( '' !== $f['sub'] ) : ?>
							<p class="aac-slide__text"><?php echo esc_html( $f['sub'] ); ?></p>
						<?php endif; ?>
						<?php if ( '' !== $f['price'] ) : ?>
							<p class="aac-slide__price"><?php echo wp_kses_post( $f['price'] ); ?></p>
						<?php endif; ?>
						<?php if ( $c['show_cta'] ) : ?>
							<a class="<?php echo esc_attr( $cta_class ); ?>" href="<?php echo esc_url( $f['url'] ); ?>">
								<?php echo esc_html( $c['cta'] ); ?>
								<span class="aac-visually-hidden"><?php echo esc_html( ' – ' . $f['name'] ); ?></span>
							</a>
						<?php endif; ?>
					</div>
				</li>
				<?php
			endforeach;
			?>
		</ul>
		<p class="aac-carousel__status aac-visually-hidden" aria-live="polite" aria-atomic="true"></p>
		<span id="<?php echo esc_attr( $skip_id ); ?>" tabindex="-1" class="aac-skip-target"></span>
	</section>
	<?php
	return ob_get_clean();
}

/**
 * The one renderer shared by the shortcode and the block.
 *
 * @param array $config Raw config (shortcode atts or block attributes, mapped).
 * @return string HTML, or '' on the front end when WooCommerce is inactive or
 *                there are no featured products (a helpful notice in the editor).
 */
function anacb_render_featured( $config ) {
	$c = anacb_pf_normalize( $config );

	// WooCommerce inactive.
	if ( ! function_exists( 'wc_get_products' ) ) {
		if ( $c['is_editor'] ) {
			return '<div class="aac-pf-notice"><strong>' . esc_html__( 'Featured Products', 'ananyoo-accessible-carousel' ) . '</strong><br>' .
				esc_html__( 'WooCommerce is not active, so there are no products to show yet. This block will display your Featured products once WooCommerce is set up.', 'ananyoo-accessible-carousel' ) . '</div>';
		}
		return '';
	}

	$products = anacb_pf_query( $c );

	if ( empty( $products ) ) {
		if ( $c['is_editor'] ) {
			return '<div class="aac-pf-notice"><strong>' . esc_html__( 'Featured Products', 'ananyoo-accessible-carousel' ) . '</strong><br>' .
				esc_html__( 'No featured products found. In WooCommerce, open Products and click the star in the Featured column (or set “This is a featured product” in a product’s Catalog visibility) to include it here.', 'ananyoo-accessible-carousel' ) . '</div>';
		}
		return '';
	}

	// Assets: the badge / price / skin CSS lives in scroller.css and is needed
	// in BOTH modes; the front-end behaviour script differs per mode.
	wp_enqueue_style( 'aac-scroller-style' );
	if ( 'carousel' === $c['display'] ) {
		wp_enqueue_style( 'aac-style' );
		wp_enqueue_script( 'aac-view' );
	} else {
		wp_enqueue_script( 'aac-scroller-view' );
	}

	// Region name: prefer the visible heading (aria-labelledby), else aria-label.
	$hid = '';
	if ( $c['show_heading'] && '' !== $c['heading'] ) {
		$hid        = wp_unique_id( 'aac-pf-title-' );
		$region_lbl = 'aria-labelledby="' . esc_attr( $hid ) . '"';
	} else {
		$region_lbl = 'aria-label="' . esc_attr( $c['label'] ) . '"';
	}

	// Body: the chosen accessible component.
	if ( 'carousel' === $c['display'] ) {
		$body = anacb_pf_render_carousel( $products, $c, $region_lbl );
	} else {
		$body = anacb_pf_render_scroller( $products, $c, $region_lbl );
	}

	// Optional section header.
	$head = '';
	if ( $c['show_heading'] && '' !== $c['heading'] ) {
		$tag  = 'h' . $c['heading_level'];
		$head = '<header class="aac-featured__head">';
		$head .= '<' . $tag . ' id="' . esc_attr( $hid ) . '" class="aac-featured__title">' . esc_html( $c['heading'] ) . '</' . $tag . '>';
		if ( '' !== $c['intro'] ) {
			$head .= '<p class="aac-featured__intro">' . esc_html( $c['intro'] ) . '</p>';
		}
		$head .= '</header>';
	}

	// Outer wrapper. The block passes get_block_wrapper_attributes(); the
	// shortcode gets a plain class.
	$outer = $c['wrapper'];
	if ( '' === $outer ) {
		$outer = 'class="aac-featured aac-featured--' . esc_attr( $c['display'] ) . '"';
	}

	return '<div ' . $outer . '>' . $head . $body . '</div>';
}

/**
 * [ananyoo_featured_products] shortcode — builds a config and calls the shared
 * renderer. Kept for quick drop-in use; the block offers the full sidebar UI.
 *
 * @param array $atts Shortcode attributes.
 * @return string
 */
function anacb_featured_products_shortcode( $atts ) {
	$a = shortcode_atts(
		array(
			'display'        => 'scroller',
			'style'          => '',
			'count'          => 8,
			'per_view'       => 3,
			'category'       => '',
			'orderby'        => 'date',
			'heading'        => '',
			'heading_level'  => 2,
			'intro'          => '',
			'show_image'     => 'yes',
			'show_badge'     => 'yes',
			'show_title'     => 'yes',
			'subtitle'       => 'excerpt', // excerpt | category | none.
			'subtitle_words' => 14,
			'show_price'     => 'yes',
			'show_cta'       => 'yes',
			'cta'            => __( 'View', 'ananyoo-accessible-carousel' ),
			'cta_style'      => 'link',
			'badge_color'    => '',        // optional custom badge background.
			'badge_text'     => '#ffffff',
			'label'          => __( 'Featured products', 'ananyoo-accessible-carousel' ),
		),
		$atts,
		'ananyoo_featured_products'
	);

	$yes = function ( $v ) {
		return in_array( strtolower( (string) $v ), array( 'yes', 'true', '1', 'on' ), true );
	};

	$config = array(
		'display'        => $a['display'],
		'style'          => $a['style'],
		'count'          => $a['count'],
		'per_view'       => $a['per_view'],
		'category'       => $a['category'],
		'orderby'        => $a['orderby'],
		'show_heading'   => ( '' !== trim( (string) $a['heading'] ) ),
		'heading'        => $a['heading'],
		'heading_level'  => $a['heading_level'],
		'intro'          => $a['intro'],
		'show_image'     => $yes( $a['show_image'] ),
		'show_badge'     => $yes( $a['show_badge'] ),
		'show_title'     => $yes( $a['show_title'] ),
		'show_subtitle'  => ( 'none' !== strtolower( (string) $a['subtitle'] ) ),
		'subtitle'       => $a['subtitle'],
		'subtitle_words' => $a['subtitle_words'],
		'show_price'     => $yes( $a['show_price'] ),
		'show_cta'       => $yes( $a['show_cta'] ),
		'cta'            => $a['cta'],
		'cta_style'      => $a['cta_style'],
		'badge_mode'     => ( '' !== trim( (string) $a['badge_color'] ) ) ? 'custom' : 'auto',
		'badge_bg'       => $a['badge_color'],
		'badge_text'     => $a['badge_text'],
		'label'          => $a['label'],
	);

	return anacb_render_featured( $config );
}
add_shortcode( 'ananyoo_featured_products', 'anacb_featured_products_shortcode' );
