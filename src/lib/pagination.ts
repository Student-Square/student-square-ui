/**
 * Page sizes, in one place.
 *
 * They had drifted to seven different numbers — 6, 9, 12, 15, 20, 25 and 50 —
 * decided one page at a time, so the same account could see twelve donations,
 * fifteen payment attempts and fifty ledger rows without anything explaining
 * why. These three constants are the whole vocabulary; change a number here
 * and every surface of that kind follows.
 *
 * The split is by shape, not by module: a dense table and a grid of image
 * cards genuinely want different counts, and forcing one number on both makes
 * the grid ragged or the table stubby.
 */

/** Dense admin and dashboard tables — users, donations, ledgers, audit. */
export const TABLE_PAGE_SIZE = 20;

/** Admin card grids — events, magazines, reports, stories. */
export const CARD_PAGE_SIZE = 12;

/** Public-facing article and story grids. */
export const PUBLIC_PAGE_SIZE = 9;

/** The choices behind every "Per page" control. */
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
