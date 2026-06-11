import { useEffect, useState } from "react";
import studioAsset from "@/assets/studio.png.asset.json";

const WHATSAPP_URL =
  "https://wa.me/5511999999999?text=Ol%C3%A1!%20Tenho%20interesse%20em%20uma%20aula%20na%20Praiana%20Pole%20Studio%20%F0%9F%8C%8A";
const INSTAGRAM_URL = "https://instagram.com/praianapolestudio";
const APP_URL = "#"; // placeholder — trocar pela URL do app das alunas

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

const schedule: Record<string, Partial<Record<Day, ClassType>>> = {
  "09:00": { Ter: "pole", Qui: "pole" },
  "10:00": { Seg: "flex", Qua: "flex", Sáb: "pole" },
  "17:00": { Seg: "pole", Qua: "pole", Sex: "flex" },
  "18:00": { Seg: "coreo", Ter: "pole", Qui: "coreo", Sex: "pole" },
  "19:00": { Seg: "pole", Ter: "flex", Qua: "coreo", Qui: "pole", Sex: "coreo" },
  "20:00": { Seg: "pole", Qua: "pole", Sáb: "coreo" },
};

const typeMeta: Record<ClassType, { label: string; bg: string; text: string; dot: string }> = {
  pole: { label: "Pole Dance", bg: "bg-ocean/10", text: "text-ocean", dot: "bg-ocean" },
  coreo: { label: "Pole Coreográfico", bg: "bg-gold/15", text: "text-[#9c5a00]", dot: "bg-gold" },
  flex: { label: "Flex Flow", bg: "bg-mist/15", text: "text-[#3a5e7f]", dot: "bg-mist" },
};

const modalities = [
  {
    n: "01",
    title: "Pole Dance",
    desc: "Desenvolva força, resistência e consciência corporal enquanto aprende giros, transições e acrobacias. Uma modalidade dinâmica para evoluir técnica e condicionamento físico.",
  },
  {
    n: "02",
    title: "Pole Coreográfico",
    desc: "A união entre o Pole e a Dança. Explore musicalidade, expressão corporal, fluidez e presença através de coreografias que conectam técnica e movimento.",
  },
  {
    n: "03",
    title: "Flex Flow",
    desc: "Movimento, mobilidade e flexibilidade em perfeita conexão. Uma prática fluida que convida o corpo a ganhar amplitude de forma natural e consciente.",
  },
];

const plans = [
  {
    name: "4 Aulas",
    price: "R$ 230",
    per: "R$ 57,50 por aula",
    desc: "Perfeito para começar com consistência.",
    highlight: false,
  },
  {
    name: "8 Aulas",
    price: "R$ 370",
    per: "R$ 46,25 por aula",
    desc: "O mais escolhido pelas nossas alunas.",
    highlight: true,
  },
  {
    name: "12 Aulas",
    price: "R$ 480",
    per: "R$ 40,00 por aula",
    desc: "Para quem quer evolução acelerada.",
    highlight: false,
  },
];

