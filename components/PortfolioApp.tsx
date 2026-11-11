"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  IntroScene,
  ExperienceScene,
  ProjectsScene,
  CvScene,
  HonorsScene,
  OutroScene,
} from "./Scenes";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CHAPTERS = [
  { id: "intro", name: "WELCOME / THE CALLING CARD" },
  { id: "experience", name: "EXPERIENCE FILES" },
  { id: "projects", name: "SELECTED PROJECTS" },
  { id: "cv", name: "CURRICULUM VITAE" },
  { id: "honors", name: "HONORS & AWARDS" },
  { id: "outro", name: "LET'S CONNECT" },
] as const;

const PROJECT_DESCRIPTIONS = [
  "/ ENTER THE STORY",
  "/ EXPERIENCE RECORDS",
  "/ HORIZONTAL PROJECT SHOWCASE",
  "/ RECOMPOSE INTO CV",
  "/ REVEAL AWARDS",
  "/ SEND THE CALLING CARD",
];

function clamp(value: number, a = 0, b = 1) {
  return Math.max(a, Math.min(b, value));
}

function buildDigitPositions(dates: string[]) {
  const digitSets = dates.map((date) => date.replace("/", "").split("").map(Number));
  return Array.from({ length: 6 }, (_, digit) => {
    const stops = [10 + digitSets[0][digit]];
    for (let i = 1; i < digitSets.length; i++) {
      const delta = (digitSets[i][digit] - digitSets[i - 1][digit] + 10) % 10;
      stops.push(stops[stops.length - 1] + delta);
    }
    return stops;
  });
}

function PrintResume() {
  return (
    <article id="print-resume">
      <h1>JGZ / YOUR NAME</h1>
      <p>Software · Design · Digital | [your.email@example.com] | [Portfolio URL]</p>
      <h2>PROFILE</h2>
      <p>[Write a concise professional summary: role, strengths and work you are proud of.]</p>
      <h2>PROFESSIONAL EXPERIENCE</h2>
      <ul>
        <li>[Year–Year] — [Your position], [Company] — [Impact and responsibility]</li>
        <li>[Year–Year] — [Your position], [Company] — [Impact and responsibility]</li>
      </ul>
      <h2>ORGANIZATION EXPERIENCE</h2>
      <ul><li>[Year–Year] — [Position], [Organization] — [Contribution]</li></ul>
      <h2>PROJECTS</h2>
      <ul>
        <li>EduQuas — Web exam platform</li>
        <li>SEGAR — Supply-chain system</li>
        <li>[Additional project and impact]</li>
      </ul>
      <h2>HONORS & AWARDS</h2>
      <ul><li>[Award name, organizer, year]</li></ul>
      <h2>EDUCATION & SKILLS</h2>
      <p>[Your education] · [Relevant languages, frameworks and competencies]</p>
    </article>
  );
}

