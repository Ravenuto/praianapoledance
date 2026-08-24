import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import studioImg from "@/assets/studio.png";
import logoImg from "@/assets/logo-praiana.png";
import movimentoImg from "@/assets/movimento.jpg";

export type ImageKey = "hero" | "logo" | "movimento";

export type Slot = { time: string; type: string };
export type DaySchedule = { id: string; name: string; slots: Slot[] };
export type ClassTypeDef = { id: string; label: string; short: string; color: ColorKey };
export type Modality = { title: string; desc: string; level: string };
export type Plan = {
  name: string;
  price: string;
  per: string;
  desc: string;
  highlight: boolean;
  benefits: string[];
};
export type Extra = { name: string; price: string; desc: string };

export type ColorKey = "ocean" | "gold" | "rose" | "green" | "violet" | "teal";

export const PALETTE: Record<
  ColorKey,
  { label: string; bg: string; ring: string; text: string; dot: string; swatch: string }
> = {
  ocean: { label: "Azul", bg: "bg-ocean/10", ring: "ring-ocean/30", text: "text-ocean", dot: "bg-ocean", swatch: "#266aae" },
  gold: { label: "Dourado", bg: "bg-gold/15", ring: "ring-gold/40", text: "text-[#9c5a00]", dot: "bg-gold", swatch: "#F5A623" },
  rose: { label: "Rosé", bg: "bg-[#f4d8de]", ring: "ring-[#d97a8a]/40", text: "text-[#a04760]", dot: "bg-[#d97a8a]", swatch: "#d97a8a" },
  green: { label: "Verde", bg: "bg-[#dcf5e3]", ring: "ring-[#1f9d55]/40", text: "text-[#1f7a45]", dot: "bg-[#1f9d55]", swatch: "#1f9d55" },
  violet: { label: "Violeta", bg: "bg-[#e6dcf5]", ring: "ring-[#7a5bbd]/40", text: "text-[#5d43a0]", dot: "bg-[#7a5bbd]", swatch: "#7a5bbd" },
  teal: { label: "Turquesa", bg: "bg-[#d5f0f0]", ring: "ring-[#178a8a]/40", text: "text-[#0f6d6d]", dot: "bg-[#178a8a]", swatch: "#178a8a" },
};

export function colorOf(key: string | undefined) {
  return PALETTE[(key as ColorKey) in PALETTE ? (key as ColorKey) : "ocean"];
}

export type SiteContent = {
  hero: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    titleRest: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  studio: {
    brandName: string;
    tagline: string;
    whatsappUrl: string;
    whatsappLabel: string;
    whatsappNote: string;
    instagramUrl: string;
    instagramLabel: string;
    instagramNote: string;
    email: string;
    emailNote: string;
    appUrl: string;
    addressLabel: string;
    addressUrl: string;
    mapEmbedUrl: string;
    addressNote: string;
    floatingWhatsText: string;
  };
  sections: {
    modalidadesEyebrow: string;
    horariosEyebrow: string;
    horariosTitle: string;
    valoresEyebrow: string;
    valoresTitle: string;
    planCta: string;
    contatoEyebrow: string;
    contatoTitle: string;
    footerCopyright: string;
    footerNote: string;
  };
  movimento: {
    titleLead: string;
    titleHighlight: string;
    badge: string;
    text1: string;
    text2: string;
  };
  images: { hero: string; logo: string; movimento: string };
  modalities: Modality[];
  classTypes: ClassTypeDef[];
  schedule: DaySchedule[];
  plans: Plan[];
  extras: Extra[];
  areaAluna: { eyebrow: string; title: string; desc: string; cta: string };
};

