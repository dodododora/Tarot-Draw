/**
 * analytics.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Comprehensive GA4 event tracking with user properties, engagement metrics,
 * timing, funnel tracking, and session intelligence.
 */

// ─── Core Helper ─────────────────────────────────────────────────────────────

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', eventName, params);
}

// ─── User Properties (set once per session, persist across events) ───────────

let _userPropsSet = false;

export function setUserProperties(props: {
  preferred_system?: string;
  preferred_theme?: string;
  preferred_lang?: string;
  history_count?: number;
  custom_spread_count?: number;
  returning_user?: boolean;
}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  if (_userPropsSet) return; // Only set once per session
  _userPropsSet = true;

  window.gtag('set', 'user_properties', {
    preferred_system: props.preferred_system,
    preferred_theme: props.preferred_theme,
    preferred_lang: props.preferred_lang,
    history_count_bucket: bucketize(props.history_count ?? 0, [0, 1, 5, 10, 25, 50, 100]),
    custom_spread_count: props.custom_spread_count ?? 0,
    is_returning_user: props.returning_user ? 'yes' : 'no',
  });
}

// ─── Session Start Intelligence ──────────────────────────────────────────────

let _sessionTracked = false;

export function trackSessionStart() {
  if (_sessionTracked) return;
  _sessionTracked = true;

  // Device & viewport
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const deviceCategory = vw < 768 ? 'mobile' : vw < 1024 ? 'tablet' : 'desktop';

  trackEvent('session_context', {
    viewport_width: vw,
    viewport_height: vh,
    device_pixel_ratio: Math.round(dpr * 10) / 10,
    device_category: deviceCategory,
    is_touch_device: isTouchDevice,
    is_pwa: isStandalone,
    screen_orientation: vw > vh ? 'landscape' : 'portrait',
    connection_type: (navigator as any).connection?.effectiveType ?? 'unknown',
    platform: navigator.platform ?? 'unknown',
  });

  // Entry point / referrer
  const ref = document.referrer;
  if (ref) {
    try {
      const refHost = new URL(ref).hostname;
      trackEvent('traffic_source', {
        referrer_host: refHost,
        referrer_full: ref.substring(0, 500),
        is_organic: refHost.includes('google') || refHost.includes('bing') || refHost.includes('yahoo') || refHost.includes('baidu'),
      });
    } catch { /* ignore */ }
  }

  // UTM params
  const params = new URLSearchParams(window.location.search);
  const utm_source = params.get('utm_source');
  if (utm_source) {
    trackEvent('utm_captured', {
      utm_source: utm_source,
      utm_medium: params.get('utm_medium') ?? '',
      utm_campaign: params.get('utm_campaign') ?? '',
      utm_content: params.get('utm_content') ?? '',
    });
  }
}

// ─── Performance Tracking ────────────────────────────────────────────────────

let _perfTracked = false;

export function trackPerformance() {
  if (_perfTracked) return;

  // Wait for page to fully load
  if (document.readyState !== 'complete') {
    window.addEventListener('load', () => setTimeout(trackPerformance, 100), { once: true });
    return;
  }
  _perfTracked = true;

  try {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!nav) return;

    trackEvent('page_performance', {
      dns_ms: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
      tcp_ms: Math.round(nav.connectEnd - nav.connectStart),
      ttfb_ms: Math.round(nav.responseStart - nav.requestStart),
      dom_interactive_ms: Math.round(nav.domInteractive - nav.startTime),
      dom_complete_ms: Math.round(nav.domComplete - nav.startTime),
      load_complete_ms: Math.round(nav.loadEventEnd - nav.startTime),
      transfer_size_kb: Math.round(nav.transferSize / 1024),
    });
  } catch { /* old browser */ }

  // Core Web Vitals via PerformanceObserver
  try {
    // LCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      trackEvent('web_vital_lcp', { value_ms: Math.round(last.startTime) });
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // FID
    new PerformanceObserver((list) => {
      const entry = list.getEntries()[0] as any;
      trackEvent('web_vital_fid', { value_ms: Math.round(entry.processingStart - entry.startTime) });
    }).observe({ type: 'first-input', buffered: true });

    // CLS
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) clsValue += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });

    // Report CLS on page hide
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        trackEvent('web_vital_cls', { value: Math.round(clsValue * 1000) / 1000 });
      }
    }, { once: true });
  } catch { /* old browser */ }
}

// ─── Engagement / Time on Page ───────────────────────────────────────────────

let _engagementStart = Date.now();
let _totalEngagedMs = 0;
let _isVisible = true;

export function initEngagementTracking() {
  _engagementStart = Date.now();

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      _totalEngagedMs += Date.now() - _engagementStart;
      _isVisible = false;
    } else {
      _engagementStart = Date.now();
      _isVisible = true;
    }
  });

  // Report on page unload
  window.addEventListener('pagehide', () => {
    if (_isVisible) _totalEngagedMs += Date.now() - _engagementStart;
    const totalSec = Math.round(_totalEngagedMs / 1000);
    if (totalSec > 0) {
      trackEvent('engaged_time', {
        total_seconds: totalSec,
        bucket: bucketize(totalSec, [0, 10, 30, 60, 120, 300, 600]),
      });
    }
  });
}

