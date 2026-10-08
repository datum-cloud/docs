// Points the navbar "Dashboard" button (docs.json navbar.links) at the signed-in
// user's cloud-portal dashboard, mirroring loadPortalUser in datum.net's
// Nav.astro. Mintlify loads every .js file in this repo on every docs page.
// The session-status request only succeeds when docs are served from an origin
// in cloud-portal's WEBSITE_ORIGINS (www.datum.net/docs via the datum.net
// proxy), not from localhost or *.mintlify.dev; there the link stays as is.
(function () {
  // Must match the Dashboard href in docs.json.
  var DASHBOARD_LINK_SELECTOR = 'a[href="https://cloud.datum.net"]';

  // Mirrors PORTAL_URL_BY_HOST in datum.net's Nav.astro.
  var PORTAL_URL_BY_HOST = {
    'website.staging.env.datum.net': 'https://cloud.staging.env.datum.net/',
  };
  var portal = new URL(PORTAL_URL_BY_HOST[location.hostname] || 'https://cloud.datum.net/');

  var applyDashboardUrl = function (dashboardUrl) {
    document.querySelectorAll(DASHBOARD_LINK_SELECTOR).forEach(function (link) {
      link.href = dashboardUrl;
    });
  };

  fetch(new URL('/api/website/session-status', portal), {
    credentials: 'include',
    signal: AbortSignal.timeout(5000),
  })
    .then(function (res) {
      return res.ok ? res.json() : null;
    })
    .then(function (status) {
      if (!status || !status.signedIn || !status.dashboardUrl) return;

      // Only follow dashboard links that stay on the portal.
      var dashboardUrl = new URL(status.dashboardUrl, portal);
      if (dashboardUrl.origin !== portal.origin) return;

      applyDashboardUrl(dashboardUrl.href);
      // Mintlify re-renders the navbar on client-side navigation (and renders
      // the mobile menu on open), restoring the docs.json href.
      new MutationObserver(function () {
        applyDashboardUrl(dashboardUrl.href);
      }).observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['href'],
      });
    })
    .catch(function () {
      // Origin not in WEBSITE_ORIGINS or portal unreachable; keep the default link.
    });
})();