const LEGACY_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;
const LEGACY_FULL: Record<string, string> = {
  Seg: "Segunda",
  Ter: "Terça",
  Qua: "Quarta",
  Qui: "Quinta",
  Sex: "Sexta",
  Sáb: "Sábado",
};

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    eyebrow: "Pole Studio & Artes",
    titleLead: "Sinta o",
    titleHighlight: "movimento",
    titleRest: "que já existe em você.",
    description:
      "Venha descobrir toda a sua força com o Pole Dance. Um espaço para você se movimentar, se amar e se expressar.",
    ctaPrimary: "Comece agora",
    ctaSecondary: "Ver modalidades",
  },
  studio: {
    brandName: "Praiana Pole Dance & Artes",
    tagline: "Um espaço para você se movimentar, se amar e se expressar.",
    whatsappUrl:
      "https://wa.me/5511999999999?text=Ol%C3%A1!%20Tenho%20interesse%20em%20uma%20aula%20na%20Praiana%20Pole%20Studio%20%F0%9F%8C%8A",
    whatsappLabel: "+55 11 99999-9999",
    whatsappNote: "Resposta rápida durante o dia.",
    instagramUrl: "https://instagram.com/praianapolestudio",
    instagramLabel: "@praianapolestudio",
    instagramNote: "Bastidores, aulas e novidades.",
    email: "contato@praianapolestudio.com",
    emailNote: "Para parcerias e dúvidas.",
    appUrl: "#",
    addressLabel: "Rua das Ondas, 123",
    addressUrl: "https://maps.google.com/?q=Rua+das+Ondas+123",
    mapEmbedUrl: "",
    addressNote: "",
    floatingWhatsText: "Bora marcar sua aula? 🌊",
  },
  sections: {
    modalidadesEyebrow: "Modalidades",
    horariosEyebrow: "Planeje sua semana",
    horariosTitle: "Grade de Horários",
    valoresEyebrow: "Invista em você",
    valoresTitle: "Planos & Valores",
    planCta: "Quero este plano",
    contatoEyebrow: "Vamos conversar",
    contatoTitle: "Contato",
    footerCopyright: "© 2024 PRAIANA POLE STUDIO",
    footerNote: "FEITO COM AMOR",
  },
  movimento: {
    titleLead: "O",
    titleHighlight: "movimento",
    badge: "Sinfonia das marés",
    text1:
      "A liberdade flui no ritmo das marés. Na Praiana, enxergamos o pole dance como uma extensão da natureza: uma dança entre a força da terra e a fluidez da água.",
    text2:
      "Aqui, cada inversão é um novo horizonte e cada movimento é uma celebração da sua própria essência. Encontre o seu equilíbrio entre o céu e o mar.",
  },
  images: { hero: studioImg, logo: logoImg, movimento: movimentoImg },
  modalities: [
    {
      title: "Pole Dance",
      desc: "Desenvolva força, resistência e consciência corporal enquanto aprende giros, transições e acrobacias. Uma modalidade dinâmica para evoluir técnica e condicionamento físico.",
      level: "Todos os níveis",
    },
    {
      title: "Pole Coreográfico",
      desc: "A união entre o Pole e a Dança. Explore musicalidade, expressão corporal, fluidez e presença através de coreografias que conectam técnica e movimento.",
      level: "Todos os níveis",
    },
    {
      title: "Flex Flow",
      desc: "Movimento, mobilidade e flexibilidade em perfeita conexão. Uma prática fluida que convida o corpo a ganhar amplitude de forma natural e consciente.",
      level: "Todos os níveis",
    },
  ],
  classTypes: [
    { id: "pole", label: "Pole Dance", short: "Pole", color: "ocean" },
    { id: "coreo", label: "Pole Coreográfico", short: "Coreo", color: "gold" },
    { id: "flex", label: "Flex Flow", short: "Flex", color: "rose" },
  ],
  schedule: [
    {
      id: "seg",
      name: "Segunda",
      slots: [
        { time: "10:00", type: "flex" },
        { time: "17:00", type: "pole" },
        { time: "18:00", type: "coreo" },
        { time: "19:00", type: "pole" },
        { time: "20:00", type: "pole" },
      ],
    },
    {
      id: "ter",
      name: "Terça",
      slots: [
        { time: "09:00", type: "pole" },
        { time: "18:00", type: "pole" },
        { time: "19:00", type: "flex" },
      ],
    },
    {
      id: "qua",
      name: "Quarta",
      slots: [
        { time: "10:00", type: "flex" },
        { time: "17:00", type: "pole" },
        { time: "19:00", type: "coreo" },
        { time: "20:00", type: "pole" },
      ],
    },
    {
      id: "qui",
      name: "Quinta",
      slots: [
        { time: "09:00", type: "pole" },
        { time: "18:00", type: "coreo" },
        { time: "19:00", type: "pole" },
      ],
    },
    {
      id: "sex",
      name: "Sexta",
      slots: [
        { time: "17:00", type: "flex" },
        { time: "18:00", type: "pole" },
        { time: "19:00", type: "coreo" },
      ],
    },
    {
      id: "sab",
      name: "Sábado",
      slots: [
        { time: "10:00", type: "pole" },
        { time: "20:00", type: "coreo" },
      ],
    },
  ],
  plans: [
    {
      name: "4 Aulas",
      price: "R$ 230",
      per: "R$ 57,50 por aula",
      desc: "Perfeito para começar com consistência",
      highlight: false,
      benefits: ["Todas as modalidades", "Todos os níveis", "Acesso ao app do estúdio"],
    },
    {
      name: "8 Aulas",
      price: "R$ 370",
      per: "R$ 46,25 por aula",
      desc: "O mais escolhido pelas nossas alunas",
      highlight: true,
      benefits: ["Todas as modalidades", "Todos os níveis", "Acesso ao app do estúdio"],
    },
    {
      name: "12 Aulas",
      price: "R$ 490",
      per: "R$ 40,83 por aula",
      desc: "Para quem quer evolução acelerada",
      highlight: false,
      benefits: ["Todas as modalidades", "Todos os níveis", "Acesso ao app do estúdio"],
    },
  ],
  extras: [
    { name: "Aula Experimental", price: "R$ 30", desc: "Venha conhecer o studio" },
    { name: "Aula Avulsa", price: "R$ 70", desc: "Sem compromisso de mensalidade" },
    { name: "Aula Particular", price: "R$ 120", desc: "Atenção exclusiva da professora" },
  ],
  areaAluna: {
    eyebrow: "Exclusivo",
    title: "Área da Aluna",
    desc: "Veja sua agenda, marque presença, acompanhe sua evolução e acesse conteúdos exclusivos direto pelo app da Praiana.",
    cta: "Acessar o app",
  },
};