const extras = [
  { name: "Aula Avulsa", price: "R$ 70", desc: "Sem compromisso de mensalidade" },
  { name: "Aula Particular", price: "R$ 140", desc: "Atenção exclusiva da professora" },
];

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
        className={`mx-auto max-w-5xl flex items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500 ${
          scrolled
            ? "bg-sand/85 backdrop-blur-xl ring-1 ring-ocean/10 shadow-[0_8px_30px_-12px_rgba(38,106,174,0.25)]"
            : "bg-transparent"
        }`}
      >
        <a href="#home" className="font-serif text-2xl italic tracking-tight text-ocean">
          Praiana
        </a>
        <div className="hidden md:flex items-center gap-7 text-sm">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-ink/70 hover:text-ocean transition-colors">
              {n.label}
            </a>
          ))}
        </div>
        <a
          href={APP_URL}
          className="hidden md:inline-flex items-center gap-2 rounded-full bg-ocean px-4 py-2 text-xs font-semibold uppercase tracking-widest text-sand hover:bg-deep transition-colors"
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
        <div className="md:hidden mx-auto mt-2 max-w-5xl rounded-3xl bg-sand/95 backdrop-blur-xl ring-1 ring-ocean/10 p-6 shadow-xl">
          <div className="flex flex-col gap-4">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="text-ink/80 hover:text-ocean text-base"
              >
                {n.label}
              </a>
            ))}
            <a
              href={APP_URL}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-ocean px-4 py-3 text-xs font-semibold uppercase tracking-widest text-sand"
            >
              Área da Aluna
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section id="home" className="relative pt-28 pb-16 px-6 overflow-hidden">
      <div className="absolute -top-24 -right-32 w-[420px] h-[420px] organic-blob bg-mist/25 blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[360px] h-[360px] organic-blob-2 bg-gold/20 blur-3xl animate-float-slow pointer-events-none" />

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-mist mb-6">
            <span className="h-px w-8 bg-gold" /> Pole Studio & Artes
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[0.95] text-ocean text-balance">
            Sinta o <span className="italic text-gold">movimento</span> que <br className="hidden md:block" />
            já existe em você.
          </h1>
          <p className="mt-6 max-w-md text-base md:text-lg text-ink/70 leading-relaxed">
            Um espaço para você descobrir sua força, se mover com fluidez e se expressar — entre giros, danças e respiração.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#valores"
              className="inline-flex items-center justify-center rounded-full bg-ocean px-7 py-4 text-sm font-semibold text-sand hover:bg-deep transition-colors shadow-[0_12px_40px_-12px_rgba(38,106,174,0.5)]"
            >
              Comece agora
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
          <div className="absolute -inset-4 bg-gradient-to-br from-mist/30 via-transparent to-gold/20 blur-2xl rounded-[60px]" />
          <div className="relative overflow-hidden rounded-[40%_60%_45%_55%/55%_45%_55%_45%] shadow-[0_30px_80px_-20px_rgba(17,53,92,0.35)] ring-1 ring-white/40">
            <img
              src={studioAsset.url}
              alt="Estúdio Praiana — sala azul com barras de pole"
              className="w-full h-[440px] md:h-[560px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ocean/30 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-6 left-6 right-10 rounded-2xl bg-white/80 backdrop-blur-md ring-1 ring-ocean/10 px-5 py-4 shadow-xl">
            <p className="font-serif italic text-ocean text-lg">"Um lugar para se amar em movimento."</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Modalidades() {
  return (
    <section id="modalidades" className="relative mt-20">
      <div className="wave-top h-24 bg-ocean -mb-px" />
      <div className="bg-ocean text-sand py-24 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 organic-blob bg-mist/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-80 h-80 organic-blob-2 bg-gold/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          <div className="mb-14 max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">O que praticamos</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl italic leading-tight">
              Três caminhos, um mesmo fluxo.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-5">
            {modalities.map((m, i) => (
              <article
                key={m.title}
                className="group relative rounded-[32px] bg-white/5 backdrop-blur-sm ring-1 ring-white/10 p-7 transition-all duration-500 hover:bg-white/10 hover:-translate-y-1"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <span
                  className="font-script text-gold text-7xl leading-none block mb-2"
                  aria-hidden
                >
                  {m.n}
                </span>
                <h3 className="font-serif text-2xl italic mb-3">{m.title}</h3>
                <p className="text-sand/75 text-sm leading-relaxed">{m.desc}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold/80">
                  Todos os níveis
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <div className="wave-bottom h-24 bg-ocean -mt-px" />
    </section>
  );
}

function Horarios() {
  return (
    <section id="horarios" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 organic-blob bg-mist/15 blur-3xl pointer-events-none" />
      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-mist">Planeje sua semana</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl italic text-ocean">Grade de Horários</h2>
          <p className="mt-3 text-ink/60 max-w-md mx-auto">
            Confira os horários disponíveis e escolha o melhor para você.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {(Object.keys(typeMeta) as ClassType[]).map((k) => (
            <span
              key={k}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ring-1 ring-ocean/10 bg-white/60 backdrop-blur ${typeMeta[k].text}`}
            >
              <span className={`w-2 h-2 rounded-full ${typeMeta[k].dot}`} />
              {typeMeta[k].label}
            </span>
          ))}
        </div>

        {/* Desktop */}
        <div className="hidden md:block rounded-[32px] overflow-hidden bg-white/70 backdrop-blur-xl ring-1 ring-ocean/10 shadow-[0_20px_60px_-30px_rgba(38,106,174,0.3)]">
          <table className="w-full">
            <thead>
              <tr className="bg-ocean text-sand">
                <th className="py-4 px-4 text-left text-xs font-semibold uppercase tracking-widest w-24">
                  Horário
                </th>
                {days.map((d) => (
                  <th key={d} className="py-4 px-2 text-center text-xs font-semibold uppercase tracking-widest">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(schedule).map(([time, slots], i) => (
                <tr key={time} className={i % 2 === 0 ? "bg-white/40" : "bg-mist/5"}>
                  <td className="py-3 px-4 text-sm font-semibold text-ocean">{time}</td>
                  {days.map((d) => {
                    const t = slots[d];
                    return (
                      <td key={d} className="py-2 px-1.5 text-center">
                        {t ? (
                          <span
                            className={`inline-block w-full px-2 py-2 rounded-xl text-[11px] font-semibold ${typeMeta[t].bg} ${typeMeta[t].text}`}
                          >
                            {typeMeta[t].label.split(" ")[0]}
                          </span>
                        ) : (
                          <span className="text-ink/20">·</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-4">
          {Object.entries(schedule).map(([time, slots]) => (
            <div
              key={time}
              className="rounded-3xl bg-white/70 backdrop-blur-xl ring-1 ring-ocean/10 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-serif text-xl italic text-ocean">{time}</span>
                <span className="text-[10px] uppercase tracking-widest text-ink/40">
                  {Object.keys(slots).length} aulas
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(Object.entries(slots) as [Day, ClassType][]).map(([d, t]) => (
                  <span
                    key={d}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-medium ${typeMeta[t].bg} ${typeMeta[t].text}`}
                  >
                    <span className="font-semibold">{d}</span>
                    <span className="opacity-60">·</span>
                    {typeMeta[t].label.split(" ")[0]}
                  </span>
                ))}
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
      <div className="absolute -top-20 -left-20 w-72 h-72 organic-blob-2 bg-gold/15 blur-3xl pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-mist">Invista em você</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl italic text-ocean">Planos & Valores</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <article
              key={p.name}
              className={`relative rounded-[36px] p-8 flex flex-col transition-all duration-500 hover:-translate-y-2 ${
                p.highlight
                  ? "bg-ocean text-sand shadow-[0_30px_80px_-20px_rgba(38,106,174,0.55)] ring-1 ring-ocean md:scale-105"
                  : "bg-white/80 backdrop-blur ring-1 ring-ocean/10 shadow-[0_10px_40px_-20px_rgba(38,106,174,0.2)]"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gold text-ocean">
                  ✦ Mais popular
                </span>
              )}
              <span
                className={`text-xs font-semibold uppercase tracking-[0.25em] ${
                  p.highlight ? "text-gold" : "text-mist"
                }`}
              >
                {p.name}
              </span>
              <div className="mt-3 flex items-baseline gap-2">
                <span
                  className={`font-serif text-5xl font-semibold ${
                    p.highlight ? "text-sand" : "text-ocean"
                  }`}
                >
                  {p.price}
                </span>
                <span className={`text-sm ${p.highlight ? "text-sand/60" : "text-ink/50"}`}>/mês</span>
              </div>
              <span
                className={`mt-2 inline-block self-start px-3 py-1 rounded-full text-[11px] font-medium ${
                  p.highlight ? "bg-gold/20 text-gold" : "bg-mist/15 text-mist"
                }`}
              >
                {p.per}
              </span>
              <p
                className={`mt-5 pb-5 border-b text-sm ${
                  p.highlight ? "text-sand/80 border-sand/15" : "text-ink/65 border-ocean/10"
                }`}
              >
                {p.desc}
              </p>
              <ul className="mt-5 space-y-3 text-sm flex-1">
                {[
                  "Todas as modalidades",
                  "Todos os níveis",
                  "Acesso ao app do estúdio",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 w-5 h-5 rounded-full grid place-items-center text-xs ${
                        p.highlight ? "bg-gold/25 text-gold" : "bg-ocean/10 text-ocean"
                      }`}
                    >
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
                className={`mt-7 inline-flex items-center justify-center rounded-2xl py-3.5 text-sm font-semibold transition-all hover:opacity-90 ${
                  p.highlight ? "bg-gold text-ocean" : "bg-ocean text-sand"
                }`}
              >
                Quero este plano
              </a>
            </article>
          ))}
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {extras.map((e) => (
            <div
              key={e.name}
              className="flex items-center justify-between rounded-2xl bg-white/70 backdrop-blur ring-1 ring-ocean/10 px-5 py-4"
            >
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
      <div className="relative max-w-5xl mx-auto overflow-hidden rounded-[48px] bg-gradient-to-br from-ocean via-deep to-ocean text-sand px-8 py-14 md:px-14 md:py-20 ring-1 ring-white/10">
        <div className="absolute -top-20 -right-20 w-80 h-80 organic-blob bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 organic-blob-2 bg-mist/30 blur-3xl" />
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
              className="inline-flex items-center gap-3 rounded-full bg-gold text-ocean px-7 py-4 text-sm font-bold uppercase tracking-widest shadow-[0_20px_60px_-15px_rgba(245,166,35,0.6)] hover:scale-[1.02] transition-transform"
            >
              Acessar o app
              <span aria-hidden>→</span>
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
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-mist">Vamos conversar</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl italic text-ocean">Contato</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="group rounded-3xl bg-white/70 backdrop-blur ring-1 ring-ocean/10 p-7 hover:bg-white transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-ocean/10 text-ocean grid place-items-center mb-4 group-hover:bg-ocean group-hover:text-sand transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M20.52 3.48A11.78 11.78 0 0 0 12.04 0C5.5 0 .2 5.3.2 11.83a11.7 11.7 0 0 0 1.6 5.95L0 24l6.36-1.67a11.83 11.83 0 0 0 5.67 1.44h.01c6.54 0 11.84-5.3 11.84-11.83 0-3.16-1.23-6.13-3.46-8.46zM12.05 21.4a9.55 9.55 0 0 1-4.87-1.33l-.35-.21-3.78.99 1-3.68-.23-.38a9.45 9.45 0 0 1-1.46-5.06c0-5.24 4.28-9.5 9.55-9.5a9.5 9.5 0 0 1 9.5 9.5c-.01 5.24-4.28 9.5-9.36 9.67z" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-widest text-mist">WhatsApp</p>
            <p className="mt-1 font-serif text-xl text-ocean">+55 11 99999-9999</p>
            <p className="mt-1 text-sm text-ink/60">Resposta rápida durante o dia.</p>
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="group rounded-3xl bg-white/70 backdrop-blur ring-1 ring-ocean/10 p-7 hover:bg-white transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold grid place-items-center mb-4 group-hover:bg-gold group-hover:text-ocean transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-widest text-mist">Instagram</p>
            <p className="mt-1 font-serif text-xl text-ocean">@praianapolestudio</p>
            <p className="mt-1 text-sm text-ink/60">Bastidores e novidades.</p>
          </a>
          <div className="rounded-3xl bg-white/70 backdrop-blur ring-1 ring-ocean/10 p-7">
            <div className="w-12 h-12 rounded-2xl bg-mist/15 text-mist grid place-items-center mb-4">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-widest text-mist">Endereço</p>
            <p className="mt-1 font-serif text-xl text-ocean leading-snug">Rua das Ondas, 123</p>
            <p className="mt-1 text-sm text-ink/60">Seg a Sáb · 08h – 21h</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative mt-10">
      <div className="wave-top h-20 bg-deep -mb-px" />
      <div className="bg-deep text-sand/80 px-6 pt-14 pb-10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <p className="font-serif text-3xl italic text-sand">Praiana</p>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gold">Pole Dance & Artes</p>
            <p className="mt-5 text-sm leading-relaxed max-w-xs text-sand/65">
              Um espaço para você se movimentar, se amar e se expressar.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sand/50 mb-4">Navegar</p>
            <ul className="space-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="hover:text-gold transition-colors">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sand/50 mb-4">Conecte-se</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href={APP_URL} className="hover:text-gold transition-colors">
                  Área da Aluna
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-12 pt-6 border-t border-sand/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-widest text-sand/40">
          <span>© {new Date().getFullYear()} Praiana Pole Studio</span>
          <span>Feito com fluidez · Rio</span>
        </div>
      </div>
    </footer>
  );
}

function FloatingWhats() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-gold text-ocean grid place-items-center shadow-[0_18px_40px_-12px_rgba(245,166,35,0.65)] hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M20.52 3.48A11.78 11.78 0 0 0 12.04 0C5.5 0 .2 5.3.2 11.83a11.7 11.7 0 0 0 1.6 5.95L0 24l6.36-1.67a11.83 11.83 0 0 0 5.67 1.44h.01c6.54 0 11.84-5.3 11.84-11.83 0-3.16-1.23-6.13-3.46-8.46zM12.05 21.4a9.55 9.55 0 0 1-4.87-1.33l-.35-.21-3.78.99 1-3.68-.23-.38a9.45 9.45 0 0 1-1.46-5.06c0-5.24 4.28-9.5 9.55-9.5a9.5 9.5 0 0 1 9.5 9.5c-.01 5.24-4.28 9.5-9.36 9.67z" />
      </svg>
    </a>
  );
}

export default function PraianaSite() {
  return (
    <div className="min-h-screen bg-sand text-ink font-sans selection:bg-gold/30 selection:text-ocean">
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
