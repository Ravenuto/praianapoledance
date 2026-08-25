import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, Instagram, Sun, Moon } from "lucide-react";
import {
  DEFAULT_CONTENT,
  colorOf,
  useSiteContent,
  type SiteContent,
} from "@/lib/site-content";
import { Ed, EdImage, EdLink, EditProvider, type EditApi } from "@/lib/site-edit";

const NAV = [
  { label: "Início", href: "#home" },
  { label: "Modalidades", href: "#modalidades" },
  { label: "Horários", href: "#horarios" },
  { label: "Valores", href: "#valores" },
  { label: "Contato", href: "#contato" },
];

const ContentCtx = createContext<SiteContent>(DEFAULT_CONTENT);
const useContent = () => useContext(ContentCtx);

function useTypeMeta() {
  const { classTypes } = useContent();
  return (id: string) => {
    const t = classTypes.find((c) => c.id === id) ?? classTypes[0];
    return { ...colorOf(t?.color), label: t?.label ?? id, short: t?.short ?? id };
  };
}

// Scroll reveal hook
function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function Logo({ className = "" }: { className?: string }) {
  const { images, studio } = useContent();
  return <img src={images.logo} alt={studio.brandName} className={className} loading="eager" />;
}

function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState<boolean | null>(null);
  useEffect(() => {
    const stored = localStorage.getItem("praiana-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("praiana-theme", next ? "dark" : "light");
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}
      className={`h-9 w-9 rounded-full bg-ocean/10 text-ocean hover:bg-ocean/20 transition-colors flex items-center justify-center ${className}`}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

function Navbar() {
  const { studio } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div
        className={`mx-auto max-w-5xl grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-[1.75rem] pl-3 pr-3 py-2 transition-all duration-500 sm:flex sm:items-center sm:justify-between ${
          scrolled
            ? "bg-sand/85 backdrop-blur-xl ring-1 ring-ocean/10 shadow-[0_8px_30px_-12px_rgba(38,106,174,0.25)]"
            : "bg-sand/40 backdrop-blur-md"
        }`}
      >
        <a href="#home" className="flex min-w-0 items-center gap-2.5 group">
          <span className="shrink-0 relative flex h-11 w-11 items-center justify-center transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-110">
            <EdImage which="logo">
              <Logo className="h-full w-full object-contain" />
            </EdImage>
          </span>
          <span className="min-w-0 truncate font-serif italic tracking-tight text-ocean text-[15px] sm:text-base md:text-lg">
            <Ed path="studio.brandName" value={studio.brandName} />
          </span>
        </a>
        <div className="hidden md:flex items-center gap-7 text-sm">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="relative text-ink/70 hover:text-ocean transition-colors after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px after:bg-gold after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
            >
              {n.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 justify-self-end">
          <ThemeToggle className="h-9 w-9" />
          <EdLink path="studio.appUrl" value={studio.appUrl}>
            <a
              href={studio.appUrl || undefined}
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 rounded-full bg-ocean px-4 py-2 text-xs font-semibold uppercase tracking-widest text-sand hover:bg-deep transition-all hover:scale-105 whitespace-nowrap"
            >
              Área da Aluna
            </a>
          </EdLink>
          <button
            aria-label="Abrir menu"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden h-8 w-8 shrink-0 rounded-full bg-ocean/10 grid place-items-center text-ocean sm:h-9 sm:w-9"
          >
            <span className="space-y-1.5">
              <span className="block w-4 h-0.5 bg-current" />
              <span className="block w-4 h-0.5 bg-current" />
            </span>
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden mx-auto mt-2 max-w-5xl rounded-3xl bg-sand/95 backdrop-blur-xl ring-1 ring-ocean/10 p-6 shadow-xl animate-fade-up">
          <div className="flex flex-col gap-4">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="text-ink/80 hover:text-ocean text-base">
                {n.label}
              </a>
            ))}
            <a href={studio.appUrl || undefined} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center justify-center rounded-full bg-ocean px-4 py-3 text-xs font-semibold uppercase tracking-widest text-sand">
              Área da Aluna
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function WaveDivider({ flip = false, color = "var(--color-ocean)" }: { flip?: boolean; color?: string }) {
  const paths = [
    "M0,70 C200,30 400,110 600,70 C800,30 1000,110 1200,70 L1200,120 L0,120 Z",
    "M0,80 C200,50 400,110 600,80 C800,50 1000,110 1200,80 L1200,120 L0,120 Z",
    "M0,90 C200,70 400,110 600,90 C800,70 1000,110 1200,90 L1200,120 L0,120 Z",
  ];
  const layers = [
    { d: paths[0], opacity: 0.35, anim: "animate-wave-move-slow" },
    { d: paths[1], opacity: 0.55, anim: "animate-wave-move-reverse" },
    { d: paths[2], opacity: 1, anim: "animate-wave-move" },
  ];
  return (
    <div className={`relative h-24 sm:h-28 overflow-hidden ${flip ? "-scale-y-100" : ""}`} aria-hidden>
      {layers.map((l, i) => (
        <div
          key={i}
          className={`absolute inset-x-0 bottom-0 h-full flex w-[200%] ${l.anim} will-change-transform`}
        >
          {[0, 1].map((k) => (
            <svg key={k} className="block h-full w-1/2 shrink-0" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d={l.d} fill={color} fillOpacity={l.opacity} />
            </svg>
          ))}
        </div>
      ))}
    </div>
  );
}

function SectionBlend({ background }: { background: string }) {
  return <div className="absolute inset-0 -z-10" style={{ background }} aria-hidden />;
}

function Hero() {
  const { hero, studio, images } = useContent();
  return (
    <section id="home" className="relative pt-24 pb-10 sm:pt-28 sm:pb-16 px-6 overflow-hidden">
      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-12 items-center">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-mist mb-6">
            <span className="h-px w-8 bg-gold" /> <Ed path="hero.eyebrow" value={hero.eyebrow} />
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] text-ocean text-balance">
            <Ed path="hero.titleLead" value={hero.titleLead} />{" "}
            <span className="relative inline-block italic text-gold">
              <Ed path="hero.titleHighlight" value={hero.titleHighlight} />
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8 Q50 -2 100 6 T198 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>{" "}
            <Ed path="hero.titleRest" value={hero.titleRest} />
          </h1>
          <p className="mt-5 max-w-md text-sm sm:text-base md:text-lg text-ink/70 leading-relaxed whitespace-pre-line">
            <Ed path="hero.description" value={hero.description} multiline />
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={studio.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 justify-center rounded-full bg-ocean px-6 py-3.5 text-sm font-semibold text-sand hover:bg-deep transition-all hover:-translate-y-0.5 shadow-[0_12px_40px_-12px_rgba(38,106,174,0.5)]"
            >
              <Ed path="hero.ctaPrimary" value={hero.ctaPrimary} />{" "}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#modalidades"
              className="inline-flex items-center justify-center rounded-full border border-ocean/30 px-6 py-3.5 text-sm font-semibold text-ocean hover:bg-ocean/5 transition-colors"
            >
              <Ed path="hero.ctaSecondary" value={hero.ctaSecondary} />
            </a>
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:200ms]">
          <div className="relative overflow-hidden animate-blob-morph shadow-[0_30px_80px_-20px_rgba(17,53,92,0.35)] ring-1 ring-white/40">
            <EdImage which="hero">
              <img
                src={images.hero}
                alt="Estúdio Praiana — sala com barras de pole"
                className="w-full h-[320px] sm:h-[440px] md:h-[560px] object-cover scale-105 hover:scale-110 transition-transform duration-[2.5s]"
              />
            </EdImage>
            <div className="absolute inset-0 bg-gradient-to-t from-ocean/30 via-transparent to-transparent" />
          </div>

          {/* Floating logo */}
          <div className="absolute -top-6 -right-4 md:-right-8 z-10 animate-float-y">
            <div className="relative">
              <div className="relative h-20 w-20 md:h-32 md:w-32 grid place-items-center drop-shadow-[0_18px_35px_rgba(17,53,92,0.45)]">
                <EdImage which="logo">
                  <Logo className="h-full w-full object-contain" />
                </EdImage>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Movimento() {
  const { movimento, images } = useContent();
  return (
    <section id="movimento" className="relative px-6 pt-10 pb-16 sm:pb-20 overflow-hidden">
      <SectionBlend background="linear-gradient(180deg, rgba(250,247,242,1) 0%, rgba(250,247,242,0.98) 55%, rgba(38,106,174,0.06) 100%)" />
      <div className="relative max-w-6xl mx-auto">
        <div className="reveal flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl leading-[0.95] text-ocean">
            <Ed path="movimento.titleLead" value={movimento.titleLead} />{" "}
            <span className="italic text-gold">
              <Ed path="movimento.titleHighlight" value={movimento.titleHighlight} />
            </span>
          </h2>
          <div className="flex items-center gap-4 shrink-0">
            <span className="hidden sm:block h-px w-20 md:w-28 bg-gold/60" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-ink/50">
              <Ed path="movimento.badge" value={movimento.badge} />
            </span>
          </div>
        </div>

        <div className="reveal group relative w-full sm:aspect-[21/9] md:aspect-[3/1] rounded-[28px] overflow-hidden shadow-[0_30px_80px_-24px_rgba(17,53,92,0.4)] ring-1 ring-white/40">
          <EdImage which="movimento">
            <img
              src={images.movimento}
              alt="Aluna em movimento no pole ao ar livre, silhueta contra o céu"
              className="w-full h-auto object-contain sm:h-full sm:object-cover transition-transform duration-[2.5s] group-hover:scale-105"
              loading="lazy"
            />
          </EdImage>

          <div className="absolute inset-0 bg-gradient-to-t from-ocean/35 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="reveal grid md:grid-cols-2 gap-8 md:gap-16 mt-10">
          <p className="text-base sm:text-lg text-ink/75 leading-relaxed">
            <Ed path="movimento.text1" value={movimento.text1} multiline />
          </p>
          <p className="text-base sm:text-lg text-ink/75 leading-relaxed">
            <Ed path="movimento.text2" value={movimento.text2} multiline />
          </p>
        </div>
      </div>
    </section>
  );
}

function Modalidades() {
  const { modalities, sections } = useContent();
  return (
    <section id="modalidades" className="relative mt-10">
      <WaveDivider />
      <div className="theme-light-locked bg-ocean text-sand py-24 px-6 relative overflow-hidden -mt-px">
        <div className="relative max-w-5xl mx-auto">
          <div className="mb-14 max-w-xl reveal">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              <Ed path="sections.modalidadesEyebrow" value={sections.modalidadesEyebrow} />
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-5">
            {modalities.map((m, i) => (
              <article
                key={i}
                className="reveal group relative rounded-[32px] bg-white/5 backdrop-blur-sm ring-1 ring-white/10 p-7 transition-all duration-500 hover:bg-white/10 hover:-translate-y-2 hover:ring-gold/30"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <h3 className="font-serif italic text-gold text-3xl md:text-4xl leading-tight mb-4 transition-transform duration-500 group-hover:translate-x-1">
                  <Ed path={`modalities.${i}.title`} value={m.title} />
                </h3>
                <p className="text-sand/75 text-sm leading-relaxed">
                  <Ed path={`modalities.${i}.desc`} value={m.desc} multiline />
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold/80">
                  <Ed path={`modalities.${i}.level`} value={m.level} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <WaveDivider flip />
    </section>
  );
}

function Horarios() {
  const { schedule, classTypes, sections } = useContent();
  const meta = useTypeMeta();
  const cols = Math.min(Math.max(schedule.length, 1), 6);
  return (
    <section id="horarios" className="py-24 px-6 relative overflow-hidden">
      <SectionBlend background="linear-gradient(180deg, rgba(250,247,242,1) 0%, rgba(250,247,242,0.98) 42%, rgba(245,166,35,0.08) 100%)" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-10 reveal">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-mist">
            <Ed path="sections.horariosEyebrow" value={sections.horariosEyebrow} />
          </span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl italic text-ocean">
            <Ed path="sections.horariosTitle" value={sections.horariosTitle} />
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10 reveal">
          {classTypes.map((t) => {
            const c = colorOf(t.color);
            return (
              <span
                key={t.id}
                className={`theme-light-locked inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ring-1 ring-ocean/10 bg-white/70 dark:bg-white backdrop-blur ${c.text}`}
              >
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                {t.label}
              </span>
            );
          })}
        </div>

        {/* Calendar grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4"
          style={{ ["--cols" as string]: cols }}
        >
          {schedule.map((day, i) => (
            <div
              key={day.id}
              className="theme-light-locked reveal rounded-3xl bg-white/70 dark:bg-white backdrop-blur-xl ring-1 ring-ocean/10 p-4 hover:-translate-y-1 hover:shadow-[0_20px_50px_-25px_rgba(38,106,174,0.4)] transition-all duration-500 lg:[grid-column:span_1]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="text-center pb-3 mb-3 border-b border-ocean/10">
                <p className="font-serif text-xl md:text-2xl italic text-ocean leading-tight">
                  <Ed path={`schedule.${i}.name`} value={day.name} />
                </p>
              </div>
              <div className="space-y-2">
                {day.slots.map((s, j) => {
                  const c = meta(s.type);
                  return (
                    <div
                      key={j}
                      className={`group rounded-2xl ${c.bg} ring-1 ${c.ring} px-3 py-2.5 transition-all hover:scale-[1.03] cursor-default`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold text-sm ${c.text}`}>{s.time}</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                      </div>
                      <p className={`text-[11px] font-medium mt-0.5 ${c.text} opacity-80`}>{c.short}</p>
                    </div>
                  );
                })}
                {day.slots.length === 0 && <p className="text-center text-xs text-ink/30 py-4">—</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media (min-width:1024px){#horarios .grid.grid-cols-2{grid-template-columns:repeat(${cols},minmax(0,1fr));}}`}</style>
    </section>
  );
}

function Valores() {
  const { plans, extras, studio, sections } = useContent();
  const sharedIdx = Math.max(0, plans.findIndex((p) => p.highlight));
  const shared = plans[sharedIdx]?.benefits ?? [];
  const [aba, setAba] = useState<"Mensal" | "Semestral">("Mensal");

  const tagOf = (p: (typeof plans)[number]) =>
    p.tag ?? (/^\s*\d+\s*x/i.test(p.price) ? "Semestral" : "Mensal");
  const isSemestral = (p: (typeof plans)[number]) => /semestr/i.test(tagOf(p));
  const hasSemestral = plans.some(isSemestral);

  return (
    <section id="valores" className="relative py-16 md:py-24 overflow-hidden">
      <SectionBlend background="linear-gradient(180deg, rgba(245,166,35,0.08) 0%, rgba(250,247,242,0.96) 30%, rgba(91,141,184,0.07) 100%)" />
      <div className="relative max-w-6xl mx-auto">
        <div className="px-6 text-center mb-8 md:mb-14 reveal">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-mist">
            <Ed path="sections.valoresEyebrow" value={sections.valoresEyebrow} />
          </span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl italic text-ocean">
            <Ed path="sections.valoresTitle" value={sections.valoresTitle} />
          </h2>
        </div>

        {hasSemestral && (
          <div className="md:hidden px-6 mb-6 flex justify-center gap-2">
            {(["Mensal", "Semestral"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setAba(t)}
                aria-pressed={aba === t}
                className={`rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors ${
                  aba === t ? "bg-ocean text-sand" : "border border-ocean/40 text-ocean"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 px-6 md:px-0 pt-3 md:pt-2">
          {plans.map((p, i) => {
            const tag = tagOf(p);
            const semestral = isSemestral(p);
            const hiddenOnMobile = hasSemestral && (semestral ? aba !== "Semestral" : aba !== "Mensal");
            const card = p.highlight
              ? "bg-white ring-2 ring-gold shadow-[0_18px_45px_-24px_rgba(245,166,35,0.6)]"
              : semestral
                ? "bg-white dark:bg-white ring-1 ring-ocean/30 shadow-[0_10px_35px_-22px_rgba(38,106,174,0.3)]"
                : "bg-white/85 dark:bg-white ring-1 ring-ocean/10 shadow-[0_10px_35px_-22px_rgba(38,106,174,0.25)]";
            return (
              <article
                key={i}
                className={`theme-light-locked reveal relative rounded-3xl p-5 flex-col backdrop-blur transition-all duration-500 md:hover:-translate-y-1.5 ${
                  hiddenOnMobile ? "hidden md:flex" : "flex"
                } ${card}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {p.highlight && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-gold text-ocean">
                    Mais popular
                  </span>
                )}
                <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${semestral ? "text-ocean" : "text-mist"}`}>
                  <Ed path={`plans.${i}.tag`} value={tag} />
                </span>
                <h3 className="mt-1 font-serif text-lg italic text-ocean">
                  <Ed path={`plans.${i}.name`} value={p.name} />
                </h3>
                <p className="mt-1 text-[11px] leading-snug text-ink/55">
                  <Ed path={`plans.${i}.desc`} value={p.desc} multiline />
                </p>
                <div className="mt-4">
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="font-serif text-[28px] leading-none font-semibold text-ink">
                      <Ed path={`plans.${i}.price`} value={p.price} />
                    </span>
                    <span className="text-[11px] text-ink/50">
                      <Ed path={`plans.${i}.unit`} value={p.unit ?? "/mês"} />
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] uppercase tracking-wide text-ink/45">
                    <Ed path={`plans.${i}.per`} value={p.per} />
                  </p>
                </div>
                <ul className="mt-4 space-y-2 text-[12px] flex-1 hidden md:block">
                  {p.benefits.map((f, k) => (
                    <li key={k} className="flex items-start gap-2">
                      <span className="mt-[3px] text-gold text-[11px]" aria-hidden>✓</span>
                      <span className="text-ink/70">
                        <Ed path={`plans.${i}.benefits.${k}`} value={f} />
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href={studio.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-4 md:mt-5 inline-flex items-center justify-center rounded-xl py-2 text-[11px] font-bold uppercase tracking-wide transition-all hover:scale-[1.02] ${
                    semestral ? "border border-ocean text-ocean" : "bg-ocean text-sand"
                  }`}
                >
                  <Ed path="sections.planCta" value={sections.planCta} />
                </a>
              </article>
            );
          })}
        </div>



        {shared.length > 0 && (
          <div className="md:hidden px-6 mt-2 reveal">
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-ocean/10 pt-5">
              {shared.map((f, k) => (
                <span key={k} className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-ink/70">
                  <span className="text-gold" aria-hidden>✓</span>
                  <Ed path={`plans.${sharedIdx}.benefits.${k}`} value={f} />
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="px-6 mt-8 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {extras.map((e, i) => (
            <div key={i} className="theme-light-locked reveal flex items-center justify-between rounded-2xl bg-white/70 dark:bg-white backdrop-blur ring-1 ring-ocean/10 px-5 py-4 hover:bg-white transition-colors">
              <div>
                <p className="font-semibold text-ink">
                  <Ed path={`extras.${i}.name`} value={e.name} />
                </p>
                <p className="text-xs text-ink/50 mt-0.5">
                  <Ed path={`extras.${i}.desc`} value={e.desc} />
                </p>
              </div>
              <span className="font-serif text-2xl text-ocean">
                <Ed path={`extras.${i}.price`} value={e.price} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AreaAluna() {
  const { areaAluna, studio } = useContent();
  return (
    <section className="relative px-6 pb-24 overflow-hidden">
      <SectionBlend background="linear-gradient(180deg, rgba(91,141,184,0.07) 0%, rgba(250,247,242,0.98) 22%, rgba(250,247,242,1) 100%)" />
      <div className="theme-light-locked relative max-w-5xl mx-auto overflow-hidden rounded-[48px] bg-gradient-to-br from-ocean via-deep to-ocean text-sand px-8 py-14 md:px-14 md:py-20 ring-1 ring-white/10 animate-shimmer-bg reveal">
        <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              <Ed path="areaAluna.eyebrow" value={areaAluna.eyebrow} />
            </span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl italic">
              <Ed path="areaAluna.title" value={areaAluna.title} />
            </h2>
            <p className="mt-4 text-sand/80 max-w-md">
              <Ed path="areaAluna.desc" value={areaAluna.desc} multiline />
            </p>
          </div>
          <div className="md:justify-self-end">
            <EdLink path="studio.appUrl" value={studio.appUrl}>
            <a
              href={studio.appUrl || undefined}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-3 rounded-full bg-gold text-ocean px-7 py-4 text-sm font-bold uppercase tracking-widest shadow-[0_20px_60px_-15px_rgba(245,166,35,0.6)] hover:scale-105 transition-transform"
            >
              <Ed path="areaAluna.cta" value={areaAluna.cta} />
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            </EdLink>
          </div>
        </div>
      </div>
    </section>
  );
}


function Contato() {
  const { studio, sections } = useContent();
  return (
    <section id="contato" className="relative px-6 pb-24 overflow-hidden">
      <SectionBlend background="linear-gradient(180deg, rgba(250,247,242,1) 0%, rgba(250,247,242,0.99) 72%, rgba(17,53,92,0.06) 100%)" />
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 reveal">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-mist">
            <Ed path="sections.contatoEyebrow" value={sections.contatoEyebrow} />
          </span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl italic text-ocean">
            <Ed path="sections.contatoTitle" value={sections.contatoTitle} />
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {/* 1. Endereço */}
          <a
            href={studio.addressUrl}
            target="_blank"
            rel="noreferrer"
            className="theme-light-locked reveal group rounded-3xl bg-white/70 dark:bg-white backdrop-blur ring-1 ring-ocean/10 p-7 hover:bg-white hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-mist/15 text-mist grid place-items-center mb-4 group-hover:bg-mist group-hover:text-sand transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-widest text-mist">Endereço</p>
            <p className="mt-1 font-serif text-xl text-ocean leading-snug">
              <Ed path="studio.addressLabel" value={studio.addressLabel} />
            </p>
            <p className="mt-1 text-sm text-ink/60">
              <Ed path="studio.addressNote" value={studio.addressNote} />
            </p>
          </a>

          {/* 2. WhatsApp */}
          <a
            href={studio.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="theme-light-locked reveal group rounded-3xl bg-white/70 dark:bg-white backdrop-blur ring-1 ring-ocean/10 p-7 hover:bg-white hover:-translate-y-1 transition-all"
            style={{ animationDelay: "120ms" }}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#dcf5e3] text-[#1f9d55] grid place-items-center mb-4 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
              <MessageCircle className="w-5 h-5" strokeWidth={2} />
            </div>
            <p className="text-xs uppercase tracking-widest text-mist">WhatsApp</p>
            <p className="mt-1 font-serif text-xl text-ocean">
              <Ed path="studio.whatsappLabel" value={studio.whatsappLabel} />
            </p>
            <p className="mt-1 text-sm text-ink/60">
              <Ed path="studio.whatsappNote" value={studio.whatsappNote} />
            </p>
          </a>

          {/* 3. Instagram */}
          <a
            href={studio.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="theme-light-locked reveal group rounded-3xl bg-white/70 dark:bg-white backdrop-blur ring-1 ring-ocean/10 p-7 hover:bg-white hover:-translate-y-1 transition-all"
            style={{ animationDelay: "240ms" }}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#f4d8de] text-[#a04760] grid place-items-center mb-4 group-hover:bg-[#d97a8a] group-hover:text-sand transition-colors">
              <Instagram className="w-5 h-5" strokeWidth={2} />
            </div>
            <p className="text-xs uppercase tracking-widest text-mist">Instagram</p>
            <p className="mt-1 font-serif text-xl text-ocean">
              <Ed path="studio.instagramLabel" value={studio.instagramLabel} />
            </p>
            <p className="mt-1 text-sm text-ink/60">
              <Ed path="studio.instagramNote" value={studio.instagramNote} />
            </p>
          </a>

          {/* 4. Email */}
          <a
            href={`mailto:${studio.email}`}
            className="theme-light-locked reveal group rounded-3xl bg-white/70 dark:bg-white backdrop-blur ring-1 ring-ocean/10 p-7 hover:bg-white hover:-translate-y-1 transition-all"
            style={{ animationDelay: "360ms" }}
          >
            <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold grid place-items-center mb-4 group-hover:bg-gold group-hover:text-ocean transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-widest text-mist">E-mail</p>
            <p className="mt-1 font-serif text-lg text-ocean break-all">
              <Ed path="studio.email" value={studio.email} />
            </p>
            <p className="mt-1 text-sm text-ink/60">
              <Ed path="studio.emailNote" value={studio.emailNote} />
            </p>
          </a>
        </div>

      </div>

    </section>
  );
}

function Footer() {
  const { studio, sections } = useContent();
  return (
    <footer className="relative mt-10">
      <WaveDivider color="var(--color-deep)" />
      <div className="theme-light-locked bg-deep text-sand/80 px-6 pt-10 pb-10 -mt-px">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 grid place-items-center">
                <Logo className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="font-serif text-2xl italic text-sand leading-tight">{studio.brandName}</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed max-w-xs text-sand/65">
              <Ed path="studio.tagline" value={studio.tagline} multiline />
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sand/50 mb-4">Navegar</p>
            <ul className="space-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="hover:text-gold transition-colors">{n.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sand/50 mb-4">Conecte-se</p>
            <ul className="space-y-2 text-sm">
              <li><a href={studio.whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">WhatsApp</a></li>
              <li><a href={studio.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">Instagram</a></li>
              <li><a href={studio.appUrl || undefined} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">Área da Aluna</a></li>
              <li><Link to="/admin" className="hover:text-gold transition-colors">Administração</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-12 pt-6 border-t border-sand/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-widest text-sand/40">
          <span><Ed path="sections.footerCopyright" value={sections.footerCopyright} /></span>
          <span><Ed path="sections.footerNote" value={sections.footerNote} /></span>
        </div>
      </div>
    </footer>
  );
}

function FloatingWhats() {
  const { studio } = useContent();
  const [expanded, setExpanded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    timer.current = setTimeout(() => setExpanded(true), 1600);
    const hide = setTimeout(() => setExpanded(false), 6000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      clearTimeout(hide);
    };
  }, []);
  return (
    <a
      href={studio.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-40 group flex items-center gap-3"
    >
      <span
        className={`origin-right transition-all duration-500 rounded-full bg-white/95 backdrop-blur ring-1 ring-ocean/10 text-ocean text-sm font-semibold px-4 py-2.5 shadow-xl whitespace-nowrap ${
          expanded ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
        } group-hover:scale-100 group-hover:opacity-100`}
      >
        {studio.floatingWhatsText}
      </span>
      <span className="relative">
        <span className="absolute inset-0 rounded-full animate-pulse-ring" />
        <span className="relative w-14 h-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-[0_18px_40px_-12px_rgba(37,211,102,0.65)] hover:scale-110 transition-transform">
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </span>
      </span>
    </a>
  );
}

export default function PraianaSite(props: { content?: SiteContent; edit?: EditApi } = {}) {
  const preview = props.content;
  const { content: fetched } = useSiteContent(!preview);
  const content = preview ?? fetched;
  useReveal([content]);
  return (
    <ContentCtx.Provider value={content}>
      <EditProvider value={props.edit ?? null}>
        <div className="min-h-screen bg-sand text-ink font-sans selection:bg-gold/30 selection:text-ocean overflow-x-hidden">
          <Navbar />
          <main>
            <Hero />
            <Movimento />
            <Modalidades />
            <Horarios />
            <Valores />
            <AreaAluna />
            <Contato />
          </main>
          <Footer />
          <FloatingWhats />
        </div>
      </EditProvider>
    </ContentCtx.Provider>
  );
}
