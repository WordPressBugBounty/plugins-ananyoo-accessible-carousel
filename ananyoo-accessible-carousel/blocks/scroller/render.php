<?php
/**
 * Server-side render for the anacb/scroller block.
 *
 * Emits a labelled region containing a native horizontal scroll container
 * (CSS scroll-snap) wrapping a <ul> list of cards. The scroll container is
 * keyboard-focusable and scrollable on its own, so it works with no
 * JavaScript. Optional previous/next buttons are injected by scroller-view.js
 * (only when the cards actually overflow), so no-JS visitors never see dead
 * controls. Nothing is hidden from assistive tech, so there is no
 * focusable-but-hidden trap — the common multi-slide carousel failure.
 *
 * @package AnanyooAccessibleCarousel
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Rendered inner cards.
 * @var WP_Block $block      Block instance.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$anacb_label = ! empty( $attributes['label'] ) ? $attributes['label'] : __( 'Card scroller', 'ananyoo-accessible-carousel' );

// Cards per view on desktop. Constrained to a sane 1–6; tablet/mobile are
// stepped down to 2 then 1 by CSS, so only this desktop value is needed.
$anacb_per_view = isset( $attributes['perView'] ) ? absint( $attributes['perView'] ) : 3;
if ( $anacb_per_view < 1 ) {
	$anacb_per_view = 1;
}
if ( $anacb_per_view > 6 ) {
	$anacb_per_view = 6;
}

// Gap between cards in pixels. Constrained to 0–80.
$anacb_gap = isset( $attributes['gap'] ) ? absint( $attributes['gap'] ) : 24;
if ( $anacb_gap > 80 ) {
	$anacb_gap = 80;
}

$anacb_arrows = isset( $attributes['showArrows'] ) ? (bool) $attributes['showArrows'] : true;

// Per-view and gap drive the card width via a single CSS calc(); breakpoints
// just reassign --aac-per-view. See scroller.css.
$anacb_vp_style = sprintf( '--aac-per-view:%d;--aac-gap:%dpx;', $anacb_per_view, $anacb_gap );

$anacb_wrapper = get_block_wrapper_attributes(
	array(
		'class'       => 'aac-scroller',
		'data-aac-scroller' => '',
		'data-arrows' => $anacb_arrows ? 'true' : 'false',
	)
);

// Accessible name + hint for the scroll region itself.
$anacb_vp_label = sprintf(
	/* translators: %s: the scroller's accessible label. */
	__( '%s. Use the left and right arrow keys to scroll.', 'ananyoo-accessible-carousel' ),
	$anacb_label
);
?>
<section <?php echo $anacb_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?> aria-label="<?php echo esc_attr( $anacb_label ); ?>">
	<div class="aac-scroller__viewport" tabindex="0" role="group" aria-label="<?php echo esc_attr( $anacb_vp_label ); ?>" style="<?php echo esc_attr( $anacb_vp_style ); ?>">
		<ul class="aac-scroller__track">
			<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- inner cards rendered and escaped by their own render.php. ?>
		</ul>
	</div>
</section>
