import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import studioImg from "@/assets/studio.png";
import logoImg from "@/assets/logo-praiana.png";

export const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;
export type Day = (typeof days)[number];
export type ClassType = "pole" | "coreo" | "flex";

export const fullDayNames: Record<Day, string> = {
  Seg: "Segunda",
  Ter: "Terça",
  Qua: "Quarta",
  Qui: "Quinta",
  Sex: "Sexta",
  Sáb: "Sábado",
};

export type Slot = { time: string; type: ClassType };
export type Modality = { title: string; desc: string };
export type Plan = { name: string; price: string; per: string; desc: string; highlight: boolean };
export type Extra = { name: string; price: string; desc: string };

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
    addressNote: string;
    floatingWhatsText: string;
  };
  images: { hero: string; logo: string };
  modalities: Modality[];
  schedule: Record<Day, Slot[]>;
  plans: Plan[];
  extras: Extra[];
  areaAluna: { eyebrow: string; title: string; desc: string; cta: string };
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
    addressNote: "",
    floatingWhatsText: "Bora marcar sua aula? 🌊",
  },
  images: { hero: studioImg, logo: logoImg },
  modalities: [
    {
      title: "Pole Dance",
      desc: "Desenvolva força, resistência e consciência corporal enquanto aprende giros, transições e acrobacias. Uma modalidade dinâmica para evoluir técnica e condicionamento físico.",
    },
    {
      title: "Pole Coreográfico",
      desc: "A união entre o Pole e a Dança. Explore musicalidade, expressão corporal, fluidez e presença através de coreografias que conectam técnica e movimento.",
    },
    {
      title: "Flex Flow",
      desc: "Movimento, mobilidade e flexibilidade em perfeita conexão. Uma prática fluida que convida o corpo a ganhar amplitude de forma natural e consciente.",
    },
  ],
  schedule: {
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
  },
  plans: [
    { name: "4 Aulas", price: "R$ 230", per: "R$ 57,50 por aula", desc: "Perfeito para começar com consistência", highlight: false },
    { name: "8 Aulas", price: "R$ 370", per: "R$ 46,25 por aula", desc: "O mais escolhido pelas nossas alunas", highlight: true },
    { name: "12 Aulas", price: "R$ 490", per: "R$ 40,83 por aula", desc: "Para quem quer evolução acelerada", highlight: false },
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

/** Shallow-per-section merge so novos campos ganham valor padrão. */
export function mergeContent(stored: unknown): SiteContent {
  if (!isObject(stored)) return DEFAULT_CONTENT;
  const out = { ...DEFAULT_CONTENT } as Record<string, unknown>;
  for (const key of Object.keys(DEFAULT_CONTENT) as (keyof SiteContent)[]) {
    const value = stored[key];
    if (value === undefined) continue;
    const base = DEFAULT_CONTENT[key];
    out[key] = isObject(base) && isObject(value) ? { ...base, ...value } : value;
  }
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

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    fetchSiteContent()
      .then((c) => active && setContent(c))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);
  return { content, loading, setContent };
}
