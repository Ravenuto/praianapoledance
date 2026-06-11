import { useEffect, useRef, useState } from "react";
import { MessageCircle, Instagram, Sun, Moon } from "lucide-react";
import studioImg from "@/assets/studio.png";
import logoImg from "@/assets/logo-praiana.png";

const WHATSAPP_URL =
  "https://wa.me/5511999999999?text=Ol%C3%A1!%20Tenho%20interesse%20em%20uma%20aula%20na%20Praiana%20Pole%20Studio%20%F0%9F%8C%8A";
const INSTAGRAM_URL = "https://instagram.com/praianapolestudio";
const EMAIL = "contato@praianapolestudio.com";
const APP_URL = "#";

const NAV = [
  { label: "Início", href: "#home" },
  { label: "Modalidades", href: "#modalidades" },
  { label: "Horários", href: "#horarios" },
  { label: "Valores", href: "#valores" },
  { label: "Contato", href: "#contato" },
];

const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;
type Day = (typeof days)[number];
type ClassType = "pole" | "coreo" | "flex";

const fullDayNames: Record<Day, string> = {
  Seg: "Segunda",
  Ter: "Terça",
  Qua: "Quarta",
  Qui: "Quinta",
  Sex: "Sexta",
  Sáb: "Sábado",
};

type Slot = { time: string; type: ClassType };
const calendar: Record<Day, Slot[]> = {
  Seg: [
    { time: "10:00", type: "flex" },
    { time: "17:00", type: "pole" },
    { time: "18:00", type: "coreo" },
    { time: "19:00", type: "pole" },
    { time: "20:00", type: "pole" },
  ],
  Ter: [
    { time: "09:00", type: "pole" },
    { time: "18:00", type: "pole" },
    { time: "19:00", type: "flex" },
  ],
  Qua: [
    { time: "10:00", type: "flex" },
    { time: "17:00", type: "pole" },
    { time: "19:00", type: "coreo" },
    { time: "20:00", type: "pole" },
  ],
  Qui: [
    { time: "09:00", type: "pole" },
    { time: "18:00", type: "coreo" },
    { time: "19:00", type: "pole" },
  ],
  Sex: [
    { time: "17:00", type: "flex" },
    { time: "18:00", type: "pole" },
    { time: "19:00", type: "coreo" },
  ],
  Sáb: [
    { time: "10:00", type: "pole" },
    { time: "20:00", type: "coreo" },
  ],
};

const typeMeta: Record<ClassType, { label: string; short: string; bg: string; ring: string; text: string; dot: string }> = {
  pole: { label: "Pole Dance", short: "Pole", bg: "bg-ocean/10", ring: "ring-ocean/30", text: "text-ocean", dot: "bg-ocean" },
  coreo: { label: "Pole Coreográfico", short: "Coreo", bg: "bg-gold/15", ring: "ring-gold/40", text: "text-[#9c5a00]", dot: "bg-gold" },
  flex: { label: "Flex Flow", short: "Flex", bg: "bg-[#f4d8de]", ring: "ring-[#d97a8a]/40", text: "text-[#a04760]", dot: "bg-[#d97a8a]" },
};

const modalities = [
  { n: "01", title: "Pole Dance", desc: "Desenvolva força, resistência e consciência corporal enquanto aprende giros, transições e acrobacias. Uma modalidade dinâmica para evoluir técnica e condicionamento físico." },
  { n: "02", title: "Pole Coreográfico", desc: "A união entre o Pole e a Dança. Explore musicalidade, expressão corporal, fluidez e presença através de coreografias que conectam técnica e movimento." },
  { n: "03", title: "Flex Flow", desc: "Movimento, mobilidade e flexibilidade em perfeita conexão. Uma prática fluida que convida o corpo a ganhar amplitude de forma natural e consciente." },
];

const plans = [
  { name: "4 Aulas", price: "R$ 230", per: "R$ 57,50 por aula", desc: "Perfeito para começar com consistência", highlight: false },
  { name: "8 Aulas", price: "R$ 370", per: "R$ 46,25 por aula", desc: "O mais escolhido pelas nossas alunas", highlight: true },
  { name: "12 Aulas", price: "R$ 480", per: "R$ 40,00 por aula", desc: "Para quem quer evolução acelerada", highlight: false },
];

const extras = [
  { name: "Aula Avulsa", price: "R$ 70", desc: "Sem compromisso de mensalidade" },
  { name: "Aula Particular", price: "R$ 140", desc: "Atenção exclusiva da professora" },
];

// Scroll reveal hook
function useReveal() {
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
  }, []);
}

