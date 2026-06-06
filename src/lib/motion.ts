/**
 * Shared Framer Motion presets.
 *
 * Spread a preset onto a `motion.*` element and override individual fields
 * as needed, e.g. to add a stagger delay:
 *
 *   <motion.div {...fadeInWhileInView} transition={{ duration: 0.5, delay: i * 0.1 }} />
 */

/** Fades/slides in once when scrolled into view. Used for page content blocks. */
export const fadeInWhileInView = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
} as const;

/** Fades/slides in on mount. Used for hero headings and above-the-fold content. */
export const fadeInOnMount = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
} as const;
