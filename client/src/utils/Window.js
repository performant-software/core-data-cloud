// @flow

/**
 * Scrolls to the top of the current window.
 */
const scrollToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

export default {
  scrollToTop
};
