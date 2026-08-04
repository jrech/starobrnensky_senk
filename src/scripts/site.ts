import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { getOpeningStatus, type OpeningHours, type OperatingStatusOverride } from "../lib/opening-status";

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;
const header = document.querySelector<HTMLElement>("[data-header]");
const menuButton = document.querySelector<HTMLButtonElement>(".menu-toggle");
const mobileMenu = document.querySelector<HTMLElement>(".mobile-menu");
const mobileMenuItems = mobileMenu?.querySelectorAll<HTMLElement>("nav a, .mobile-contact-link, .mobile-contact-label") || [];
const allergenDialog = document.querySelector<HTMLDialogElement>("[data-allergen-dialog]");
const heroStatus = document.querySelector<HTMLElement>("[data-hero-status]");

function updateLunchWeekLabel() {
  const target = document.querySelector<HTMLElement>("[data-lunch-updated]");
  if (!target) return;

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Prague",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(new Date());
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || "";
  const weekday = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 }[value("weekday") as "Mon"] ?? 1;
  const monday = new Date(Date.UTC(Number(value("year")), Number(value("month")) - 1, Number(value("day")) - ((weekday + 6) % 7), 12));
  const friday = new Date(monday);
  friday.setUTCDate(monday.getUTCDate() + 4);
  const months = ["ledna", "února", "března", "dubna", "května", "června", "července", "srpna", "září", "října", "listopadu", "prosince"];
  target.textContent = `Obědové menu · ${monday.getUTCDate()}.–${friday.getUTCDate()}. ${months[friday.getUTCMonth()]} ${friday.getUTCFullYear()}`;
}

updateLunchWeekLabel();

if (heroStatus) {
  try {
    const hours = JSON.parse(heroStatus.dataset.hours || "[]") as OpeningHours[];
    const override = JSON.parse(heroStatus.dataset.statusOverride || "{}") as OperatingStatusOverride;
    const message = heroStatus.querySelector<HTMLElement>("[data-hero-status-message]");
    const updateHeroStatus = () => {
      const status = getOpeningStatus(hours, override);
      heroStatus.classList.toggle("is-open", status.state === "open");
      heroStatus.classList.toggle("is-closed", status.state === "closed");
      heroStatus.setAttribute("aria-label", status.message);
      if (message) message.textContent = status.message;
    };
    const scheduleHeroStatusUpdate = () => {
      updateHeroStatus();
      window.setTimeout(scheduleHeroStatusUpdate, 60_000 - (Date.now() % 60_000) + 50);
    };
    scheduleHeroStatusUpdate();
  } catch (error) {
    console.warn("Hero operating status could not be updated.", error);
  }
}

function setMenu(open: boolean) {
  menuButton?.setAttribute("aria-expanded", String(open));
  menuButton?.setAttribute("aria-label", open ? "Zavřít menu" : "Otevřít menu");
  mobileMenu?.setAttribute("aria-hidden", String(!open));
  mobileMenu?.classList.toggle("is-open", open);
  header?.classList.toggle("menu-active", open);
  document.body.classList.toggle("menu-open", open);

  if (!reduceMotion && open && mobileMenuItems.length) {
    gsap.fromTo(mobileMenuItems, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .7, stagger: .09, delay: .14, ease: "power3.out", overwrite: "auto" });
  }

  if (!open) gsap.killTweensOf(mobileMenuItems);
}

menuButton?.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

document.querySelector<HTMLButtonElement>("[data-allergen-open]")?.addEventListener("click", () => allergenDialog?.showModal());
document.querySelector<HTMLButtonElement>("[data-allergen-close]")?.addEventListener("click", () => allergenDialog?.close());
allergenDialog?.addEventListener("click", (event) => {
  if (event.target === allergenDialog) allergenDialog.close();
});

const updateHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 32);
};
updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-tab]"));
const panels = Array.from(document.querySelectorAll<HTMLElement>("[data-panel]"));

function activateTab(index: number, focus = false) {
  tabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });

  panels.forEach((panel, panelIndex) => {
    const active = panelIndex === index;
    panel.hidden = !active;
    if (active && !reduceMotion) gsap.fromTo(panel, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .42, ease: "power2.out" });
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(index));
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    activateTab((index + direction + tabs.length) % tabs.length, true);
  });
});

const today = new Date().toISOString().slice(0, 10);
const matchingPanel = Array.from(document.querySelectorAll<HTMLElement>(".lunch-panel")).findIndex((panel) => {
  const tabIndex = panel.dataset.panel;
  const tab = document.querySelector<HTMLElement>(`[data-tab="${tabIndex}"]`);
  return tab?.getAttribute("data-date") === today;
});
if (matchingPanel >= 0) activateTab(matchingPanel);

const rumViewport = document.querySelector<HTMLElement>("[data-rum-viewport]");
rumViewport?.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  event.preventDefault();
  rumViewport.scrollBy({ left: event.key === "ArrowRight" ? 360 : -360, behavior: reduceMotion ? "auto" : "smooth" });
});

const reservationForm = document.querySelector<HTMLFormElement>("[data-reservation-form]");
const formStatus = document.querySelector<HTMLElement>("[data-form-status]");
const dateInput = reservationForm?.querySelector<HTMLInputElement>('input[type="date"]');
if (dateInput) dateInput.min = today;

reservationForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!reservationForm.reportValidity() || !formStatus) return;
  const submit = reservationForm.querySelector<HTMLButtonElement>('button[type="submit"]');
  formStatus.className = "form-status";
  formStatus.textContent = "Odesíláme žádost…";
  if (submit) submit.disabled = true;

  try {
    const payload = Object.fromEntries(new FormData(reservationForm));
    const response = await fetch(reservationForm.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "Žádost se nepodařilo odeslat.");
    formStatus.classList.add("is-success");
    formStatus.textContent = "Děkujeme. Ozveme se vám s potvrzením rezervace.";
    reservationForm.reset();
  } catch (error) {
    formStatus.classList.add("is-error");
    formStatus.textContent = error instanceof Error ? error.message : "Něco se nepovedlo. Zavolejte nám prosím.";
  } finally {
    if (submit) submit.disabled = false;
  }
});

if (!reduceMotion) {
  root.classList.add("motion-ready");

  const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });
  heroTimeline
    .to(".hero .reveal-media", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.45 })
    .to(".hero .reveal-media img", { scale: 1.035, duration: 1.65 }, 0)
    .to(".hero .line > span", { y: 0, rotate: 0, duration: 1.15, stagger: .14 }, .28)
    .from(".hero-bottom, .hero-eyebrow, .hero-status", { autoAlpha: 0, y: 16, duration: .8, stagger: .1 }, .72)
    .fromTo(".site-header", { autoAlpha: 0 }, { autoAlpha: 1, duration: .85, ease: "power3.out" });

  gsap.to(".hero-media img", {
    yPercent: 8,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  document.querySelectorAll<HTMLElement>(".motion-title:not(.hero-title)").forEach((title) => {
    gsap.fromTo(title.querySelectorAll(".line > span"),
      { yPercent: 112, rotate: 1.5 },
      { yPercent: 0, rotate: 0, duration: 1.2, stagger: .12, ease: "power4.out", scrollTrigger: { trigger: title, start: "top 86%", once: true } },
    );
  });

  document.querySelectorAll<HTMLElement>(".reveal-media:not(.hero-media)").forEach((media) => {
    if (media.closest(".gallery") || media.closest(".specialty-image")) return;
    gsap.to(media, {
      clipPath: "inset(0% 0% 0% 0%)",
      y: 0,
      duration: 1.25,
      ease: "power3.out",
      scrollTrigger: { trigger: media, start: "top 88%", once: true },
    });
    const image = media.querySelector("img");
    if (image) gsap.to(image, { scale: 1, duration: 1.5, ease: "power3.out", scrollTrigger: { trigger: media, start: "top 88%", once: true } });
  });

  const gallery = document.querySelector<HTMLElement>(".gallery");
  const galleryItems = gallery?.querySelectorAll<HTMLElement>(".reveal-media") || [];
  if (gallery && galleryItems.length) {
    const revealGalleryItem = (media: HTMLElement, index: number) => {
      const image = media.querySelector("img");
      const reveal = gsap.timeline({ defaults: { ease: "power4.out" } });
      reveal.to(media, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.3, delay: index * .14 });
      if (image) reveal.to(image, { scale: 1, duration: 1.6, ease: "power3.out" }, "<");
    };

    galleryItems.forEach((media) => gsap.set(media, { clipPath: "inset(100% 0 0 0)", y: 72 }));
    if (window.innerWidth >= 1025) {
      const revealed = new Set<HTMLElement>();
      let ticking = false;
      const checkGalleryVisibility = () => {
        const threshold = window.innerHeight * .75;
        galleryItems.forEach((media, index) => {
          if (revealed.has(media)) return;
          const bounds = media.getBoundingClientRect();
          if (bounds.top <= threshold && bounds.bottom >= window.innerHeight * .05) {
            revealed.add(media);
            revealGalleryItem(media, index);
          }
        });
        if (revealed.size === galleryItems.length) window.removeEventListener("scroll", onGalleryScroll);
      };
      const onGalleryScroll = () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
          ticking = false;
          checkGalleryVisibility();
        });
      };
      window.addEventListener("scroll", onGalleryScroll, { passive: true });
      checkGalleryVisibility();
    } else {
      galleryItems.forEach((media, index) => {
        const reveal = gsap.timeline({
          scrollTrigger: { trigger: media, start: "top 100%", once: true },
          defaults: { ease: "power4.out" },
        });
        reveal.to(media, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.3, delay: index * .14 });
        const image = media.querySelector("img");
        if (image) reveal.to(image, { scale: 1, duration: 1.6, ease: "power3.out" }, "<");
      });
    }
  }

  const specialtyImages = document.querySelectorAll<HTMLElement>(".specialty-image.reveal-media");
  specialtyImages.forEach((media, index) => {
    const image = media.querySelector("img");
    gsap.set(media, { clipPath: "inset(100% 0 0 0)", y: 72 });
    const reveal = gsap.timeline({
      scrollTrigger: { trigger: media, start: "top 82%", once: true },
      defaults: { ease: "power4.out" },
    });
    reveal.to(media, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.3, delay: index * .16 });
    if (image) reveal.to(image, { scale: 1, duration: 1.6, ease: "power3.out" }, "<");
  });

  const statement = document.querySelector<HTMLElement>(".about-statement");
  if (statement) {
    const aboutCopy = document.querySelector<HTMLElement>("[data-about-copy]");
    if (aboutCopy) gsap.fromTo(aboutCopy, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .95, ease: "power4.out", scrollTrigger: { trigger: statement, start: "top 86%", once: true } });
  }

  gsap.matchMedia().add("(min-width: 1025px)", () => {
    const track = document.querySelector<HTMLElement>("[data-rum-track]");
    const viewport = document.querySelector<HTMLElement>("[data-rum-viewport]");
    const progress = document.querySelector<HTMLElement>("[data-rum-progress]");
    if (!track || !viewport) return;

    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: viewport,
        start: "center center",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: .8,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => { if (progress) progress.style.width = `${self.progress * 100}%`; },
      },
    });
    return () => tween.kill();
  });
}

window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
