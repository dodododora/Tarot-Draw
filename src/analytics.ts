/**
 * GA4 event tracking helper.
 * Safe to call server-side (returns early if gtag is not available).
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', eventName, params);
}
