import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { getOpeningStatus, getOpeningWindow, getStatusBanner, type OpeningHours, type OperatingStatusOverride } from "../lib/opening-status";
import { getLunchView, lunchQuery, mondayOf, pragueNow, renderLunch, type LunchData } from "../lib/lunch";

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;
const header = document.querySelector<HTMLElement>("[data-header]");
const menuButton = document.querySelector<HTMLButtonElement>(".menu-toggle");
const mobileMenu = document.querySelector<HTMLElement>(".mobile-menu");
const mobileMenuItems = mobileMenu?.querySelectorAll<HTMLElement>("nav a, .mobile-contact-link, .mobile-contact-label") || [];
const heroStatus = document.querySelector<HTMLElement>("[data-hero-status]");
const contentRoot = document.querySelector<HTMLElement>("[data-sanity-project]");

type PublishedContent = {
  lunch?: Partial<LunchData>;
  operatingStatus?: OperatingStatusOverride;
};

let updateHeroStatus = () => {};
let setHeroStatusOverride = (_override: OperatingStatusOverride) => {};

const statusBanners = Array.from(document.querySelectorAll<HTMLElement>("[data-status-banner]"));
let bannerOverride = JSON.parse(statusBanners[0]?.dataset.statusOverride || "{}") as OperatingStatusOverride;
function updateStatusBanners() {
  const banner = getStatusBanner(bannerOverride);
  statusBanners.forEach((element) => {
    element.hidden = !banner;
    element.textContent = banner?.text || "";
    element.classList.toggle("is-closed", banner?.tone === "closed");
    element.classList.toggle("is-notice", banner?.tone === "notice");
  });
}
updateStatusBanners();

if (heroStatus) {
  try {
    const hours = JSON.parse(heroStatus.dataset.hours || "[]") as OpeningHours[];
    let override = JSON.parse(heroStatus.dataset.statusOverride || "{}") as OperatingStatusOverride;
    const message = heroStatus.querySelector<HTMLElement>("[data-hero-status-message]");
    updateHeroStatus = () => {
      const status = getOpeningStatus(hours, override);
      heroStatus.classList.toggle("is-open", status.state === "open");
      heroStatus.classList.toggle("is-closed", status.state === "closed");
      heroStatus.setAttribute("aria-label", status.notice ? `${status.message}. ${status.notice}` : status.message);
      if (message) message.textContent = status.message;
      const notice = heroStatus.querySelector<HTMLElement>("[data-hero-status-notice]");
      if (notice) {
        notice.textContent = status.notice || "";
        notice.hidden = !status.notice;
      }
    };
    setHeroStatusOverride = (nextOverride) => {
      override = nextOverride;
      heroStatus.dataset.statusOverride = JSON.stringify(nextOverride);
      updateHeroStatus();
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
    gsap.fromTo(mobileMenuItems, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .24, stagger: .035, delay: .06, ease: "power3.out", overwrite: "auto" });
  }

  if (!open) gsap.killTweensOf(mobileMenuItems);
}

menuButton?.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});


const updateHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 32);
};
updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

const lunchRoot = document.querySelector<HTMLElement>("[data-lunch]");
let lunchData = JSON.parse(lunchRoot?.dataset.lunchData || '{"weeks":[],"prices":{}}') as LunchData;
const lunchPhone = JSON.parse(lunchRoot?.dataset.phone || "{}") as { label: string; href: string };

function activateTab(index: number, focus = false) {
  if (!lunchRoot) return;
  const tabs = Array.from(lunchRoot.querySelectorAll<HTMLButtonElement>("[data-tab]"));
  const panels = Array.from(lunchRoot.querySelectorAll<HTMLElement>("[role='tabpanel']"));
  tabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });

  panels.forEach((panel, panelIndex) => {
    const active = panelIndex === index;
    panel.hidden = !active;
    if (active && !reduceMotion) gsap.fromTo(panel, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .2, ease: "power3.out", overwrite: "auto" });
  });
}

