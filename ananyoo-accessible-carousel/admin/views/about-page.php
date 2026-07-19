<?php
/**
 * Admin "About / How to use" page for Ananyoo Accessible Carousel.
 *
 * This is a block plugin, so there are no global settings — the blocks are
 * configured per-instance in the editor. This page exists for discoverability
 * and help: it tells users which blocks the plugin provides, how to insert
 * them, and what makes them accessible.
 *
 * @package AnanyooAccessibleCarousel
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$anacb_demo_url    = 'https://showcase.ananyoo.com/accessible-carousel/';
$anacb_home_url    = 'https://ananyoo.com/ananyoo-accessible-carousel-block-plugin/';
$anacb_ananyoo_url = 'https://ananyoo.com';
$anacb_support_url = 'https://wordpress.org/support/plugin/ananyoo-accessible-carousel/';
?>
<div class="wrap anacb-wrap">

	<?php // WordPress inserts admin notices right after this marker, so they appear above the header instead of inside it. ?>
	<hr class="wp-header-end" style="display:none;">

	<header class="anacb-header" role="banner">
		<h1 class="anacb-title">
			<img src="<?php echo esc_url( ANACB_URL . 'assets/ananyoo-logo.jpg' ); ?>"
			     alt="<?php esc_attr_e( 'Ananyoo — Accessibility Ready Themes', 'ananyoo-accessible-carousel' ); ?>"
			     class="anacb-title__logo"
			     width="156" height="68" />
			<span class="anacb-title__text">
				<?php esc_html_e( 'Accessible Carousel &amp; Slider', 'ananyoo-accessible-carousel' ); ?>
			</span>
			<span class="anacb-version" aria-label="<?php esc_attr_e( 'Plugin version', 'ananyoo-accessible-carousel' ); ?>">
				v<?php echo esc_html( ANACB_VERSION ); ?>
			</span>
		</h1>
		<p class="anacb-subtitle">
			<?php esc_html_e( 'WCAG 2.2 AA carousel, slider and card-scroller blocks for WordPress — keyboard and screen-reader friendly, with a pause control and no autoplay.', 'ananyoo-accessible-carousel' ); ?>
			<br>
			<?php
			printf(
				/* translators: %1$s: opening anchor, %2$s: closing anchor */
				esc_html__( 'Built by Shivaji Mitra at %1$sAnanyoo%2$s, Kolkata, India.', 'ananyoo-accessible-carousel' ),
				'<a href="' . esc_url( $anacb_ananyoo_url ) . '" target="_blank" rel="noopener noreferrer">',
				'</a>'
			);
			?>
		</p>
	</header>

	<div class="anacb-actions">
		<a class="anacb-btn" href="<?php echo esc_url( $anacb_demo_url ); ?>" target="_blank" rel="noopener noreferrer">
			<?php esc_html_e( 'View the live demo', 'ananyoo-accessible-carousel' ); ?>
		</a>
		<a class="anacb-btn anacb-btn--secondary" href="<?php echo esc_url( $anacb_home_url ); ?>" target="_blank" rel="noopener noreferrer">
			<?php esc_html_e( 'Documentation', 'ananyoo-accessible-carousel' ); ?>
		</a>
	</div>

	<div class="anacb-grid">

		<section class="anacb-card" aria-labelledby="anacb-c-blocks">
			<h2 id="anacb-c-blocks"><?php esc_html_e( 'Blocks included', 'ananyoo-accessible-carousel' ); ?></h2>
			<p class="anacb-muted">
				<?php
				printf(
					/* translators: %s: the block category name shown in the editor inserter. */
					esc_html__( 'In the block editor, open the inserter (the + button) and look under the %s category, or type "/" and the block name.', 'ananyoo-accessible-carousel' ),
					'<strong>' . esc_html__( 'Ananyoo Accessible Blocks', 'ananyoo-accessible-carousel' ) . '</strong>' // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above.
				);
				?>
			</p>
			<ul>
				<li><span class="anacb-block-name"><?php esc_html_e( 'Accessible Carousel', 'ananyoo-accessible-carousel' ); ?></span> — <?php esc_html_e( 'one slide at a time, with Previous / Next, slide dots and a pause control.', 'ananyoo-accessible-carousel' ); ?></li>
				<li><span class="anacb-block-name"><?php esc_html_e( 'Accessible Card Scroller', 'ananyoo-accessible-carousel' ); ?></span> — <?php esc_html_e( 'a horizontal row of cards that scrolls with the keyboard and Previous / Next buttons.', 'ananyoo-accessible-carousel' ); ?></li>
			</ul>
			<p class="anacb-muted">
				<?php esc_html_e( 'The Hero Slide and Scroller Card blocks are added inside these two as their items.', 'ananyoo-accessible-carousel' ); ?>
			</p>
		</section>

		<section class="anacb-card" aria-labelledby="anacb-c-how">
			<h2 id="anacb-c-how"><?php esc_html_e( 'How to add one', 'ananyoo-accessible-carousel' ); ?></h2>
			<ul>
				<li><?php esc_html_e( 'Edit any post or page.', 'ananyoo-accessible-carousel' ); ?></li>
				<li>
					<?php
					printf(
						/* translators: %s: a keyboard/slash-command hint. */
						esc_html__( 'Click the + inserter and search for "Accessible", or type %s in a new paragraph.', 'ananyoo-accessible-carousel' ),
						'<span class="anacb-kbd">/carousel</span>' // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static markup.
					);
					?>
				</li>
				<li><?php esc_html_e( 'Insert your slides or cards, then adjust options (cards per view, gap, arrows) in the block sidebar.', 'ananyoo-accessible-carousel' ); ?></li>
				<li><?php esc_html_e( 'Ready-made patterns are also available under the Patterns tab.', 'ananyoo-accessible-carousel' ); ?></li>
			</ul>
		</section>

		<section class="anacb-card" aria-labelledby="anacb-c-a11y">
			<h2 id="anacb-c-a11y"><?php esc_html_e( 'Accessibility built in', 'ananyoo-accessible-carousel' ); ?></h2>
			<ul>
				<li><?php esc_html_e( 'No autoplay; an explicit pause / play control where motion is used.', 'ananyoo-accessible-carousel' ); ?></li>
				<li><?php esc_html_e( 'Full keyboard operation with a logical focus order (Previous / Next reachable first).', 'ananyoo-accessible-carousel' ); ?></li>
				<li><?php esc_html_e( 'Screen-reader labels and a polite live region for slide changes.', 'ananyoo-accessible-carousel' ); ?></li>
				<li><?php esc_html_e( 'Non-visible slides are removed from the tab order, so there is no hidden focus trap.', 'ananyoo-accessible-carousel' ); ?></li>
				<li><?php esc_html_e( 'Honours the "reduce motion" setting and uses 44px minimum touch targets.', 'ananyoo-accessible-carousel' ); ?></li>
			</ul>
		</section>

		<section class="anacb-card" aria-labelledby="anacb-c-links">
			<h2 id="anacb-c-links"><?php esc_html_e( 'Help &amp; more', 'ananyoo-accessible-carousel' ); ?></h2>
			<ul>
				<li><a href="<?php echo esc_url( $anacb_demo_url ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Live demo', 'ananyoo-accessible-carousel' ); ?></a></li>
				<li><a href="<?php echo esc_url( $anacb_home_url ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Plugin home &amp; documentation', 'ananyoo-accessible-carousel' ); ?></a></li>
				<li><a href="<?php echo esc_url( $anacb_support_url ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Support forum', 'ananyoo-accessible-carousel' ); ?></a></li>
				<li><a href="<?php echo esc_url( $anacb_ananyoo_url ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'More accessibility work from Ananyoo', 'ananyoo-accessible-carousel' ); ?></a></li>
			</ul>
		</section>

	</div>
</div>
