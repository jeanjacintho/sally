var Hr = Object.defineProperty;
var Kr = (e, t) => {
  for (var r in t) Hr(e, r, { get: t[r], enumerable: !0 });
};
(function () {
  "use strict";
  var e = (d, g) => {
    let x = (b) => {
        for (let y = 0, { length: P } = b; y < P; y++) _(b[y]);
      },
      _ = ({ target: b, attributeName: y, oldValue: P }) => {
        b.attributeChangedCallback(y, P, b.getAttribute(y));
      };
    return (b, y) => {
      let { observedAttributes: P } = b.constructor;
      return (
        P &&
          d(y).then(() => {
            new g(x).observe(b, {
              attributes: !0,
              attributeOldValue: !0,
              attributeFilter: P,
            });
            for (let H = 0, { length: w } = P; H < w; H++)
              b.hasAttribute(P[H]) &&
                _({ target: b, attributeName: P[H], oldValue: null });
          }),
        b
      );
    };
  };
  let i = "querySelectorAll",
    n = "querySelectorAll",
    { document: s, Element: o, MutationObserver: c, Set: f, WeakMap: u } = self,
    v = (d) => n in d,
    { filter: h } = [];
  var p = (d) => {
    let g = new u(),
      x = (w, A) => {
        let R;
        if (A)
          for (
            let M,
              O = ((W) =>
                W.matches || W.webkitMatchesSelector || W.msMatchesSelector)(w),
              N = 0,
              { length: Q } = b;
            N < Q;
            N++
          )
            O.call(w, (M = b[N])) &&
              (g.has(w) || g.set(w, new f()),
              (R = g.get(w)),
              R.has(M) || (R.add(M), d.handle(w, A, M)));
        else
          g.has(w) &&
            ((R = g.get(w)),
            g.delete(w),
            R.forEach((M) => {
              d.handle(w, A, M);
            }));
      },
      _ = (w, A = !0) => {
        for (let R = 0, { length: M } = w; R < M; R++) x(w[R], A);
      },
      { query: b } = d,
      y = d.root || s,
      P = ((w, A = document, R = MutationObserver, M = ["*"]) => {
        let O = (W, nt, ot, at, lt, ht) => {
            for (let J of W)
              (ht || i in J) &&
                (lt
                  ? ot.has(J) || (ot.add(J), at.delete(J), w(J, lt))
                  : at.has(J) || (at.add(J), ot.delete(J), w(J, lt)),
                ht || O(J[i](nt), nt, ot, at, lt, !0));
          },
          N = new R((W) => {
            if (M.length) {
              let nt = M.join(","),
                ot = new Set(),
                at = new Set();
              for (let { addedNodes: lt, removedNodes: ht } of W)
                (O(ht, nt, ot, at, !1, !1), O(lt, nt, ot, at, !0, !1));
            }
          }),
          { observe: Q } = N;
        return (
          (N.observe = (W) => Q.call(N, W, { subtree: !0, childList: !0 }))(A),
          N
        );
      })(x, y, c, b),
      { attachShadow: H } = o.prototype;
    return (
      H &&
        (o.prototype.attachShadow = function (w) {
          let A = H.call(this, w);
          return (P.observe(A), A);
        }),
      b.length && _(y[n](b)),
      {
        drop: (w) => {
          for (let A = 0, { length: R } = w; A < R; A++) g.delete(w[A]);
        },
        flush: () => {
          let w = P.takeRecords();
          for (let A = 0, { length: R } = w; A < R; A++)
            (_(h.call(w[A].removedNodes, v), !1),
              _(h.call(w[A].addedNodes, v), !0));
        },
        observer: P,
        parse: _,
      }
    );
  };
  let {
      document: S,
      Map: F,
      MutationObserver: k,
      Object: C,
      Set: $,
      WeakMap: G,
      Element: U,
      HTMLElement: V,
      Node: tt,
      Error: j,
      TypeError: rt,
      Reflect: I,
    } = self,
    {
      defineProperty: et,
      keys: D,
      getOwnPropertyNames: T,
      setPrototypeOf: a,
    } = C,
    l = !self.customElements,
    m = (d) => {
      let g = D(d),
        x = [],
        _ = new $(),
        { length: b } = g;
      for (let y = 0; y < b; y++) {
        x[y] = d[g[y]];
        try {
          delete d[g[y]];
        } catch {
          _.add(y);
        }
      }
      return () => {
        for (let y = 0; y < b; y++) _.has(y) || (d[g[y]] = x[y]);
      };
    };
  if (l) {
    let M = function () {
        let { constructor: O } = this;
        if (!g.has(O)) throw new rt("Illegal constructor");
        let N = g.get(O);
        if (w) return R(w, N);
        let Q = d.call(S, N);
        return R(a(Q, O.prototype), N);
      },
      { createElement: d } = S,
      g = new F(),
      x = new F(),
      _ = new F(),
      b = new F(),
      y = [],
      P = (O, N, Q) => {
        let W = _.get(Q);
        if (N && !W.isPrototypeOf(O)) {
          let ot = m(O);
          w = a(O, W);
          try {
            new W.constructor();
          } finally {
            ((w = null), ot());
          }
        }
        let nt = (N ? "" : "dis") + "connectedCallback";
        nt in W && O[nt]();
      },
      { parse: H } = p({ query: y, handle: P }),
      w = null,
      A = (O) => {
        if (!x.has(O)) {
          let N,
            Q = new Promise((W) => {
              N = W;
            });
          x.set(O, { $: Q, _: N });
        }
        return x.get(O).$;
      },
      R = e(A, k);
    ((self.customElements = {
      define: (O, N) => {
        if (b.has(O))
          throw new j(
            `the name "${O}" has already been used with this registry`,
          );
        (g.set(N, O),
          _.set(O, N.prototype),
          b.set(O, N),
          y.push(O),
          A(O).then(() => {
            H(S.querySelectorAll(O));
          }),
          x.get(O)._(N));
      },
      get: (O) => b.get(O),
      whenDefined: A,
    }),
      et((M.prototype = V.prototype), "constructor", { value: M }),
      (self.HTMLElement = M),
      (S.createElement = function (O, N) {
        let Q = N && N.is,
          W = Q ? b.get(Q) : b.get(O);
        return W ? new W() : d.call(S, O);
      }),
      "isConnected" in tt.prototype ||
        et(tt.prototype, "isConnected", {
          configurable: !0,
          get() {
            return !(
              this.ownerDocument.compareDocumentPosition(this) &
              this.DOCUMENT_POSITION_DISCONNECTED
            );
          },
        }));
  } else if (((l = !self.customElements.get("extends-br")), l))
    try {
      let d = function () {
        return self.Reflect.construct(HTMLBRElement, [], d);
      };
      d.prototype = HTMLLIElement.prototype;
      let g = "extends-br";
      (self.customElements.define("extends-br", d, { extends: "br" }),
        (l = S.createElement("br", { is: g }).outerHTML.indexOf(g) < 0));
      let { get: x, whenDefined: _ } = self.customElements;
      self.customElements.whenDefined = function (b) {
        return _.call(this, b).then((y) => y || x.call(this, b));
      };
    } catch {}
  if (l) {
    let We = function (E) {
        let L = P.get(E);
        nt(L.querySelectorAll(this), E.isConnected);
      },
      d = self.customElements,
      { createElement: g } = S,
      { define: x, get: _, upgrade: b } = d,
      { construct: y } = I || {
        construct(E) {
          return E.call(this);
        },
      },
      P = new G(),
      H = new $(),
      w = new F(),
      A = new F(),
      R = new F(),
      M = new F(),
      O = [],
      N = [],
      Q = (E) => M.get(E) || _.call(d, E),
      W = (E, L, K) => {
        let z = R.get(K);
        if (L && !z.isPrototypeOf(E)) {
          let ge = m(E);
          J = a(E, z);
          try {
            new z.constructor();
          } finally {
            ((J = null), ge());
          }
        }
        let Z = (L ? "" : "dis") + "connectedCallback";
        Z in z && E[Z]();
      },
      { parse: nt } = p({ query: N, handle: W }),
      { parse: ot } = p({
        query: O,
        handle(E, L) {
          P.has(E) && (L ? H.add(E) : H.delete(E), N.length && We.call(N, E));
        },
      }),
      { attachShadow: at } = U.prototype;
    at &&
      (U.prototype.attachShadow = function (E) {
        let L = at.call(this, E);
        return (P.set(this, L), L);
      });
    let lt = (E) => {
        if (!A.has(E)) {
          let L,
            K = new Promise((z) => {
              L = z;
            });
          A.set(E, { $: K, _: L });
        }
        return A.get(E).$;
      },
      ht = e(lt, k),
      J = null;
    (T(self)
      .filter((E) => /^HTML.*Element$/.test(E))
      .forEach((E) => {
        let L = self[E];
        function K() {
          let { constructor: z } = this;
          if (!w.has(z)) throw new rt("Illegal constructor");
          let { is: Z, tag: ge } = w.get(z);
          if (Z) {
            if (J) return ht(J, Z);
            let Be = g.call(S, ge);
            return (Be.setAttribute("is", Z), ht(a(Be, z.prototype), Z));
          }
          return y.call(this, L, [], z);
        }
        (a(K, L),
          et((K.prototype = L.prototype), "constructor", { value: K }),
          et(self, E, { value: K }));
      }),
      (S.createElement = function (E, L) {
        let K = L && L.is;
        if (K) {
          let Z = M.get(K);
          if (Z && w.get(Z).tag === E) return new Z();
        }
        let z = g.call(S, E);
        return (K && z.setAttribute("is", K), z);
      }),
      (d.get = Q),
      (d.whenDefined = lt),
      (d.upgrade = function (E) {
        let L = E.getAttribute("is");
        if (L) {
          let K = M.get(L);
          if (K) return void ht(a(E, K.prototype), L);
        }
        b.call(d, E);
      }),
      (d.define = function (E, L, K) {
        if (Q(E))
          throw new j(`'${E}' has already been defined as a custom element`);
        let z,
          Z = K && K.extends;
        (w.set(L, Z ? { is: E, tag: Z } : { is: "", tag: E }),
          Z
            ? ((z = `${Z}[is="${E}"]`),
              R.set(z, L.prototype),
              M.set(E, L),
              N.push(z))
            : (x.apply(d, arguments), O.push((z = E))),
          lt(E).then(() => {
            Z
              ? (nt(S.querySelectorAll(z)), H.forEach(We, [z]))
              : ot(S.querySelectorAll(z));
          }),
          A.get(E)._(L));
      }));
  }
})();
var qt = null,
  $e,
  He,
  Ke,
  Ue = 65,
  ye,
  Dt,
  Ve = new Set(),
  qe = 1111;