// The page is static, so "today", weekends and the lunch cut-off are worked out again in the browser.
function renderLunchMenu() {
  if (!lunchRoot) return;
  const view = getLunchView(lunchData);
  lunchRoot.innerHTML = renderLunch(view, lunchPhone);
  const eyebrow = document.querySelector<HTMLElement>("[data-lunch-eyebrow]");
  const updated = document.querySelector<HTMLElement>("[data-lunch-updated]");
  if (eyebrow) eyebrow.textContent = view.eyebrow;
  if (updated) updated.textContent = view.weekLabel;
}

lunchRoot?.addEventListener("click", (event) => {
  const tab = (event.target as Element).closest<HTMLButtonElement>("[data-tab]");
  if (tab) activateTab(Number(tab.dataset.tab));
});
lunchRoot?.addEventListener("keydown", (event) => {
  const tab = (event.target as Element).closest<HTMLButtonElement>("[data-tab]");
  if (!tab || (event.key !== "ArrowRight" && event.key !== "ArrowLeft")) return;
  event.preventDefault();
  const count = lunchRoot.querySelectorAll("[data-tab]").length;
  const direction = event.key === "ArrowRight" ? 1 : -1;
  activateTab((Number(tab.dataset.tab) + direction + count) % count, true);
});
renderLunchMenu();