export default function PortfolioApp() {
  const root = useRef<HTMLDivElement>(null);
  const [indexOpen, setIndexOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overlay-open", indexOpen);
    return () => document.body.classList.remove("overlay-open");
  }, [indexOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIndexOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const navigateTo = (id: string) => {
    setIndexOpen(false);
    const section = document.getElementById(id);
    if (section) {
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  async function copyEmail() {
    const email = "hello@yourdomain.com"; // Replace with your actual email.
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  useGSAP(() => {
    if (!root.current) return;
    const scope = root.current;
    const $ = (selector: string) => scope.querySelector<HTMLElement>(selector);
    const $$ = (selector: string) => Array.from(scope.querySelectorAll<HTMLElement>(selector));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = $$("#project-track .project-slide");
    const wheels = $$(".date-wheel");
    const dates = cards.map((card) => card.dataset.date ?? "01/2026");
    const digitPositions = buildDigitPositions(dates);

    // Populate real mechanical reels with enough digits for multi-year motion.
    wheels.forEach((wheel, digit) => {
      wheel.innerHTML = Array.from({ length: 100 }, (_, i) => `<b>${i % 10}</b>`).join("");
      gsap.set(wheel, { y: -(digitPositions[digit][0]) * (wheel.firstElementChild?.getBoundingClientRect().height || 67) });
    });

    if (reduced) {
      gsap.set(["#hero-headline", "#cv-text", "#outro-copy"], { autoAlpha: 1, clearProps: "transform" });
      gsap.set(["#intro-menu", "#hero-blue-bridge"], { autoAlpha: 0 });
      cards.forEach((card, index) => gsap.set(card, { autoAlpha: index === 0 ? 1 : 0, clipPath: "none" }));
      return;
    }

    // HERO: exactly the original 01 — EXPERIENCE menu panel reaches full viewport
    // before the next chapter, already populated, appears underneath. No blue empty frame.
    const menuItem = $("#intro-menu-experience");
    const introMenu = $("#intro-menu");
    if (menuItem && introMenu) {
      gsap.set(introMenu, { zIndex: 31 });
      gsap.set(menuItem, { transformOrigin: "50% 50%" });
      gsap.set($("#hero-blue-bridge"), { autoAlpha: 0 });
      gsap.set($("#hero-blue-bridge .bridge-left"), { x: -45, autoAlpha: 0 });
      gsap.set($("#hero-blue-bridge .bridge-card"), { x: 90, autoAlpha: 0 });
      const zoomMenu = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: "#intro", start: "top top", end: "bottom bottom", scrub: 0.95,
          invalidateOnRefresh: true,
        },
      });
      zoomMenu
        .to("#hero-headline", { x: -110, y: -65, autoAlpha: 0, duration: .15, ease: "power2.inOut" }, .07)
        .to("#hero-figure", { x: -52, scale: 1.04, opacity: .61, duration: .28 }, .08)
        .fromTo(introMenu, { autoAlpha: 0, x: 65, y: 80 }, { autoAlpha: 1, x: 0, y: 0, duration: .20, ease: "back.out(1.25)" }, .20)
        .to("#intro-menu .menu-note, #intro-menu .intro-menu-line:not(#intro-menu-experience)", {
          x: 130, autoAlpha: 0, duration: .13, stagger: .018, ease: "power2.in"
        }, .52)
        .to(menuItem, {
          x: () => {
            const rect = menuItem.getBoundingClientRect();
            const currentX = Number(gsap.getProperty(menuItem, "x")) || 0;
            return innerWidth / 2 - (rect.left + rect.width / 2) + currentX;
          },
          y: () => {
            const rect = menuItem.getBoundingClientRect();
            const currentY = Number(gsap.getProperty(menuItem, "y")) || 0;
            return innerHeight / 2 - (rect.top + rect.height / 2) + currentY;
          },
          scale: () => {
            // Overscan accounts for the polygon cutout and aspect ratio.
            const rect = menuItem.getBoundingClientRect();
            return Math.max(innerWidth * 1.95 / Math.max(1, rect.width), innerHeight * 1.95 / Math.max(1, rect.height));
          },
          rotate: 0, duration: .32, ease: "power3.inOut",
        }, .59)
        // The chapter is revealed only after the selected menu fills the viewport.
        .to("#hero-blue-bridge", { autoAlpha: 1, duration: .10 }, .88)
        .to(menuItem, { autoAlpha: 0, duration: .10 }, .91)
        .to("#hero-blue-bridge .bridge-left", { x: 0, autoAlpha: 1, duration: .10 }, .90)
        .to("#hero-blue-bridge .bridge-card", { x: 0, autoAlpha: 1, duration: .10 }, .91);
    }

    // Experience: a single fixed frame; records advance upward following scroll.
    const experiences = $$(".xp-card");
    const port = $("#xp-port");
    const track = $("#xp-track");
    if (track && port && experiences.length) {
      const xpTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#experience", start: "top top", end: "bottom bottom", scrub: 1.05,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const exact = self.progress * (experiences.length - 1);
            const idx = clamp(Math.round(exact), 0, experiences.length - 1);
            const count = $("#xp-count");
            const mode = $("#xp-mode");
            if (count) count.textContent = String(idx + 1).padStart(2, "0");
            if (mode) mode.innerHTML = idx < 2 ? "PROFESSIONAL <em>EXPERIENCE</em>" : "ORGANIZATION <em>EXPERIENCE</em>";
            experiences.forEach((card, i) => {
              card.style.filter = `brightness(${1 - Math.min(.24, Math.abs(i - exact) * .16)})`;
            });
          },
        },
      });
      xpTl.fromTo(track, {
        y: () => (port.clientHeight - experiences[0].offsetHeight) / 2 - experiences[0].offsetTop,
      }, {
        y: () => (port.clientHeight - experiences[0].offsetHeight) / 2 - experiences[experiences.length - 1].offsetTop,
        ease: "none", duration: 1,
      }, 0);
      gsap.fromTo(".xp-giant-03", { xPercent: -4, rotate: -3 }, {
        xPercent: 3, rotate: 2, ease: "none",
        scrollTrigger: { trigger: "#experience", start: "top top", end: "bottom bottom", scrub: 1.6 },
      });
    }

    // Project gallery: each next slide reveals ON TOP OF the outgoing slide.
    // The previous slide never disappears until fully covered, so no white/blank gap.
    const projectDots = $$("#project-dots i");
    const projectState = $("#project-mech-state");
    const projectPanel = $("#project-mech-panel");
    if (cards.length) {
      gsap.set(cards[0], { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", zIndex: 1 });
      cards.slice(1).forEach((card, i) => gsap.set(card, { autoAlpha: 1, clipPath: "inset(0% 100% 0% 0%)", zIndex: i + 2 }));
      const gallery = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: "#projects", start: "top top", end: "bottom bottom", scrub: 1.0,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(cards.length - 1, Math.round(self.progress * (cards.length - 1)));
            projectDots.forEach((dot, i) => dot.classList.toggle("on", i === idx));
            if (projectState) projectState.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
            projectPanel?.setAttribute("aria-label", `Demo project date ${dates[idx]}, project ${idx + 1} of ${cards.length}`);
            const hingeTurn = self.progress * (cards.length - 1);
            const phase = hingeTurn - Math.floor(hingeTurn);
            $$(".date-slot").forEach((slot) => slot.style.setProperty("--flip-angle", `${-23 * Math.sin(Math.PI * phase)}deg`));
          },
        },
      });
      cards.slice(1).forEach((card, n) => {
        const i = n + 1;
        gallery.fromTo(card,
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power2.inOut" },
          n,
        );
        const copy = card.querySelector(".project-copy");
        const screen = card.querySelector(".project-screen-case");
        if (copy) gallery.fromTo(copy, { x: 72 }, { x: 0, ease: "power2.out", duration: 1 }, n);
        if (screen) gallery.fromTo(screen, { x: 102, rotate: 2 }, { x: 0, rotate: -5, ease: "power2.out", duration: 1 }, n);
        wheels.forEach((wheel, digit) => {
          gallery.to(wheel, {
            y: () => -digitPositions[digit][i] * (wheel.firstElementChild?.getBoundingClientRect().height || 67),
            duration: 1, ease: "none",
          }, n);
        });
      });
    }

    // CV: zoom OUT from an oversized paper to a stable document layout.
    const cvTl = gsap.timeline({
      scrollTrigger: { trigger: "#cv", start: "top top", end: "bottom bottom", scrub: 1.0, invalidateOnRefresh: true },
    });
    cvTl
      .fromTo("#cv-paper", {
        x: () => innerWidth < 800 ? -90 : -195, y: -220,
        scale: () => innerWidth < 800 ? 1.7 : 2.25, rotation: -12,
      }, { x: () => innerWidth < 800 ? 60 : 80, y: () => innerWidth < 800 ? 65 : -20, scale: () => innerWidth < 800 ? .70 : 1.0, rotation: 6, duration: .67, ease: "power2.inOut" }, 0)
      .fromTo("#cv-blue-bg", { autoAlpha: 0 }, { autoAlpha: 1, duration: .52 }, .12)
      .fromTo("#cv-ripple", { autoAlpha: 0, scale: 1.12 }, { autoAlpha: 1, scale: 1, duration: .52 }, .27)
      .fromTo("#cv-text", { autoAlpha: 0, x: -80, y: 50 }, { autoAlpha: 1, x: 0, y: 0, duration: .48, ease: "power2.out" }, .40)
      .to("#cv-source-note", { autoAlpha: 0, duration: .22 }, .10);

    // Awards: asymmetric assembly rather than identical reveals.
    const awards = $$(".award-card");
    const awardTl = gsap.timeline({
      scrollTrigger: { trigger: "#honors", start: "top top", end: "bottom bottom", scrub: .85,
        onUpdate: (self) => { const count = $("#award-count"); if (count) count.textContent = String(Math.min(3,Math.max(0,Math.floor(self.progress*3.4)))).padStart(2, "0"); },
      },
    });
    if (awards.length >= 3) {
      awardTl
        .fromTo(awards[0], { x: 420, y: -160, rotation: 24, scale: .55, autoAlpha: 0 }, { x: 0, y: 0, rotation: -11, scale: 1, autoAlpha: 1, duration: .34, ease: "back.out(1.3)" }, .08)
        .fromTo(awards[1], { x: -430, y: 60, rotation: -32, scale: .6, autoAlpha: 0 }, { x: 0, y: 0, rotation: 10, scale: 1, autoAlpha: 1, duration: .34, ease: "back.out(1.25)" }, .38)
        .fromTo(awards[2], { x: 290, y: 360, rotation: 30, scale: .5, autoAlpha: 0 }, { x: 0, y: 0, rotation: -7, scale: 1, autoAlpha: 1, duration: .30, ease: "back.out(1.2)" }, .67);
    }

    // Outro: confident calling-card close, with a slightly delayed stamp impact.
    const outroTl = gsap.timeline({
      scrollTrigger: { trigger: "#outro", start: "top top", end: "bottom bottom", scrub: .75 },
    });
    outroTl
      .fromTo("#outro-copy", { autoAlpha: 0, y: 135, scale: .88 }, { autoAlpha: 1, y: 0, scale: 1, duration: .55, ease: "power3.out" }, .10)
      .fromTo("#outro-stamp", { autoAlpha: 0, rotation: -120, scale: .45, x: 180 }, { autoAlpha: 1, rotation: 0, scale: 1, x: 0, duration: .42, ease: "back.out(1.55)" }, .43);

    const hudScene = $("#hud-scene");
    const hudAction = $("#hud-action");
    const pageBar = $("#page-bar");
    ScrollTrigger.create({
      trigger: scope,
      start: "top top",
      end: "bottom bottom",
      onUpdate: () => {
        const y = window.scrollY + window.innerHeight * .45;
        let selected = 0;
        CHAPTERS.forEach((chapter, i) => {
          const el = $("#" + chapter.id);
          if (el && y >= el.getBoundingClientRect().top + window.scrollY) selected = i;
        });
        if (hudScene) hudScene.textContent = `${String(selected + 1).padStart(2, "0")} / 06`;
        if (hudAction) hudAction.textContent = PROJECT_DESCRIPTIONS[selected];
        if (pageBar) pageBar.style.height = `${clamp(window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight), 0, 1) * 100}%`;
      },
    });
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    return () => { /* useGSAP context automatically reverts every ScrollTrigger + animation */ };
  }, { scope: root });

  return (
    <div ref={root} id="portfolio-root">
      <div id="global-grain" aria-hidden="true" />
      <header id="top-hud" aria-label="Portfolio quick controls">
        <div className="signature"><span className="bolt">✦</span><span>JGZ // RE:FRAME</span></div>
        <motion.button
          type="button" id="index-open" className="index-toggle"
          whileHover={{ x: -4, scale: 1.035 }} whileTap={{ scale: .96 }}
          onClick={() => setIndexOpen(true)} aria-expanded={indexOpen} aria-controls="scene-index">
          SCENE INDEX <span>☷</span>
        </motion.button>
      </header>
      <div id="side-hud" aria-hidden="true">
        <div className="rot" id="hud-scene">01 / 06</div>
        <div className="rail"><i id="page-bar" /></div>
        <div>SCROLL</div>
      </div>
      <div id="bottom-hud">PORTFOLIO CONCEPT <span id="hud-action">/ ENTER THE STORY</span></div>
      <main>
        <IntroScene />
        <ExperienceScene />
        <ProjectsScene />
        <CvScene onPrint={() => window.print()} />
        <HonorsScene />
        <OutroScene onCopyEmail={copyEmail} onBackToTop={() => navigateTo("intro")} copied={copied} />
      </main>
      <AnimatePresence>
        {indexOpen && (
          <motion.div id="scene-index" className="open scene-index-open" role="dialog" aria-modal="true" aria-label="Scene index"
            style={{ visibility: "visible", pointerEvents: "auto" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : .25 }}>
            <div className="index-art"><span>RE:<br />FRAME</span></div>
            <div className="index-body">
              <motion.button className="index-close" type="button" onClick={() => setIndexOpen(false)} whileTap={{ scale: .9 }} aria-label="Close scene index">×</motion.button>
              <motion.h2 initial={{ x: reducedMotion ? 0 : -35, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: .30 }}>SCENE<br /><em>INDEX.</em></motion.h2>
              {CHAPTERS.map((chapter, index) => (
                <motion.button key={chapter.id} className="index-row" type="button" onClick={() => navigateTo(chapter.id)}
                  initial={{ x: reducedMotion ? 0 : 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: reducedMotion ? 0 : index * .045, duration: .25 }}
                  whileHover={{ x: 12 }} whileTap={{ scale: .99 }}>
                  <small>{String(index + 1).padStart(2, "0")}</small><strong>{chapter.name}</strong>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <PrintResume />
    </div>
  );
}
