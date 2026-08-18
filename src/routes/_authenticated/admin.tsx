import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DEFAULT_CONTENT,
  days,
  fetchSiteContent,
  fullDayNames,
  saveSiteContent,
  type ClassType,
  type Day,
  type SiteContent,
} from "@/lib/site-content";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel do Studio · Praiana Pole Studio" },
      { name: "description", content: "Painel para editar modalidades, horários, valores, textos e imagens do site da Praiana." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Painel do Studio · Praiana" },
      { property: "og:description", content: "Gerencie o conteúdo do site da Praiana Pole Studio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const CLASS_TYPES: { value: ClassType; label: string }[] = [
  { value: "pole", label: "Pole Dance" },
  { value: "coreo", label: "Pole Coreográfico" },
  { value: "flex", label: "Flex Flow" },
];

const field =
  "w-full rounded-xl border border-ocean/15 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ocean";
const label = "text-[11px] uppercase tracking-widest text-mist";
const card = "rounded-3xl bg-white/85 backdrop-blur ring-1 ring-ocean/10 p-6 shadow-[0_20px_60px_-40px_rgba(38,106,174,0.5)]";
const btn = "rounded-xl bg-ocean px-4 py-2 text-xs font-semibold uppercase tracking-widest text-sand hover:bg-deep transition-colors";
const btnGhost = "rounded-xl border border-ocean/20 px-3 py-1.5 text-xs font-semibold text-ocean hover:bg-ocean/5 transition-colors";

function Field({
  labelText,
  value,
  onChange,
  textarea = false,
}: {
  labelText: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="block space-y-1">
      <span className={label}>{labelText}</span>
      {textarea ? (
        <textarea rows={3} className={field} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={field} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (uid) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", uid)
          .eq("role", "admin")
          .maybeSingle();
        setIsAdmin(!!roles);
      } else {
        setIsAdmin(false);
      }
      setContent(await fetchSiteContent());
      setLoading(false);
    })();
  }, []);

  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) =>
    setContent((c) => ({ ...c, [key]: value }));

  const save = async () => {
    setSaving(true);
    setStatus(null);
    setError(null);
    try {
      await saveSiteContent(content);
      setStatus("Alterações publicadas no site!");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível salvar.");
    }
    setSaving(false);
  };

  const uploadImage = async (which: "hero" | "logo", file: File) => {
    setError(null);
    const path = `${which}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from("site-images").upload(path, file, { upsert: true });
    if (upErr) return setError(upErr.message);
    const { data, error: urlErr } = await supabase.storage
      .from("site-images")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
    if (urlErr || !data) return setError("Imagem enviada, mas não foi possível gerar o link.");
    update("images", { ...content.images, [which]: data.signedUrl });
    setStatus("Imagem carregada. Lembre-se de salvar.");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (loading) {
    return <div className="min-h-screen bg-sand grid place-items-center text-ocean">Carregando painel…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-sand grid place-items-center px-6 text-center">
        <div className={card}>
          <h1 className="font-serif text-2xl italic text-ocean">Acesso restrito</h1>
          <p className="mt-2 max-w-sm text-sm text-ink/60">
            Sua conta não tem permissão de administradora. Peça para a administradora do studio liberar seu acesso.
          </p>
          <button onClick={signOut} className={`${btn} mt-6`}>Sair</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand text-ink font-sans px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-mist">Praiana</p>
            <h1 className="font-serif text-3xl italic text-ocean">Painel do Studio</h1>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className={btnGhost}>Ver site</a>
            <button onClick={signOut} className={btnGhost}>Sair</button>
            <button onClick={save} disabled={saving} className={`${btn} disabled:opacity-60`}>
              {saving ? "Salvando…" : "Salvar alterações"}
            </button>
          </div>
        </header>

        {status && <p className="rounded-2xl bg-ocean/10 px-4 py-3 text-sm text-ocean">{status}</p>}
        {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        {/* Informações do studio */}
        <section className={card}>
          <h2 className="font-serif text-xl italic text-ocean mb-4">Informações do studio</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field labelText="Nome do studio" value={content.studio.brandName} onChange={(v) => update("studio", { ...content.studio, brandName: v })} />
            <Field labelText="Frase do rodapé" value={content.studio.tagline} onChange={(v) => update("studio", { ...content.studio, tagline: v })} />
            <Field labelText="Endereço" value={content.studio.addressLabel} onChange={(v) => update("studio", { ...content.studio, addressLabel: v })} />
            <Field labelText="Link do mapa" value={content.studio.addressUrl} onChange={(v) => update("studio", { ...content.studio, addressUrl: v })} />
            <Field labelText="Complemento do endereço" value={content.studio.addressNote} onChange={(v) => update("studio", { ...content.studio, addressNote: v })} />
            <Field labelText="Link do WhatsApp" value={content.studio.whatsappUrl} onChange={(v) => update("studio", { ...content.studio, whatsappUrl: v })} />
            <Field labelText="Telefone exibido" value={content.studio.whatsappLabel} onChange={(v) => update("studio", { ...content.studio, whatsappLabel: v })} />
            <Field labelText="Texto do WhatsApp" value={content.studio.whatsappNote} onChange={(v) => update("studio", { ...content.studio, whatsappNote: v })} />
            <Field labelText="Link do Instagram" value={content.studio.instagramUrl} onChange={(v) => update("studio", { ...content.studio, instagramUrl: v })} />
            <Field labelText="@ do Instagram" value={content.studio.instagramLabel} onChange={(v) => update("studio", { ...content.studio, instagramLabel: v })} />
            <Field labelText="Texto do Instagram" value={content.studio.instagramNote} onChange={(v) => update("studio", { ...content.studio, instagramNote: v })} />
            <Field labelText="E-mail" value={content.studio.email} onChange={(v) => update("studio", { ...content.studio, email: v })} />
            <Field labelText="Texto do e-mail" value={content.studio.emailNote} onChange={(v) => update("studio", { ...content.studio, emailNote: v })} />
            <Field labelText="Link do app das alunas" value={content.studio.appUrl} onChange={(v) => update("studio", { ...content.studio, appUrl: v })} />
            <Field labelText="Balão flutuante do WhatsApp" value={content.studio.floatingWhatsText} onChange={(v) => update("studio", { ...content.studio, floatingWhatsText: v })} />
          </div>
        </section>

        {/* Imagens */}
        <section className={card}>
          <h2 className="font-serif text-xl italic text-ocean mb-4">Imagens</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {(["hero", "logo"] as const).map((which) => (
              <div key={which} className="space-y-2">
                <p className={label}>{which === "hero" ? "Foto do studio (início)" : "Logo"}</p>
                <img src={content.images[which]} alt="" className="h-32 w-full rounded-2xl object-contain bg-ocean/5 p-2" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void uploadImage(which, f);
                  }}
                  className="text-xs text-ink/60"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Textos da home */}
        <section className={card}>
          <h2 className="font-serif text-xl italic text-ocean mb-4">Textos da página inicial</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field labelText="Selo acima do título" value={content.hero.eyebrow} onChange={(v) => update("hero", { ...content.hero, eyebrow: v })} />
            <Field labelText="Título — início" value={content.hero.titleLead} onChange={(v) => update("hero", { ...content.hero, titleLead: v })} />
            <Field labelText="Título — palavra destacada" value={content.hero.titleHighlight} onChange={(v) => update("hero", { ...content.hero, titleHighlight: v })} />
            <Field labelText="Título — final" value={content.hero.titleRest} onChange={(v) => update("hero", { ...content.hero, titleRest: v })} />
            <Field labelText="Botão principal" value={content.hero.ctaPrimary} onChange={(v) => update("hero", { ...content.hero, ctaPrimary: v })} />
            <Field labelText="Botão secundário" value={content.hero.ctaSecondary} onChange={(v) => update("hero", { ...content.hero, ctaSecondary: v })} />
          </div>
          <div className="mt-4">
            <Field textarea labelText="Descrição" value={content.hero.description} onChange={(v) => update("hero", { ...content.hero, description: v })} />
          </div>
          <h3 className="mt-8 mb-3 font-serif text-lg italic text-ocean">Bloco Área da Aluna</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field labelText="Selo" value={content.areaAluna.eyebrow} onChange={(v) => update("areaAluna", { ...content.areaAluna, eyebrow: v })} />
            <Field labelText="Título" value={content.areaAluna.title} onChange={(v) => update("areaAluna", { ...content.areaAluna, title: v })} />
            <Field labelText="Botão" value={content.areaAluna.cta} onChange={(v) => update("areaAluna", { ...content.areaAluna, cta: v })} />
          </div>
          <div className="mt-4">
            <Field textarea labelText="Descrição" value={content.areaAluna.desc} onChange={(v) => update("areaAluna", { ...content.areaAluna, desc: v })} />
          </div>
        </section>

        {/* Modalidades */}
        <section className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl italic text-ocean">Modalidades</h2>
            <button
              className={btnGhost}
              onClick={() => update("modalities", [...content.modalities, { title: "Nova modalidade", desc: "" }])}
            >
              + Adicionar
            </button>
          </div>
          <div className="space-y-4">
            {content.modalities.map((m, i) => (
              <div key={i} className="rounded-2xl bg-ocean/5 p-4 space-y-3">
                <Field
                  labelText="Nome"
                  value={m.title}
                  onChange={(v) =>
                    update("modalities", content.modalities.map((x, j) => (j === i ? { ...x, title: v } : x)))
                  }
                />
                <Field
                  textarea
                  labelText="Descrição"
                  value={m.desc}
                  onChange={(v) =>
                    update("modalities", content.modalities.map((x, j) => (j === i ? { ...x, desc: v } : x)))
                  }
                />
                <button
                  className="text-xs font-semibold text-red-600 hover:underline"
                  onClick={() => update("modalities", content.modalities.filter((_, j) => j !== i))}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Grade de horários */}
        <section className={card}>
          <h2 className="font-serif text-xl italic text-ocean mb-4">Grade de horários</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {days.map((d: Day) => {
              const slots = content.schedule[d] ?? [];
              const setSlots = (next: typeof slots) =>
                update("schedule", { ...content.schedule, [d]: next });
              return (
                <div key={d} className="rounded-2xl bg-ocean/5 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-serif text-lg italic text-ocean">{fullDayNames[d]}</p>
                    <button className={btnGhost} onClick={() => setSlots([...slots, { time: "18:00", type: "pole" }])}>
                      +
                    </button>
                  </div>
                  <div className="space-y-2">
                    {slots.map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="time"
                          value={s.time}
                          onChange={(e) => setSlots(slots.map((x, j) => (j === i ? { ...x, time: e.target.value } : x)))}
                          className={`${field} w-28`}
                        />
                        <select
                          value={s.type}
                          onChange={(e) =>
                            setSlots(slots.map((x, j) => (j === i ? { ...x, type: e.target.value as ClassType } : x)))
                          }
                          className={field}
                        >
                          {CLASS_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                        <button
                          className="text-xs font-semibold text-red-600"
                          onClick={() => setSlots(slots.filter((_, j) => j !== i))}
                          aria-label="Remover horário"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {slots.length === 0 && <p className="text-xs text-ink/40">Sem aulas neste dia.</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Planos */}
        <section className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl italic text-ocean">Planos</h2>
            <button
              className={btnGhost}
              onClick={() =>
                update("plans", [...content.plans, { name: "Novo plano", price: "R$ 0", per: "", desc: "", highlight: false }])
              }
            >
              + Adicionar
            </button>
          </div>
          <div className="space-y-4">
            {content.plans.map((p, i) => {
              const set = (patch: Partial<typeof p>) =>
                update("plans", content.plans.map((x, j) => (j === i ? { ...x, ...patch } : x)));
              return (
                <div key={i} className="rounded-2xl bg-ocean/5 p-4 grid gap-3 sm:grid-cols-2">
                  <Field labelText="Nome" value={p.name} onChange={(v) => set({ name: v })} />
                  <Field labelText="Preço" value={p.price} onChange={(v) => set({ price: v })} />
                  <Field labelText="Valor por aula" value={p.per} onChange={(v) => set({ per: v })} />
                  <Field labelText="Descrição" value={p.desc} onChange={(v) => set({ desc: v })} />
                  <label className="flex items-center gap-2 text-xs text-ink/70">
                    <input type="checkbox" checked={p.highlight} onChange={(e) => set({ highlight: e.target.checked })} />
                    Destacar como mais popular
                  </label>
                  <button
                    className="justify-self-start text-xs font-semibold text-red-600 hover:underline"
                    onClick={() => update("plans", content.plans.filter((_, j) => j !== i))}
                  >
                    Remover plano
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-8 mb-4">
            <h2 className="font-serif text-xl italic text-ocean">Aulas avulsas</h2>
            <button
              className={btnGhost}
              onClick={() => update("extras", [...content.extras, { name: "Nova opção", price: "R$ 0", desc: "" }])}
            >
              + Adicionar
            </button>
          </div>
          <div className="space-y-4">
            {content.extras.map((e, i) => {
              const set = (patch: Partial<typeof e>) =>
                update("extras", content.extras.map((x, j) => (j === i ? { ...x, ...patch } : x)));
              return (
                <div key={i} className="rounded-2xl bg-ocean/5 p-4 grid gap-3 sm:grid-cols-3">
                  <Field labelText="Nome" value={e.name} onChange={(v) => set({ name: v })} />
                  <Field labelText="Preço" value={e.price} onChange={(v) => set({ price: v })} />
                  <Field labelText="Descrição" value={e.desc} onChange={(v) => set({ desc: v })} />
                  <button
                    className="justify-self-start text-xs font-semibold text-red-600 hover:underline"
                    onClick={() => update("extras", content.extras.filter((_, j) => j !== i))}
                  >
                    Remover
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <div className="flex justify-end pb-16">
          <button onClick={save} disabled={saving} className={`${btn} disabled:opacity-60`}>
            {saving ? "Salvando…" : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}