Ur();
function Ur() {
  if (!document.createElement("link").relList.supports("prefetch")) return;
  let t = "instantVaryAccept" in document.body.dataset || "Shopify" in window,
    r = navigator.userAgent.indexOf("Chrome/");
  if (
    (r > -1 && (qt = parseInt(navigator.userAgent.substring(r + 7))),
    t && qt && qt < 110)
  )
    return;
  let i = "instantMousedownShortcut" in document.body.dataset;
  (($e = "instantAllowQueryString" in document.body.dataset),
    (He = "instantAllowExternalLinks" in document.body.dataset),
    (Ke = "instantWhitelist" in document.body.dataset));
  let n = { capture: !0, passive: !0 },
    s = !1,
    o = !1,
    c = !1;
  if ("instantIntensity" in document.body.dataset) {
    let f = document.body.dataset.instantIntensity;
    if (f.startsWith("mousedown"))
      ((s = !0), f == "mousedown-only" && (o = !0));
    else if (f.startsWith("viewport")) {
      let u = navigator.connection && navigator.connection.saveData,
        v =
          navigator.connection &&
          navigator.connection.effectiveType &&
          navigator.connection.effectiveType.includes("2g");
      !u &&
        !v &&
        (f == "viewport"
          ? document.documentElement.clientWidth *
              document.documentElement.clientHeight <
              45e4 && (c = !0)
          : f == "viewport-all" && (c = !0));
    } else {
      let u = parseInt(f);
      isNaN(u) || (Ue = u);
    }
  }
  if (
    (o || document.addEventListener("touchstart", qr, n),
    s
      ? i || document.addEventListener("mousedown", Zr, n)
      : document.addEventListener("mouseover", Gr, n),
    i && document.addEventListener("mousedown", Yr, n),
    c)
  ) {
    let f = window.requestIdleCallback;
    (f ||
      (f = (u) => {
        u();
      }),
      f(
        function () {
          let v = new IntersectionObserver((h) => {
            h.forEach((p) => {
              if (p.isIntersecting) {
                let S = p.target;
                (v.unobserve(S), Zt(S.href));
              }
            });
          });
          document.querySelectorAll("a").forEach((h) => {
            Gt(h) && v.observe(h);
          });
        },
        { timeout: 1500 },
      ));
  }
}
function qr(e) {
  ye = performance.now();
  let t = e.target.closest("a");
  Gt(t) && Zt(t.href, "high");
}
function Gr(e) {
  if (performance.now() - ye < qe || !("closest" in e.target)) return;
  let t = e.target.closest("a");
  Gt(t) &&
    (t.addEventListener("mouseout", Xr, { passive: !0 }),
    (Dt = setTimeout(() => {
      (Zt(t.href, "high"), (Dt = void 0));
    }, Ue)));
}
function Zr(e) {
  let t = e.target.closest("a");
  Gt(t) && Zt(t.href, "high");
}
function Xr(e) {
  (e.relatedTarget && e.target.closest("a") == e.relatedTarget.closest("a")) ||
    (Dt && (clearTimeout(Dt), (Dt = void 0)));
}
function Yr(e) {
  if (performance.now() - ye < qe) return;
  let t = e.target.closest("a");
  if (e.which > 1 || e.metaKey || e.ctrlKey || !t) return;
  t.addEventListener(
    "click",
    function (i) {
      i.detail != 1337 && i.preventDefault();
    },
    { capture: !0, passive: !1, once: !0 },
  );
  let r = new MouseEvent("click", {
    view: window,
    bubbles: !0,
    cancelable: !1,
    detail: 1337,
  });
  t.dispatchEvent(r);
}
function Gt(e) {
  if (
    !(!e || !e.href) &&
    !(Ke && !("instant" in e.dataset)) &&
    !(
      e.origin != location.origin &&
      (!(He || "instant" in e.dataset) || !qt)
    ) &&
    ["http:", "https:"].includes(e.protocol) &&
    !(e.protocol == "http:" && location.protocol == "https:") &&
    !(!$e && e.search && !("instant" in e.dataset)) &&
    !(e.hash && e.pathname + e.search == location.pathname + location.search) &&
    !("noInstant" in e.dataset)
  )
    return !0;
}
function Zt(e, t = "auto") {
  if (Ve.has(e)) return;
  let r = document.createElement("link");
  ((r.rel = "prefetch"),
    (r.href = e),
    (r.fetchPriority = t),
    (r.as = "document"),
    document.head.appendChild(r),
    Ve.add(e));
}
var lr = {};
Kr(lr, { createFocusTrap: () => Ei });
var Ze = [
    "input:not([inert])",
    "select:not([inert])",
    "textarea:not([inert])",
    "a[href]:not([inert])",
    "button:not([inert])",
    "[tabindex]:not(slot):not([inert])",
    "audio[controls]:not([inert])",
    "video[controls]:not([inert])",
    '[contenteditable]:not([contenteditable="false"]):not([inert])',
    "details>summary:first-of-type:not([inert])",
    "details:not([inert])",
  ],
  Xt = Ze.join(","),
  Xe = typeof Element > "u",
  Et = Xe
    ? function () {}
    : Element.prototype.matches ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector,
  Yt =
    !Xe && Element.prototype.getRootNode
      ? function (e) {
          var t;
          return e == null || (t = e.getRootNode) === null || t === void 0
            ? void 0
            : t.call(e);
        }
      : function (e) {
          return e?.ownerDocument;
        },
  Qt = function e(t, r) {
    var i;
    r === void 0 && (r = !0);
    var n =
        t == null || (i = t.getAttribute) === null || i === void 0
          ? void 0
          : i.call(t, "inert"),
      s = n === "" || n === "true",
      o = s || (r && t && e(t.parentNode));
    return o;
  },
  Qr = function (t) {
    var r,
      i =
        t == null || (r = t.getAttribute) === null || r === void 0
          ? void 0
          : r.call(t, "contenteditable");
    return i === "" || i === "true";
  },
  Ye = function (t, r, i) {
    if (Qt(t)) return [];
    var n = Array.prototype.slice.apply(t.querySelectorAll(Xt));
    return (r && Et.call(t, Xt) && n.unshift(t), (n = n.filter(i)), n);
  },
  Qe = function e(t, r, i) {
    for (var n = [], s = Array.from(t); s.length; ) {
      var o = s.shift();
      if (!Qt(o, !1))
        if (o.tagName === "SLOT") {
          var c = o.assignedElements(),
            f = c.length ? c : o.children,
            u = e(f, !0, i);
          i.flatten
            ? n.push.apply(n, u)
            : n.push({ scopeParent: o, candidates: u });
        } else {
          var v = Et.call(o, Xt);
          v && i.filter(o) && (r || !t.includes(o)) && n.push(o);
          var h =
              o.shadowRoot ||
              (typeof i.getShadowRoot == "function" && i.getShadowRoot(o)),
            p = !Qt(h, !1) && (!i.shadowRootFilter || i.shadowRootFilter(o));
          if (h && p) {
            var S = e(h === !0 ? o.children : h.children, !0, i);
            i.flatten
              ? n.push.apply(n, S)
              : n.push({ scopeParent: o, candidates: S });
          } else s.unshift.apply(s, o.children);
        }
    }
    return n;
  },
  Je = function (t) {
    return !isNaN(parseInt(t.getAttribute("tabindex"), 10));
  },
  pt = function (t) {
    if (!t) throw new Error("No node provided");
    return t.tabIndex < 0 &&
      (/^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName) || Qr(t)) &&
      !Je(t)
      ? 0
      : t.tabIndex;
  },
  Jr = function (t, r) {
    var i = pt(t);
    return i < 0 && r && !Je(t) ? 0 : i;
  },
  ti = function (t, r) {
    return t.tabIndex === r.tabIndex
      ? t.documentOrder - r.documentOrder
      : t.tabIndex - r.tabIndex;
  },
  tr = function (t) {
    return t.tagName === "INPUT";
  },
  ei = function (t) {
    return tr(t) && t.type === "hidden";
  },
  ri = function (t) {
    var r =
      t.tagName === "DETAILS" &&
      Array.prototype.slice.apply(t.children).some(function (i) {
        return i.tagName === "SUMMARY";
      });
    return r;
  },
  ii = function (t, r) {
    for (var i = 0; i < t.length; i++)
      if (t[i].checked && t[i].form === r) return t[i];
  },
  ni = function (t) {
    if (!t.name) return !0;
    var r = t.form || Yt(t),
      i = function (c) {
        return r.querySelectorAll('input[type="radio"][name="' + c + '"]');
      },
      n;
    if (
      typeof window < "u" &&
      typeof window.CSS < "u" &&
      typeof window.CSS.escape == "function"
    )
      n = i(window.CSS.escape(t.name));
    else
      try {
        n = i(t.name);
      } catch (o) {
        return (
          console.error(
            "Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",
            o.message,
          ),
          !1
        );
      }
    var s = ii(n, t.form);
    return !s || s === t;
  },
  oi = function (t) {
    return tr(t) && t.type === "radio";
  },
  si = function (t) {
    return oi(t) && !ni(t);
  },
  ai = function (t) {
    var r,
      i = t && Yt(t),
      n = (r = i) === null || r === void 0 ? void 0 : r.host,
      s = !1;
    if (i && i !== t) {
      var o, c, f;
      for (
        s = !!(
          ((o = n) !== null &&
            o !== void 0 &&
            (c = o.ownerDocument) !== null &&
            c !== void 0 &&
            c.contains(n)) ||
          (t != null &&
            (f = t.ownerDocument) !== null &&
            f !== void 0 &&
            f.contains(t))
        );
        !s && n;

      ) {
        var u, v, h;
        ((i = Yt(n)),
          (n = (u = i) === null || u === void 0 ? void 0 : u.host),
          (s = !!(
            (v = n) !== null &&
            v !== void 0 &&
            (h = v.ownerDocument) !== null &&
            h !== void 0 &&
            h.contains(n)
          )));
      }
    }
    return s;
  },
  Ge = function (t) {
    var r = t.getBoundingClientRect(),
      i = r.width,
      n = r.height;
    return i === 0 && n === 0;
  },
  li = function (t, r) {
    var i = r.displayCheck,
      n = r.getShadowRoot;
    if (getComputedStyle(t).visibility === "hidden") return !0;
    var s = Et.call(t, "details>summary:first-of-type"),
      o = s ? t.parentElement : t;
    if (Et.call(o, "details:not([open]) *")) return !0;
    if (!i || i === "full" || i === "legacy-full") {
      if (typeof n == "function") {
        for (var c = t; t; ) {
          var f = t.parentElement,
            u = Yt(t);
          if (f && !f.shadowRoot && n(f) === !0) return Ge(t);
          t.assignedSlot
            ? (t = t.assignedSlot)
            : !f && u !== t.ownerDocument
              ? (t = u.host)
              : (t = f);
        }
        t = c;
      }
      if (ai(t)) return !t.getClientRects().length;
      if (i !== "legacy-full") return !0;
    } else if (i === "non-zero-area") return Ge(t);
    return !1;
  },
  ci = function (t) {
    if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(t.tagName))
      for (var r = t.parentElement; r; ) {
        if (r.tagName === "FIELDSET" && r.disabled) {
          for (var i = 0; i < r.children.length; i++) {
            var n = r.children.item(i);
            if (n.tagName === "LEGEND")
              return Et.call(r, "fieldset[disabled] *") ? !0 : !n.contains(t);
          }
          return !0;
        }
        r = r.parentElement;
      }
    return !1;
  },
  Jt = function (t, r) {
    return !(r.disabled || Qt(r) || ei(r) || li(r, t) || ri(r) || ci(r));
  },
  be = function (t, r) {
    return !(si(r) || pt(r) < 0 || !Jt(t, r));
  },
  ui = function (t) {
    var r = parseInt(t.getAttribute("tabindex"), 10);
    return !!(isNaN(r) || r >= 0);
  },
  fi = function e(t) {
    var r = [],
      i = [];
    return (
      t.forEach(function (n, s) {
        var o = !!n.scopeParent,
          c = o ? n.scopeParent : n,
          f = Jr(c, o),
          u = o ? e(n.candidates) : c;
        f === 0
          ? o
            ? r.push.apply(r, u)
            : r.push(c)
          : i.push({
              documentOrder: s,
              tabIndex: f,
              item: n,
              isScope: o,
              content: u,
            });
      }),
      i
        .sort(ti)
        .reduce(function (n, s) {
          return (
            s.isScope ? n.push.apply(n, s.content) : n.push(s.content),
            n
          );
        }, [])
        .concat(r)
    );
  },
  er = function (t, r) {
    r = r || {};
    var i;
    return (
      r.getShadowRoot
        ? (i = Qe([t], r.includeContainer, {
            filter: be.bind(null, r),
            flatten: !1,
            getShadowRoot: r.getShadowRoot,
            shadowRootFilter: ui,
          }))
        : (i = Ye(t, r.includeContainer, be.bind(null, r))),
      fi(i)
    );
  },
  rr = function (t, r) {
    r = r || {};
    var i;
    return (
      r.getShadowRoot
        ? (i = Qe([t], r.includeContainer, {
            filter: Jt.bind(null, r),
            flatten: !0,
            getShadowRoot: r.getShadowRoot,
          }))
        : (i = Ye(t, r.includeContainer, Jt.bind(null, r))),
      i
    );
  },
  xt = function (t, r) {
    if (((r = r || {}), !t)) throw new Error("No node provided");
    return Et.call(t, Xt) === !1 ? !1 : be(r, t);
  },
  di = Ze.concat("iframe").join(","),
  te = function (t, r) {
    if (((r = r || {}), !t)) throw new Error("No node provided");
    return Et.call(t, di) === !1 ? !1 : Jt(r, t);
  };