// ─── Scroll Depth Tracking ───────────────────────────────────────────────────

const _scrollMilestones = new Set<number>();

export function initScrollTracking() {
  const milestones = [25, 50, 75, 90, 100];

  window.addEventListener('scroll', () => {
    const scrollH = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollH <= 0) return;
    const pct = Math.round((window.scrollY / scrollH) * 100);

    for (const m of milestones) {
      if (pct >= m && !_scrollMilestones.has(m)) {
        _scrollMilestones.add(m);
        trackEvent('scroll_depth', { percent: m });
      }
    }
  }, { passive: true });
}

// ─── Funnel Tracking ─────────────────────────────────────────────────────────

const _funnelSteps = new Set<string>();

export function trackFunnelStep(step: string, params?: Record<string, string | number | boolean>) {
  if (_funnelSteps.has(step)) return; // Don't double-count
  _funnelSteps.add(step);

  trackEvent('funnel_step', {
    step_name: step,
    step_index: FUNNEL_ORDER.indexOf(step),
    steps_completed: _funnelSteps.size,
    ...params,
  });
}

const FUNNEL_ORDER = [
  'page_load',           // 1. Landed on the page
  'select_system',       // 2. Chose a tarot system
  'select_spread',       // 3. Picked a spread
  'enter_question',      // 4. Typed a question
  'initiate_draw',       // 5. Hit draw / manual submit
  'view_result',         // 6. Saw the result
  'copy_prompt',         // 7. Copied AI prompt (primary conversion)
  'open_ai_model',       // 8. Clicked through to AI
  'share_or_save',       // 9. Downloaded share image
];

// ─── Timing Helper (measure how long operations take) ────────────────────────

const _timers = new Map<string, number>();

export function startTimer(name: string) {
  _timers.set(name, performance.now());
}

export function endTimer(name: string, extraParams?: Record<string, string | number>) {
  const start = _timers.get(name);
  if (start === undefined) return;
  _timers.delete(name);
  const ms = Math.round(performance.now() - start);

  trackEvent('timing', {
    timing_name: name,
    duration_ms: ms,
    ...extraParams,
  });
}

// ─── Error Tracking ──────────────────────────────────────────────────────────

export function initErrorTracking() {
  window.addEventListener('error', (e) => {
    trackEvent('js_error', {
      error_message: (e.message ?? '').substring(0, 200),
      error_source: (e.filename ?? '').substring(0, 200),
      error_line: e.lineno ?? 0,
    });
  });

  window.addEventListener('unhandledrejection', (e) => {
    trackEvent('promise_rejection', {
      error_message: String(e.reason).substring(0, 200),
    });
  });
}

// ─── Feature Usage Heatmap ───────────────────────────────────────────────────

const _featureUsage = new Map<string, number>();

export function trackFeatureUse(feature: string) {
  const count = (_featureUsage.get(feature) ?? 0) + 1;
  _featureUsage.set(feature, count);
  
  // Only fire event on 1st, 3rd, 10th use (avoid event spam)
  if (count === 1 || count === 3 || count === 10) {
    trackEvent('feature_use', {
      feature_name: feature,
      use_count: count,
    });
  }
}

// ─── Card Interaction Tracking ───────────────────────────────────────────────

export function trackCardInteraction(params: {
  action: 'flip' | 'tap' | 'long_press';
  card_name: string;
  card_index: number;
  is_reversed: boolean;
  system: string;
}) {
  trackEvent('card_interaction', params);
}

// ─── Rage Click Detection ────────────────────────────────────────────────────

let _clickTimes: number[] = [];

export function initRageClickDetection() {
  document.addEventListener('click', (e) => {
    const now = Date.now();
    _clickTimes.push(now);
    _clickTimes = _clickTimes.filter(t => now - t < 2000);

    if (_clickTimes.length >= 4) {
      const target = e.target as HTMLElement;
      trackEvent('rage_click', {
        element_tag: target.tagName,
        element_class: (target.className ?? '').substring(0, 100),
        element_text: (target.textContent ?? '').substring(0, 50),
        click_count: _clickTimes.length,
      });
      _clickTimes = []; // Reset
    }
  });
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function bucketize(value: number, thresholds: number[]): string {
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (value >= thresholds[i]) {
      const next = thresholds[i + 1];
      return next ? `${thresholds[i]}-${next - 1}` : `${thresholds[i]}+`;
    }
  }
  return '0';
}

// ─── Init All (call once in App mount) ───────────────────────────────────────

export function initAnalytics() {
  trackSessionStart();
  trackPerformance();
  initEngagementTracking();
  initScrollTracking();
  initErrorTracking();
  initRageClickDetection();
  trackFunnelStep('page_load');
}