export const CONTENT_KEY = "site";

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Ordena horários de forma crescente (HH:MM). */
export function sortSlots(slots: Slot[]): Slot[] {
  const key = (t: string) => {
    const [h, m] = String(t ?? "").split(":");
    return (Number(h) || 0) * 60 + (Number(m) || 0);
  };
  return [...slots].sort((a, b) => key(a.time) - key(b.time));
}

function normalizeSchedule(value: unknown): DaySchedule[] {
  if (Array.isArray(value)) {
    return value
      .filter(isObject)
      .map((d, i) => ({
        id: typeof d['id'] === "string" ? (d['id'] as string) : `dia-${i}`,
        name: typeof d['name'] === "string" ? (d['name'] as string) : `Dia ${i + 1}`,
        slots: Array.isArray(d['slots'])
          ? (d['slots'] as unknown[]).filter(isObject).map((s) => ({
              time: String(s['time'] ?? "18:00"),
              type: String(s['type'] ?? "pole"),
            }))
          : [],
      }));
  }
  if (isObject(value)) {
    // legacy Record<"Seg"|..., Slot[]>
    return LEGACY_DAYS.map((d) => ({
      id: d.toLowerCase(),
      name: LEGACY_FULL[d] ?? d,
      slots: Array.isArray(value[d])
        ? sortSlots(
            (value[d] as unknown[]).filter(isObject).map((s) => ({
              time: String(s['time'] ?? "18:00"),
              type: String(s['type'] ?? "pole"),
            })),
          )
        : [],
    }));
  }
  return DEFAULT_CONTENT.schedule;
}

