// TEST ONLY: logs the cloud-portal session-status response on /docs.
// Mintlify loads every .js file in this repo on every docs page. The request
// only succeeds when docs are served from an origin in cloud-portal's
// WEBSITE_ORIGINS (e.g. https://www.datum.net/docs via the datum.net proxy),
// not from localhost or the *.mintlify.dev domain.
(function () {
  // Mirrors PORTAL_URL_BY_HOST in datum.net's Nav.astro.
  var PORTAL_URL_BY_HOST = {
    'website.staging.env.datum.net': 'https://cloud.staging.env.datum.net/',
  };
  var portal = PORTAL_URL_BY_HOST[location.hostname] || 'https://cloud.datum.net/';
  var url = new URL('/api/website/session-status', portal).href;

  fetch(url, { credentials: 'include', signal: AbortSignal.timeout(5000) })
    .then(function (res) {
      console.log('[portal-session-test]', location.origin, '->', url, 'HTTP', res.status);
      return res.json();
    })
    .then(function (status) {
      console.log('[portal-session-test] session-status:', status);
    })
    .catch(function (err) {
      // CORS rejections (origin not in WEBSITE_ORIGINS) land here as a TypeError.
      console.error('[portal-session-test] failed:', err);
    });
})();
