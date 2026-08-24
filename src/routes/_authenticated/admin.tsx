import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PraianaSite from "@/components/site/PraianaSite";
import {
  DEFAULT_CONTENT,
  PALETTE,
  fetchSiteContent,
  saveSiteContent,
  setPath,
  sortSlots,
  type ColorKey,
  type ImageKey,
  type SiteContent,
} from "@/lib/site-content";
import { X, ZoomIn } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel do Studio · Praiana Pole Studio" },
      { name: "description", content: "Painel para editar modalidades, horários, valores e contato do site da Praiana." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Painel do Studio · Praiana" },
      { property: "og:description", content: "Gerencie o conteúdo do site da Praiana Pole Studio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const field =
  "w-full rounded-xl border border-ocean/15 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ocean";
const labelCls = "text-[11px] uppercase tracking-widest text-mist";
const card = "rounded-3xl bg-white/85 backdrop-blur ring-1 ring-ocean/10 p-6 shadow-[0_20px_60px_-40px_rgba(38,106,174,0.5)]";
const btn = "rounded-xl bg-ocean px-4 py-2 text-xs font-semibold uppercase tracking-widest text-sand hover:bg-deep transition-colors";
const btnGhost = "rounded-xl border border-ocean/20 px-3 py-1.5 text-xs font-semibold text-ocean hover:bg-ocean/5 transition-colors";
const btnDanger = "text-xs font-semibold text-red-600 hover:underline";

function Field({
  labelText,
  value,
  onChange,
  textarea = false,
  type = "text",
}: {
  labelText: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  type?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className={labelCls}>{labelText}</span>
      {textarea ? (
        <textarea rows={3} className={field} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type={type} className={field} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

type TabKey = "preview" | "modalidades" | "horarios" | "planos" | "contato" | "acessos";
const TABS: { key: TabKey; label: string }[] = [
  { key: "preview", label: "Prévia do site" },
  { key: "modalidades", label: "Modalidades" },
  { key: "horarios", label: "Grade de horários" },
  { key: "planos", label: "Planos e valores" },
  { key: "contato", label: "Contato" },
  { key: "acessos", label: "Acessos" },
];

type AccessRow = {
  user_id: string;
  email: string;
  status: string;
  created_at: string;
  is_admin: boolean;
  is_owner: boolean;
};

function AccessTab({ onError }: { onError: (m: string | null) => void }) {
  const [rows, setRows] = useState<AccessRow[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data, error } = await (supabase.rpc as unknown as (fn: string) => Promise<{ data: unknown; error: { message: string } | null }>)("admin_list_access");
    if (error) onError(error.message);
    else setRows((data as AccessRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const decide = async (userId: string, approve: boolean) => {
    setBusy(userId);
    onError(null);
    const { error } = await (
      supabase.rpc as unknown as (
        fn: string,
        args: Record<string, unknown>,
      ) => Promise<{ error: { message: string } | null }>
    )("admin_decide_access", { _user_id: userId, _approve: approve });
    if (error) onError(error.message);
    await load();
    setBusy(null);
  };

  const pending = rows.filter((r) => !r.is_admin && r.status !== "rejected");
  const rejected = rows.filter((r) => !r.is_admin && r.status === "rejected");
  const admins = rows.filter((r) => r.is_admin);

  if (loading) return <section className={card}>Carregando acessos…</section>;

  const Row = ({ r, actions }: { r: AccessRow; actions: React.ReactNode }) => (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ocean/5 p-4">
      <div>
        <p className="text-sm font-semibold text-ink">{r.email}</p>
        <p className="text-[11px] uppercase tracking-widest text-mist">
          {new Date(r.created_at).toLocaleDateString("pt-BR")}
          {r.is_owner ? " · conta principal" : ""}
        </p>
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <section className={card}>
        <h2 className="mb-1 font-serif text-xl italic text-ocean">Pedidos de acesso</h2>
        <p className="mb-4 text-sm text-ink/60">
          Quem criar uma conta fica aqui aguardando. Só entra na administração quem você aprovar.
        </p>
        {pending.length === 0 ? (
          <p className="text-sm text-ink/50">Nenhum pedido pendente.</p>
        ) : (
          <div className="space-y-3">
            {pending.map((r) => (
              <Row
                key={r.user_id}
                r={r}
                actions={
                  <>
                    <button disabled={busy === r.user_id} className={btn} onClick={() => decide(r.user_id, true)}>
                      Aprovar
                    </button>
                    <button disabled={busy === r.user_id} className={btnGhost} onClick={() => decide(r.user_id, false)}>
                      Recusar
                    </button>
                  </>
                }
              />
            ))}
          </div>
        )}
      </section>

      <section className={card}>
        <h2 className="mb-4 font-serif text-xl italic text-ocean">Com acesso liberado</h2>
        <div className="space-y-3">
          {admins.map((r) => (
            <Row
              key={r.user_id}
              r={r}
              actions={
                r.is_owner ? (
                  <span className="rounded-full bg-gold/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-ink/70">
                    Principal
                  </span>
                ) : (
                  <button disabled={busy === r.user_id} className={btnDanger} onClick={() => decide(r.user_id, false)}>
                    Remover acesso
                  </button>
                )
              }
            />
          ))}
        </div>
      </section>

      {rejected.length > 0 && (
        <section className={card}>
          <h2 className="mb-4 font-serif text-xl italic text-ocean">Recusados</h2>
          <div className="space-y-3">
            {rejected.map((r) => (
              <Row
                key={r.user_id}
                r={r}
                actions={
                  <button disabled={busy === r.user_id} className={btnGhost} onClick={() => decide(r.user_id, true)}>
                    Liberar acesso
                  </button>
                }
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}


const TAB_ANCHOR: Partial<Record<TabKey, string>> = {
  modalidades: "modalidades",
  horarios: "horarios",
  planos: "valores",
  contato: "contato",
};

function LivePreview({ content, anchor }: { content: SiteContent; anchor: string }) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const t = setTimeout(() => {
      const el = box.querySelector(`#${anchor}`) as HTMLElement | null;
      if (el) box.scrollTop = Math.max(0, el.offsetTop * 0.55 - 16);
    }, 120);
    return () => clearTimeout(t);
  }, [anchor]);

  return (
    <section className={card}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-serif text-xl italic text-ocean">Prévia ao vivo</h2>
        <span className="text-[11px] uppercase tracking-widest text-mist">Atualiza enquanto você edita</span>
      </div>
      <div
        ref={boxRef}
        className="h-[520px] overflow-auto rounded-2xl ring-1 ring-ocean/15 bg-white"
        onClickCapture={(e) => {
          const el = (e.target as HTMLElement).closest("a");
          if (el) e.preventDefault();
        }}
      >
        <div
          style={{ transform: "scale(0.55)", transformOrigin: "top left", width: "181.8%" }}
          className="pointer-events-none"
        >
          <PraianaSite content={content} />
        </div>
      </div>
    </section>
  );
}

function aspectForImage(which: ImageKey): number {
  if (which === "logo") return 1 / 1;
  if (which === "hero") return 3 / 4;
  if (which === "movimento") return 21 / 9;
  return 4 / 3;
}

type CropState = {
  which: ImageKey;
  file: File;
  url: string;
  naturalWidth: number;
  naturalHeight: number;
};

function CropModal({
  state,
  onCancel,
  onConfirm,
}: {
  state: CropState | null;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  useEffect(() => {
    if (state) {
      setZoom(1);
      setPos({ x: 0, y: 0 });
    }
  }, [state]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !state) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr) setContainerSize({ w: cr.width, h: cr.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [state]);

  if (!state) return null;

  const aspect = aspectForImage(state.which);

  const handleConfirm = () => {
    const cropW = containerSize.w;
    const cropH = containerSize.h;
    if (!cropW || !cropH) return;
    const baseScale = Math.max(cropW / state.naturalWidth, cropH / state.naturalHeight);
    const totalScale = baseScale * zoom;
    const outScale = Math.min(2, Math.max(1, 1200 / cropW));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(cropW * outScale);
    canvas.height = Math.round(cropH * outScale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.drawImage(
        img,
        Math.max(0, -pos.x / totalScale),
        Math.max(0, -pos.y / totalScale),
        cropW / totalScale,
        cropH / totalScale,
        0,
        0,
        canvas.width,
        canvas.height
      );
      canvas.toBlob(
        (blob) => {
          if (blob) onConfirm(blob);
        },
        "image/jpeg",
        0.92
      );
    };
    img.src = state.url;
  };

  const baseScale = containerSize.w && containerSize.h
    ? Math.max(containerSize.w / state.naturalWidth, containerSize.h / state.naturalHeight)
    : 1;
  const imgW = state.naturalWidth * baseScale * zoom;
  const imgH = state.naturalHeight * baseScale * zoom;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-sand p-6 shadow-2xl ring-1 ring-ocean/10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl italic text-ocean">Ajustar imagem</h3>
            <p className="text-xs text-ink/60">Arraste para posicionar. Aproxime com o slider.</p>
          </div>
          <button onClick={onCancel} className="rounded-full p-2 hover:bg-ocean/10 text-ink/60">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          ref={containerRef}
          className="relative mx-auto w-full overflow-hidden rounded-2xl bg-ocean/10 ring-1 ring-ocean/20 cursor-move"
          style={{ aspectRatio: `${aspect}` }}
          onMouseDown={(e) => {
            setDragging(true);
            dragStart.current = { x: e.clientX, y: e.clientY, posX: pos.x, posY: pos.y };
          }}
          onMouseMove={(e) => {
            if (!dragging) return;
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            setPos({ x: dragStart.current.posX + dx, y: dragStart.current.posY + dy });
          }}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
          onTouchStart={(e) => {
            const t = e.touches[0];
            setDragging(true);
            dragStart.current = { x: t.clientX, y: t.clientY, posX: pos.x, posY: pos.y };
          }}
          onTouchMove={(e) => {
            if (!dragging) return;
            const t = e.touches[0];
            const dx = t.clientX - dragStart.current.x;
            const dy = t.clientY - dragStart.current.y;
            setPos({ x: dragStart.current.posX + dx, y: dragStart.current.posY + dy });
          }}
          onTouchEnd={() => setDragging(false)}
        >
          <img
            src={state.url}
            alt="Prévia para corte"
            draggable={false}
            className="absolute left-0 top-0 select-none"
            style={{
              width: imgW,
              height: imgH,
              transform: `translate(${pos.x}px, ${pos.y}px)`,
              transformOrigin: "top left",
            }}
          />
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-inset ring-white/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
        </div>

        <div className="mt-5 flex items-center gap-3">
          <ZoomIn className="h-4 w-4 text-mist" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-ocean"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className={btnGhost}>Cancelar</button>
          <button onClick={handleConfirm} className={btn}>Confirmar</button>
        </div>
      </div>
    </div>
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
  const [tab, setTab] = useState<TabKey>("preview");
  const [dragFrom, setDragFrom] = useState<{ dayId: string; index: number } | null>(null);
  const [crop, setCrop] = useState<CropState | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingImage = useRef<ImageKey>("hero");

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

  const setValue = (path: string, value: string) => setContent((c) => setPath(c, path, value));

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

  const uploadImage = async (which: ImageKey, blob: Blob) => {
    setError(null);
    const path = `${which}-${Date.now()}.jpg`;
    const { error: upErr } = await supabase.storage.from("site-images").upload(path, blob, { upsert: true, contentType: "image/jpeg" });
    if (upErr) return setError(upErr.message);
    const { data, error: urlErr } = await supabase.storage
      .from("site-images")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
    if (urlErr || !data) return setError("Imagem enviada, mas não foi possível gerar o link.");
    setContent((c) => ({ ...c, images: { ...c.images, [which]: data.signedUrl } }));
    setStatus("Imagem carregada. Clique em salvar para publicar.");
  };

  const pickImage = (which: ImageKey) => {
    pendingImage.current = which;
    fileRef.current?.click();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (loading) {
    return <div className="theme-light-locked min-h-screen bg-sand grid place-items-center text-ocean">Carregando painel…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="theme-light-locked min-h-screen bg-sand grid place-items-center px-6 text-center">
        <div className={card}>
          <h1 className="font-serif text-2xl italic text-ocean">Acesso aguardando aprovação</h1>
          <p className="mt-2 max-w-sm text-sm text-ink/60">
            Seu pedido foi registrado e só a administradora principal do studio pode liberar o acesso. Assim que ela
            aprovar, é só entrar de novo por aqui.
          </p>

          <button onClick={signOut} className={`${btn} mt-6`}>Sair</button>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-light-locked min-h-screen bg-sand text-ink font-sans">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            const url = URL.createObjectURL(f);
            const img = new Image();
            img.onload = () => {
              setCrop({
                which: pendingImage.current,
                file: f,
                url,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
              });
            };
            img.src = url;
          }
          e.target.value = "";
        }}
      />

      <CropModal
        state={crop}
        onCancel={() => {
          if (crop) URL.revokeObjectURL(crop.url);
          setCrop(null);
        }}
        onConfirm={(blob) => {
          if (!crop) return;
          const which = crop.which;
          URL.revokeObjectURL(crop.url);
          setCrop(null);
          void uploadImage(which, blob);
        }}
      />

      {/* Barra fixa */}
      <header className="sticky top-0 z-50 border-b border-ocean/10 bg-sand/90 backdrop-blur px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-mist">Praiana</p>
            <h1 className="font-serif text-2xl italic text-ocean">Painel do Studio</h1>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className={btnGhost}>Ver site</a>
            <button onClick={signOut} className={btnGhost}>Sair</button>
            <button onClick={save} disabled={saving} className={`${btn} disabled:opacity-60`}>
              {saving ? "Salvando…" : "Salvar alterações"}
            </button>
          </div>
        </div>
        <div className="mx-auto mt-3 flex max-w-6xl gap-2 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                tab === t.key ? "bg-ocean text-sand" : "bg-ocean/10 text-ocean hover:bg-ocean/20"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {status && <p className="mx-auto mt-3 max-w-6xl rounded-2xl bg-ocean/10 px-4 py-2 text-sm text-ocean">{status}</p>}
        {error && <p className="mx-auto mt-3 max-w-6xl rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
      </header>

      {tab === "preview" && (
        <div className="px-2 py-4 sm:px-6">
          <p className="mx-auto mb-3 max-w-6xl rounded-2xl bg-gold/15 px-4 py-3 text-sm text-ink/75">
            Clique em qualquer texto marcado para editar, e passe o mouse sobre a logo ou a foto do studio para trocar a
            imagem. Depois clique em <strong>Salvar alterações</strong>.
          </p>
          <div
            className="mx-auto max-w-6xl overflow-hidden rounded-3xl ring-1 ring-ocean/15"
            style={{ transform: "translateZ(0)" }}
            onClickCapture={(e) => {
              const el = (e.target as HTMLElement).closest("a");
              if (el) e.preventDefault();
            }}
          >
            <PraianaSite content={content} edit={{ editing: true, setValue, pickImage }} />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-8">
        {/* MODALIDADES */}
        {tab === "modalidades" && (
          <section className={card}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl italic text-ocean">Modalidades</h2>
              <button
                className={btnGhost}
                onClick={() =>
                  update("modalities", [
                    ...content.modalities,
                    { title: "Nova modalidade", desc: "", level: "Todos os níveis" },
                  ])
                }
              >
                + Adicionar
              </button>
            </div>
            <div className="space-y-4">
              {content.modalities.map((m, i) => {
                const set = (patch: Partial<typeof m>) =>
                  update("modalities", content.modalities.map((x, j) => (j === i ? { ...x, ...patch } : x)));
                return (
                  <div key={i} className="space-y-3 rounded-2xl bg-ocean/5 p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field labelText="Nome" value={m.title} onChange={(v) => set({ title: v })} />
                      <Field labelText="Nível" value={m.level} onChange={(v) => set({ level: v })} />
                    </div>
                    <Field textarea labelText="Descrição" value={m.desc} onChange={(v) => set({ desc: v })} />
                    <button
                      className={btnDanger}
                      onClick={() => update("modalities", content.modalities.filter((_, j) => j !== i))}
                    >
                      Remover modalidade
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* HORÁRIOS */}
        {tab === "horarios" && (
          <>
            <section className={card}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-xl italic text-ocean">Tipos de aula</h2>
                <button
                  className={btnGhost}
                  onClick={() =>
                    update("classTypes", [
                      ...content.classTypes,
                      { id: `t${Date.now()}`, label: "Nova aula", short: "Nova", color: "teal" },
                    ])
                  }
                >
                  + Adicionar
                </button>
              </div>
              <div className="space-y-3">
                {content.classTypes.map((t, i) => {
                  const set = (patch: Partial<typeof t>) =>
                    update("classTypes", content.classTypes.map((x, j) => (j === i ? { ...x, ...patch } : x)));
                  return (
                    <div key={t.id} className="grid gap-3 rounded-2xl bg-ocean/5 p-4 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
                      <Field labelText="Nome da aula" value={t.label} onChange={(v) => set({ label: v })} />
                      <Field labelText="Abreviação (no calendário)" value={t.short} onChange={(v) => set({ short: v })} />
                      <label className="space-y-1">
                        <span className={labelCls}>Cor</span>
                        <select
                          className={field}
                          value={t.color}
                          onChange={(e) => set({ color: e.target.value as ColorKey })}
                        >
                          {(Object.keys(PALETTE) as ColorKey[]).map((k) => (
                            <option key={k} value={k}>{PALETTE[k].label}</option>
                          ))}
                        </select>
                      </label>
                      <button
                        className={`${btnDanger} pb-2`}
                        onClick={() => update("classTypes", content.classTypes.filter((_, j) => j !== i))}
                      >
                        Remover
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className={card}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-xl italic text-ocean">Dias e horários</h2>
                <button
                  className={btnGhost}
                  onClick={() =>
                    update("schedule", [...content.schedule, { id: `d${Date.now()}`, name: "Novo dia", slots: [] }])
                  }
                >
                  + Adicionar dia
                </button>
              </div>
              <p className="mb-3 text-xs text-ink/50">
                Arraste pela alça ⠿ (ou use as setas) para deixar na ordem que você quiser.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {content.schedule.map((day, i) => {
                  const setDay = (patch: Partial<typeof day>) =>
                    update("schedule", content.schedule.map((x, j) => (j === i ? { ...x, ...patch } : x)));
                  const move = (from: number, to: number) => {
                    if (to < 0 || to >= day.slots.length || from === to) return;
                    const next = [...day.slots];
                    const [moved] = next.splice(from, 1);
                    if (!moved) return;
                    next.splice(to, 0, moved);
                    setDay({ slots: next });
                  };
                  return (
                    <div key={day.id} className="rounded-2xl bg-ocean/5 p-4">
                      <input
                        className={`${field} mb-3 font-semibold`}
                        value={day.name}
                        onChange={(e) => setDay({ name: e.target.value })}
                      />
                      <div className="space-y-2">
                        {day.slots.map((s, k) => (
                          <div
                            key={k}
                            draggable
                            onDragStart={(e) => {
                              setDragFrom({ dayId: day.id, index: k });
                              e.dataTransfer.effectAllowed = "move";
                            }}
                            onDragOver={(e) => {
                              if (dragFrom?.dayId === day.id) e.preventDefault();
                            }}
                            onDrop={(e) => {
                              if (dragFrom?.dayId !== day.id) return;
                              e.preventDefault();
                              move(dragFrom.index, k);
                              setDragFrom(null);
                            }}
                            onDragEnd={() => setDragFrom(null)}
                            className={`flex items-center gap-1.5 rounded-xl bg-white/70 p-1 ${
                              dragFrom?.dayId === day.id && dragFrom.index === k ? "opacity-50" : ""
                            }`}
                          >
                            <span
                              className="cursor-grab select-none px-1 text-sm text-ink/40"
                              title="Arraste para reordenar"
                              aria-hidden
                            >
                              ⠿
                            </span>
                            <div className="flex flex-col">
                              <button
                                className="text-[10px] leading-none text-ocean disabled:opacity-25"
                                aria-label="Mover para cima"
                                disabled={k === 0}
                                onClick={() => move(k, k - 1)}
                              >
                                ▲
                              </button>
                              <button
                                className="text-[10px] leading-none text-ocean disabled:opacity-25"
                                aria-label="Mover para baixo"
                                disabled={k === day.slots.length - 1}
                                onClick={() => move(k, k + 1)}
                              >
                                ▼
                              </button>
                            </div>
                            <input
                              type="time"
                              value={s.time}
                              onChange={(e) =>
                                setDay({
                                  slots: day.slots.map((x, m) => (m === k ? { ...x, time: e.target.value } : x)),
                                })
                              }
                              className={`${field} w-28`}
                            />
                            <select
                              value={s.type}
                              onChange={(e) =>
                                setDay({ slots: day.slots.map((x, m) => (m === k ? { ...x, type: e.target.value } : x)) })
                              }
                              className={field}
                            >
                              {content.classTypes.map((t) => (
                                <option key={t.id} value={t.id}>{t.label}</option>
                              ))}
                            </select>
                            <button
                              className="text-xs font-semibold text-red-600"
                              aria-label="Remover horário"
                              onClick={() => setDay({ slots: day.slots.filter((_, m) => m !== k) })}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        {day.slots.length === 0 && <p className="text-xs text-ink/40">Sem aulas neste dia.</p>}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          className={btnGhost}
                          onClick={() =>
                            setDay({
                              slots: [
                                ...day.slots,
                                { time: "18:00", type: content.classTypes[0]?.id ?? "pole" },
                              ],
                            })
                          }
                        >
                          + Horário
                        </button>
                        <button
                          className={btnGhost}
                          disabled={day.slots.length < 2}
                          onClick={() => setDay({ slots: sortSlots(day.slots) })}
                        >
                          Ordenar por horário
                        </button>
                        <button
                          className={`${btnDanger} ml-auto`}
                          onClick={() => update("schedule", content.schedule.filter((_, j) => j !== i))}
                        >
                          Excluir dia
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* PLANOS */}
        {tab === "planos" && (
          <section className={card}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl italic text-ocean">Planos</h2>
              <button
                className={btnGhost}
                onClick={() =>
                  update("plans", [
                    ...content.plans,
                    { name: "Novo plano", price: "R$ 0", per: "", desc: "", highlight: false, benefits: [] },
                  ])
                }
              >
                + Adicionar plano
              </button>
            </div>
            <div className="space-y-4">
              {content.plans.map((p, i) => {
                const set = (patch: Partial<typeof p>) =>
                  update("plans", content.plans.map((x, j) => (j === i ? { ...x, ...patch } : x)));
                return (
                  <div key={i} className="rounded-2xl bg-ocean/5 p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field labelText="Nome" value={p.name} onChange={(v) => set({ name: v })} />
                      <Field labelText="Valor" value={p.price} onChange={(v) => set({ price: v })} />
                      <Field labelText="Valor por aula" value={p.per} onChange={(v) => set({ per: v })} />
                      <Field labelText="Descrição" value={p.desc} onChange={(v) => set({ desc: v })} />
                    </div>
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className={labelCls}>Benefícios</span>
                        <button className={btnGhost} onClick={() => set({ benefits: [...p.benefits, "Novo benefício"] })}>
                          + Benefício
                        </button>
                      </div>
                      <div className="space-y-2">
                        {p.benefits.map((b, k) => (
                          <div key={k} className="flex items-center gap-2">
                            <input
                              className={field}
                              value={b}
                              onChange={(e) => set({ benefits: p.benefits.map((x, m) => (m === k ? e.target.value : x)) })}
                            />
                            <button
                              className="text-xs font-semibold text-red-600"
                              onClick={() => set({ benefits: p.benefits.filter((_, m) => m !== k) })}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        {p.benefits.length === 0 && <p className="text-xs text-ink/40">Nenhum benefício listado.</p>}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs text-ink/70">
                        <input type="checkbox" checked={p.highlight} onChange={(e) => set({ highlight: e.target.checked })} />
                        Destacar como mais popular
                      </label>
                      <button className={btnDanger} onClick={() => update("plans", content.plans.filter((_, j) => j !== i))}>
                        Remover plano
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mb-4 mt-10 flex items-center justify-between">
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
                  <div key={i} className="grid gap-3 rounded-2xl bg-ocean/5 p-4 sm:grid-cols-3">
                    <Field labelText="Nome" value={e.name} onChange={(v) => set({ name: v })} />
                    <Field labelText="Valor" value={e.price} onChange={(v) => set({ price: v })} />
                    <Field labelText="Descrição" value={e.desc} onChange={(v) => set({ desc: v })} />
                    <button
                      className={`${btnDanger} justify-self-start`}
                      onClick={() => update("extras", content.extras.filter((_, j) => j !== i))}
                    >
                      Remover
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* CONTATO */}
        {tab === "contato" && (
          <section className={card}>
            <h2 className="mb-4 font-serif text-xl italic text-ocean">Área da Aluna</h2>
            <div className="mb-8 grid gap-4 rounded-2xl bg-ocean/5 p-4 sm:grid-cols-2">
              <Field labelText="Link do app das alunas" value={content.studio.appUrl} onChange={(v) => update("studio", { ...content.studio, appUrl: v })} />
              <Field labelText="Texto do botão" value={content.areaAluna.cta} onChange={(v) => update("areaAluna", { ...content.areaAluna, cta: v })} />
              <Field labelText="Etiqueta" value={content.areaAluna.eyebrow} onChange={(v) => update("areaAluna", { ...content.areaAluna, eyebrow: v })} />
              <Field labelText="Título" value={content.areaAluna.title} onChange={(v) => update("areaAluna", { ...content.areaAluna, title: v })} />
              <Field labelText="Descrição" value={content.areaAluna.desc} onChange={(v) => update("areaAluna", { ...content.areaAluna, desc: v })} />
            </div>

            <h2 className="mb-4 font-serif text-xl italic text-ocean">Contato e informações do studio</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field labelText="Nome do studio" value={content.studio.brandName} onChange={(v) => update("studio", { ...content.studio, brandName: v })} />
              <Field labelText="Frase do rodapé" value={content.studio.tagline} onChange={(v) => update("studio", { ...content.studio, tagline: v })} />
              <Field labelText="Endereço" value={content.studio.addressLabel} onChange={(v) => update("studio", { ...content.studio, addressLabel: v })} />
              <Field labelText="Link do mapa" value={content.studio.addressUrl} onChange={(v) => update("studio", { ...content.studio, addressUrl: v })} />
              <Field labelText="Link do mapa exibido no site (Google Maps: Compartilhar > Incorporar um mapa, ou cole o link normal)" value={content.studio.mapEmbedUrl} onChange={(v) => update("studio", { ...content.studio, mapEmbedUrl: v })} />
              <Field labelText="Complemento do endereço" value={content.studio.addressNote} onChange={(v) => update("studio", { ...content.studio, addressNote: v })} />
              <Field labelText="Link do WhatsApp" value={content.studio.whatsappUrl} onChange={(v) => update("studio", { ...content.studio, whatsappUrl: v })} />
              <Field labelText="Telefone exibido" value={content.studio.whatsappLabel} onChange={(v) => update("studio", { ...content.studio, whatsappLabel: v })} />
              <Field labelText="Texto do WhatsApp" value={content.studio.whatsappNote} onChange={(v) => update("studio", { ...content.studio, whatsappNote: v })} />
              <Field labelText="Link do Instagram" value={content.studio.instagramUrl} onChange={(v) => update("studio", { ...content.studio, instagramUrl: v })} />
              <Field labelText="@ do Instagram" value={content.studio.instagramLabel} onChange={(v) => update("studio", { ...content.studio, instagramLabel: v })} />
              <Field labelText="Texto do Instagram" value={content.studio.instagramNote} onChange={(v) => update("studio", { ...content.studio, instagramNote: v })} />
              <Field labelText="E-mail" value={content.studio.email} onChange={(v) => update("studio", { ...content.studio, email: v })} />
              <Field labelText="Texto do e-mail" value={content.studio.emailNote} onChange={(v) => update("studio", { ...content.studio, emailNote: v })} />
              <Field labelText="Balão flutuante do WhatsApp" value={content.studio.floatingWhatsText} onChange={(v) => update("studio", { ...content.studio, floatingWhatsText: v })} />
            </div>
          </section>
        )}

        {tab === "acessos" && <AccessTab onError={setError} />}

        {TAB_ANCHOR[tab] && <LivePreview content={content} anchor={TAB_ANCHOR[tab]!} />}

        {tab !== "preview" && tab !== "acessos" && (

          <div className="flex justify-end pb-16">
            <button onClick={save} disabled={saving} className={`${btn} disabled:opacity-60`}>
              {saving ? "Salvando…" : "Salvar alterações"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
