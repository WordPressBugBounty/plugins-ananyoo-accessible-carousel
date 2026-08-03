<?php
/**
 * Server-side render for the anacb/slider block.
 *
 * Follows the W3C/WAI carousel structure: a labelled <section> region wrapping
 * a <ul> list of slides, plus a visually hidden polite live region. Controls
 * (previous/next, dots, stop/start) are injected by view.js per the W3C
 * guidance, so users without JavaScript get a clean, readable list.
 *
 * @package AnanyooAccessibleCarousel
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Rendered inner slides.
 * @var WP_Block $block      Block instance.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$anacb_label     = ! empty( $attributes['label'] ) ? $attributes['label'] : __( 'Featured content carousel', 'ananyoo-accessible-carousel' );
$anacb_autoplay  = ! empty( $attributes['autoplay'] );
$anacb_interval  = isset( $attributes['interval'] ) ? absint( $attributes['interval'] ) : 6000;
$anacb_loop      = isset( $attributes['loop'] ) ? (bool) $attributes['loop'] : true;
$anacb_arrows    = isset( $attributes['showArrows'] ) ? (bool) $attributes['showArrows'] : true;
$anacb_dots      = isset( $attributes['showDots'] ) ? (bool) $attributes['showDots'] : true;

$anacb_animation = ! empty( $attributes['animation'] ) ? $attributes['animation'] : 'fade';
if ( ! in_array( $anacb_animation, array( 'none', 'fade', 'slide' ), true ) ) {
	$anacb_animation = 'fade';
}

$anacb_layout = ! empty( $attributes['layout'] ) ? $attributes['layout'] : 'card';
if ( ! in_array( $anacb_layout, array( 'card', 'overlay' ), true ) ) {
	$anacb_layout = 'card';
}

/*
 * User-supplied width / height. These are free-text CSS values, so we allow
 * only a safe subset (digits, dot, %, common length units, auto/none).
 * Anything else is dropped, preventing style injection.
 */
$anacb_len_pattern  = '/^(auto|none|[0-9]+(\.[0-9]+)?(px|%|rem|em|vw|vh|vmin|vmax|ch)?)$/';

$anacb_max_width    = isset( $attributes['maxWidth'] ) ? trim( (string) $attributes['maxWidth'] ) : '';
$anacb_slide_height = isset( $attributes['slideHeight'] ) ? trim( (string) $attributes['slideHeight'] ) : '';

if ( '' !== $anacb_max_width && ! preg_match( $anacb_len_pattern, $anacb_max_width ) ) {
	$anacb_max_width = '';
}
if ( '' !== $anacb_slide_height && ! preg_match( $anacb_len_pattern, $anacb_slide_height ) ) {
	$anacb_slide_height = '';
}

$anacb_style = '';
if ( '' !== $anacb_max_width ) {
	$anacb_style .= '--aac-max-width:' . $anacb_max_width . ';';
}
if ( '' !== $anacb_slide_height ) {
	$anacb_style .= '--aac-min-height:' . $anacb_slide_height . ';';
}

/*
 * Card background colour. Defaults to a light grey so the carousel stands out
 * on white pages; the user can change it per carousel in the block settings.
 * Sanitised to a valid hex colour; invalid values fall back to the CSS default.
 */
$anacb_card_bg = isset( $attributes['cardBg'] ) ? sanitize_hex_color( (string) $attributes['cardBg'] ) : '';
if ( $anacb_card_bg ) {
	$anacb_style .= '--aac-card-bg:' . $anacb_card_bg . ';';
}

/*
 * Pause / stop control options.
 *
 * The control itself is ALWAYS rendered by view.js whenever autoplay is on
 * (WCAG 2.2.2) — these options only customise its wording, position, and size,
 * they can never remove it.
 *
 * Labels feed view.js via the existing data-i18n-* convention and are used as
 * BOTH the visible text and the button's accessible name, so they always match
 * (WCAG 2.5.3 Label in Name). Position and size are constrained to known values.
 */
$anacb_pause_label = isset( $attributes['pauseLabel'] ) ? sanitize_text_field( (string) $attributes['pauseLabel'] ) : '';
$anacb_play_label  = isset( $attributes['playLabel'] ) ? sanitize_text_field( (string) $attributes['playLabel'] ) : '';
if ( '' === $anacb_pause_label ) {
	$anacb_pause_label = __( 'Pause', 'ananyoo-accessible-carousel' );
}
if ( '' === $anacb_play_label ) {
	$anacb_play_label = __( 'Play', 'ananyoo-accessible-carousel' );
}

