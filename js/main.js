/* Moxiflox Medical — site script
 *
 * Two jobs:
 *   1. Update the footer copyright year.
 *   2. Mount Cal.com inline booking widgets on book.html.
 *
 * The Cal.com embed snippet below is the official one from Cal's "Embed code"
 * generator — it self-bootstraps the Cal namespace, queues commands until
 * embed.js loads, then flushes them in order.
 *
 * To change the booking events, edit `data-cal-link` attributes in book.html
 * (format: "<cal-username>/<event-slug>"). To switch accounts, search-replace
 * the username throughout HTML files.
 */

// ---------- Footer year ----------
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  mountCalEmbeds();
});

// ---------- Cal.com embeds ----------
function mountCalEmbeds() {
  const targets = document.querySelectorAll(".booking-embed[data-cal-link]");
  if (!targets.length) return;

  // Official Cal.com embed bootstrap (from cal.com/docs/embed)
  // eslint-disable-next-line
  (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");

  targets.forEach((target, i) => {
    const calLink = target.getAttribute("data-cal-link");
    if (!calLink) return;

    const ns = `mx${i}`;
    const mount = document.createElement("div");
    mount.style.minHeight = "640px";
    mount.style.width = "100%";

    // Replace placeholder with mount node
    const placeholder = target.querySelector(".embed-placeholder");
    if (placeholder) placeholder.remove();
    target.appendChild(mount);
    target.setAttribute("data-embed-loaded", "true");

    // Init this namespace, then mount the inline embed into the new div
    window.Cal("init", ns, { origin: "https://cal.com" });
    window.Cal.ns[ns]("inline", {
      elementOrSelector: mount,
      calLink: calLink,
      layout: "month_view",
    });
    window.Cal.ns[ns]("ui", {
      hideEventTypeDetails: false,
      layout: "month_view",
    });
  });
}