/** Shallow-per-section merge so novos campos ganham valor padrão. */
export function mergeContent(stored: unknown): SiteContent {
  if (!isObject(stored)) return DEFAULT_CONTENT;
  const out = { ...DEFAULT_CONTENT } as Record<string, unknown>;
  for (const key of Object.keys(DEFAULT_CONTENT) as (keyof SiteContent)[]) {
    const value = stored[key];
    if (value === undefined) continue;
    if (key === "schedule") {
      out[key] = normalizeSchedule(value);
      continue;
    }
    const base = DEFAULT_CONTENT[key];
    out[key] = isObject(base) && isObject(value) ? { ...base, ...value } : value;
  }
  // garantias mínimas
  const mods = out['modalities'];
  if (Array.isArray(mods)) {
    out['modalities'] = mods.filter(isObject).map((m) => ({
      title: String(m['title'] ?? ""),
      desc: String(m['desc'] ?? ""),
      level: typeof m['level'] === "string" ? (m['level'] as string) : "Todos os níveis",
    }));
  }
  const plans = out['plans'];
  if (Array.isArray(plans)) {
    out['plans'] = plans.filter(isObject).map((p) => ({
      name: String(p['name'] ?? ""),
      price: String(p['price'] ?? ""),
      per: String(p['per'] ?? ""),
      desc: String(p['desc'] ?? ""),
      highlight: Boolean(p['highlight']),
      benefits: Array.isArray(p['benefits'])
        ? (p['benefits'] as unknown[]).map(String)
        : ["Todas as modalidades", "Todos os níveis", "Acesso ao app do estúdio"],
    }));
  }
  if (!Array.isArray(out['classTypes']) || (out['classTypes'] as unknown[]).length === 0) {
    out['classTypes'] = DEFAULT_CONTENT.classTypes;
  }
  // imagens: caminhos de dev (/src/assets/...) ou vazios voltam para o bundle padrão
  const imgs = isObject(out['images']) ? (out['images'] as Record<string, unknown>) : {};
  const fixImg = (v: unknown, fallback: string) => {
    const s = typeof v === "string" ? v.trim() : "";
    if (!s || s === "default" || s.startsWith("/src/assets/") || s.startsWith("src/assets/")) {
      return fallback;
    }
    return s;
  };
  out['images'] = {
    hero: fixImg(imgs['hero'], studioImg),
    logo: fixImg(imgs['logo'], logoImg),
    movimento: fixImg(imgs['movimento'], movimentoImg),
  };
  return out as SiteContent;
}

export async function fetchSiteContent(): Promise<SiteContent> {
  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", CONTENT_KEY)
    .maybeSingle();
  if (error || !data) return DEFAULT_CONTENT;
  return mergeContent(data.value);
}

export async function saveSiteContent(content: SiteContent) {
  const { error } = await supabase
    .from("site_content")
    .upsert(
      { key: CONTENT_KEY, value: JSON.parse(JSON.stringify(content)) },
      { onConflict: "key" },
    );
  if (error) throw error;
}

export function useSiteContent(enabled = true) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(enabled);
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    fetchSiteContent()
      .then((c) => active && setContent(c))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [enabled]);
  return { content, loading, setContent };
}

/** Atualiza um caminho "a.b.c" de forma imutável. */
export function setPath<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const clone: any = Array.isArray(obj) ? [...(obj as any)] : { ...(obj as any) };
  let cur = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]!;
    cur[k] = Array.isArray(cur[k]) ? [...cur[k]] : { ...cur[k] };
    cur = cur[k];
  }
  cur[keys[keys.length - 1]!] = value;
  return clone as T;
}