$anacb_pause_position = isset( $attributes['pausePosition'] ) ? (string) $attributes['pausePosition'] : 'right';
if ( ! in_array( $anacb_pause_position, array( 'left', 'center', 'right' ), true ) ) {
	$anacb_pause_position = 'right';
}

$anacb_pause_size = isset( $attributes['pauseSize'] ) ? (string) $attributes['pauseSize'] : 'medium';
if ( ! in_array( $anacb_pause_size, array( 'small', 'medium', 'large' ), true ) ) {
	$anacb_pause_size = 'medium';
}

// Slide navigation style: plain dots, or a titled tab list (author choice).
$anacb_dot_style = isset( $attributes['dotStyle'] ) ? (string) $attributes['dotStyle'] : 'dots';
if ( ! in_array( $anacb_dot_style, array( 'dots', 'titles' ), true ) ) {
	$anacb_dot_style = 'dots';
}

// Reading-time pacing: when on (and autoplay is on), each slide stays long
// enough to read its own text rather than a fixed interval.
$anacb_auto_time = isset( $attributes['autoTime'] ) ? (bool) $attributes['autoTime'] : true;

// Opt-in visitor modes (off by default): a "View as list" reading mode and a
// dyslexia-friendly text toggle. Their scripts/styles do nothing unless on.
$anacb_reading_mode = ! empty( $attributes['readingMode'] );
$anacb_dyslexia     = ! empty( $attributes['dyslexiaToggle'] );

$anacb_wrapper_args = array(
	'class'         => 'aac-carousel aac-layout-' . $anacb_layout . ' aac-anim-' . $anacb_animation,
	'data-aac'      => '',
	'data-autoplay' => $anacb_autoplay ? 'true' : 'false',
	'data-interval' => (string) $anacb_interval,
	'data-loop'     => $anacb_loop ? 'true' : 'false',
	'data-arrows'   => $anacb_arrows ? 'true' : 'false',
	'data-dots'     => $anacb_dots ? 'true' : 'false',
	'data-i18n-pause'     => $anacb_pause_label,
	'data-i18n-play'      => $anacb_play_label,
	'data-pause-position' => $anacb_pause_position,
	'data-pause-size'     => $anacb_pause_size,
	'data-dot-style'      => $anacb_dot_style,
	'data-auto-time'      => $anacb_auto_time ? 'true' : 'false',
	'data-reading-mode'   => $anacb_reading_mode ? 'true' : 'false',
	'data-dyslexia'       => $anacb_dyslexia ? 'true' : 'false',
	'data-i18n-listview'      => __( 'View as list', 'ananyoo-accessible-carousel' ),
	'data-i18n-carouselview'  => __( 'View as carousel', 'ananyoo-accessible-carousel' ),
	'data-i18n-easyread'      => __( 'Easier reading', 'ananyoo-accessible-carousel' ),
	'data-i18n-easyreadoff'   => __( 'Normal reading', 'ananyoo-accessible-carousel' ),
	'data-i18n-slide'         => __( 'Slide', 'ananyoo-accessible-carousel' ),
	'data-i18n-of'            => __( 'of', 'ananyoo-accessible-carousel' ),
);
if ( '' !== $anacb_style ) {
	$anacb_wrapper_args['style'] = $anacb_style;
}

$anacb_wrapper = get_block_wrapper_attributes( $anacb_wrapper_args );
?>
<?php $anacb_skip_id = wp_unique_id( 'aac-skip-' ); ?>
<section <?php echo $anacb_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?> aria-roledescription="<?php esc_attr_e( 'carousel', 'ananyoo-accessible-carousel' ); ?>" aria-label="<?php echo esc_attr( $anacb_label ); ?>">
	<a class="aac-skip-link" href="#<?php echo esc_attr( $anacb_skip_id ); ?>"><?php esc_html_e( 'Skip carousel', 'ananyoo-accessible-carousel' ); ?></a>
	<ul class="aac-carousel__track">
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- inner slides rendered and escaped by their own render.php. ?>
	</ul>
	<p class="aac-carousel__status aac-visually-hidden" aria-live="polite" aria-atomic="true"></p>
	<span id="<?php echo esc_attr( $anacb_skip_id ); ?>" tabindex="-1" class="aac-skip-target"></span>
</section>
