<?php
/**
 * Server-side render for the anacb/card block.
 *
 * One <li> card: image, heading, text, and a call to action. Design controls
 * are layered on WITHOUT loosening the accessibility guardrails:
 *   - Card background, text colour, typography, border and spacing come from
 *     core block supports (get_block_wrapper_attributes()).
 *   - Heading colour/size and the CTA (link vs button, colour, shape) are
 *     explicit, sanitised attributes.
 *   - The heading level stays constrained (2–4), the image stays decorative by
 *     default, and the CTA keeps hidden context ("Learn more – Design") so
 *     repeated links have distinct names (WCAG 2.4.4).
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
$anacb_level   = isset( $attributes['headingLevel'] ) ? absint( $attributes['headingLevel'] ) : 3;
if ( $anacb_level < 2 || $anacb_level > 4 ) {
	$anacb_level = 3;
}
$anacb_tag = 'h' . $anacb_level;

// Heading design (sanitised). Size is chosen from a fixed list.
$anacb_heading_color = sanitize_hex_color( isset( $attributes['headingColor'] ) ? (string) $attributes['headingColor'] : '' );
$anacb_heading_size  = isset( $attributes['headingFontSize'] ) ? (string) $attributes['headingFontSize'] : '';
if ( ! in_array( $anacb_heading_size, array( '', '1.05rem', '1.25rem', '1.5rem', '1.75rem' ), true ) ) {
	$anacb_heading_size = '';
}
$anacb_heading_style = '';
if ( $anacb_heading_color ) {
	$anacb_heading_style .= 'color:' . $anacb_heading_color . ';';
}
if ( '' !== $anacb_heading_size ) {
	$anacb_heading_style .= 'font-size:' . $anacb_heading_size . ';';
}

$anacb_text      = isset( $attributes['text'] ) ? $attributes['text'] : '';
$anacb_link_text = isset( $attributes['linkText'] ) ? $attributes['linkText'] : '';
$anacb_link_url  = isset( $attributes['linkUrl'] ) ? $attributes['linkUrl'] : '';
$anacb_has_link  = ( '' !== $anacb_link_text && '' !== $anacb_link_url );

// CTA design.
$anacb_cta_type = isset( $attributes['ctaType'] ) ? (string) $attributes['ctaType'] : 'link';
if ( ! in_array( $anacb_cta_type, array( 'link', 'button' ), true ) ) {
	$anacb_cta_type = 'link';
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

$anacb_link_class = 'aac-scroller__link';
$anacb_link_style = '';
if ( 'button' === $anacb_cta_type ) {
	$anacb_link_class .= ' aac-scroller__link--button aac-scroller__link--' . $anacb_cta_shape . ' aac-scroller__link--' . $anacb_size_map[ $anacb_cta_size ];
	if ( $anacb_cta_bg ) {
		$anacb_link_style .= 'background-color:' . $anacb_cta_bg . ';';
	}
	if ( $anacb_cta_fg ) {
		$anacb_link_style .= 'color:' . $anacb_cta_fg . ';';
	}
}

// Block supports (colour, typography, border, spacing) on the card wrapper.
$anacb_wrapper = get_block_wrapper_attributes( array( 'class' => 'aac-scroller__card' ) );

// Make the card programmatically focusable (tabindex="-1") and give it an
// accessible name composed from its own heading + text, so that when the
// Previous/Next buttons move focus onto the newly-revealed card the screen
// reader announces THAT card's information (WCAG 2.4.3 / 4.1.2). The card
// stays a list item, so "list, N items" is preserved.
$anacb_uid        = wp_unique_id( 'aac-card-' );
$anacb_heading_id = $anacb_uid . '-h';
$anacb_text_id    = $anacb_uid . '-t';
$anacb_label_ids  = array();
if ( '' !== $anacb_heading ) {
	$anacb_label_ids[] = $anacb_heading_id;
}
if ( '' !== $anacb_text ) {
	$anacb_label_ids[] = $anacb_text_id;
}
$anacb_labelledby = $anacb_label_ids
	? ' aria-labelledby="' . esc_attr( implode( ' ', $anacb_label_ids ) ) . '"'
	: '';
?>
<li <?php echo $anacb_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?> tabindex="-1"<?php echo $anacb_labelledby; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- ids escaped above. ?>>
	<?php if ( $anacb_img_url ) : ?>
		<img
			class="aac-scroller__media"
			src="<?php echo esc_url( $anacb_img_url ); ?>"
			alt="<?php echo $anacb_decorative ? '' : esc_attr( $anacb_img_alt ); ?>"
			<?php echo $anacb_decorative ? 'role="presentation"' : ''; ?>
			loading="lazy"
			decoding="async"
		/>
	<?php else : ?>
		<span class="aac-scroller__media aac-scroller__media--placeholder" aria-hidden="true"></span>
	<?php endif; ?>

	<div class="aac-scroller__body">
		<?php if ( '' !== $anacb_heading ) : ?>
			<<?php echo esc_attr( $anacb_tag ); ?> class="aac-scroller__heading" id="<?php echo esc_attr( $anacb_heading_id ); ?>"<?php echo '' !== $anacb_heading_style ? ' style="' . esc_attr( $anacb_heading_style ) . '"' : ''; ?>><?php echo esc_html( $anacb_heading ); ?></<?php echo esc_attr( $anacb_tag ); ?>>
		<?php endif; ?>

		<?php if ( '' !== $anacb_text ) : ?>
			<p class="aac-scroller__text" id="<?php echo esc_attr( $anacb_text_id ); ?>"><?php echo esc_html( $anacb_text ); ?></p>
		<?php endif; ?>

		<?php if ( $anacb_has_link ) : ?>
			<a class="<?php echo esc_attr( $anacb_link_class ); ?>" href="<?php echo esc_url( $anacb_link_url ); ?>"<?php echo '' !== $anacb_link_style ? ' style="' . esc_attr( $anacb_link_style ) . '"' : ''; ?>>
				<?php echo esc_html( $anacb_link_text ); ?>
				<?php if ( '' !== $anacb_heading ) : ?>
					<span class="aac-visually-hidden"><?php echo esc_html( ' – ' . $anacb_heading ); ?></span>
				<?php endif; ?>
				<span class="aac-scroller__arrow" aria-hidden="true">&rarr;</span>
			</a>
		<?php endif; ?>
	</div>
</li>
