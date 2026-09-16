/**
 * The navbar's height, defined once.
 *
 * `Header` is `fixed`, so it takes up no space in the document flow — every
 * page whose content starts directly beneath it has to reserve that height
 * itself. The two strings below must describe the same size at every
 * breakpoint, which is why they live next to each other.
 *
 * They had already drifted: the offset stopped at `lg` while the header kept
 * growing at `2xl` and above, so on wide screens the page banner tucked up
 * underneath the navbar.
 */

/** Applied to the header's inner row — the element that sets its real height. */
export const NAVBAR_HEIGHT = "h-12 sm:h-14 lg:h-16 2xl:h-20 3xl:h-24 4xl:h-28";

/** Applied to whatever a page renders first, to clear the fixed header. */
export const NAVBAR_OFFSET = "mt-12 sm:mt-14 lg:mt-16 2xl:mt-20 3xl:mt-24 4xl:mt-28";

/**
 * Padding equivalent of NAVBAR_OFFSET.
 *
 * Use this when a section has its own background that should run full-bleed
 * behind the transparent navbar while only its *content* clears the header.
 * NAVBAR_OFFSET moves the background down too, which leaves a bare strip.
 */
export const NAVBAR_PAD_TOP = "pt-12 sm:pt-14 lg:pt-16 2xl:pt-20 3xl:pt-24 4xl:pt-28";

/**
 * Scrim for a full-bleed hero that runs underneath the transparent navbar.
 *
 * Deliberately taller than the navbar: a gradient sized to exactly the navbar
 * leaves the links sitting in its faded tail, which washes them out over a
 * bright photo.
 */
export const HERO_TOP_SCRIM =
  "absolute inset-x-0 top-0 h-40 2xl:h-48 bg-gradient-to-b from-black/85 via-black/50 to-transparent";
