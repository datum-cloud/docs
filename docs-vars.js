// Marks the placeholder tokens in code (see "Placeholders" in README.md) for a
// signed-in reader. The token stays as written; hovering it opens a card with
// the reader's own value and buttons to copy that value or the whole code
// (block or inline) with every token filled in. Tokens aren't marked when the
// reader is signed out, the request fails, or the portal doesn't vouch for
// the value.
(function () {
  // Mirrors PORTAL_URL_BY_HOST in portal-user.js.
  var PORTAL_URL_BY_HOST = {
    "website.staging.env.datum.net": "https://cloud.staging.env.datum.net/",
  };
  var portal = new URL(
    PORTAL_URL_BY_HOST[location.hostname] || "https://cloud.datum.net/",
  );

  var VAR_CLASS = "datum-var";
  // A whole token only: `your-project-id-2` is someone's own name, not a token.
  // `$` and `{` before it are excluded so `${PROJECT_ID}` stays as written.
  // `$PROJECT` being assigned (PowerShell `$PROJECT = "your-project-id"`) stays
  // too, or the copied code would read `my-project = "my-project"`.
  var TOKEN_PATTERN =
    /(?<![\w${-])(your-org-id|your-project-id|your-email|\$PROJECT_ID|\$PROJECT(?!\s*=)|PROJECT_ID)(?![\w-])/g;
  // Text past a node that the end-of-token checks may need (`$PROJECT    =`).
  var LOOKAHEAD_CHARS = 32;
  // Other spellings that mean the same value as a token.
  var TOKEN_ALIASES = {
    PROJECT_ID: 'your-project-id',
    $PROJECT_ID: 'your-project-id',
    $PROJECT: 'your-project-id',
  };
  var canonicalToken = function (token) {
    return TOKEN_ALIASES[token] || token;
  };
  // Milo resource names (Kubernetes DNS subdomains).
  var NAME_PATTERN = /^[a-z0-9]([a-z0-9.-]{0,251}[a-z0-9])?$/;
  // Narrower than RFC 5322 on purpose: the email lands unquoted in copied shell
  // commands, so it must not carry ; $ ` | & ( ) or quotes.
  var EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+$/;

  // Shared with portal-user.js. Mintlify loads the two in no set order, so
  // whichever runs first starts the one request.
  if (!window.datumSessionStatus) {
    window.datumSessionStatus = fetch(
      new URL("/api/website/session-status", portal),
      {
        credentials: "include",
        signal: AbortSignal.timeout(5000),
      },
    )
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
    if (
      status.org &&
      status.org.selected === true &&
      NAME_PATTERN.test(status.org.name)
    ) {
      values["your-org-id"] = status.org.name;
    }
    if (status.project && NAME_PATTERN.test(status.project.name)) {
      values["your-project-id"] = status.project.name;
    }
    if (status.user && EMAIL_PATTERN.test(status.user.email)) {
      values["your-email"] = status.user.email;
    }
    Object.keys(TOKEN_ALIASES).forEach(function (alias) {
      var value = values[TOKEN_ALIASES[alias]];
      if (value) values[alias] = value;
    });
    return values;
  };

  // The reader's load balancers in their project, from cloud-portal#1787. Any
  // failure (signed out, foreign project, portal without the route) reads as
  // none, so `ALB_NAME` stays a plain placeholder.
  var ALB_TOKEN = "ALB_NAME";
  var ALB_LIST_LIMIT = 500;
  var albsFrom = function (body) {
    var raw = body && Array.isArray(body.items) ? body.items : [];
    var items = raw
      .filter(function (item) {
        return (
          item && typeof item.name === "string" && NAME_PATTERN.test(item.name)
        );
      })
      .map(function (item) {
        var displayName =
          typeof item.displayName === "string" ? item.displayName.trim() : "";
        return { name: item.name, displayName: displayName };
      });
    return {
      items: items,
      truncated: Boolean(body && body.truncated === true),
    };
  };
  var fetchAlbs = function (project) {
    var path = "/api/website/projects/" + encodeURIComponent(project) + "/albs";
    return fetch(new URL(path, portal), {
      credentials: "include",
      signal: AbortSignal.timeout(5000),
    })
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .catch(function () {
        return null;
      })
      .then(albsFrom);
  };

  // A token is marked when the reader has a value for it, or, for `ALB_NAME`,
  // load balancers to pick from.
  var isMarked = function (ctx, token) {
    return (
      Boolean(ctx.values[token]) || (token === ALB_TOKEN && ctx.albs.length > 0)
    );
  };

  var TIP_ID = "datum-var-tip";
  // Time to cross the gap from a value to its tooltip before it closes.
  var TIP_HIDE_DELAY_MS = 150;
  var TIP_GAP_PX = 8;
  var TIP_VIEWPORT_MARGIN_PX = 8;
  var COPIED_LABEL_MS = 1500;

  // Hover card for a token, after docs.stripe.com/api: which token it is,
  // the reader's value, then where to change it.
  var TIP_COPY = {
    "your-org-id": {
      label: "Your organization",
      note: "Switch organizations in the ",
      link: { path: "/", label: "Cloud portal" },
    },
    "your-project-id": {
      label: "Your project",
      note: "It's the last project you opened. Open another one in the ",
      link: { path: "/", label: "Cloud portal" },
    },
    "your-email": {
      label: "Your email",
      note: "Manage your account in ",
      link: { path: "/account/general", label: "Account Settings" },
    },
    ALB_NAME: {
      label: "Your load balancer",
      pickLabel:
        "Pick your load balancer. It fills every ALB_NAME on this page.",
      note: "Manage load balancers in the ",
      link: {
        path: function (values) {
          return (
            "/project/" + encodeURIComponent(values["your-project-id"]) + "/alb"
          );
        },
        label: "Cloud portal",
      },
    },
  };

  // The value is read from the shared state when used, not stored on the span:
  // picking a load balancer changes it for every `ALB_NAME` at once.
  var buildVar = function (token) {
    var span = document.createElement("span");
    span.className = VAR_CLASS;
    span.tabIndex = 0;
    span.dataset.token = token;
    span.textContent = token;
    return span;
  };

  // Keeps the original text node in place (trimmed to the text before the
  // first token) and adds the rest after it, so React still finds the node it
  // rendered when it updates or removes the code block. `following` is the
  // code's text after this node: Shiki splits `$PROJECT` and ` = ...` into
  // separate spans, so the end-of-token checks need to see past the node.
  var fillTextNode = function (node, values, following) {
    var text = node.nodeValue;
    var matches = [];
    var match;
    TOKEN_PATTERN.lastIndex = 0;
    while ((match = TOKEN_PATTERN.exec(text + following))) {
      if (match.index + match[1].length > text.length) break;
      if (values[match[1]]) matches.push(match);
    }
    if (!matches.length) return;

    node.nodeValue = text.slice(0, matches[0].index);
    var tail = node;
    matches.forEach(function (m, i) {
      var span = buildVar(m[1]);
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

  var fill = function (ctx) {
    document.querySelectorAll("code").forEach(function (code) {
      // The hover card names the token in a <code> too; that one stays plain.
      var text = code.textContent;
      if (
        (text.indexOf('your-') === -1 && text.indexOf('PROJECT') === -1) ||
        code.closest('#' + TIP_ID)
      ) {
        return;
      }
      var walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
      var nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (node, i) {
        if (node.parentElement.closest('.' + VAR_CLASS)) return;
        var following = '';
        for (var j = i + 1; j < nodes.length && following.length < LOOKAHEAD_CHARS; j++) {
          following += nodes[j].nodeValue;
        }
        fillTextNode(node, values, following);
      });
    });
  };

  // The code block's text with every token swapped for the reader's value. A
  // token without one (an `ALB_NAME` not picked yet) stays as written.
  var filledCode = function (block, values) {
    var code = block.querySelector("code") || block;
    return code.textContent.replace(TOKEN_PATTERN, function (token) {
      return values[token] || token;
    });
  };

  var buildCopyButton = function (label, getText, enabled) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "datum-var-tip-copy";
    button.textContent = label;
    button.disabled = !enabled;
    var timer = null;
    var flash = function (text) {
      button.textContent = text;
      clearTimeout(timer);
      timer = setTimeout(function () {
        button.textContent = label;
      }, COPIED_LABEL_MS);
    };
    button.addEventListener("click", function () {
      navigator.clipboard.writeText(getText()).then(
        function () {
          flash("Copied");
        },
        function () {
          flash("Copy failed");
        },
      );
    });
    return button;
  };

  var tipPart = function (tag, className) {
    var el = document.createElement(tag);
    el.className = "datum-var-tip-" + className;
    return el;
  };

  // One button per load balancer. Nothing is picked by default: on a page like
  // `datumctl alb delete ALB_NAME --yes`, a wrong default does real damage.
  var buildAlbPicker = function (ctx, onPick) {
    var list = tipPart("div", "options");
    list.setAttribute("role", "group");
    list.setAttribute("aria-label", "Your load balancers");
    ctx.albs.forEach(function (alb) {
      var option = list.appendChild(tipPart("button", "option"));
      option.type = "button";
      option.setAttribute(
        "aria-pressed",
        String(alb.name === ctx.values[ALB_TOKEN]),
      );
      option.appendChild(tipPart("code", "option-name")).textContent = alb.name;
      if (alb.displayName && alb.displayName !== alb.name) {
        option.appendChild(tipPart("span", "option-display")).textContent =
          alb.displayName;
      }
      option.addEventListener("click", function () {
        onPick(alb.name);
      });
    });
    return list;
  };

  // Header (which token), body (the reader's value, or the load balancers to
  // pick from, and where to change it), footer (copy buttons).
  var fillTip = function (tip, span, ctx, onPick) {
    var token = span.dataset.token;
    var copy = TIP_COPY[canonicalToken(token)];
    var value = ctx.values[token];
    var picking = token === ALB_TOKEN && ctx.albs.length > 1;

    var header = tipPart("div", "header");
    header.appendChild(tipPart("span", "kicker")).textContent = "Placeholder";
    header.appendChild(tipPart("code", "token")).textContent = token;

    var body = tipPart("div", "body");
    body.appendChild(tipPart("p", "label")).textContent = picking
      ? copy.pickLabel
      : copy.label;
    if (picking) body.appendChild(buildAlbPicker(ctx, onPick));
    else body.appendChild(tipPart("code", "value")).textContent = value;
    if (token === ALB_TOKEN && ctx.truncated) {
      body.appendChild(tipPart("p", "note")).textContent =
        "Showing the first " + ALB_LIST_LIMIT + " load balancers.";
    }
    var note = body.appendChild(tipPart("p", "note"));
    note.appendChild(document.createTextNode(copy.note));
    var link = note.appendChild(document.createElement("a"));
    var linkPath =
      typeof copy.link.path === "function"
        ? copy.link.path(ctx.values)
        : copy.link.path;
    link.href = new URL(linkPath, portal).href;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = copy.link.label;
    note.appendChild(document.createTextNode("."));

    // Both buttons wait for a pick when there are several load balancers.
    var actions = tipPart("div", "actions");
    actions.appendChild(
      buildCopyButton(
        "Copy value",
        function () {
          return ctx.values[token];
        },
        Boolean(value),
      ),
    );
    // A code block, or inline code like `datumctl ctx use your-org-id/...`.
    // Skipped when the code is the token alone: it would copy the value again.
    var block = span.closest("pre") || span.closest("code");
    if (
      block &&
      (block.querySelector("code") || block).textContent.trim() !== token
    ) {
      actions.appendChild(
        buildCopyButton(
          "Copy code with my values",
          function () {
            return filledCode(block, ctx.values);
          },
          Boolean(value),
        ),
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
      Math.max(
        anchor.left + anchor.width / 2 - box.width / 2,
        TIP_VIEWPORT_MARGIN_PX,
      ),
      maxLeft,
    );
    var top = anchor.top - box.height - TIP_GAP_PX;
    if (top < TIP_VIEWPORT_MARGIN_PX) top = anchor.bottom + TIP_GAP_PX;
    tip.style.left = left + "px";
    tip.style.top = top + "px";
  };

  // One tooltip for every value, opened on hover or keyboard focus. It stays
  // open while the pointer is on it, so its link can be clicked.
  var setUpTip = function (ctx) {
    var tip = document.createElement("div");
    tip.id = TIP_ID;
    tip.className = "datum-var-tip";
    tip.setAttribute("role", "tooltip");
    tip.hidden = true;
    var current = null;
    var hideTimer = null;

    var cancelHide = function () {
      clearTimeout(hideTimer);
    };
    var hide = function () {
      cancelHide();
      if (current) current.removeAttribute("aria-describedby");
      current = null;
      tip.hidden = true;
    };
    var hideSoon = function () {
      cancelHide();
      hideTimer = setTimeout(hide, TIP_HIDE_DELAY_MS);
    };
    // The pick applies to every `ALB_NAME` on the page; the card redraws to
    // show it and enable the copy buttons, keeping focus on the picked option.
    var pick = function (name) {
      ctx.values = Object.assign({}, ctx.values, { ALB_NAME: name });
      if (!current) return;
      fillTip(tip, current, ctx, pick);
      placeTip(tip, current);
      var picked = tip.querySelector('[aria-pressed="true"]');
      if (picked) picked.focus();
    };
    var show = function (span) {
      cancelHide();
      if (current === span) return;
      if (current) current.removeAttribute("aria-describedby");
      current = span;
      if (!tip.isConnected) document.body.appendChild(tip);
      fillTip(tip, span, ctx, pick);
      tip.hidden = false;
      placeTip(tip, span);
      span.setAttribute("aria-describedby", TIP_ID);
    };
    var varFrom = function (target) {
      return target instanceof Element ? target.closest("." + VAR_CLASS) : null;
    };

    document.addEventListener("mouseover", function (e) {
      var span = varFrom(e.target);
      if (span) show(span);
      else if (current && tip.contains(e.target)) cancelHide();
    });
    document.addEventListener("mouseout", function (e) {
      if (!current) return;
      var from = varFrom(e.target) || (tip.contains(e.target) ? tip : null);
      if (!from || from.contains(e.relatedTarget)) return;
      hideSoon();
    });
    document.addEventListener("focusin", function (e) {
      var span = varFrom(e.target);
      if (span) show(span);
      else if (!tip.contains(e.target)) hide();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && current) hide();
    });
    // The value moves under a fixed tooltip on scroll, including the code
    // block's own horizontal scroll. Scrolling the card's own list doesn't.
    window.addEventListener(
      "scroll",
      function (e) {
        if (!(e.target instanceof Node && tip.contains(e.target))) hide();
      },
      true,
    );
    window.addEventListener("resize", hide);
  };

  window.datumSessionStatus.then(function (status) {
    var values = valuesFrom(status);
    if (!Object.keys(values).length) return;
    // Shared by every marked token and the hover card. `values` is replaced,
    // never edited, when the reader picks a load balancer.
    var ctx = { values: values, albs: [], truncated: false };
    setUpTip(ctx);

    // Mintlify renders code and swaps page content on client-side navigation,
    // so this runs on every DOM change. Marked tokens are skipped, so a pass
    // that has nothing to do changes nothing.
    var apply = function () {
      fill(ctx);
    };

    apply();
    new MutationObserver(apply).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    // The other tokens are already marked; `ALB_NAME` follows when its list
    // arrives. A single load balancer is filled in; several wait for a pick.
    var project = values["your-project-id"];
    if (!project) return;
    fetchAlbs(project).then(function (albs) {
      if (!albs.items.length) return;
      ctx.albs = albs.items;
      ctx.truncated = albs.truncated;
      if (albs.items.length === 1) {
        ctx.values = Object.assign({}, ctx.values, {
          ALB_NAME: albs.items[0].name,
        });
      }
      apply();
    });
  });
})();
