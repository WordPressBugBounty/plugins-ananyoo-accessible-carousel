<?php
/**
 * Server-side render for the anacb/slide block.
 *
 * A single <li> hero slide: an optional background <img> (decorative by
 * default) and a solid "contrast box" holding the heading, text, and call to
 * action. Design controls (heading size/colour, text size, CTA link-vs-button
 * with colour and shape) are layered on top of the box's own background/text
 * colours WITHOUT loosening the guardrails: the heading level stays 2–4, the
 * image stays decorative by default, and the solid box still guarantees text
 * contrast over any image (WCAG 1.4.3).
 *
 * @package AnanyooAccessibleCarousel
 *
 * @var array $attributes Block attributes.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$anacb_img_url    = ! empty( $attributes['imageUrl'] ) ? $attributes['imageUrl'] : '';
$anacb_decorative = ! empty( $attributes['imageDecorative'] );
$anacb_img_alt    = isset( $attributes['imageAlt'] ) ? $attributes['imageAlt'] : '';

$anacb_heading = isset( $attributes['heading'] ) ? $attributes['heading'] : '';
$anacb_level   = isset( $attributes['headingLevel'] ) ? absint( $attributes['headingLevel'] ) : 2;
if ( $anacb_level < 2 || $anacb_level > 4 ) {
	$anacb_level = 2;
}
$anacb_tag = 'h' . $anacb_level;

$anacb_text     = isset( $attributes['text'] ) ? $attributes['text'] : '';
$anacb_btn_text = isset( $attributes['buttonText'] ) ? $attributes['buttonText'] : '';
$anacb_btn_url  = isset( $attributes['buttonUrl'] ) ? $attributes['buttonUrl'] : '';

$anacb_pos = ! empty( $attributes['boxPosition'] ) ? $attributes['boxPosition'] : 'left';
if ( ! in_array( $anacb_pos, array( 'left', 'right', 'bottom' ), true ) ) {
	$anacb_pos = 'left';
}

// Box colours: sanitise to hex; fall back to safe high-contrast defaults.
$anacb_overlay = sanitize_hex_color( isset( $attributes['overlayColor'] ) ? $attributes['overlayColor'] : '' );
$anacb_textcol = sanitize_hex_color( isset( $attributes['textColor'] ) ? $attributes['textColor'] : '' );
if ( ! $anacb_overlay ) {
	$anacb_overlay = '#10151c';
}
if ( ! $anacb_textcol ) {
	$anacb_textcol = '#ffffff';
}
$anacb_box_style = sprintf( 'background-color:%s;color:%s;', $anacb_overlay, $anacb_textcol );

// Heading design.
$anacb_heading_color = sanitize_hex_color( isset( $attributes['headingColor'] ) ? (string) $attributes['headingColor'] : '' );
$anacb_heading_size  = isset( $attributes['headingFontSize'] ) ? (string) $attributes['headingFontSize'] : '';
if ( ! in_array( $anacb_heading_size, array( '', '1.4rem', '1.75rem', '2rem', '2.5rem' ), true ) ) {
	$anacb_heading_size = '';
}
$anacb_heading_style = '';
if ( $anacb_heading_color ) {
	$anacb_heading_style .= 'color:' . $anacb_heading_color . ';';
}
if ( '' !== $anacb_heading_size ) {
	$anacb_heading_style .= 'font-size:' . $anacb_heading_size . ';';
}

// Text size.
$anacb_text_size = isset( $attributes['textFontSize'] ) ? (string) $attributes['textFontSize'] : '';
if ( ! in_array( $anacb_text_size, array( '', '0.9rem', '1.15rem' ), true ) ) {
	$anacb_text_size = '';
}
$anacb_text_style = '' !== $anacb_text_size ? 'font-size:' . $anacb_text_size . ';' : '';

// CTA design. Default is a button, preserving the original look.
$anacb_cta_type = isset( $attributes['ctaType'] ) ? (string) $attributes['ctaType'] : 'button';
if ( ! in_array( $anacb_cta_type, array( 'link', 'button' ), true ) ) {
	$anacb_cta_type = 'button';
}
$anacb_cta_shape = isset( $attributes['ctaShape'] ) ? (string) $attributes['ctaShape'] : 'rounded';
if ( ! in_array( $anacb_cta_shape, array( 'square', 'rounded', 'pill' ), true ) ) {
	$anacb_cta_shape = 'rounded';
}
$anacb_cta_size = isset( $attributes['ctaSize'] ) ? (string) $attributes['ctaSize'] : 'medium';
$anacb_size_map = array( 'small' => 'sm', 'medium' => 'md', 'large' => 'lg' );
if ( ! isset( $anacb_size_map[ $anacb_cta_size ] ) ) {
	$anacb_cta_size = 'medium';
}
$anacb_cta_bg = sanitize_hex_color( isset( $attributes['ctaBgColor'] ) ? (string) $attributes['ctaBgColor'] : '' );
$anacb_cta_fg = sanitize_hex_color( isset( $attributes['ctaTextColor'] ) ? (string) $attributes['ctaTextColor'] : '' );

if ( 'link' === $anacb_cta_type ) {
	$anacb_cta_class = 'aac-slide__link';
	$anacb_cta_style = '';
} else {
	$anacb_cta_class = 'aac-slide__btn aac-slide__btn--' . $anacb_cta_shape . ' aac-slide__btn--' . $anacb_size_map[ $anacb_cta_size ];
	$anacb_cta_style = '';
	if ( $anacb_cta_bg ) {
		$anacb_cta_style .= 'background-color:' . $anacb_cta_bg . ';';
	}
	if ( $anacb_cta_fg ) {
		$anacb_cta_style .= 'color:' . $anacb_cta_fg . ';';
	}
}

$anacb_has_box = ( '' !== $anacb_heading || '' !== $anacb_text || ( '' !== $anacb_btn_text && '' !== $anacb_btn_url ) );
?>
<li class="aac-slide">
	<?php if ( $anacb_img_url ) : ?>
		<img
			class="aac-slide__bg"
			src="<?php echo esc_url( $anacb_img_url ); ?>"
			alt="<?php echo $anacb_decorative ? '' : esc_attr( $anacb_img_alt ); ?>"
			<?php echo $anacb_decorative ? 'role="presentation"' : ''; ?>
			loading="lazy"
			decoding="async"
		/>
	<?php endif; ?>

	<?php if ( $anacb_has_box ) : ?>
		<div class="aac-slide__box aac-slide__box--<?php echo esc_attr( $anacb_pos ); ?>" style="<?php echo esc_attr( $anacb_box_style ); ?>">
			<?php if ( '' !== $anacb_heading ) : ?>
				<<?php echo esc_attr( $anacb_tag ); ?> class="aac-slide__heading"<?php echo '' !== $anacb_heading_style ? ' style="' . esc_attr( $anacb_heading_style ) . '"' : ''; ?>><?php echo esc_html( $anacb_heading ); ?></<?php echo esc_attr( $anacb_tag ); ?>>
			<?php endif; ?>

			<?php if ( '' !== $anacb_text ) : ?>
				<p class="aac-slide__text"<?php echo '' !== $anacb_text_style ? ' style="' . esc_attr( $anacb_text_style ) . '"' : ''; ?>><?php echo esc_html( $anacb_text ); ?></p>
			<?php endif; ?>

			<?php if ( '' !== $anacb_btn_text && '' !== $anacb_btn_url ) : ?>
				<a class="<?php echo esc_attr( $anacb_cta_class ); ?>" href="<?php echo esc_url( $anacb_btn_url ); ?>"<?php echo '' !== $anacb_cta_style ? ' style="' . esc_attr( $anacb_cta_style ) . '"' : ''; ?>><?php echo esc_html( $anacb_btn_text ); ?></a>
			<?php endif; ?>
		</div>
	<?php endif; ?>
</li>