async function hydratePublishedContent() {
  const projectId = contentRoot?.dataset.sanityProject;
  const dataset = contentRoot?.dataset.sanityDataset || "production";
  if (!projectId) return;

  const query = `{
    ${lunchRoot ? `"lunch": ${lunchQuery(mondayOf(pragueNow().date))},` : ""}
    "operatingStatus": *[_type == "operatingStatus" && _id == "operatingStatus"][0]{mode,closedReason,closedUntil,noticeText}
  }`;

  try {
    const response = await fetch(`https://${projectId}.api.sanity.io/v2026-08-01/data/query/${dataset}?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error(`Sanity request failed with ${response.status}`);
    const payload = await response.json() as { result?: PublishedContent };
    const data = payload.result;
    if (!data) return;
    const override = data.operatingStatus || { mode: "automatic" };
    setHeroStatusOverride(override);
    bannerOverride = override;
    updateStatusBanners();
    if (data.lunch) {
      lunchData = { weeks: data.lunch.weeks || [], prices: data.lunch.prices || {} };
      renderLunchMenu();
    }
  } catch (error) {
    console.warn("Published Sanity content could not be refreshed.", error);
  }
}

const today = pragueNow().date;
void hydratePublishedContent();

const rumViewport = document.querySelector<HTMLElement>("[data-rum-viewport]");
rumViewport?.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  event.preventDefault();
  rumViewport.scrollBy({ left: event.key === "ArrowRight" ? 360 : -360, behavior: reduceMotion ? "auto" : "smooth" });
});

let rumDragPointer: number | null = null;
let rumDragStartX = 0;
let rumDragStartScroll = 0;
let rumIsDragging = false;
rumViewport?.addEventListener("pointerdown", (event) => {
  if (event.pointerType !== "mouse" || event.button !== 0 || (event.target as Element).closest("a, button")) return;
  rumDragPointer = event.pointerId;
  rumDragStartX = event.clientX;
  rumDragStartScroll = rumViewport.scrollLeft;
});
rumViewport?.addEventListener("pointermove", (event) => {
  if (!rumViewport || rumDragPointer !== event.pointerId) return;
  const distance = event.clientX - rumDragStartX;
  if (!rumIsDragging && Math.abs(distance) > 6) {
    rumIsDragging = true;
    rumViewport.classList.add("is-dragging");
    rumViewport.setPointerCapture(event.pointerId);
  }
  if (!rumIsDragging) return;
  event.preventDefault();
  rumViewport.scrollLeft = rumDragStartScroll - distance;
});
const finishRumDrag = (event: PointerEvent) => {
  if (!rumViewport || rumDragPointer !== event.pointerId) return;
  rumDragPointer = null;
  rumIsDragging = false;
  rumViewport.classList.remove("is-dragging");
};
rumViewport?.addEventListener("pointerup", finishRumDrag);
rumViewport?.addEventListener("pointercancel", finishRumDrag);
rumViewport?.addEventListener("lostpointercapture", finishRumDrag);

const rumProgress = document.querySelector<HTMLElement>("[data-rum-progress]");
const updateRumProgress = () => {
  if (!rumViewport || !rumProgress) return;
  const maxScroll = rumViewport.scrollWidth - rumViewport.clientWidth;
  const ratio = maxScroll > 0 ? rumViewport.scrollLeft / maxScroll : 0;
  rumProgress.style.width = `${Math.min(1, Math.max(0, ratio)) * 100}%`;
};
rumViewport?.addEventListener("scroll", updateRumProgress, { passive: true });
window.addEventListener("resize", updateRumProgress);
window.addEventListener("load", updateRumProgress, { once: true });
updateRumProgress();

const reservationForm = document.querySelector<HTMLFormElement>("[data-reservation-form]");
const formStatus = document.querySelector<HTMLElement>("[data-form-status]");
const dateInput = reservationForm?.querySelector<HTMLInputElement>('input[type="date"]');
const reservationHours = JSON.parse(reservationForm?.dataset.hours || "[]") as OpeningHours[];
const timeLabel = (minutes: number) => `${String(Math.floor(minutes / 60) % 24).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
reservationForm?.querySelectorAll<HTMLInputElement>('input[type="time"]').forEach((input) => {
  const select = document.createElement("select");
  select.name = input.name;
  select.required = input.required;
  select.className = input.className;
  if (input.id) select.id = input.id;

  // Offer only times when the pub is open: from opening until an hour before closing, and not in the past today.
  const fillTimes = () => {
    const date = dateInput?.value;
    const previous = select.value;
    const opening = date ? getOpeningWindow(reservationHours, date) : null;
    const slots: string[] = [];
    if (date && opening) {
      const now = pragueNow();
      const earliest = date === now.date ? Math.max(opening.opens, Math.ceil((now.minutes + 30) / 15) * 15) : opening.opens;
      for (let minutes = earliest; minutes <= opening.closes - 60; minutes += 15) slots.push(timeLabel(minutes));
    }
    const placeholder = !date ? "Nejdřív vyberte datum" : slots.length ? "Vyberte čas" : "Tento den už rezervace nebereme";
    select.replaceChildren(new Option(placeholder, ""), ...slots.map((slot) => new Option(slot, slot)));
    if (slots.includes(previous)) select.value = previous;
  };

  input.replaceWith(select);
  dateInput?.addEventListener("change", fillTimes);
  reservationForm?.addEventListener("reset", () => window.setTimeout(fillTimes));
  fillTimes();
});
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
    .from(".hero-bottom, .hero-eyebrow, .hero-lead, .hero-status, .hero-actions", { autoAlpha: 0, y: 16, duration: .8, stagger: .1 }, .72)
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
    galleryItems.forEach((media) => gsap.set(media, { clipPath: "inset(100% 0 0 0)", y: 72 }));
    galleryItems.forEach((media, index) => {
      const reveal = gsap.timeline({
        scrollTrigger: { trigger: media, start: "top 82%", once: true },
        defaults: { ease: "power4.out" },
      });
      reveal.to(media, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: .85, delay: index * .05 });
      const image = media.querySelector("img");
      if (image) reveal.to(image, { scale: 1, duration: 1, ease: "power3.out" }, "<");
    });
  }

  const specialtyImages = document.querySelectorAll<HTMLElement>(".specialty-image.reveal-media");
  specialtyImages.forEach((media, index) => {
    const image = media.querySelector("img");
    gsap.set(media, { clipPath: "inset(100% 0 0 0)", y: 72 });
    const reveal = gsap.timeline({
      scrollTrigger: { trigger: media, start: "top 82%", once: true },
      defaults: { ease: "power4.out" },
    });
    reveal.to(media, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: .85, delay: index * .05 });
    if (image) reveal.to(image, { scale: 1, duration: 1, ease: "power3.out" }, "<");
  });
}

window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