function ir(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    (t &&
      (i = i.filter(function (n) {
        return Object.getOwnPropertyDescriptor(e, n).enumerable;
      })),
      r.push.apply(r, i));
  }
  return r;
}
function nr(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? ir(Object(r), !0).forEach(function (i) {
          hi(e, i, r[i]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : ir(Object(r)).forEach(function (i) {
            Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(r, i));
          });
  }
  return e;
}
function hi(e, t, r) {
  return (
    (t = mi(t)),
    t in e
      ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[t] = r),
    e
  );
}
function pi(e, t) {
  if (typeof e != "object" || e === null) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var i = r.call(e, t || "default");
    if (typeof i != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function mi(e) {
  var t = pi(e, "string");
  return typeof t == "symbol" ? t : String(t);
}
var or = {
    activateTrap: function (t, r) {
      if (t.length > 0) {
        var i = t[t.length - 1];
        i !== r && i.pause();
      }
      var n = t.indexOf(r);
      (n === -1 || t.splice(n, 1), t.push(r));
    },
    deactivateTrap: function (t, r) {
      var i = t.indexOf(r);
      (i !== -1 && t.splice(i, 1), t.length > 0 && t[t.length - 1].unpause());
    },
  },
  vi = function (t) {
    return (
      t.tagName &&
      t.tagName.toLowerCase() === "input" &&
      typeof t.select == "function"
    );
  },
  gi = function (t) {
    return t?.key === "Escape" || t?.key === "Esc" || t?.keyCode === 27;
  },
  Ft = function (t) {
    return t?.key === "Tab" || t?.keyCode === 9;
  },
  yi = function (t) {
    return Ft(t) && !t.shiftKey;
  },
  bi = function (t) {
    return Ft(t) && t.shiftKey;
  },
  sr = function (t) {
    return setTimeout(t, 0);
  },
  ar = function (t, r) {
    var i = -1;
    return (
      t.every(function (n, s) {
        return r(n) ? ((i = s), !1) : !0;
      }),
      i
    );
  },
  Nt = function (t) {
    for (
      var r = arguments.length, i = new Array(r > 1 ? r - 1 : 0), n = 1;
      n < r;
      n++
    )
      i[n - 1] = arguments[n];
    return typeof t == "function" ? t.apply(void 0, i) : t;
  },
  ee = function (t) {
    return t.target.shadowRoot && typeof t.composedPath == "function"
      ? t.composedPath()[0]
      : t.target;
  },
  wi = [],
  Ei = function (t, r) {
    var i = r?.document || document,
      n = r?.trapStack || wi,
      s = nr(
        {
          returnFocusOnDeactivate: !0,
          escapeDeactivates: !0,
          delayInitialFocus: !0,
          isKeyForward: yi,
          isKeyBackward: bi,
        },
        r,
      ),
      o = {
        containers: [],
        containerGroups: [],
        tabbableGroups: [],
        nodeFocusedBeforeActivation: null,
        mostRecentlyFocusedNode: null,
        active: !1,
        paused: !1,
        delayInitialFocusTimer: void 0,
        recentNavEvent: void 0,
      },
      c,
      f = function (a, l, m) {
        return a && a[l] !== void 0 ? a[l] : s[m || l];
      },
      u = function (a, l) {
        var m =
          typeof l?.composedPath == "function" ? l.composedPath() : void 0;
        return o.containerGroups.findIndex(function (d) {
          var g = d.container,
            x = d.tabbableNodes;
          return (
            g.contains(a) ||
            m?.includes(g) ||
            x.find(function (_) {
              return _ === a;
            })
          );
        });
      },
      v = function (a) {
        var l = s[a];
        if (typeof l == "function") {
          for (
            var m = arguments.length, d = new Array(m > 1 ? m - 1 : 0), g = 1;
            g < m;
            g++
          )
            d[g - 1] = arguments[g];
          l = l.apply(void 0, d);
        }
        if ((l === !0 && (l = void 0), !l)) {
          if (l === void 0 || l === !1) return l;
          throw new Error(
            "`".concat(
              a,
              "` was specified but was not a node, or did not return a node",
            ),
          );
        }
        var x = l;
        if (typeof l == "string" && ((x = i.querySelector(l)), !x))
          throw new Error(
            "`".concat(a, "` as selector refers to no known node"),
          );
        return x;
      },
      h = function () {
        var a = v("initialFocus");
        if (a === !1) return !1;
        if (a === void 0 || !te(a, s.tabbableOptions))
          if (u(i.activeElement) >= 0) a = i.activeElement;
          else {
            var l = o.tabbableGroups[0],
              m = l && l.firstTabbableNode;
            a = m || v("fallbackFocus");
          }
        if (!a)
          throw new Error(
            "Your focus-trap needs to have at least one focusable element",
          );
        return a;
      },
      p = function () {
        if (
          ((o.containerGroups = o.containers.map(function (a) {
            var l = er(a, s.tabbableOptions),
              m = rr(a, s.tabbableOptions),
              d = l.length > 0 ? l[0] : void 0,
              g = l.length > 0 ? l[l.length - 1] : void 0,
              x = m.find(function (y) {
                return xt(y);
              }),
              _ = m
                .slice()
                .reverse()
                .find(function (y) {
                  return xt(y);
                }),
              b = !!l.find(function (y) {
                return pt(y) > 0;
              });
            return {
              container: a,
              tabbableNodes: l,
              focusableNodes: m,
              posTabIndexesFound: b,
              firstTabbableNode: d,
              lastTabbableNode: g,
              firstDomTabbableNode: x,
              lastDomTabbableNode: _,
              nextTabbableNode: function (P) {
                var H =
                    arguments.length > 1 && arguments[1] !== void 0
                      ? arguments[1]
                      : !0,
                  w = l.indexOf(P);
                return w < 0
                  ? H
                    ? m.slice(m.indexOf(P) + 1).find(function (A) {
                        return xt(A);
                      })
                    : m
                        .slice(0, m.indexOf(P))
                        .reverse()
                        .find(function (A) {
                          return xt(A);
                        })
                  : l[w + (H ? 1 : -1)];
              },
            };
          })),
          (o.tabbableGroups = o.containerGroups.filter(function (a) {
            return a.tabbableNodes.length > 0;
          })),
          o.tabbableGroups.length <= 0 && !v("fallbackFocus"))
        )
          throw new Error(
            "Your focus-trap must have at least one container with at least one tabbable node in it at all times",
          );
        if (
          o.containerGroups.find(function (a) {
            return a.posTabIndexesFound;
          }) &&
          o.containerGroups.length > 1
        )
          throw new Error(
            "At least one node with a positive tabindex was found in one of your focus-trap's multiple containers. Positive tabindexes are only supported in single-container focus-traps.",
          );
      },
      S = function T(a) {
        var l = a.activeElement;
        if (l)
          return l.shadowRoot && l.shadowRoot.activeElement !== null
            ? T(l.shadowRoot)
            : l;
      },
      F = function T(a) {
        if (a !== !1 && a !== S(document)) {
          if (!a || !a.focus) {
            T(h());
            return;
          }
          (a.focus({ preventScroll: !!s.preventScroll }),
            (o.mostRecentlyFocusedNode = a),
            vi(a) && a.select());
        }
      },
      k = function (a) {
        var l = v("setReturnFocus", a);
        return l || (l === !1 ? !1 : a);
      },
      C = function (a) {
        var l = a.target,
          m = a.event,
          d = a.isBackward,
          g = d === void 0 ? !1 : d;
        ((l = l || ee(m)), p());
        var x = null;
        if (o.tabbableGroups.length > 0) {
          var _ = u(l, m),
            b = _ >= 0 ? o.containerGroups[_] : void 0;
          if (_ < 0)
            g
              ? (x =
                  o.tabbableGroups[o.tabbableGroups.length - 1]
                    .lastTabbableNode)
              : (x = o.tabbableGroups[0].firstTabbableNode);
          else if (g) {
            var y = ar(o.tabbableGroups, function (M) {
              var O = M.firstTabbableNode;
              return l === O;
            });
            if (
              (y < 0 &&
                (b.container === l ||
                  (te(l, s.tabbableOptions) &&
                    !xt(l, s.tabbableOptions) &&
                    !b.nextTabbableNode(l, !1))) &&
                (y = _),
              y >= 0)
            ) {
              var P = y === 0 ? o.tabbableGroups.length - 1 : y - 1,
                H = o.tabbableGroups[P];
              x = pt(l) >= 0 ? H.lastTabbableNode : H.lastDomTabbableNode;
            } else Ft(m) || (x = b.nextTabbableNode(l, !1));
          } else {
            var w = ar(o.tabbableGroups, function (M) {
              var O = M.lastTabbableNode;
              return l === O;
            });
            if (
              (w < 0 &&
                (b.container === l ||
                  (te(l, s.tabbableOptions) &&
                    !xt(l, s.tabbableOptions) &&
                    !b.nextTabbableNode(l))) &&
                (w = _),
              w >= 0)
            ) {
              var A = w === o.tabbableGroups.length - 1 ? 0 : w + 1,
                R = o.tabbableGroups[A];
              x = pt(l) >= 0 ? R.firstTabbableNode : R.firstDomTabbableNode;
            } else Ft(m) || (x = b.nextTabbableNode(l));
          }
        } else x = v("fallbackFocus");
        return x;
      },
      $ = function (a) {
        var l = ee(a);
        if (!(u(l, a) >= 0)) {
          if (Nt(s.clickOutsideDeactivates, a)) {
            c.deactivate({ returnFocus: s.returnFocusOnDeactivate });
            return;
          }
          Nt(s.allowOutsideClick, a) || a.preventDefault();
        }
      },
      G = function (a) {
        var l = ee(a),
          m = u(l, a) >= 0;
        if (m || l instanceof Document) m && (o.mostRecentlyFocusedNode = l);
        else {
          a.stopImmediatePropagation();
          var d,
            g = !0;
          if (o.mostRecentlyFocusedNode)
            if (pt(o.mostRecentlyFocusedNode) > 0) {
              var x = u(o.mostRecentlyFocusedNode),
                _ = o.containerGroups[x].tabbableNodes;
              if (_.length > 0) {
                var b = _.findIndex(function (y) {
                  return y === o.mostRecentlyFocusedNode;
                });
                b >= 0 &&
                  (s.isKeyForward(o.recentNavEvent)
                    ? b + 1 < _.length && ((d = _[b + 1]), (g = !1))
                    : b - 1 >= 0 && ((d = _[b - 1]), (g = !1)));
              }
            } else
              o.containerGroups.some(function (y) {
                return y.tabbableNodes.some(function (P) {
                  return pt(P) > 0;
                });
              }) || (g = !1);
          else g = !1;
          (g &&
            (d = C({
              target: o.mostRecentlyFocusedNode,
              isBackward: s.isKeyBackward(o.recentNavEvent),
            })),
            F(d || o.mostRecentlyFocusedNode || h()));
        }
        o.recentNavEvent = void 0;
      },
      U = function (a) {
        var l =
          arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
        o.recentNavEvent = a;
        var m = C({ event: a, isBackward: l });
        m && (Ft(a) && a.preventDefault(), F(m));
      },
      V = function (a) {
        if (gi(a) && Nt(s.escapeDeactivates, a) !== !1) {
          (a.preventDefault(), c.deactivate());
          return;
        }
        (s.isKeyForward(a) || s.isKeyBackward(a)) && U(a, s.isKeyBackward(a));
      },
      tt = function (a) {
        var l = ee(a);
        u(l, a) >= 0 ||
          Nt(s.clickOutsideDeactivates, a) ||
          Nt(s.allowOutsideClick, a) ||
          (a.preventDefault(), a.stopImmediatePropagation());
      },
      j = function () {
        if (o.active)
          return (
            or.activateTrap(n, c),
            (o.delayInitialFocusTimer = s.delayInitialFocus
              ? sr(function () {
                  F(h());
                })
              : F(h())),
            i.addEventListener("focusin", G, !0),
            i.addEventListener("mousedown", $, { capture: !0, passive: !1 }),
            i.addEventListener("touchstart", $, { capture: !0, passive: !1 }),
            i.addEventListener("click", tt, { capture: !0, passive: !1 }),
            i.addEventListener("keydown", V, { capture: !0, passive: !1 }),
            c
          );
      },
      rt = function () {
        if (o.active)
          return (
            i.removeEventListener("focusin", G, !0),
            i.removeEventListener("mousedown", $, !0),
            i.removeEventListener("touchstart", $, !0),
            i.removeEventListener("click", tt, !0),
            i.removeEventListener("keydown", V, !0),
            c
          );
      },
      I = function (a) {
        var l = a.some(function (m) {
          var d = Array.from(m.removedNodes);
          return d.some(function (g) {
            return g === o.mostRecentlyFocusedNode;
          });
        });
        l && F(h());
      },
      et =
        typeof window < "u" && "MutationObserver" in window
          ? new MutationObserver(I)
          : void 0,
      D = function () {
        et &&
          (et.disconnect(),
          o.active &&
            !o.paused &&
            o.containers.map(function (a) {
              et.observe(a, { subtree: !0, childList: !0 });
            }));
      };
    return (
      (c = {
        get active() {
          return o.active;
        },
        get paused() {
          return o.paused;
        },
        activate: function (a) {
          if (o.active) return this;
          var l = f(a, "onActivate"),
            m = f(a, "onPostActivate"),
            d = f(a, "checkCanFocusTrap");
          (d || p(),
            (o.active = !0),
            (o.paused = !1),
            (o.nodeFocusedBeforeActivation = i.activeElement),
            l?.());
          var g = function () {
            (d && p(), j(), D(), m?.());
          };
          return d ? (d(o.containers.concat()).then(g, g), this) : (g(), this);
        },
        deactivate: function (a) {
          if (!o.active) return this;
          var l = nr(
            {
              onDeactivate: s.onDeactivate,
              onPostDeactivate: s.onPostDeactivate,
              checkCanReturnFocus: s.checkCanReturnFocus,
            },
            a,
          );
          (clearTimeout(o.delayInitialFocusTimer),
            (o.delayInitialFocusTimer = void 0),
            rt(),
            (o.active = !1),
            (o.paused = !1),
            D(),
            or.deactivateTrap(n, c));
          var m = f(l, "onDeactivate"),
            d = f(l, "onPostDeactivate"),
            g = f(l, "checkCanReturnFocus"),
            x = f(l, "returnFocus", "returnFocusOnDeactivate");
          m?.();
          var _ = function () {
            sr(function () {
              (x && F(k(o.nodeFocusedBeforeActivation)), d?.());
            });
          };
          return x && g
            ? (g(k(o.nodeFocusedBeforeActivation)).then(_, _), this)
            : (_(), this);
        },
        pause: function (a) {
          if (o.paused || !o.active) return this;
          var l = f(a, "onPause"),
            m = f(a, "onPostPause");
          return ((o.paused = !0), l?.(), rt(), D(), m?.(), this);
        },
        unpause: function (a) {
          if (!o.paused || !o.active) return this;
          var l = f(a, "onUnpause"),
            m = f(a, "onPostUnpause");
          return ((o.paused = !1), l?.(), p(), j(), D(), m?.(), this);
        },
        updateContainerElements: function (a) {
          var l = [].concat(a).filter(Boolean);
          return (
            (o.containers = l.map(function (m) {
              return typeof m == "string" ? i.querySelector(m) : m;
            })),
            o.active && p(),
            D(),
            this
          );
        },
      }),
      c.updateContainerElements(t),
      c
    );
  };
function we(e, t) {
  e.indexOf(t) === -1 && e.push(t);
}
function Ee(e, t) {
  let r = e.indexOf(t);
  r > -1 && e.splice(r, 1);
}
var Pt = (e, t, r) => Math.min(Math.max(r, e), t);
var B = { duration: 0.3, delay: 0, endDelay: 0, repeat: 0, easing: "ease" };
var Y = (e) => typeof e == "number";
var ct = (e) => Array.isArray(e) && !Y(e[0]);
var cr = (e, t, r) => {
  let i = t - e;
  return ((((r - e) % i) + i) % i) + e;
};
function Lt(e, t) {
  return ct(e) ? e[cr(0, e.length, t)] : e;
}
var St = (e, t, r) => -r * e + r * t + e;
var Ct = () => {},
  X = (e) => e;
var st = (e, t, r) => (t - e === 0 ? 1 : (r - e) / (t - e));
function At(e, t) {
  let r = e[e.length - 1];
  for (let i = 1; i <= t; i++) {
    let n = st(0, t, i);
    e.push(St(r, 1, n));
  }
}
function Ot(e) {
  let t = [0];
  return (At(t, e - 1), t);
}
function Rt(e, t = Ot(e.length), r = X) {
  let i = e.length,
    n = i - t.length;
  return (
    n > 0 && At(t, n),
    (s) => {
      let o = 0;
      for (; o < i - 2 && !(s < t[o + 1]); o++);
      let c = Pt(0, 1, st(t[o], t[o + 1], s));
      return ((c = Lt(r, o)(c)), St(e[o], e[o + 1], c));
    }
  );
}
var Mt = (e) => Array.isArray(e) && Y(e[0]);
var mt = (e) => typeof e == "object" && !!e.createAnimation;
var q = (e) => typeof e == "function";
var ut = (e) => typeof e == "string";
var vt = { ms: (e) => e * 1e3, s: (e) => e / 1e3 };
function xe(e, t) {
  return t ? e * (1e3 / t) : 0;
}
var ur = (e, t, r) =>
    (((1 - 3 * r + 3 * t) * e + (3 * r - 6 * t)) * e + 3 * t) * e,
  xi = 1e-7,
  Si = 12;
function Oi(e, t, r, i, n) {
  let s,
    o,
    c = 0;
  do ((o = t + (r - t) / 2), (s = ur(o, i, n) - e), s > 0 ? (r = o) : (t = o));
  while (Math.abs(s) > xi && ++c < Si);
  return o;
}
function Tt(e, t, r, i) {
  if (e === t && r === i) return X;
  let n = (s) => Oi(s, 0, 1, e, r);
  return (s) => (s === 0 || s === 1 ? s : ur(n(s), t, i));
}
var Se =
  (e, t = "end") =>
  (r) => {
    r = t === "end" ? Math.min(r, 0.999) : Math.max(r, 0.001);
    let i = r * e,
      n = t === "end" ? Math.floor(i) : Math.ceil(i);
    return Pt(0, 1, n / e);
  };
var fr = {
    ease: Tt(0.25, 0.1, 0.25, 1),
    "ease-in": Tt(0.42, 0, 1, 1),
    "ease-in-out": Tt(0.42, 0, 0.58, 1),
    "ease-out": Tt(0, 0, 0.58, 1),
  },
  Ti = /\((.*?)\)/;
function It(e) {
  if (q(e)) return e;
  if (Mt(e)) return Tt(...e);
  if (fr[e]) return fr[e];
  if (e.startsWith("steps")) {
    let t = Ti.exec(e);
    if (t) {
      let r = t[1].split(",");
      return Se(parseFloat(r[0]), r[1].trim());
    }
  }
  return X;
}
var ft = class {
  constructor(
    t,
    r = [0, 1],
    {
      easing: i,
      duration: n = B.duration,
      delay: s = B.delay,
      endDelay: o = B.endDelay,
      repeat: c = B.repeat,
      offset: f,
      direction: u = "normal",
    } = {},
  ) {
    if (
      ((this.startTime = null),
      (this.rate = 1),
      (this.t = 0),
      (this.cancelTimestamp = null),
      (this.easing = X),
      (this.duration = 0),
      (this.totalDuration = 0),
      (this.repeat = 0),
      (this.playState = "idle"),
      (this.finished = new Promise((h, p) => {
        ((this.resolve = h), (this.reject = p));
      })),
      (i = i || B.easing),
      mt(i))
    ) {
      let h = i.createAnimation(r);
      ((i = h.easing), (r = h.keyframes || r), (n = h.duration || n));
    }
    ((this.repeat = c),
      (this.easing = ct(i) ? X : It(i)),
      this.updateDuration(n));
    let v = Rt(r, f, ct(i) ? i.map(It) : X);
    ((this.tick = (h) => {
      var p;
      s = s;
      let S = 0;
      (this.pauseTime !== void 0
        ? (S = this.pauseTime)
        : (S = (h - this.startTime) * this.rate),
        (this.t = S),
        (S /= 1e3),
        (S = Math.max(S - s, 0)),
        this.playState === "finished" &&
          this.pauseTime === void 0 &&
          (S = this.totalDuration));
      let F = S / this.duration,
        k = Math.floor(F),
        C = F % 1;
      (!C && F >= 1 && (C = 1), C === 1 && k--);
      let $ = k % 2;
      (u === "reverse" ||
        (u === "alternate" && $) ||
        (u === "alternate-reverse" && !$)) &&
        (C = 1 - C);
      let G = S >= this.totalDuration ? 1 : Math.min(C, 1),
        U = v(this.easing(G));
      (t(U),
        this.pauseTime === void 0 &&
        (this.playState === "finished" || S >= this.totalDuration + o)
          ? ((this.playState = "finished"),
            (p = this.resolve) === null || p === void 0 || p.call(this, U))
          : this.playState !== "idle" &&
            (this.frameRequestId = requestAnimationFrame(this.tick)));
    }),
      this.play());
  }
  play() {
    let t = performance.now();
    ((this.playState = "running"),
      this.pauseTime !== void 0
        ? (this.startTime = t - this.pauseTime)
        : this.startTime || (this.startTime = t),
      (this.cancelTimestamp = this.startTime),
      (this.pauseTime = void 0),
      (this.frameRequestId = requestAnimationFrame(this.tick)));
  }
  pause() {
    ((this.playState = "paused"), (this.pauseTime = this.t));
  }
  finish() {
    ((this.playState = "finished"), this.tick(0));
  }
  stop() {
    var t;
    ((this.playState = "idle"),
      this.frameRequestId !== void 0 &&
        cancelAnimationFrame(this.frameRequestId),
      (t = this.reject) === null || t === void 0 || t.call(this, !1));
  }
  cancel() {
    (this.stop(), this.tick(this.cancelTimestamp));
  }
  reverse() {
    this.rate *= -1;
  }
  commitStyles() {}
  updateDuration(t) {
    ((this.duration = t), (this.totalDuration = t * (this.repeat + 1)));
  }
  get currentTime() {
    return this.t;
  }
  set currentTime(t) {
    this.pauseTime !== void 0 || this.rate === 0
      ? (this.pauseTime = t)
      : (this.startTime = performance.now() - t / this.rate);
  }
  get playbackRate() {
    return this.rate;
  }
  set playbackRate(t) {
    this.rate = t;
  }
};
var kt = function () {};
var zt = class {
  setAnimation(t) {
    ((this.animation = t),
      t?.finished.then(() => this.clearAnimation()).catch(() => {}));
  }
  clearAnimation() {
    this.animation = this.generator = void 0;
  }
};
var Oe = new WeakMap();
function re(e) {
  return (
    Oe.has(e) || Oe.set(e, { transforms: [], values: new Map() }),
    Oe.get(e)
  );
}
function dr(e, t) {
  return (e.has(t) || e.set(t, new zt()), e.get(t));
}
var _i = ["", "X", "Y", "Z"],
  Ai = ["translate", "scale", "rotate", "skew"],
  jt = { x: "translateX", y: "translateY", z: "translateZ" },
  hr = {
    syntax: "<angle>",
    initialValue: "0deg",
    toDefaultUnit: (e) => e + "deg",
  },
  Ii = {
    translate: {
      syntax: "<length-percentage>",
      initialValue: "0px",
      toDefaultUnit: (e) => e + "px",
    },
    rotate: hr,
    scale: { syntax: "<number>", initialValue: 1, toDefaultUnit: X },
    skew: hr,
  },
  gt = new Map(),
  ne = (e) => `--motion-${e}`,
  ie = ["x", "y", "z"];
Ai.forEach((e) => {
  _i.forEach((t) => {
    (ie.push(e + t), gt.set(ne(e + t), Ii[e]));
  });
});
var Di = (e, t) => ie.indexOf(e) - ie.indexOf(t),
  Ni = new Set(ie),
  oe = (e) => Ni.has(e),
  pr = (e, t) => {
    jt[t] && (t = jt[t]);
    let { transforms: r } = re(e);
    (we(r, t), (e.style.transform = Fi(r)));
  },
  Fi = (e) => e.sort(Di).reduce(Pi, "").trim(),
  Pi = (e, t) => `${e} ${t}(var(${ne(t)}))`;
var Wt = (e) => e.startsWith("--"),
  mr = new Set();
function vr(e) {
  if (!mr.has(e)) {
    mr.add(e);
    try {
      let { syntax: t, initialValue: r } = gt.has(e) ? gt.get(e) : {};
      CSS.registerProperty({
        name: e,
        inherits: !1,
        syntax: t,
        initialValue: r,
      });
    } catch {}
  }
}
var Te = (e, t) => document.createElement("div").animate(e, t),
  gr = {
    cssRegisterProperty: () =>
      typeof CSS < "u" && Object.hasOwnProperty.call(CSS, "registerProperty"),
    waapi: () => Object.hasOwnProperty.call(Element.prototype, "animate"),
    partialKeyframes: () => {
      try {
        Te({ opacity: [1] });
      } catch {
        return !1;
      }
      return !0;
    },
    finished: () => !!Te({ opacity: [0, 1] }, { duration: 0.001 }).finished,
    linearEasing: () => {
      try {
        Te({ opacity: 0 }, { easing: "linear(0, 1)" });
      } catch {
        return !1;
      }
      return !0;
    },
  },
  _e = {},
  yt = {};
for (let e in gr) yt[e] = () => (_e[e] === void 0 && (_e[e] = gr[e]()), _e[e]);
var Li = 0.015,
  Ci = (e, t) => {
    let r = "",
      i = Math.round(t / Li);
    for (let n = 0; n < i; n++) r += e(st(0, i - 1, n)) + ", ";
    return r.substring(0, r.length - 2);
  },
  Ae = (e, t) =>
    q(e)
      ? yt.linearEasing()
        ? `linear(${Ci(e, t)})`
        : B.easing
      : Mt(e)
        ? Ri(e)
        : e,
  Ri = ([e, t, r, i]) => `cubic-bezier(${e}, ${t}, ${r}, ${i})`;
function yr(e, t) {
  for (let r = 0; r < e.length; r++)
    e[r] === null && (e[r] = r ? e[r - 1] : t());
  return e;
}
var se = (e) => (Array.isArray(e) ? e : [e]);
function Bt(e) {
  return (jt[e] && (e = jt[e]), oe(e) ? ne(e) : e);
}
var Vt = {
  get: (e, t) => {
    t = Bt(t);
    let r = Wt(t) ? e.style.getPropertyValue(t) : getComputedStyle(e)[t];
    if (!r && r !== 0) {
      let i = gt.get(t);
      i && (r = i.initialValue);
    }
    return r;
  },
  set: (e, t, r) => {
    ((t = Bt(t)), Wt(t) ? e.style.setProperty(t, r) : (e.style[t] = r));
  },
};
function ae(e, t = !0) {
  if (!(!e || e.playState === "finished"))
    try {
      e.stop ? e.stop() : (t && e.commitStyles(), e.cancel());
    } catch {}
}
function br(e, t) {
  var r;
  let i = t?.toDefaultUnit || X,
    n = e[e.length - 1];
  if (ut(n)) {
    let s =
      ((r = n.match(/(-?[\d.]+)([a-z%]*)/)) === null || r === void 0
        ? void 0
        : r[2]) || "";
    s && (i = (o) => o + s);
  }
  return i;
}
function Mi() {
  return window.__MOTION_DEV_TOOLS_RECORD;
}
function le(e, t, r, i = {}, n) {
  let s = Mi(),
    o = i.record !== !1 && s,
    c,
    {
      duration: f = B.duration,
      delay: u = B.delay,
      endDelay: v = B.endDelay,
      repeat: h = B.repeat,
      easing: p = B.easing,
      persist: S = !1,
      direction: F,
      offset: k,
      allowWebkitAcceleration: C = !1,
    } = i,
    $ = re(e),
    G = oe(t),
    U = yt.waapi();
  G && pr(e, t);
  let V = Bt(t),
    tt = dr($.values, V),
    j = gt.get(V);
  return (
    ae(tt.animation, !(mt(p) && tt.generator) && i.record !== !1),
    () => {
      let rt = () => {
          var D, T;
          return (T =
            (D = Vt.get(e, V)) !== null && D !== void 0
              ? D
              : j?.initialValue) !== null && T !== void 0
            ? T
            : 0;
        },
        I = yr(se(r), rt),
        et = br(I, j);
      if (mt(p)) {
        let D = p.createAnimation(I, t !== "opacity", rt, V, tt);
        ((p = D.easing), (I = D.keyframes || I), (f = D.duration || f));
      }
      if (
        (Wt(V) && (yt.cssRegisterProperty() ? vr(V) : (U = !1)),
        G && !yt.linearEasing() && (q(p) || (ct(p) && p.some(q))) && (U = !1),
        U)
      ) {
        (j && (I = I.map((a) => (Y(a) ? j.toDefaultUnit(a) : a))),
          I.length === 1 && (!yt.partialKeyframes() || o) && I.unshift(rt()));
        let D = {
          delay: vt.ms(u),
          duration: vt.ms(f),
          endDelay: vt.ms(v),
          easing: ct(p) ? void 0 : Ae(p, f),
          direction: F,
          iterations: h + 1,
          fill: "both",
        };
        ((c = e.animate(
          {
            [V]: I,
            offset: k,
            easing: ct(p) ? p.map((a) => Ae(a, f)) : void 0,
          },
          D,
        )),
          c.finished ||
            (c.finished = new Promise((a, l) => {
              ((c.onfinish = a), (c.oncancel = l));
            })));
        let T = I[I.length - 1];
        (c.finished
          .then(() => {
            S || (Vt.set(e, V, T), c.cancel());
          })
          .catch(Ct),
          C || (c.playbackRate = 1.000001));
      } else if (n && G)
        ((I = I.map((D) => (typeof D == "string" ? parseFloat(D) : D))),
          I.length === 1 && I.unshift(parseFloat(rt())),
          (c = new n(
            (D) => {
              Vt.set(e, V, et ? et(D) : D);
            },
            I,
            Object.assign(Object.assign({}, i), { duration: f, easing: p }),
          )));
      else {
        let D = I[I.length - 1];
        Vt.set(e, V, j && Y(D) ? j.toDefaultUnit(D) : D);
      }
      return (
        o &&
          s(
            e,
            t,
            I,
            { duration: f, delay: u, easing: p, repeat: h, offset: k },
            "motion-one",
          ),
        tt.setAnimation(c),
        c
      );
    }
  );
}
var ce = (e, t) =>
  e[t] ? Object.assign(Object.assign({}, e), e[t]) : Object.assign({}, e);
function bt(e, t) {
  var r;
  return (
    typeof e == "string"
      ? t
        ? (((r = t[e]) !== null && r !== void 0) ||
            (t[e] = document.querySelectorAll(e)),
          (e = t[e]))
        : (e = document.querySelectorAll(e))
      : e instanceof Element && (e = [e]),
    Array.from(e || [])
  );
}
var ki = (e) => e(),
  _t = (e, t, r = B.duration) =>
    new Proxy(
      { animations: e.map(ki).filter(Boolean), duration: r, options: t },
      ji,
    ),
  zi = (e) => e.animations[0],
  ji = {
    get: (e, t) => {
      let r = zi(e);
      switch (t) {
        case "duration":
          return e.duration;
        case "currentTime":
          return vt.s(r?.[t] || 0);
        case "playbackRate":
        case "playState":
          return r?.[t];
        case "finished":
          return (
            e.finished ||
              (e.finished = Promise.all(e.animations.map(Wi)).catch(Ct)),
            e.finished
          );
        case "stop":
          return () => {
            e.animations.forEach((i) => ae(i));
          };
        case "forEachNative":
          return (i) => {
            e.animations.forEach((n) => i(n, e));
          };
        default:
          return typeof r?.[t] > "u"
            ? void 0
            : () => e.animations.forEach((i) => i[t]());
      }
    },
    set: (e, t, r) => {
      switch (t) {
        case "currentTime":
          r = vt.ms(r);
        case "playbackRate":
          for (let i = 0; i < e.animations.length; i++) e.animations[i][t] = r;
          return !0;
      }
      return !1;
    },
  },
  Wi = (e) => e.finished;
function wr(e = 0.1, { start: t = 0, from: r = 0, easing: i } = {}) {
  return (n, s) => {
    let o = Y(r) ? r : Bi(r, s),
      c = Math.abs(o - n),
      f = e * c;
    if (i) {
      let u = s * e;
      f = It(i)(f / u) * u;
    }
    return t + f;
  };
}
function Bi(e, t) {
  if (e === "first") return 0;
  {
    let r = t - 1;
    return e === "last" ? r : r / 2;
  }
}
function ue(e, t, r) {
  return q(e) ? e(t, r) : e;
}
function Er(e) {
  return function (r, i, n = {}) {
    r = bt(r);
    let s = r.length;
    (kt(!!s, "No valid element provided."), kt(!!i, "No keyframes defined."));
    let o = [];
    for (let c = 0; c < s; c++) {
      let f = r[c];
      for (let u in i) {
        let v = ce(n, u);
        v.delay = ue(v.delay, c, s);
        let h = le(f, u, i[u], v, e);
        o.push(h);
      }
    }
    return _t(o, n, n.duration);
  };
}
var Ie = Er(ft);
function fe(e, t) {
  var r = {};
  for (var i in e)
    Object.prototype.hasOwnProperty.call(e, i) &&
      t.indexOf(i) < 0 &&
      (r[i] = e[i]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var n = 0, i = Object.getOwnPropertySymbols(e); n < i.length; n++)
      t.indexOf(i[n]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, i[n]) &&
        (r[i[n]] = e[i[n]]);
  return r;
}
function De(e, t, r, i) {
  var n;
  return Y(t)
    ? t
    : t.startsWith("-") || t.startsWith("+")
      ? Math.max(0, e + parseFloat(t))
      : t === "<"
        ? r
        : (n = i.get(t)) !== null && n !== void 0
          ? n
          : e;
}
function Vi(e, t, r) {
  for (let i = 0; i < e.length; i++) {
    let n = e[i];
    n.at > t && n.at < r && (Ee(e, n), i--);
  }
}
function xr(e, t, r, i, n, s) {
  Vi(e, n, s);
  for (let o = 0; o < t.length; o++)
    e.push({ value: t[o], at: St(n, s, i[o]), easing: Lt(r, o) });
}
function Sr(e, t) {
  return e.at === t.at ? (e.value === null ? 1 : -1) : e.at - t.at;
}
function Or(e, t = {}) {
  var r;
  let i = $i(e, t),
    n = i.map((s) => le(...s, ft)).filter(Boolean);
  return _t(n, t, (r = i[0]) === null || r === void 0 ? void 0 : r[3].duration);
}
function $i(e, t = {}) {
  var { defaultOptions: r = {} } = t,
    i = fe(t, ["defaultOptions"]);
  let n = [],
    s = new Map(),
    o = {},
    c = new Map(),
    f = 0,
    u = 0,
    v = 0;
  for (let h = 0; h < e.length; h++) {
    let p = e[h];
    if (ut(p)) {
      c.set(p, u);
      continue;
    } else if (!Array.isArray(p)) {
      c.set(p.name, De(u, p.at, f, c));
      continue;
    }
    let [S, F, k = {}] = p;
    k.at !== void 0 && (u = De(u, k.at, f, c));
    let C = 0,
      $ = bt(S, o),
      G = $.length;
    for (let U = 0; U < G; U++) {
      let V = $[U],
        tt = Hi(V, s);
      for (let j in F) {
        let rt = Ki(j, tt),
          I = se(F[j]),
          et = ce(k, j),
          {
            duration: D = r.duration || B.duration,
            easing: T = r.easing || B.easing,
          } = et;
        if (mt(T)) {
          kt(
            j === "opacity" || I.length > 1,
            "spring must be provided 2 keyframes within timeline()",
          );
          let x = T.createAnimation(I, j !== "opacity", () => 0, j);
          ((T = x.easing), (I = x.keyframes || I), (D = x.duration || D));
        }
        let a = ue(k.delay, U, G) || 0,
          l = u + a,
          m = l + D,
          { offset: d = Ot(I.length) } = et;
        d.length === 1 && d[0] === 0 && (d[1] = 1);
        let g = d.length - I.length;
        (g > 0 && At(d, g),
          I.length === 1 && I.unshift(null),
          xr(rt, I, T, d, l, m),
          (C = Math.max(a + D, C)),
          (v = Math.max(m, v)));
      }
    }
    ((f = u), (u += C));
  }
  return (
    s.forEach((h, p) => {
      for (let S in h) {
        let F = h[S];
        F.sort(Sr);
        let k = [],
          C = [],
          $ = [];
        for (let G = 0; G < F.length; G++) {
          let { at: U, value: V, easing: tt } = F[G];
          (k.push(V), C.push(st(0, v, U)), $.push(tt || B.easing));
        }
        (C[0] !== 0 && (C.unshift(0), k.unshift(k[0]), $.unshift("linear")),
          C[C.length - 1] !== 1 && (C.push(1), k.push(null)),
          n.push([
            p,
            S,
            k,
            Object.assign(
              Object.assign(Object.assign({}, r), {
                duration: v,
                easing: $,
                offset: C,
              }),
              i,
            ),
          ]));
      }
    }),
    n
  );
}
function Hi(e, t) {
  return (!t.has(e) && t.set(e, {}), t.get(e));
}
function Ki(e, t) {
  return (t[e] || (t[e] = []), t[e]);
}
var Ui = { any: 0, all: 1 };
function Tr(e, t, { root: r, margin: i, amount: n = "any" } = {}) {
  if (typeof IntersectionObserver > "u") return () => {};
  let s = bt(e),
    o = new WeakMap(),
    c = (u) => {
      u.forEach((v) => {
        let h = o.get(v.target);
        if (v.isIntersecting !== !!h)
          if (v.isIntersecting) {
            let p = t(v);
            q(p) ? o.set(v.target, p) : f.unobserve(v.target);
          } else h && (h(v), o.delete(v.target));
      });
    },
    f = new IntersectionObserver(c, {
      root: r,
      rootMargin: i,
      threshold: typeof n == "number" ? n : Ui[n],
    });
  return (s.forEach((u) => f.observe(u)), () => f.disconnect());
}
var de = new WeakMap(),
  wt;
function qi(e, t) {
  if (t) {
    let { inlineSize: r, blockSize: i } = t[0];
    return { width: r, height: i };
  } else
    return e instanceof SVGElement && "getBBox" in e
      ? e.getBBox()
      : { width: e.offsetWidth, height: e.offsetHeight };
}
function Gi({ target: e, contentRect: t, borderBoxSize: r }) {
  var i;
  (i = de.get(e)) === null ||
    i === void 0 ||
    i.forEach((n) => {
      n({
        target: e,
        contentSize: t,
        get size() {
          return qi(e, r);
        },
      });
    });
}
function Zi(e) {
  e.forEach(Gi);
}
function Xi() {
  typeof ResizeObserver > "u" || (wt = new ResizeObserver(Zi));
}
function _r(e, t) {
  wt || Xi();
  let r = bt(e);
  return (
    r.forEach((i) => {
      let n = de.get(i);
      (n || ((n = new Set()), de.set(i, n)), n.add(t), wt?.observe(i));
    }),
    () => {
      r.forEach((i) => {
        let n = de.get(i);
        (n?.delete(t), n?.size || wt?.unobserve(i));
      });
    }
  );
}
var he = new Set(),
  $t;
function Yi() {
  (($t = () => {
    let e = { width: window.innerWidth, height: window.innerHeight },
      t = { target: window, size: e, contentSize: e };
    he.forEach((r) => r(t));
  }),
    window.addEventListener("resize", $t));
}
function Ar(e) {
  return (
    he.add(e),
    $t || Yi(),
    () => {
      (he.delete(e), !he.size && $t && ($t = void 0));
    }
  );
}
function Ir(e, t) {
  return q(e) ? Ar(e) : _r(e, t);
}
var Qi = 50,
  Dr = () => ({
    current: 0,
    offset: [],
    progress: 0,
    scrollLength: 0,
    targetOffset: 0,
    targetLength: 0,
    containerLength: 0,
    velocity: 0,
  }),
  Fr = () => ({ time: 0, x: Dr(), y: Dr() }),
  Ji = {
    x: { length: "Width", position: "Left" },
    y: { length: "Height", position: "Top" },
  };
function Nr(e, t, r, i) {
  let n = r[t],
    { length: s, position: o } = Ji[t],
    c = n.current,
    f = r.time;
  ((n.current = e["scroll" + o]),
    (n.scrollLength = e["scroll" + s] - e["client" + s]),
    (n.offset.length = 0),
    (n.offset[0] = 0),
    (n.offset[1] = n.scrollLength),
    (n.progress = st(0, n.scrollLength, n.current)));
  let u = i - f;
  n.velocity = u > Qi ? 0 : xe(n.current - c, u);
}
function Pr(e, t, r) {
  (Nr(e, "x", t, r), Nr(e, "y", t, r), (t.time = r));
}
function Lr(e, t) {
  let r = { x: 0, y: 0 },
    i = e;
  for (; i && i !== t; )
    if (i instanceof HTMLElement)
      ((r.x += i.offsetLeft), (r.y += i.offsetTop), (i = i.offsetParent));
    else if (i instanceof SVGGraphicsElement && "getBBox" in i) {
      let { top: n, left: s } = i.getBBox();
      for (r.x += s, r.y += n; i && i.tagName !== "svg"; ) i = i.parentNode;
    }
  return r;
}
var pe = {
  Enter: [
    [0, 1],
    [1, 1],
  ],
  Exit: [
    [0, 0],
    [1, 0],
  ],
  Any: [
    [1, 0],
    [0, 1],
  ],
  All: [
    [0, 0],
    [1, 1],
  ],
};
var me = { start: 0, center: 0.5, end: 1 };
function Ne(e, t, r = 0) {
  let i = 0;
  if ((me[e] !== void 0 && (e = me[e]), ut(e))) {
    let n = parseFloat(e);
    e.endsWith("px")
      ? (i = n)
      : e.endsWith("%")
        ? (e = n / 100)
        : e.endsWith("vw")
          ? (i = (n / 100) * document.documentElement.clientWidth)
          : e.endsWith("vh")
            ? (i = (n / 100) * document.documentElement.clientHeight)
            : (e = n);
  }
  return (Y(e) && (i = t * e), r + i);
}
var tn = [0, 0];
function Cr(e, t, r, i) {
  let n = Array.isArray(e) ? e : tn,
    s = 0,
    o = 0;
  return (
    Y(e)
      ? (n = [e, e])
      : ut(e) &&
        ((e = e.trim()),
        e.includes(" ") ? (n = e.split(" ")) : (n = [e, me[e] ? e : "0"])),
    (s = Ne(n[0], r, i)),
    (o = Ne(n[1], t)),
    s - o
  );
}
var en = { x: 0, y: 0 };
function Rr(e, t, r) {
  let { offset: i = pe.All } = r,
    { target: n = e, axis: s = "y" } = r,
    o = s === "y" ? "height" : "width",
    c = n !== e ? Lr(n, e) : en,
    f =
      n === e
        ? { width: e.scrollWidth, height: e.scrollHeight }
        : { width: n.clientWidth, height: n.clientHeight },
    u = { width: e.clientWidth, height: e.clientHeight };
  t[s].offset.length = 0;
  let v = !t[s].interpolate,
    h = i.length;
  for (let p = 0; p < h; p++) {
    let S = Cr(i[p], u[o], f[o], c[s]);
    (!v && S !== t[s].interpolatorOffsets[p] && (v = !0), (t[s].offset[p] = S));
  }
  (v &&
    ((t[s].interpolate = Rt(Ot(h), t[s].offset)),
    (t[s].interpolatorOffsets = [...t[s].offset])),
    (t[s].progress = t[s].interpolate(t[s].current)));
}
function rn(e, t = e, r) {
  if (((r.x.targetOffset = 0), (r.y.targetOffset = 0), t !== e)) {
    let i = t;
    for (; i && i != e; )
      ((r.x.targetOffset += i.offsetLeft),
        (r.y.targetOffset += i.offsetTop),
        (i = i.offsetParent));
  }
  ((r.x.targetLength = t === e ? t.scrollWidth : t.clientWidth),
    (r.y.targetLength = t === e ? t.scrollHeight : t.clientHeight),
    (r.x.containerLength = e.clientWidth),
    (r.y.containerLength = e.clientHeight));
}
function Mr(e, t, r, i = {}) {
  let n = i.axis || "y";
  return {
    measure: () => rn(e, i.target, r),
    update: (s) => {
      (Pr(e, r, s), (i.offset || i.target) && Rr(e, r, i));
    },
    notify: q(t) ? () => t(r) : nn(t, r[n]),
  };
}
function nn(e, t) {
  return (
    e.pause(),
    e.forEachNative((r, { easing: i }) => {
      var n, s;
      if (r.updateDuration) (i || (r.easing = X), r.updateDuration(1));
      else {
        let o = { duration: 1e3 };
        (i || (o.easing = "linear"),
          (s =
            (n = r.effect) === null || n === void 0
              ? void 0
              : n.updateTiming) === null ||
            s === void 0 ||
            s.call(n, o));
      }
    }),
    () => {
      e.currentTime = t.progress;
    }
  );
}
var Ht = new WeakMap(),
  kr = new WeakMap(),
  Fe = new WeakMap(),
  zr = (e) => (e === document.documentElement ? window : e);
function jr(e, t = {}) {
  var { container: r = document.documentElement } = t,
    i = fe(t, ["container"]);
  let n = Fe.get(r);
  n || ((n = new Set()), Fe.set(r, n));
  let s = Fr(),
    o = Mr(r, e, s, i);
  if ((n.add(o), !Ht.has(r))) {
    let u = () => {
      let h = performance.now();
      for (let p of n) p.measure();
      for (let p of n) p.update(h);
      for (let p of n) p.notify();
    };
    Ht.set(r, u);
    let v = zr(r);
    (window.addEventListener("resize", u, { passive: !0 }),
      r !== document.documentElement && kr.set(r, Ir(r, u)),
      v.addEventListener("scroll", u, { passive: !0 }));
  }
  let c = Ht.get(r),
    f = requestAnimationFrame(c);
  return () => {
    var u;
    (typeof e != "function" && e.stop(), cancelAnimationFrame(f));
    let v = Fe.get(r);
    if (!v || (v.delete(o), v.size)) return;
    let h = Ht.get(r);
    (Ht.delete(r),
      h &&
        (zr(r).removeEventListener("scroll", h),
        (u = kr.get(r)) === null || u === void 0 || u(),
        window.removeEventListener("resize", h)));
  };
}
function on(e, t = {}) {
  return _t(
    [
      () => {
        let r = new ft(e, [0, 1], t);
        return (r.finished.catch(() => {}), r);
      },
    ],
    t,
    t.duration,
  );
}
function Wr(e, t, r) {
  return (q(e) ? on : Ie)(e, t, r);
}
function dt(e) {
  ((this.listenerMap = [{}, {}]),
    e && this.root(e),
    (this.handle = dt.prototype.handle.bind(this)),
    (this._removedListeners = []));
}
dt.prototype.root = function (e) {
  let t = this.listenerMap,
    r;
  if (this.rootElement) {
    for (r in t[1])
      t[1].hasOwnProperty(r) &&
        this.rootElement.removeEventListener(r, this.handle, !0);
    for (r in t[0])
      t[0].hasOwnProperty(r) &&
        this.rootElement.removeEventListener(r, this.handle, !1);
  }
  if (!e || !e.addEventListener)
    return (this.rootElement && delete this.rootElement, this);
  this.rootElement = e;
  for (r in t[1])
    t[1].hasOwnProperty(r) &&
      this.rootElement.addEventListener(r, this.handle, !0);
  for (r in t[0])
    t[0].hasOwnProperty(r) &&
      this.rootElement.addEventListener(r, this.handle, !1);
  return this;
};
dt.prototype.captureForType = function (e) {
  return (
    ["blur", "error", "focus", "load", "resize", "scroll"].indexOf(e) !== -1
  );
};
dt.prototype.on = function (e, t, r, i) {
  let n, s, o, c;
  if (!e) throw new TypeError("Invalid event type: " + e);
  if (
    (typeof t == "function" && ((i = r), (r = t), (t = null)),
    i === void 0 && (i = this.captureForType(e)),
    typeof r != "function")
  )
    throw new TypeError("Handler must be a type of Function");
  return (
    (n = this.rootElement),
    (s = this.listenerMap[i ? 1 : 0]),
    s[e] || (n && n.addEventListener(e, this.handle, i), (s[e] = [])),
    t
      ? /^[a-z]+$/i.test(t)
        ? ((c = t), (o = sn))
        : /^#[a-z0-9\-_]+$/i.test(t)
          ? ((c = t.slice(1)), (o = ln))
          : ((c = t), (o = Element.prototype.matches))
      : ((c = null), (o = an.bind(this))),
    s[e].push({ selector: t, handler: r, matcher: o, matcherParam: c }),
    this
  );
};
dt.prototype.off = function (e, t, r, i) {
  let n, s, o, c, f;
  if ((typeof t == "function" && ((i = r), (r = t), (t = null)), i === void 0))
    return (this.off(e, t, r, !0), this.off(e, t, r, !1), this);
  if (((o = this.listenerMap[i ? 1 : 0]), !e)) {
    for (f in o) o.hasOwnProperty(f) && this.off(f, t, r);
    return this;
  }
  if (((c = o[e]), !c || !c.length)) return this;
  for (n = c.length - 1; n >= 0; n--)
    ((s = c[n]),
      (!t || t === s.selector) &&
        (!r || r === s.handler) &&
        (this._removedListeners.push(s), c.splice(n, 1)));
  return (
    c.length ||
      (delete o[e],
      this.rootElement &&
        this.rootElement.removeEventListener(e, this.handle, i)),
    this
  );
};
dt.prototype.handle = function (e) {
  let t,
    r,
    i = e.type,
    n,
    s,
    o,
    c,
    f = [],
    u,
    v = "ftLabsDelegateIgnore";
  if (e[v] === !0) return;
  switch (
    ((u = e.target),
    u.nodeType === 3 && (u = u.parentNode),
    u.correspondingUseElement && (u = u.correspondingUseElement),
    (n = this.rootElement),
    (s = e.eventPhase || (e.target !== e.currentTarget ? 3 : 2)),
    s)
  ) {
    case 1:
      f = this.listenerMap[1][i];
      break;
    case 2:
      (this.listenerMap[0] &&
        this.listenerMap[0][i] &&
        (f = f.concat(this.listenerMap[0][i])),
        this.listenerMap[1] &&
          this.listenerMap[1][i] &&
          (f = f.concat(this.listenerMap[1][i])));
      break;
    case 3:
      f = this.listenerMap[0][i];
      break;
  }
  let h = [];
  for (r = f.length; u && r; ) {
    for (t = 0; t < r && ((o = f[t]), !!o); t++)
      u.tagName &&
      ["button", "input", "select", "textarea"].indexOf(
        u.tagName.toLowerCase(),
      ) > -1 &&
      u.hasAttribute("disabled")
        ? (h = [])
        : o.matcher.call(u, o.matcherParam, u) && h.push([e, u, o]);
    if (
      u === n ||
      ((r = f.length),
      (u = u.parentElement || u.parentNode),
      u instanceof HTMLDocument)
    )
      break;
  }
  let p;
  for (t = 0; t < h.length; t++)
    if (
      !(this._removedListeners.indexOf(h[t][2]) > -1) &&
      ((c = this.fire.apply(this, h[t])), c === !1)
    ) {
      ((h[t][0][v] = !0), h[t][0].preventDefault(), (p = !1));
      break;
    }
  return p;
};
dt.prototype.fire = function (e, t, r) {
  return r.handler.call(t, e, t);
};
function sn(e, t) {
  return e.toLowerCase() === t.tagName.toLowerCase();
}
function an(e, t) {
  return this.rootElement === window
    ? t === document || t === document.documentElement || t === window
    : this.rootElement === t;
}
function ln(e, t) {
  return e === t.id;
}
dt.prototype.destroy = function () {
  (this.off(), this.root());
};
var cn = dt;
function Kt(e, t, r) {
  let i = document.createElement(t);
  return (e && (i.className = e), r && r.appendChild(i), i);
}
function un(e, t, r) {
  let i = `translate3d(${e}px,${t || 0}px,0)`;
  return (r !== void 0 && (i += ` scale3d(${r},${r},1)`), i);
}
function Pe(e, t, r) {
  ((e.style.width = typeof t == "number" ? `${t}px` : t),
    (e.style.height = typeof r == "number" ? `${r}px` : r));
}
var it = { IDLE: "idle", LOADING: "loading", LOADED: "loaded", ERROR: "error" };
function fn(e) {
  return (
    ("button" in e && e.button === 1) ||
    e.ctrlKey ||
    e.metaKey ||
    e.altKey ||
    e.shiftKey
  );
}
function Ut(e, t, r = document) {
  let i = [];
  if (e instanceof Element) i = [e];
  else if (e instanceof NodeList || Array.isArray(e)) i = Array.from(e);
  else {
    let n = typeof e == "string" ? e : t;
    n && (i = Array.from(r.querySelectorAll(n)));
  }
  return i;
}
function dn(e) {
  return typeof e == "function" && e.prototype && e.prototype.goTo;
}
function Br() {
  return !!(navigator.vendor && navigator.vendor.match(/apple/i));
}
var Le = class {
    constructor(t, r) {
      ((this.type = t),
        (this.defaultPrevented = !1),
        r && Object.assign(this, r));
    }
    preventDefault() {
      this.defaultPrevented = !0;
    }
  },
  Ce = class {
    constructor() {
      ((this._listeners = {}),
        (this._filters = {}),
        (this.pswp = void 0),
        (this.options = void 0));
    }
    addFilter(t, r, i = 100) {
      var n, s, o;
      (this._filters[t] || (this._filters[t] = []),
        (n = this._filters[t]) === null ||
          n === void 0 ||
          n.push({ fn: r, priority: i }),
        (s = this._filters[t]) === null ||
          s === void 0 ||
          s.sort((c, f) => c.priority - f.priority),
        (o = this.pswp) === null || o === void 0 || o.addFilter(t, r, i));
    }
    removeFilter(t, r) {
      (this._filters[t] &&
        (this._filters[t] = this._filters[t].filter((i) => i.fn !== r)),
        this.pswp && this.pswp.removeFilter(t, r));
    }
    applyFilters(t, ...r) {
      var i;
      return (
        (i = this._filters[t]) === null ||
          i === void 0 ||
          i.forEach((n) => {
            r[0] = n.fn.apply(this, r);
          }),
        r[0]
      );
    }
    on(t, r) {
      var i, n;
      (this._listeners[t] || (this._listeners[t] = []),
        (i = this._listeners[t]) === null || i === void 0 || i.push(r),
        (n = this.pswp) === null || n === void 0 || n.on(t, r));
    }
    off(t, r) {
      var i;
      (this._listeners[t] &&
        (this._listeners[t] = this._listeners[t].filter((n) => r !== n)),
        (i = this.pswp) === null || i === void 0 || i.off(t, r));
    }
    dispatch(t, r) {
      var i;
      if (this.pswp) return this.pswp.dispatch(t, r);
      let n = new Le(t, r);
      return (
        (i = this._listeners[t]) === null ||
          i === void 0 ||
          i.forEach((s) => {
            s.call(this, n);
          }),
        n
      );
    }
  },
  Re = class {
    constructor(t, r) {
      if (
        ((this.element = Kt(
          "pswp__img pswp__img--placeholder",
          t ? "img" : "div",
          r,
        )),
        t)
      ) {
        let i = this.element;
        ((i.decoding = "async"),
          (i.alt = ""),
          (i.src = t),
          i.setAttribute("role", "presentation"));
      }
      this.element.setAttribute("aria-hidden", "true");
    }
    setDisplayedSize(t, r) {
      this.element &&
        (this.element.tagName === "IMG"
          ? (Pe(this.element, 250, "auto"),
            (this.element.style.transformOrigin = "0 0"),
            (this.element.style.transform = un(0, 0, t / 250)))
          : Pe(this.element, t, r));
    }
    destroy() {
      var t;
      ((t = this.element) !== null &&
        t !== void 0 &&
        t.parentNode &&
        this.element.remove(),
        (this.element = null));
    }
  },
  Me = class {
    constructor(t, r, i) {
      ((this.instance = r),
        (this.data = t),
        (this.index = i),
        (this.element = void 0),
        (this.placeholder = void 0),
        (this.slide = void 0),
        (this.displayedImageWidth = 0),
        (this.displayedImageHeight = 0),
        (this.width = Number(this.data.w) || Number(this.data.width) || 0),
        (this.height = Number(this.data.h) || Number(this.data.height) || 0),
        (this.isAttached = !1),
        (this.hasSlide = !1),
        (this.isDecoding = !1),
        (this.state = it.IDLE),
        this.data.type
          ? (this.type = this.data.type)
          : this.data.src
            ? (this.type = "image")
            : (this.type = "html"),
        this.instance.dispatch("contentInit", { content: this }));
    }
    removePlaceholder() {
      this.placeholder &&
        !this.keepPlaceholder() &&
        setTimeout(() => {
          this.placeholder &&
            (this.placeholder.destroy(), (this.placeholder = void 0));
        }, 1e3);
    }
    load(t, r) {
      if (this.slide && this.usePlaceholder())
        if (this.placeholder) {
          let i = this.placeholder.element;
          i && !i.parentElement && this.slide.container.prepend(i);
        } else {
          let i = this.instance.applyFilters(
            "placeholderSrc",
            this.data.msrc && this.slide.isFirstSlide ? this.data.msrc : !1,
            this,
          );
          this.placeholder = new Re(i, this.slide.container);
        }
      (this.element && !r) ||
        this.instance.dispatch("contentLoad", { content: this, isLazy: t })
          .defaultPrevented ||
        (this.isImageContent()
          ? ((this.element = Kt("pswp__img", "img")),
            this.displayedImageWidth && this.loadImage(t))
          : ((this.element = Kt("pswp__content", "div")),
            (this.element.innerHTML = this.data.html || "")),
        r && this.slide && this.slide.updateContentSize(!0));
    }
    loadImage(t) {
      var r, i;
      if (
        !this.isImageContent() ||
        !this.element ||
        this.instance.dispatch("contentLoadImage", { content: this, isLazy: t })
          .defaultPrevented
      )
        return;
      let n = this.element;
      (this.updateSrcsetSizes(),
        this.data.srcset && (n.srcset = this.data.srcset),
        (n.src = (r = this.data.src) !== null && r !== void 0 ? r : ""),
        (n.alt = (i = this.data.alt) !== null && i !== void 0 ? i : ""),
        (this.state = it.LOADING),
        n.complete
          ? this.onLoaded()
          : ((n.onload = () => {
              this.onLoaded();
            }),
            (n.onerror = () => {
              this.onError();
            })));
    }
    setSlide(t) {
      ((this.slide = t), (this.hasSlide = !0), (this.instance = t.pswp));
    }
    onLoaded() {
      ((this.state = it.LOADED),
        this.slide &&
          this.element &&
          (this.instance.dispatch("loadComplete", {
            slide: this.slide,
            content: this,
          }),
          this.slide.isActive &&
            this.slide.heavyAppended &&
            !this.element.parentNode &&
            (this.append(), this.slide.updateContentSize(!0)),
          (this.state === it.LOADED || this.state === it.ERROR) &&
            this.removePlaceholder()));
    }
    onError() {
      ((this.state = it.ERROR),
        this.slide &&
          (this.displayError(),
          this.instance.dispatch("loadComplete", {
            slide: this.slide,
            isError: !0,
            content: this,
          }),
          this.instance.dispatch("loadError", {
            slide: this.slide,
            content: this,
          })));
    }
    isLoading() {
      return this.instance.applyFilters(
        "isContentLoading",
        this.state === it.LOADING,
        this,
      );
    }
    isError() {
      return this.state === it.ERROR;
    }
    isImageContent() {
      return this.type === "image";
    }
    setDisplayedSize(t, r) {
      if (
        this.element &&
        (this.placeholder && this.placeholder.setDisplayedSize(t, r),
        !this.instance.dispatch("contentResize", {
          content: this,
          width: t,
          height: r,
        }).defaultPrevented &&
          (Pe(this.element, t, r), this.isImageContent() && !this.isError()))
      ) {
        let i = !this.displayedImageWidth && t;
        ((this.displayedImageWidth = t),
          (this.displayedImageHeight = r),
          i ? this.loadImage(!1) : this.updateSrcsetSizes(),
          this.slide &&
            this.instance.dispatch("imageSizeChange", {
              slide: this.slide,
              width: t,
              height: r,
              content: this,
            }));
      }
    }
    isZoomable() {
      return this.instance.applyFilters(
        "isContentZoomable",
        this.isImageContent() && this.state !== it.ERROR,
        this,
      );
    }
    updateSrcsetSizes() {
      if (!this.isImageContent() || !this.element || !this.data.srcset) return;
      let t = this.element,
        r = this.instance.applyFilters(
          "srcsetSizesWidth",
          this.displayedImageWidth,
          this,
        );
      (!t.dataset.largestUsedSize ||
        r > parseInt(t.dataset.largestUsedSize, 10)) &&
        ((t.sizes = r + "px"), (t.dataset.largestUsedSize = String(r)));
    }
    usePlaceholder() {
      return this.instance.applyFilters(
        "useContentPlaceholder",
        this.isImageContent(),
        this,
      );
    }
    lazyLoad() {
      this.instance.dispatch("contentLazyLoad", { content: this })
        .defaultPrevented || this.load(!0);
    }
    keepPlaceholder() {
      return this.instance.applyFilters(
        "isKeepingPlaceholder",
        this.isLoading(),
        this,
      );
    }
    destroy() {
      ((this.hasSlide = !1),
        (this.slide = void 0),
        !this.instance.dispatch("contentDestroy", { content: this })
          .defaultPrevented &&
          (this.remove(),
          this.placeholder &&
            (this.placeholder.destroy(), (this.placeholder = void 0)),
          this.isImageContent() &&
            this.element &&
            ((this.element.onload = null),
            (this.element.onerror = null),
            (this.element = void 0))));
    }
    displayError() {
      if (this.slide) {
        var t, r;
        let i = Kt("pswp__error-msg", "div");
        ((i.innerText =
          (t =
            (r = this.instance.options) === null || r === void 0
              ? void 0
              : r.errorMsg) !== null && t !== void 0
            ? t
            : ""),
          (i = this.instance.applyFilters("contentErrorElement", i, this)),
          (this.element = Kt("pswp__content pswp__error-msg-container", "div")),
          this.element.appendChild(i),
          (this.slide.container.innerText = ""),
          this.slide.container.appendChild(this.element),
          this.slide.updateContentSize(!0),
          this.removePlaceholder());
      }
    }
    append() {
      if (this.isAttached || !this.element) return;
      if (((this.isAttached = !0), this.state === it.ERROR)) {
        this.displayError();
        return;
      }
      if (
        this.instance.dispatch("contentAppend", { content: this })
          .defaultPrevented
      )
        return;
      let t = "decode" in this.element;
      this.isImageContent()
        ? t && this.slide && (!this.slide.isActive || Br())
          ? ((this.isDecoding = !0),
            this.element
              .decode()
              .catch(() => {})
              .finally(() => {
                ((this.isDecoding = !1), this.appendImage());
              }))
          : this.appendImage()
        : this.slide &&
          !this.element.parentNode &&
          this.slide.container.appendChild(this.element);
    }
    activate() {
      this.instance.dispatch("contentActivate", { content: this })
        .defaultPrevented ||
        !this.slide ||
        (this.isImageContent() && this.isDecoding && !Br()
          ? this.appendImage()
          : this.isError() && this.load(!1, !0),
        this.slide.holderElement &&
          this.slide.holderElement.setAttribute("aria-hidden", "false"));
    }
    deactivate() {
      (this.instance.dispatch("contentDeactivate", { content: this }),
        this.slide &&
          this.slide.holderElement &&
          this.slide.holderElement.setAttribute("aria-hidden", "true"));
    }
    remove() {
      ((this.isAttached = !1),
        !this.instance.dispatch("contentRemove", { content: this })
          .defaultPrevented &&
          (this.element && this.element.parentNode && this.element.remove(),
          this.placeholder &&
            this.placeholder.element &&
            this.placeholder.element.remove()));
    }
    appendImage() {
      this.isAttached &&
        (this.instance.dispatch("contentAppendImage", { content: this })
          .defaultPrevented ||
          (this.slide &&
            this.element &&
            !this.element.parentNode &&
            this.slide.container.appendChild(this.element),
          (this.state === it.LOADED || this.state === it.ERROR) &&
            this.removePlaceholder()));
    }
  };
function hn(e, t) {
  if (e.getViewportSizeFn) {
    let r = e.getViewportSizeFn(e, t);
    if (r) return r;
  }
  return { x: document.documentElement.clientWidth, y: window.innerHeight };
}
function ve(e, t, r, i, n) {
  let s = 0;
  if (t.paddingFn) s = t.paddingFn(r, i, n)[e];
  else if (t.padding) s = t.padding[e];
  else {
    let o = "padding" + e[0].toUpperCase() + e.slice(1);
    t[o] && (s = t[o]);
  }
  return Number(s) || 0;
}
function pn(e, t, r, i) {
  return {
    x: t.x - ve("left", e, t, r, i) - ve("right", e, t, r, i),
    y: t.y - ve("top", e, t, r, i) - ve("bottom", e, t, r, i),
  };
}
var Vr = 4e3,
  ke = class {
    constructor(t, r, i, n) {
      ((this.pswp = n),
        (this.options = t),
        (this.itemData = r),
        (this.index = i),
        (this.panAreaSize = null),
        (this.elementSize = null),
        (this.fit = 1),
        (this.fill = 1),
        (this.vFill = 1),
        (this.initial = 1),
        (this.secondary = 1),
        (this.max = 1),
        (this.min = 1));
    }
    update(t, r, i) {
      let n = { x: t, y: r };
      ((this.elementSize = n), (this.panAreaSize = i));
      let s = i.x / n.x,
        o = i.y / n.y;
      ((this.fit = Math.min(1, s < o ? s : o)),
        (this.fill = Math.min(1, s > o ? s : o)),
        (this.vFill = Math.min(1, o)),
        (this.initial = this._getInitial()),
        (this.secondary = this._getSecondary()),
        (this.max = Math.max(this.initial, this.secondary, this._getMax())),
        (this.min = Math.min(this.fit, this.initial, this.secondary)),
        this.pswp &&
          this.pswp.dispatch("zoomLevelsUpdate", {
            zoomLevels: this,
            slideData: this.itemData,
          }));
    }
    _parseZoomLevelOption(t) {
      let r = t + "ZoomLevel",
        i = this.options[r];
      if (i)
        return typeof i == "function"
          ? i(this)
          : i === "fill"
            ? this.fill
            : i === "fit"
              ? this.fit
              : Number(i);
    }
    _getSecondary() {
      let t = this._parseZoomLevelOption("secondary");
      return (
        t ||
        ((t = Math.min(1, this.fit * 3)),
        this.elementSize &&
          t * this.elementSize.x > Vr &&
          (t = Vr / this.elementSize.x),
        t)
      );
    }
    _getInitial() {
      return this._parseZoomLevelOption("initial") || this.fit;
    }
    _getMax() {
      return this._parseZoomLevelOption("max") || Math.max(1, this.fit * 4);
    }
  };
function $r(e, t, r) {
  let i = t.createContentFromData(e, r),
    n,
    { options: s } = t;
  if (s) {
    n = new ke(s, e, -1);
    let o;
    t.pswp ? (o = t.pswp.viewportSize) : (o = hn(s, t));
    let c = pn(s, o, e, r);
    n.update(i.width, i.height, c);
  }
  return (
    i.lazyLoad(),
    n &&
      i.setDisplayedSize(
        Math.ceil(i.width * n.initial),
        Math.ceil(i.height * n.initial),
      ),
    i
  );
}
function mn(e, t) {
  let r = t.getItemData(e);
  if (!t.dispatch("lazyLoadSlide", { index: e, itemData: r }).defaultPrevented)
    return $r(r, t, e);
}
var ze = class extends Ce {
    getNumItems() {
      var t;
      let r = 0,
        i = (t = this.options) === null || t === void 0 ? void 0 : t.dataSource;
      i && "length" in i
        ? (r = i.length)
        : i &&
          "gallery" in i &&
          (i.items || (i.items = this._getGalleryDOMElements(i.gallery)),
          i.items && (r = i.items.length));
      let n = this.dispatch("numItems", { dataSource: i, numItems: r });
      return this.applyFilters("numItems", n.numItems, i);
    }
    createContentFromData(t, r) {
      return new Me(t, this, r);
    }
    getItemData(t) {
      var r;
      let i =
          (r = this.options) === null || r === void 0 ? void 0 : r.dataSource,
        n = {};
      Array.isArray(i)
        ? (n = i[t])
        : i &&
          "gallery" in i &&
          (i.items || (i.items = this._getGalleryDOMElements(i.gallery)),
          (n = i.items[t]));
      let s = n;
      s instanceof Element && (s = this._domElementToItemData(s));
      let o = this.dispatch("itemData", { itemData: s || {}, index: t });
      return this.applyFilters("itemData", o.itemData, t);
    }
    _getGalleryDOMElements(t) {
      var r, i;
      return ((r = this.options) !== null && r !== void 0 && r.children) ||
        ((i = this.options) !== null && i !== void 0 && i.childSelector)
        ? Ut(this.options.children, this.options.childSelector, t) || []
        : [t];
    }
    _domElementToItemData(t) {
      let r = { element: t },
        i = t.tagName === "A" ? t : t.querySelector("a");
      if (i) {
        ((r.src = i.dataset.pswpSrc || i.href),
          i.dataset.pswpSrcset && (r.srcset = i.dataset.pswpSrcset),
          (r.width = i.dataset.pswpWidth
            ? parseInt(i.dataset.pswpWidth, 10)
            : 0),
          (r.height = i.dataset.pswpHeight
            ? parseInt(i.dataset.pswpHeight, 10)
            : 0),
          (r.w = r.width),
          (r.h = r.height),
          i.dataset.pswpType && (r.type = i.dataset.pswpType));
        let s = t.querySelector("img");
        if (s) {
          var n;
          ((r.msrc = s.currentSrc || s.src),
            (r.alt =
              (n = s.getAttribute("alt")) !== null && n !== void 0 ? n : ""));
        }
        (i.dataset.pswpCropped || i.dataset.cropped) && (r.thumbCropped = !0);
      }
      return this.applyFilters("domItemData", r, t, i);
    }
    lazyLoadData(t, r) {
      return $r(t, this, r);
    }
  },
  je = class extends ze {
    constructor(t) {
      (super(),
        (this.options = t || {}),
        (this._uid = 0),
        (this.shouldOpen = !1),
        (this._preloadedContent = void 0),
        (this.onThumbnailsClick = this.onThumbnailsClick.bind(this)));
    }
    init() {
      Ut(this.options.gallery, this.options.gallerySelector).forEach((t) => {
        t.addEventListener("click", this.onThumbnailsClick, !1);
      });
    }
    onThumbnailsClick(t) {
      if (fn(t) || window.pswp) return;
      let r = { x: t.clientX, y: t.clientY };
      !r.x && !r.y && (r = null);
      let i = this.getClickedIndex(t);
      i = this.applyFilters("clickedIndex", i, t, this);
      let n = { gallery: t.currentTarget };
      i >= 0 && (t.preventDefault(), this.loadAndOpen(i, n, r));
    }
    getClickedIndex(t) {
      if (this.options.getClickedIndexFn)
        return this.options.getClickedIndexFn.call(this, t);
      let r = t.target,
        n = Ut(
          this.options.children,
          this.options.childSelector,
          t.currentTarget,
        ).findIndex((s) => s === r || s.contains(r));
      return n !== -1
        ? n
        : this.options.children || this.options.childSelector
          ? -1
          : 0;
    }
    loadAndOpen(t, r, i) {
      if (window.pswp || !this.options) return !1;
      if (!r && this.options.gallery && this.options.children) {
        let n = Ut(this.options.gallery);
        n[0] && (r = { gallery: n[0] });
      }
      return (
        (this.options.index = t),
        (this.options.initialPointerPos = i),
        (this.shouldOpen = !0),
        this.preload(t, r),
        !0
      );
    }
    preload(t, r) {
      let { options: i } = this;
      r && (i.dataSource = r);
      let n = [],
        s = typeof i.pswpModule;
      if (dn(i.pswpModule)) n.push(Promise.resolve(i.pswpModule));
      else {
        if (s === "string")
          throw new Error("pswpModule as string is no longer supported");
        if (s === "function") n.push(i.pswpModule());
        else throw new Error("pswpModule is not valid");
      }
      (typeof i.openPromise == "function" && n.push(i.openPromise()),
        i.preloadFirstSlide !== !1 &&
          t >= 0 &&
          (this._preloadedContent = mn(t, this)));
      let o = ++this._uid;
      Promise.all(n).then((c) => {
        if (this.shouldOpen) {
          let f = c[0];
          this._openPhotoswipe(f, o);
        }
      });
    }
    _openPhotoswipe(t, r) {
      if (
        (r !== this._uid && this.shouldOpen) ||
        ((this.shouldOpen = !1), window.pswp)
      )
        return;
      let i =
        typeof t == "object"
          ? new t.default(this.options)
          : new t(this.options);
      ((this.pswp = i),
        (window.pswp = i),
        Object.keys(this._listeners).forEach((n) => {
          var s;
          (s = this._listeners[n]) === null ||
            s === void 0 ||
            s.forEach((o) => {
              i.on(n, o);
            });
        }),
        Object.keys(this._filters).forEach((n) => {
          var s;
          (s = this._filters[n]) === null ||
            s === void 0 ||
            s.forEach((o) => {
              i.addFilter(n, o.fn, o.priority);
            });
        }),
        this._preloadedContent &&
          (i.contentLoader.addToCache(this._preloadedContent),
          (this._preloadedContent = void 0)),
        i.on("destroy", () => {
          ((this.pswp = void 0), delete window.pswp);
        }),
        i.init());
    }
    destroy() {
      var t;
      ((t = this.pswp) === null || t === void 0 || t.destroy(),
        (this.shouldOpen = !1),
        (this._listeners = {}),
        Ut(this.options.gallery, this.options.gallerySelector).forEach((r) => {
          r.removeEventListener("click", this.onThumbnailsClick, !1);
        }));
    }
  };
(function () {
  let e = !1;
  if (
    (document.createElement("i").addEventListener("click", () => {}, {
      get signal() {
        e = !0;
      },
    }),
    e || !window.AbortController)
  )
    return;
  let t = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (r, i, n) {
    if (n && n.signal) {
      if (n.signal.aborted) return;
      n.signal.addEventListener("abort", () =>
        this.removeEventListener(r, i, { ...n }),
      );
    }
    return t.call(this, r, i, n);
  };
})();
export {
  cn as Delegate,
  lr as FocusTrap,
  je as PhotoSwipeLightbox,
  pe as ScrollOffset,
  Wr as animate,
  Tr as inView,
  jr as scroll,
  wr as stagger,
  Or as timeline,
};
/*! Bundled license information:

@ungap/custom-elements/es.js:
  (*! (c) Andrea Giammarchi - ISC *)

instant.page/instantpage.js:
  (*! instant.page v5.2.0 - (C) 2019-2023 Alexandre Dieulot - https://instant.page/license *)

tabbable/dist/index.esm.js:
  (*!
  * tabbable 6.2.0
  * @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
  *)

focus-trap/dist/focus-trap.esm.js:
  (*!
  * focus-trap 7.5.4
  * @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
  *)

photoswipe/dist/photoswipe-lightbox.esm.js:
  (*!
    * PhotoSwipe Lightbox 5.4.3 - https://photoswipe.com
    * (c) 2023 Dmytro Semenov
    *)
*/
