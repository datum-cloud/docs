// Marks the placeholder tokens in code (see "Placeholders" in README.md) for a
// signed-in reader. The token stays as written; hovering it opens a card with
// the reader's own value and buttons to copy that value or, in a code block,
// the whole block with every token filled in. Tokens aren't marked when the
// reader is signed out, the request fails, or the portal doesn't vouch for
// the value.
(function () {
  // Mirrors PORTAL_URL_BY_HOST in portal-user.js.
  var PORTAL_URL_BY_HOST = {
    'website.staging.env.datum.net': 'https://cloud.staging.env.datum.net/',
  };
  var portal = new URL(PORTAL_URL_BY_HOST[location.hostname] || 'https://cloud.datum.net/');

  var VAR_CLASS = 'datum-var';
  // A whole token only: `your-project-id-2` is someone's own name, not a token.
  var TOKEN_PATTERN = /(?<![\w-])(your-org-id|your-project-id|your-email)(?![\w-])/g;
  // Milo resource names (Kubernetes DNS subdomains).
  var NAME_PATTERN = /^[a-z0-9]([a-z0-9.-]{0,251}[a-z0-9])?$/;
  // Narrower than RFC 5322 on purpose: the email lands unquoted in copied shell
  // commands, so it must not carry ; $ ` | & ( ) or quotes.
  var EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+$/;

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

  var TIP_ID = 'datum-var-tip';
  // Time to cross the gap from a value to its tooltip before it closes.
  var TIP_HIDE_DELAY_MS = 150;
  var TIP_GAP_PX = 8;
  var TIP_VIEWPORT_MARGIN_PX = 8;
  var COPIED_LABEL_MS = 1500;

  // Hover card for a token, after docs.stripe.com/api: which token it is,
  // the reader's value, then where to change it.
  var TIP_COPY = {
    'your-org-id': {
      label: 'Your organization',
      note: 'Switch organizations in the ',
      link: { path: '/', label: 'Cloud portal' },
    },
    'your-project-id': {
      label: 'Your project',
      note: "It's the last project you opened. Open another one in the ",
      link: { path: '/', label: 'Cloud portal' },
    },
    'your-email': {
      label: 'Your email',
      note: 'Manage your account in ',
      link: { path: '/account/general', label: 'Account Settings' },
    },
  };

  var buildVar = function (token, value) {
    var span = document.createElement('span');
    span.className = VAR_CLASS;
    span.tabIndex = 0;
    span.dataset.token = token;
    span.dataset.value = value;
    span.textContent = token;
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
      // The hover card names the token in a <code> too; that one stays plain.
      if (code.textContent.indexOf('your-') === -1 || code.closest('#' + TIP_ID)) return;
      var walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
      var nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (node) {
        if (!node.parentElement.closest('.' + VAR_CLASS)) fillTextNode(node, values);
      });
    });
  };

  // The code block's text with every token swapped for the reader's value.
  var filledCode = function (block, values) {
    var code = block.querySelector('code') || block;
    return code.textContent.replace(TOKEN_PATTERN, function (token) {
      return values[token] || token;
    });
  };

  var buildCopyButton = function (label, getText) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'datum-var-tip-copy';
    button.textContent = label;
    var timer = null;
    var flash = function (text) {
      button.textContent = text;
      clearTimeout(timer);
      timer = setTimeout(function () {
        button.textContent = label;
      }, COPIED_LABEL_MS);
    };
    button.addEventListener('click', function () {
      navigator.clipboard.writeText(getText()).then(
        function () {
          flash('Copied');
        },
        function () {
          flash('Copy failed');
        }
      );
    });
    return button;
  };

  var tipPart = function (tag, className) {
    var el = document.createElement(tag);
    el.className = 'datum-var-tip-' + className;
    return el;
  };

  // Header (which token), body (the reader's value and where to change it),
  // footer (copy buttons).
  var fillTip = function (tip, span, values) {
    var copy = TIP_COPY[span.dataset.token];

    var header = tipPart('div', 'header');
    header.appendChild(tipPart('span', 'kicker')).textContent = 'Placeholder';
    header.appendChild(tipPart('code', 'token')).textContent = span.dataset.token;

    var body = tipPart('div', 'body');
    body.appendChild(tipPart('p', 'label')).textContent = copy.label;
    body.appendChild(tipPart('code', 'value')).textContent = span.dataset.value;
    var note = body.appendChild(tipPart('p', 'note'));
    note.appendChild(document.createTextNode(copy.note));
    var link = note.appendChild(document.createElement('a'));
    link.href = new URL(copy.link.path, portal).href;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = copy.link.label;
    note.appendChild(document.createTextNode('.'));

    var actions = tipPart('div', 'actions');
    actions.appendChild(
      buildCopyButton('Copy value', function () {
        return span.dataset.value;
      })
    );
    var block = span.closest('pre');
    if (block) {
      actions.appendChild(
        buildCopyButton('Copy code with my values', function () {
          return filledCode(block, values);
        })
      );
    }

    tip.replaceChildren(header, body, actions);
  };

  // Above the value, or below it when there's no room; kept inside the
  // viewport. Fixed to the viewport so the code block's scroll box can't clip it.
  var placeTip = function (tip, span) {
    var anchor = span.getBoundingClientRect();
    var box = tip.getBoundingClientRect();
    var maxLeft = window.innerWidth - box.width - TIP_VIEWPORT_MARGIN_PX;
    var left = Math.min(
      Math.max(anchor.left + anchor.width / 2 - box.width / 2, TIP_VIEWPORT_MARGIN_PX),
      maxLeft
    );
    var top = anchor.top - box.height - TIP_GAP_PX;
    if (top < TIP_VIEWPORT_MARGIN_PX) top = anchor.bottom + TIP_GAP_PX;
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  };

  // One tooltip for every value, opened on hover or keyboard focus. It stays
  // open while the pointer is on it, so its link can be clicked.
  var setUpTip = function (values) {
    var tip = document.createElement('div');
    tip.id = TIP_ID;
    tip.className = 'datum-var-tip';
    tip.setAttribute('role', 'tooltip');
    tip.hidden = true;
    var current = null;
    var hideTimer = null;

    var cancelHide = function () {
      clearTimeout(hideTimer);
    };
    var hide = function () {
      cancelHide();
      if (current) current.removeAttribute('aria-describedby');
      current = null;
      tip.hidden = true;
    };
    var hideSoon = function () {
      cancelHide();
      hideTimer = setTimeout(hide, TIP_HIDE_DELAY_MS);
    };
    var show = function (span) {
      cancelHide();
      if (current === span) return;
      if (current) current.removeAttribute('aria-describedby');
      current = span;
      if (!tip.isConnected) document.body.appendChild(tip);
      fillTip(tip, span, values);
      tip.hidden = false;
      placeTip(tip, span);
      span.setAttribute('aria-describedby', TIP_ID);
    };
    var varFrom = function (target) {
      return target instanceof Element ? target.closest('.' + VAR_CLASS) : null;
    };

    document.addEventListener('mouseover', function (e) {
      var span = varFrom(e.target);
      if (span) show(span);
      else if (current && tip.contains(e.target)) cancelHide();
    });
    document.addEventListener('mouseout', function (e) {
      if (!current) return;
      var from = varFrom(e.target) || (tip.contains(e.target) ? tip : null);
      if (!from || from.contains(e.relatedTarget)) return;
      hideSoon();
    });
    document.addEventListener('focusin', function (e) {
      var span = varFrom(e.target);
      if (span) show(span);
      else if (!tip.contains(e.target)) hide();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && current) hide();
    });
    // The value moves under a fixed tooltip on scroll, including the code
    // block's own horizontal scroll.
    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
  };

  window.datumSessionStatus.then(function (status) {
    var values = valuesFrom(status);
    if (!Object.keys(values).length) return;
    setUpTip(values);

    // Mintlify renders code and swaps page content on client-side navigation,
    // so this runs on every DOM change. Marked tokens are skipped, so a pass
    // that has nothing to do changes nothing.
    var apply = function () {
      fill(values);
    };

    apply();
    new MutationObserver(apply).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });
})();
