// Signed-in cloud-portal user in the docs navbar, mirroring loadPortalUser in
// datum.net's Nav.astro: adds a user menu at the top right of the navbar on
// desktop and before the search icon on mobile. Everyone else gets datum.net's
// "Start for free" link in the desktop spot only. Mintlify loads every .js file in this
// repo on every docs page. The session-status request only succeeds when docs
// are served from an origin in cloud-portal's WEBSITE_ORIGINS (www.datum.net/docs
// via the datum.net proxy), not from localhost or *.mintlify.dev.
(function () {
  // Desktop: the menu joins the navbar's right-hand group (links + theme
  // toggle, hidden below lg). Mobile: it leads the header icon group (hidden
  // from lg up).
  var NAVBAR_LINKS_SELECTOR = 'nav[aria-label="Main"]';
  var MOBILE_SEARCH_SELECTOR = '#search-bar-entry-mobile';
  var MENU_ID = 'portal-user-menu';
  var SIGNUP_URL = 'https://auth.datum.net/id/signup';

  // Mirrors PORTAL_URL_BY_HOST in datum.net's Nav.astro.
  var PORTAL_URL_BY_HOST = {
    'website.staging.env.datum.net': 'https://cloud.staging.env.datum.net/',
  };
  var portal = new URL(PORTAL_URL_BY_HOST[location.hostname] || 'https://cloud.datum.net/');

  // Lucide icons, same as the datum.net user menu.
  var ICONS = {
    'layout-grid':
      '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    folder:
      '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
    user: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  };

  // datum.net's hand-drawn arrow (src/static/assets/svgs/arrow-right.svg).
  var ARROW_RIGHT =
    '<svg width="16" height="14" viewBox="0 0 24 20" fill="currentColor" aria-hidden="true"><path d="M12.6862 0.407931C12.5404 0.610886 12.3946 0.822217 12.3599 0.860147C11.5656 1.7232 11.5398 1.87886 12.2349 2.65719C12.9435 3.45078 13.8886 4.12763 14.6789 4.85225C14.9021 5.07393 15.4971 5.59117 15.4971 5.59117C15.7202 5.88673 16.0177 6.10841 16.3152 6.33008C16.4639 6.47787 16.7614 6.69954 16.7614 6.69954C17.0391 6.99708 17.3173 7.27836 17.5954 7.56506C15.8129 7.52171 14.1444 8.09018 12.3936 8.00545C10.1356 7.89609 7.89388 7.88131 5.63335 7.91431C4.34715 7.93303 2.91467 7.56555 1.66417 7.99609C0.369037 8.4419 -0.496696 10.0542 0.315487 11.3473C0.788517 12.0971 2.51403 11.5335 3.1735 11.4508C4.19493 11.3222 5.0086 11.5685 6.01069 11.6384C8.94208 11.8434 12.1204 11.6419 15.0513 11.4286C16.0519 11.3291 17.0183 11.3601 17.9743 11.3483C17.7685 11.6207 17.5627 11.8892 17.357 12.0936C16.9851 12.4631 16.1669 13.1281 16.1669 13.202C16.0182 13.3498 15.6463 13.6453 15.6463 13.6453C14.4563 14.6059 13.2663 15.5665 12.0763 16.5271C11.8531 16.7488 11.5556 16.9704 11.4069 17.266C11.3325 17.4138 11.2581 17.7094 11.2581 17.7094L11.3524 17.498C11.1912 18.07 11.4153 18.6296 11.936 18.9522C11.9335 18.9567 11.9295 18.9611 11.9275 18.9655C11.9275 19.1133 11.9275 19.4089 11.9275 19.4089L11.9548 19.3C11.9652 19.6729 12.225 20 12.7457 20C13.0432 19.9261 13.4894 19.5566 13.6382 19.4089C13.7125 19.335 13.8613 19.1133 13.9357 19.1133C14.605 19.0394 15.4232 18.1527 15.9438 17.7094C16.0926 17.5616 16.3157 17.4877 16.4644 17.266C16.5388 17.1921 16.7619 16.8966 16.7619 16.8966C17.1338 16.601 17.4313 16.3054 17.7288 15.936C17.8032 15.8621 18.0263 15.7143 18.0263 15.7143C18.6957 15.1971 19.5882 14.6798 20.1832 14.0887C20.4807 13.7192 20.8526 13.3498 21.1501 13.0542C21.3732 12.8325 21.6707 12.4631 21.6707 12.4631C22.1616 11.9754 22.5861 11.4833 23.007 10.8719C23.5941 10.9734 24.2526 10.6315 23.902 9.87687C23.4558 9.06407 22.2658 8.32515 21.5964 7.80791C19.6626 6.10841 17.8032 4.26112 15.7951 2.63551C15.2834 2.22123 13.6456 -0.159062 13.0119 0.00842551C12.9723 0.0182777 12.8295 0.208917 12.6862 0.407931Z"/></svg>';

  var el = function (tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  var menuItem = function (href, label, icon) {
    var link = el('a', 'portal-user-menu-item');
    link.href = href;
    if (icon) {
      link.insertAdjacentHTML(
        'beforeend',
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          ICONS[icon] +
          '</svg>'
      );
    }
    link.appendChild(document.createTextNode(label));
    return link;
  };

  // Same items as datum.net: "Get started" only when the dashboard is not the
  // projects page (i.e. onboarding for new users).
  var buildMenuItems = function (status, dashboardUrl) {
    var projectsUrl = status.org
      ? new URL('/org/' + encodeURIComponent(status.org.name) + '/projects', portal).href
      : null;
    var main = el('div', 'portal-user-menu-group');
    if (dashboardUrl && dashboardUrl !== projectsUrl) {
      main.appendChild(menuItem(dashboardUrl, 'Get started', 'layout-grid'));
    }
    if (projectsUrl) main.appendChild(menuItem(projectsUrl, 'Projects', 'folder'));
    main.appendChild(
      menuItem(new URL('/account/general', portal).href, 'Account Settings', 'user')
    );
    var signOut = el('div', 'portal-user-menu-group');
    signOut.appendChild(menuItem(new URL('/logout', portal).href, 'Sign out'));
    return [main, signOut];
  };

  var buildUserMenu = function (status, dashboardUrl, id) {
    var root = el('div', 'portal-user');
    root.id = id;

    var trigger = el('button', 'portal-user-trigger');
    trigger.type = 'button';
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', id + '-panel');
    var avatarUrl = status.user.avatarUrl;
    if (avatarUrl && avatarUrl.indexOf('https://') === 0) {
      var avatar = el('img', 'portal-user-avatar');
      avatar.src = avatarUrl;
      avatar.alt = '';
      avatar.referrerPolicy = 'no-referrer';
      trigger.appendChild(avatar);
    }
    trigger.appendChild(el('span', 'portal-user-name', status.user.displayName));

    var panel = el('div', 'portal-user-menu');
    panel.id = id + '-panel';
    panel.hidden = true;
    var header = el('div', 'portal-user-menu-header');
    header.appendChild(el('span', 'portal-user-menu-name', status.user.displayName));
    header.appendChild(el('span', 'portal-user-menu-email', status.user.email || ''));
    panel.appendChild(header);
    buildMenuItems(status, dashboardUrl).forEach(function (group) {
      panel.appendChild(group);
    });

    var setOpen = function (open) {
      panel.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
    };
    trigger.addEventListener('click', function () {
      setOpen(panel.hidden);
    });
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !root.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) {
        setOpen(false);
        trigger.focus();
      }
    });

    root.appendChild(trigger);
    root.appendChild(panel);
    return root;
  };

  // Same link as datum.net's desktop nav.
  var buildSignupLink = function () {
    var link = el('a', 'portal-signup', 'Start for free');
    link.href = SIGNUP_URL;
    link.target = '_blank';
    link.rel = 'noopener';
    link.insertAdjacentHTML('beforeend', ARROW_RIGHT);
    return link;
  };

  // Mintlify re-renders the navbar on client-side navigation, dropping nodes it
  // doesn't own, so this runs on every DOM change. Both steps are no-ops once
  // applied.
  var apply = function (nodes) {
    var links = document.querySelector(NAVBAR_LINKS_SELECTOR);
    if (links && !nodes.desktop.isConnected) links.parentElement.appendChild(nodes.desktop);
    var search = document.querySelector(MOBILE_SEARCH_SELECTOR);
    if (nodes.mobile && search && !nodes.mobile.isConnected) search.before(nodes.mobile);
  };

  var mount = function (nodes) {
    apply(nodes);
    new MutationObserver(function () {
      apply(nodes);
    }).observe(document.body, { childList: true, subtree: true });
  };

  fetch(new URL('/api/website/session-status', portal), {
    credentials: 'include',
    signal: AbortSignal.timeout(5000),
  })
    .then(function (res) {
      return res.ok ? res.json() : null;
    })
    .catch(function () {
      // Origin not in WEBSITE_ORIGINS or portal unreachable: treat as signed out.
      return null;
    })
    .then(function (status) {
      if (!status || !status.signedIn) {
        mount({ desktop: buildSignupLink() });
        return;
      }

      // Only follow dashboard links that stay on the portal.
      var dashboardUrl = status.dashboardUrl ? new URL(status.dashboardUrl, portal) : null;
      var safeDashboardUrl =
        dashboardUrl && dashboardUrl.origin === portal.origin ? dashboardUrl.href : null;

      mount({
        desktop: buildUserMenu(status, safeDashboardUrl, MENU_ID),
        mobile: buildUserMenu(status, safeDashboardUrl, MENU_ID + '-mobile'),
      });
    });
})();