function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src={logoImg}
      alt="Praiana Pole Studio"
      className={className}
      loading="eager"
    />
  );
}

function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);
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
      onClick={toggle}
      aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}
      className={`h-9 w-9 rounded-full bg-ocean/10 text-ocean grid place-items-center hover:bg-ocean/20 transition-colors ${className}`}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

function Navbar() {
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
        className={`mx-auto max-w-5xl flex items-center justify-between rounded-full pl-3 pr-3 py-2 transition-all duration-500 ${
          scrolled
            ? "bg-sand/85 backdrop-blur-xl ring-1 ring-ocean/10 shadow-[0_8px_30px_-12px_rgba(38,106,174,0.25)]"
            : "bg-sand/40 backdrop-blur-md"
        }`}
      >
        <a href="#home" className="flex items-center gap-2 group min-w-0">
          <Logo className="h-11 w-11 shrink-0 object-contain transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-110" />
          <span className="hidden sm:inline font-serif text-base md:text-lg italic tracking-tight text-ocean truncate">Praiana Pole Dance & Artes</span>
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
        <a
          href={APP_URL}
          className="hidden md:inline-flex items-center gap-2 rounded-full bg-ocean px-4 py-2 text-xs font-semibold uppercase tracking-widest text-sand hover:bg-deep transition-all hover:scale-105"
        >
          Área da Aluna
        </a>
        <button
          aria-label="Abrir menu"
          onClick={() => setOpen((o) => !o)}
          className="md:hidden h-9 w-9 rounded-full bg-ocean/10 grid place-items-center text-ocean"
        >
          <span className="space-y-1.5">
            <span className="block w-4 h-0.5 bg-current" />
            <span className="block w-4 h-0.5 bg-current" />
          </span>
        </button>
      </div>
      {open && (
        <div className="md:hidden mx-auto mt-2 max-w-5xl rounded-3xl bg-sand/95 backdrop-blur-xl ring-1 ring-ocean/10 p-6 shadow-xl animate-fade-up">
          <div className="flex flex-col gap-4">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="text-ink/80 hover:text-ocean text-base">
                {n.label}
              </a>
            ))}
            <a href={APP_URL} className="mt-2 inline-flex items-center justify-center rounded-full bg-ocean px-4 py-3 text-xs font-semibold uppercase tracking-widest text-sand">
              Área da Aluna
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function WaveDivider({ flip = false, color = "var(--color-ocean)" }: { flip?: boolean; color?: string }) {
  return (
    <div className={`relative h-20 overflow-hidden ${flip ? "-scale-y-100" : ""}`} aria-hidden>
      <div className="absolute inset-x-0 bottom-0 h-full flex w-[200%] animate-wave-move will-change-transform">
        {[0, 1].map((k) => (
          <svg
            key={k}
            className="block h-full w-1/2 shrink-0"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 C300,120 600,0 1200,60 L1200,120 L0,120 Z"
              fill={color}
            />
          </svg>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="relative pt-28 pb-20 px-6 overflow-hidden">
      <div className="absolute -top-24 -right-32 w-[420px] h-[420px] organic-blob bg-mist/25 blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[360px] h-[360px] organic-blob-2 bg-gold/20 blur-3xl animate-float-slow pointer-events-none [animation-delay:2s]" />
      <div className="absolute top-1/3 left-1/2 w-[260px] h-[260px] organic-blob bg-ocean/10 blur-3xl animate-float-y pointer-events-none" />

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-mist mb-6">
            <span className="h-px w-8 bg-gold" /> Pole Studio & Artes
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[0.95] text-ocean text-balance">
            Sinta o{" "}
            <span className="relative inline-block italic text-gold">
              movimento
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8 Q50 -2 100 6 T198 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>{" "}
            que <br className="hidden md:block" />
            já existe em você.
          </h1>
          <p className="mt-6 max-w-md text-base md:text-lg text-ink/70 leading-relaxed">
            Venha descobrir toda a sua força com o Pole Dance.{"\n"}Um espaço para você se movimentar, se amar e se expressar.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 justify-center rounded-full bg-ocean px-7 py-4 text-sm font-semibold text-sand hover:bg-deep transition-all hover:-translate-y-0.5 shadow-[0_12px_40px_-12px_rgba(38,106,174,0.5)]"
            >
              Comece agora{"\n\n"}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#modalidades"
              className="inline-flex items-center justify-center rounded-full border border-ocean/30 px-7 py-4 text-sm font-semibold text-ocean hover:bg-ocean/5 transition-colors"
            >
              Ver modalidades
            </a>
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:200ms]">
          <div className="absolute -inset-4 bg-gradient-to-br from-mist/30 via-transparent to-gold/20 blur-2xl rounded-[60px] animate-shimmer-bg" />
          <div className="relative overflow-hidden animate-blob-morph shadow-[0_30px_80px_-20px_rgba(17,53,92,0.35)] ring-1 ring-white/40">
            <img
              src={studioImg}
              alt="Estúdio Praiana — sala com barras de pole"
              className="w-full h-[440px] md:h-[560px] object-cover scale-105 hover:scale-110 transition-transform duration-[2.5s]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ocean/30 via-transparent to-transparent" />
          </div>

          {/* Floating logo */}
          <div className="absolute -top-6 -right-4 md:-right-8 z-10 animate-float-y">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gold/30 blur-2xl animate-pulse-ring" />
              <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full bg-sand/95 backdrop-blur ring-2 ring-white/70 shadow-[0_18px_50px_-15px_rgba(17,53,92,0.45)] grid place-items-center p-3">
                <Logo className="h-full w-full object-contain" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Marquee strip */}
      <div className="mt-24 relative overflow-hidden border-y border-ocean/10 py-5 bg-gradient-to-r from-sand via-mist/10 to-sand">
        <div className="flex whitespace-nowrap animate-marquee w-max will-change-transform">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center shrink-0">
              {["Força", "Liberdade", "Empoderamento", "Flexibilidade", "Dança", "Arte", "Comunidade", "Movimento"].map((w, i) => (
                <span key={i} className="flex items-center">
                  <span className="font-serif italic text-3xl leading-none text-ocean/80 px-6">{w}</span>
                  <span className="text-gold text-2xl leading-none">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Modalidades() {
  return (
    <section id="modalidades" className="relative mt-10">
      <WaveDivider />
      <div className="bg-ocean text-sand py-24 px-6 relative overflow-hidden -mt-px">
        <div className="absolute top-20 left-10 w-72 h-72 organic-blob bg-mist/20 blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-80 h-80 organic-blob-2 bg-gold/10 blur-3xl animate-float-slow [animation-delay:3s] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          <div className="mb-14 max-w-xl reveal">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Modalidades</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-5">
            {modalities.map((m, i) => (
              <article
                key={m.title}
                className="reveal group relative rounded-[32px] bg-white/5 backdrop-blur-sm ring-1 ring-white/10 p-7 transition-all duration-500 hover:bg-white/10 hover:-translate-y-2 hover:ring-gold/30"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <h3 className="font-serif italic text-gold text-3xl md:text-4xl leading-tight mb-4 transition-transform duration-500 group-hover:translate-x-1">
                  {m.title}
                </h3>
                <p className="text-sand/75 text-sm leading-relaxed">{m.desc}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold/80">
                  Todos os níveis
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
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
  return (
    <section id="horarios" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 organic-blob bg-mist/15 blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-72 h-72 organic-blob-2 bg-gold/10 blur-3xl animate-float-slow [animation-delay:2s] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-10 reveal">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-mist">Planeje sua semana</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl italic text-ocean">Grade de Horários</h2>
          <p className="mt-3 text-ink/60 max-w-md mx-auto">
            {"\n\n\n\n"}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10 reveal">
          {(Object.keys(typeMeta) as ClassType[]).map((k) => (
            <span
              key={k}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ring-1 ring-ocean/10 bg-white/70 backdrop-blur ${typeMeta[k].text}`}
            >
              <span className={`w-2 h-2 rounded-full ${typeMeta[k].dot}`} />
              {typeMeta[k].label}
            </span>
          ))}
        </div>

        {/* Calendar grid - 6 day columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {days.map((d, i) => (
            <div
              key={d}
              className="reveal rounded-3xl bg-white/70 backdrop-blur-xl ring-1 ring-ocean/10 p-4 hover:-translate-y-1 hover:shadow-[0_20px_50px_-25px_rgba(38,106,174,0.4)] transition-all duration-500"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="text-center pb-3 mb-3 border-b border-ocean/10">
                <p className="font-serif text-xl md:text-2xl italic text-ocean leading-tight">{fullDayNames[d]}</p>
              </div>
              <div className="space-y-2">
                {calendar[d].map((s) => (
                  <div
                    key={s.time + s.type}
                    className={`group rounded-2xl ${typeMeta[s.type].bg} ring-1 ${typeMeta[s.type].ring} px-3 py-2.5 transition-all hover:scale-[1.03] cursor-default`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold text-sm ${typeMeta[s.type].text}`}>{s.time}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${typeMeta[s.type].dot}`} />
                    </div>
                    <p className={`text-[11px] font-medium mt-0.5 ${typeMeta[s.type].text} opacity-80`}>
                      {typeMeta[s.type].short}
                    </p>
                  </div>
                ))}
                {calendar[d].length === 0 && (
                  <p className="text-center text-xs text-ink/30 py-4">—</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Valores() {
  return (
    <section id="valores" className="relative py-24 px-6 overflow-hidden">
      <div className="absolute -top-20 -left-20 w-72 h-72 organic-blob-2 bg-gold/15 blur-3xl animate-float-slow pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14 reveal">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-mist">Invista em você</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl italic text-ocean">Planos & Valores</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <article
              key={p.name}
              className={`reveal relative rounded-[36px] p-8 flex flex-col transition-all duration-500 hover:-translate-y-3 ${
                p.highlight
                  ? "bg-ocean text-sand shadow-[0_30px_80px_-20px_rgba(38,106,174,0.55)] ring-1 ring-ocean md:scale-105"
                  : "bg-white/80 backdrop-blur ring-1 ring-ocean/10 shadow-[0_10px_40px_-20px_rgba(38,106,174,0.2)]"
              }`}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gold text-ocean animate-float-y">
                  ✦ Mais popular
                </span>
              )}
              <span className={`text-xs font-semibold uppercase tracking-[0.25em] ${p.highlight ? "text-gold" : "text-mist"}`}>
                {p.name}
              </span>
              <div className="mt-3 flex items-baseline gap-2">
                <span className={`font-serif text-5xl font-semibold ${p.highlight ? "text-sand" : "text-ocean"}`}>
                  {p.price}
                </span>
                <span className={`text-sm ${p.highlight ? "text-sand/60" : "text-ink/50"}`}>/mês</span>
              </div>
              <span className={`mt-2 inline-block self-start px-3 py-1 rounded-full text-[11px] font-medium ${p.highlight ? "bg-gold/20 text-gold" : "bg-mist/15 text-mist"}`}>
                {p.per}
              </span>
              <p className={`mt-5 pb-5 border-b text-sm ${p.highlight ? "text-sand/80 border-sand/15" : "text-ink/65 border-ocean/10"}`}>
                {p.desc}
              </p>
              <ul className="mt-5 space-y-3 text-sm flex-1">
                {["Todas as modalidades", "Todos os níveis", "Acesso ao app do estúdio"].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className={`mt-0.5 w-5 h-5 rounded-full grid place-items-center text-xs ${p.highlight ? "bg-gold/25 text-gold" : "bg-ocean/10 text-ocean"}`}>
                      ✓
                    </span>
                    <span className={p.highlight ? "text-sand/90" : "text-ink/75"}>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className={`mt-7 inline-flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-all hover:scale-[1.02] ${p.highlight ? "bg-gold text-ocean" : "bg-ocean text-sand"}`}
              >
                Quero este plano <span aria-hidden>→</span>
              </a>
            </article>
          ))}
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {extras.map((e) => (
            <div key={e.name} className="reveal flex items-center justify-between rounded-2xl bg-white/70 backdrop-blur ring-1 ring-ocean/10 px-5 py-4 hover:bg-white transition-colors">
              <div>
                <p className="font-semibold text-ink">{e.name}</p>
                <p className="text-xs text-ink/50 mt-0.5">{e.desc}</p>
              </div>
              <span className="font-serif text-2xl text-ocean">{e.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AreaAluna() {
  return (
    <section className="px-6 pb-24">
      <div className="relative max-w-5xl mx-auto overflow-hidden rounded-[48px] bg-gradient-to-br from-ocean via-deep to-ocean text-sand px-8 py-14 md:px-14 md:py-20 ring-1 ring-white/10 animate-shimmer-bg reveal">
        <div className="absolute -top-20 -right-20 w-80 h-80 organic-blob bg-gold/20 blur-3xl animate-float-slow" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 organic-blob-2 bg-mist/30 blur-3xl animate-float-slow [animation-delay:2s]" />
        <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Exclusivo</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl italic">Área da Aluna</h2>
            <p className="mt-4 text-sand/80 max-w-md">
              Veja sua agenda, marque presença, acompanhe sua evolução e acesse conteúdos exclusivos direto pelo app da Praiana.
            </p>
          </div>
          <div className="md:justify-self-end">
            <a
              href={APP_URL}
              className="group inline-flex items-center gap-3 rounded-full bg-gold text-ocean px-7 py-4 text-sm font-bold uppercase tracking-widest shadow-[0_20px_60px_-15px_rgba(245,166,35,0.6)] hover:scale-105 transition-transform"
            >
              Acessar o app
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contato() {
  return (
    <section id="contato" className="px-6 pb-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 reveal">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-mist">Vamos conversar</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl italic text-ocean">Contato</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Endereço */}
          <a
            href="https://maps.google.com/?q=Rua+das+Ondas+123"
            target="_blank"
            rel="noreferrer"
            className="reveal group rounded-3xl bg-white/70 backdrop-blur ring-1 ring-ocean/10 p-7 hover:bg-white hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-mist/15 text-mist grid place-items-center mb-4 group-hover:bg-mist group-hover:text-sand transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-widest text-mist">Endereço</p>
            <p className="mt-1 font-serif text-xl text-ocean leading-snug">Rua das Ondas, 123</p>
            <p className="mt-1 text-sm text-ink/60">{"\n"}</p>
          </a>

          {/* 2. WhatsApp */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="reveal group rounded-3xl bg-white/70 backdrop-blur ring-1 ring-ocean/10 p-7 hover:bg-white hover:-translate-y-1 transition-all"
            style={{ animationDelay: "120ms" }}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#dcf5e3] text-[#1f9d55] grid place-items-center mb-4 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
              <MessageCircle className="w-5 h-5" strokeWidth={2} />
            </div>
            <p className="text-xs uppercase tracking-widest text-mist">WhatsApp</p>
            <p className="mt-1 font-serif text-xl text-ocean">+55 11 99999-9999</p>
            <p className="mt-1 text-sm text-ink/60">Resposta rápida durante o dia.</p>
          </a>

          {/* 3. Instagram */}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="reveal group rounded-3xl bg-white/70 backdrop-blur ring-1 ring-ocean/10 p-7 hover:bg-white hover:-translate-y-1 transition-all"
            style={{ animationDelay: "240ms" }}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#f4d8de] text-[#a04760] grid place-items-center mb-4 group-hover:bg-[#d97a8a] group-hover:text-sand transition-colors">
              <Instagram className="w-5 h-5" strokeWidth={2} />
            </div>
            <p className="text-xs uppercase tracking-widest text-mist">Instagram</p>
            <p className="mt-1 font-serif text-xl text-ocean">@praianapolestudio</p>
            <p className="mt-1 text-sm text-ink/60">Bastidores, aulas e novidades.</p>
          </a>

          {/* 4. Email */}
          <a
            href={`mailto:${EMAIL}`}
            className="reveal group rounded-3xl bg-white/70 backdrop-blur ring-1 ring-ocean/10 p-7 hover:bg-white hover:-translate-y-1 transition-all"
            style={{ animationDelay: "360ms" }}
          >
            <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold grid place-items-center mb-4 group-hover:bg-gold group-hover:text-ocean transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-widest text-mist">E-mail</p>
            <p className="mt-1 font-serif text-lg text-ocean break-all">{EMAIL}</p>
            <p className="mt-1 text-sm text-ink/60">Para parcerias e dúvidas.</p>
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative mt-10">
      <WaveDivider color="var(--color-deep)" />
      <div className="bg-deep text-sand/80 px-6 pt-10 pb-10 -mt-px">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-sand/95 grid place-items-center p-2">
                <Logo className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="font-serif text-2xl italic text-sand leading-tight">Praiana Pole Dance & Artes</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-gold">{"\n"}</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed max-w-xs text-sand/65">
              Um espaço para você se movimentar, se amar e se expressar.
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
              <li><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">WhatsApp</a></li>
              <li><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">Instagram</a></li>
              <li><a href={APP_URL} className="hover:text-gold transition-colors">Área da Aluna</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-12 pt-6 border-t border-sand/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-widest text-sand/40">
          <span>© 2024&nbsp;PRAIANA POLE STUDIO</span>
          <span>FEITO COM AMOR</span>
        </div>
      </div>
    </footer>
  );
}

function FloatingWhats() {
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
      href={WHATSAPP_URL}
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
        Bora marcar sua aula? 🌊
      </span>
      <span className="relative">
        <span className="absolute inset-0 rounded-full animate-pulse-ring" />
        <span className="relative w-14 h-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-[0_18px_40px_-12px_rgba(37,211,102,0.65)] hover:scale-110 transition-transform">
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </span>
      </span>
    </a>
  );
}

export default function PraianaSite() {
  useReveal();
  return (
    <div className="min-h-screen bg-sand text-ink font-sans selection:bg-gold/30 selection:text-ocean overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Modalidades />
        <Horarios />
        <Valores />
        <AreaAluna />
        <Contato />
      </main>
      <Footer />
      <FloatingWhats />
    </div>
  );
}
