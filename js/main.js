(() => {
  "use strict";

  const config = window.SITE_CONFIG || {};
  const siteTimeZone = config.timezone || "America/Bogota";
  const allPicks = Array.isArray(window.DAILY_PICKS)
    ? [...window.DAILY_PICKS].sort((a, b) => String(a.date).localeCompare(String(b.date)))
    : [];

  const $ = (id) => document.getElementById(id);
  const setText = (id, value) => {
    const el = $(id);
    if (el) el.textContent = value;
  };

  const escapeHTML = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };
      return entities[char];
    });

  const iconNames = new Set([
    "flag",
    "corner",
    "clock",
    "ball",
    "target",
    "chart",
    "wallet",
    "shield",
    "alert",
    "spark",
  ]);

  const safeIcon = (name) => (iconNames.has(name) ? name : "target");
  const safeColor = (value, fallback) =>
    /^#[0-9a-f]{3,8}$/i.test(String(value || "")) ? value : fallback;

  let closeMobileMenu = () => {};

  function setActiveNav(id) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function scrollToSection(hash, updateHistory = true) {
    const target = document.querySelector(hash);
    if (!target) return false;

    const header = document.querySelector("header");
    const offset = (header?.getBoundingClientRect().height || 76) + 14;
    const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });

    if (updateHistory && window.location.hash !== hash) {
      try {
        window.history.pushState(null, "", hash);
      } catch (error) {
        // En algunos navegadores los archivos locales no permiten pushState.
      }
    }
    return true;
  }

  function setupAnchorNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const hash = link.getAttribute("href");
        if (!hash || hash === "#" || hash === "#contenido") return;
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (!document.querySelector(hash)) return;

        event.preventDefault();
        closeMobileMenu();

        window.requestAnimationFrame(() => {
          scrollToSection(hash);
          const hasNavLink = [...document.querySelectorAll(".nav-link")].some(
            (navLink) => navLink.getAttribute("href") === hash
          );
          if (hasNavLink) setActiveNav(hash.slice(1));
        });
      });
    });

    window.addEventListener("popstate", () => {
      const hash = window.location.hash;
      if (hash && document.querySelector(hash)) {
        scrollToSection(hash, false);
        setActiveNav(hash.slice(1));
      }
    });
  }

  const dateFromISO = (isoDate) => {
    const [year, month, day] = String(isoDate).split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  };

  const longDateFormatter = new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });

  const monthShort = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

  function formatLongDate(isoDate) {
    const formatted = longDateFormatter.format(dateFromISO(isoDate));
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  function formatShortDate(isoDate) {
    const date = dateFromISO(isoDate);
    return `${String(date.getUTCDate()).padStart(2, "0")} ${monthShort[date.getUTCMonth()]}`;
  }

  function dateInSiteTimeZone(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: siteTimeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);

    const get = (type) => parts.find((part) => part.type === type)?.value || "";
    return `${get("year")}-${get("month")}-${get("day")}`;
  }

  const today = dateInSiteTimeZone();
  const todayPick = allPicks.find((pick) => pick.date === today);
  const pastPicks = allPicks.filter((pick) => pick.date < today);
  const upcomingPicks = allPicks.filter((pick) => pick.date > today);
  const currentPick = todayPick || pastPicks.at(-1) || upcomingPicks[0];

  const status = todayPick ? "today" : pastPicks.length ? "latest" : "upcoming";
  const statusConfig = {
    today: {
      label: "Publicado hoy",
      topLabel: "Pick de hoy disponible",
      badge: "bg-ink text-lime",
      dot: "bg-lime",
    },
    latest: {
      label: "Última publicación",
      topLabel: "Último pick disponible",
      badge: "bg-amber text-ink",
      dot: "bg-ink",
    },
    upcoming: {
      label: "Próximamente",
      topLabel: "Próximo pick programado",
      badge: "bg-ink/10 text-ink",
      dot: "bg-ink/50",
    },
  };

  function renderStatus() {
    if (!currentPick) {
      setText("topStatus", "Sin pick publicado");
      setText("pickStatus", "Pendiente");
      return;
    }

    const statusInfo = statusConfig[status];
    setText("topStatus", statusInfo.topLabel);
    setText("topDate", formatShortDate(currentPick.date));

    const badge = $("pickStatus");
    if (badge) {
      badge.className = `inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[0.56rem] font-extrabold uppercase tracking-[0.12em] ${statusInfo.badge}`;
      badge.innerHTML = `<span class="h-1.5 w-1.5 rounded-full ${statusInfo.dot}"></span>${statusInfo.label}`;
    }
  }

  function renderTicket(pick) {
    setText("pickDate", formatLongDate(pick.date));
    setText("pickSportCompetition", `${pick.sport} · ${pick.competition}`);
    setText(
      "pickKickoffMeta",
      `${status === "today" ? "Hoy" : formatShortDate(pick.date)} · ${pick.kickoff} ${pick.timezone || "COT"}`
    );
    setText("pickSelection", pick.selection);
    setText("pickMarket", pick.market);
    setText("pickOdds", pick.odds);
    setText("pickBetType", pick.typeShort || "Pick");
    setText("ticketId", pick.id || "PICK-DIARIO");

    const homeCrest = $("homeCrest");
    const awayCrest = $("awayCrest");
    if (homeCrest) {
      homeCrest.style.backgroundColor = safeColor(pick.home.color, "#2f7d32");
      homeCrest.style.color = safeColor(pick.home.textColor, "#f4f1e6");
    }
    if (awayCrest) {
      awayCrest.style.backgroundColor = safeColor(pick.away.color, "#1e3a8a");
      awayCrest.style.color = safeColor(pick.away.textColor, "#f4f1e6");
    }

    setText("homeShort", pick.home.short);
    setText("homeName", pick.home.name);
    setText("awayShort", pick.away.short);
    setText("awayName", pick.away.name);

    const conditions = $("ticketConditions");
    if (conditions) {
      conditions.innerHTML = pick.conditions
        .map(
          (condition) => `
            <li class="condition-card">
              <span class="condition-icon">
                <svg aria-hidden="true"><use href="#icon-${safeIcon(condition.icon)}"></use></svg>
              </span>
              <div>
                <p class="text-[0.55rem] font-extrabold uppercase tracking-[0.12em] text-ink/60">${escapeHTML(condition.label)}</p>
                <p class="mt-0.5 text-[0.7rem] font-bold leading-4 text-ink">${escapeHTML(condition.value)}</p>
              </div>
            </li>`
        )
        .join("");
    }

    setText("analysisText", pick.analysis);

    const keys = $("pickKeys");
    if (keys) {
      keys.innerHTML = pick.keys
        .map(
          (key) => `
            <div class="feature-card">
              <svg class="h-5 w-5 text-lime" aria-hidden="true"><use href="#icon-${safeIcon(key.icon)}"></use></svg>
              <h3 class="mt-5 font-display text-2xl font-semibold uppercase leading-none">${escapeHTML(key.title)}</h3>
              <p class="mt-2 text-xs leading-6 text-smoke">${escapeHTML(key.text)}</p>
            </div>`
        )
        .join("");
    }

    setText("factMatch", `${pick.home.name} vs ${pick.away.name}`);
    setText("factCompetition", pick.competition);
    setText("factKickoff", `${pick.kickoff} (${pick.timezone || "COT"})`);
    setText("factVenue", pick.venue);
    setText("factBetType", pick.typeLong || pick.typeShort || "Pick");
    setText("factStake", pick.stake);

    const notice = $("pickNotice");
    if (notice) {
      if (status === "today") {
        notice.classList.add("hidden");
        notice.textContent = "";
      } else if (status === "latest") {
        notice.textContent =
          "Este es el último pick publicado. La próxima edición se avisa primero en Telegram.";
        notice.classList.remove("hidden");
      } else {
        notice.textContent = "El próximo pick ya está programado. Vuelve en la fecha indicada.";
        notice.classList.remove("hidden");
      }
    }
  }

  function buildPickText(pick) {
    const conditions = pick.conditions.map((condition) => `• ${condition.label}: ${condition.value}`).join("\n");
    return [
      `PICK DEL DÍA · ${formatLongDate(pick.date).toUpperCase()}`,
      `${pick.home.name} vs ${pick.away.name} · ${pick.competition}`,
      "",
      `Pick: ${pick.selection} — ${pick.market}`,
      `Cuota ref.: ${pick.odds} · ${pick.typeLong || pick.typeShort}`,
      "",
      "Condiciones:",
      conditions,
      "",
      `Stake sugerido: ${pick.stake}`,
      "Análisis gratuito. +18. Las apuestas conllevan riesgo. Juega responsable.",
    ].join("\n");
  }

  let toastTimer;
  function showToast(message) {
    const toast = $("toast");
    const text = $("toastText");
    if (!toast || !text) return;
    text.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) throw new Error("No se pudo copiar");
  }

  function setupActions(pick) {
    const copyButton = $("copyPick");
    const shareButton = $("sharePick");
    if (!pick) {
      if (copyButton) copyButton.disabled = true;
      if (shareButton) shareButton.disabled = true;
      return;
    }

    copyButton?.addEventListener("click", async () => {
      try {
        await copyText(buildPickText(pick));
        showToast("Pick copiado. Ahora tú decides.");
      } catch (error) {
        showToast("No se pudo copiar. Intenta de nuevo.");
      }
    });

    shareButton?.addEventListener("click", async () => {
      const shareData = {
        title: `${pick.home.name} vs ${pick.away.name} | Pick Diario`,
        text: buildPickText(pick),
        url: `${window.location.href.split("#")[0]}#ticket`,
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          return;
        } catch (error) {
          if (error?.name === "AbortError") return;
        }
      }

      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareData.text}\n\n${shareData.url}`)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });
  }

  function setupSocialLinks() {
    document.querySelectorAll("[data-social]").forEach((link) => {
      const key = link.dataset.social;
      const social = config.socials?.[key];

      if (!social?.url) {
        link.style.display = "none";
        return;
      }

      link.href = social.url;
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });

    document.querySelectorAll("[data-social-handle]").forEach((element) => {
      const social = config.socials?.[element.dataset.socialHandle];
      if (social?.handle) element.textContent = social.handle;
    });

    document.querySelectorAll("[data-email]").forEach((link) => {
      if (config.email) link.href = `mailto:${config.email}`;
    });
  }

  function setupMobileMenu() {
    const toggle = $("menuToggle");
    const menu = $("mobileMenu");
    const openIcon = $("menuIconOpen");
    const closeIcon = $("menuIconClose");
    if (!toggle || !menu) return;

    const setMenuOpen = (open) => {
      menu.classList.toggle("hidden", !open);
      menu.setAttribute("aria-hidden", String(!open));
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú de navegación" : "Abrir menú de navegación");
      openIcon?.classList.toggle("hidden", open);
      closeIcon?.classList.toggle("hidden", !open);
    };

    closeMobileMenu = () => setMenuOpen(false);

    toggle.addEventListener("click", () => {
      setMenuOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMobileMenu());
    });

    document.addEventListener("click", (event) => {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      const clickedInsideMenu = event.target.closest("#mobileMenu");
      const clickedToggle = event.target.closest("#menuToggle");
      if (!clickedInsideMenu && !clickedToggle) closeMobileMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeMobileMenu();
        toggle.focus();
      }
    });

    window.matchMedia("(min-width: 1024px)").addEventListener("change", (event) => {
      if (event.matches) closeMobileMenu();
    });
  }

  function setupNavSpy() {
    const links = [...document.querySelectorAll(".nav-link")].filter((link) => {
      const hash = link.getAttribute("href");
      return hash?.startsWith("#") && hash !== "#deportes" && document.querySelector(hash);
    });

    if (!links.length || !("IntersectionObserver" in window)) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveNav(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
    );

    links.forEach((link) => {
      const section = document.querySelector(link.getAttribute("href"));
      if (section) sectionObserver.observe(section);
    });
  }

  function setupReveals() {
    const elements = [...document.querySelectorAll(".reveal")];
    elements.forEach((element, index) => {
      if (!element.style.transitionDelay) {
        element.style.transitionDelay = `${Math.min(index * 35, 210)}ms`;
      }
    });

    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    elements.forEach((element) => observer.observe(element));
  }

  function setupFaq() {
    const items = [...document.querySelectorAll(".faq-item")];
    items.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        items.forEach((other) => {
          if (other !== item) other.open = false;
        });
      });
    });
  }

  function setupCountdown() {
    const countdown = $("countdown");
    if (!countdown) return;

    const tick = () => {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: siteTimeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      }).formatToParts(new Date());

      const get = (type) => Number(parts.find((part) => part.type === type)?.value || 0);
      const secondsLeft = 86400 - (get("hour") * 3600 + get("minute") * 60 + get("second"));
      const hours = Math.floor(secondsLeft / 3600);
      const minutes = Math.floor((secondsLeft % 3600) / 60);
      const seconds = secondsLeft % 60;

      countdown.textContent = [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
      countdown.title = `Próximo cambio de día en ${siteTimeZone}`;
    };

    tick();
    window.setInterval(tick, 1000);
  }

  function init() {
    renderStatus();
    if (currentPick) {
      renderTicket(currentPick);
      setupActions(currentPick);
      document.title = `${currentPick.home.name} vs ${currentPick.away.name} | Pick Diario`;
    } else {
      setupActions(null);
    }

    setupSocialLinks();
    setupMobileMenu();
    setupAnchorNavigation();
    setupNavSpy();
    setupReveals();
    setupFaq();
    setupCountdown();
    setText("year", new Date().getFullYear());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
