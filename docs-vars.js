// Fills the placeholder tokens in code (see "Placeholders" in README.md) with
// the signed-in reader's own values, so a copied command runs as is. Mintlify's
// copy button copies the rendered text, so it copies the filled values too.
// A token stays as written when the reader is signed out, the request fails,
// or the portal doesn't vouch for the value.
(function () {
  // Mirrors PORTAL_URL_BY_HOST in portal-user.js.
  var PORTAL_URL_BY_HOST = {
    'website.staging.env.datum.net': 'https://cloud.staging.env.datum.net/',
  };
  var portal = new URL(PORTAL_URL_BY_HOST[location.hostname] || 'https://cloud.datum.net/');

  var VAR_CLASS = 'datum-var';
  var BAR_ID = 'datum-vars-bar';
  // The bar names the org and project, so it shows only on pages that use them.
  var BAR_VARS_SELECTOR =
    '#content-area .datum-var[data-token="your-org-id"], #content-area .datum-var[data-token="your-project-id"]';
  // A whole token only: `your-project-id-2` is someone's own name, not a token.
  var TOKEN_PATTERN = /(?<![\w-])(your-org-id|your-project-id|your-email)(?![\w-])/g;
  // Milo resource names (Kubernetes DNS subdomains).
  var NAME_PATTERN = /^[a-z0-9]([a-z0-9.-]{0,251}[a-z0-9])?$/;
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+$/;

  // Shared with portal-user.js. Mintlify loads the two in no set order, so
  // whichever runs first starts the one request.
  if (!window.datumSessionStatus) {
    window.datumSessionStatus = fetch(new URL('/api/website/session-status', portal), {
      credentials: 'include',
      signal: AbortSignal.timeout(5000),
    })
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .catch(function () {
        // Origin not in WEBSITE_ORIGINS or portal unreachable: treat as signed out.
        return null;
      });
  }

  // Only `org.selected === true` fills the org. When the portal falls back to
  // the reader's first org, `selected` is false, and a portal older than
  // cloud-portal#1742 sends no `selected` at all: either way the org may not be
  // the one the reader works in, and a placeholder beats a wrong org.
  var valuesFrom = function (status) {
    var values = {};
    if (!status || !status.signedIn) return values;
    if (status.org && status.org.selected === true && NAME_PATTERN.test(status.org.name)) {
      values['your-org-id'] = status.org.name;
    }
    if (status.project && NAME_PATTERN.test(status.project.name)) {
      values['your-project-id'] = status.project.name;
    }
    if (status.user && EMAIL_PATTERN.test(status.user.email)) {
      values['your-email'] = status.user.email;
    }
    return values;
  };

  var showValues = true;

  var buildVar = function (token, value) {
    var span = document.createElement('span');
    span.className = VAR_CLASS;
    span.title = 'From your Datum Cloud account';
    span.dataset.token = token;
    span.dataset.value = value;
    span.textContent = showValues ? value : token;
    return span;
  };

  // Keeps the original text node in place (trimmed to the text before the
  // first token) and adds the rest after it, so React still finds the node it
  // rendered when it updates or removes the code block.
  var fillTextNode = function (node, values) {
    var text = node.nodeValue;
    var matches = [];
    var match;
    TOKEN_PATTERN.lastIndex = 0;
    while ((match = TOKEN_PATTERN.exec(text))) {
      if (values[match[1]]) matches.push(match);
    }
    if (!matches.length) return;

    node.nodeValue = text.slice(0, matches[0].index);
    var tail = node;
    matches.forEach(function (m, i) {
      var span = buildVar(m[1], values[m[1]]);
      tail.after(span);
      tail = span;
      var end = m.index + m[1].length;
      var next = i + 1 < matches.length ? matches[i + 1].index : text.length;
      if (next > end) {
        var rest = document.createTextNode(text.slice(end, next));
        tail.after(rest);
        tail = rest;
      }
    });
  };

  var fill = function (values) {
    document.querySelectorAll('code').forEach(function (code) {
      if (code.textContent.indexOf('your-') === -1) return;
      var walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
      var nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (node) {
        if (!node.parentElement.closest('.' + VAR_CLASS)) fillTextNode(node, values);
      });
    });
  };

  var setShowValues = function (show, button) {
    showValues = show;
    document.querySelectorAll('.' + VAR_CLASS).forEach(function (span) {
      span.textContent = show ? span.dataset.value : span.dataset.token;
    });
    button.textContent = show ? 'Show placeholders' : 'Show my values';
    button.setAttribute('aria-pressed', String(!show));
  };

  // "Examples use org X, project Y", with a toggle back to the placeholders.
  // Only with a project: without one, most commands keep a placeholder anyway.
  var buildBar = function (values) {
    var bar = document.createElement('div');
    bar.id = BAR_ID;
    bar.className = 'datum-vars-bar';
    var label = document.createElement('span');
    label.appendChild(document.createTextNode('Examples use '));
    if (values['your-org-id']) {
      label.appendChild(document.createTextNode('org '));
      label.appendChild(document.createElement('strong')).textContent = values['your-org-id'];
      label.appendChild(document.createTextNode(', '));
    }
    label.appendChild(document.createTextNode('project '));
    label.appendChild(document.createElement('strong')).textContent = values['your-project-id'];
    label.appendChild(document.createTextNode(' from your account.'));
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'datum-vars-toggle';
    button.addEventListener('click', function () {
      setShowValues(!showValues, button);
    });
    bar.appendChild(label);
    bar.appendChild(button);
    setShowValues(showValues, button);
    return bar;
  };

  window.datumSessionStatus.then(function (status) {
    var values = valuesFrom(status);
    if (!Object.keys(values).length) return;
    var bar = values['your-project-id'] ? buildBar(values) : null;

    // Mintlify renders code and swaps page content on client-side navigation,
    // so this runs on every DOM change. Filled tokens are skipped, and the bar
    // moves only when it isn't already under the page header, so a pass that
    // has nothing to do changes nothing.
    var apply = function () {
      fill(values);
      if (!bar) return;
      var header = document.getElementById('header');
      if (header && document.querySelector(BAR_VARS_SELECTOR)) {
        if (header.nextElementSibling !== bar) header.after(bar);
      } else if (bar.isConnected) {
        bar.remove();
      }
    };

    apply();
    new MutationObserver(apply).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });
})();
