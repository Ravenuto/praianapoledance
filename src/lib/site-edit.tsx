import { createContext, useContext, useState, type ReactNode } from "react";
import type { ImageKey } from "@/lib/site-content";

export type EditApi = {
  editing: boolean;
  setValue: (path: string, value: string) => void;
  pickImage?: (which: ImageKey) => void;
};

const EditCtx = createContext<EditApi | null>(null);

export function EditProvider({ value, children }: { value: EditApi | null; children: ReactNode }) {
  return <EditCtx.Provider value={value}>{children}</EditCtx.Provider>;
}

export const useEdit = () => useContext(EditCtx);

/** Texto do site: normal em produção, clicável para editar no painel. */
export function Ed({
  path,
  value,
  multiline = false,
  className = "",
}: {
  path: string;
  value: string;
  multiline?: boolean;
  className?: string;
}) {
  const api = useEdit();
  const [draft, setDraft] = useState<string | null>(null);

  if (!api?.editing) return <>{value}</>;

  if (draft !== null) {
    const commit = () => {
      api.setValue(path, draft);
      setDraft(null);
    };
    const shared = {
      autoFocus: true,
      value: draft,
      onBlur: commit,
      className: `w-full min-w-[4ch] rounded-md bg-white px-1 text-ink shadow-[0_0_0_2px_var(--color-gold)] outline-none ${className}`,
      style: { font: "inherit", lineHeight: "inherit" as const },
    };
    return multiline ? (
      <textarea
        {...shared}
        rows={4}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setDraft(null);
        }}
      />
    ) : (
      <input
        {...shared}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
          if (e.key === "Escape") setDraft(null);
        }}
      />
    );
  }

  return (
    <span
      role="button"
      tabIndex={0}
      title="Clique para editar"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDraft(value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") setDraft(value);
      }}
      className={`cursor-text rounded-md outline-1 outline-dashed outline-gold/70 hover:bg-gold/25 ${className}`}
    >
      {value || "clique para escrever"}
    </span>
  );
}

/** Overlay clicável sobre as imagens editáveis. */
export function EdImage({ which, children }: { which: "hero" | "logo"; children: ReactNode }) {
  const api = useEdit();
  if (!api?.editing || !api.pickImage) return <>{children}</>;
  return (
    <span className="relative block group/img">
      {children}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          api.pickImage?.(which);
        }}
        className="absolute inset-0 z-20 grid place-items-center rounded-[inherit] bg-ocean/45 text-[11px] font-bold uppercase tracking-widest text-white opacity-0 transition-opacity group-hover/img:opacity-100"
      >
        Trocar imagem
      </button>
    </span>
  );
}

/** Envolve um link para permitir editar a URL no modo de edição. */
export function EdLink({
  path,
  value,
  children,
}: {
  path: string;
  value: string;
  children: ReactNode;
}) {
  const api = useEdit();
  const [draft, setDraft] = useState<string | null>(null);

  if (!api?.editing) return <>{children}</>;

  return (
    <span className="relative inline-block">
      <span
        onClickCapture={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDraft(value ?? "");
        }}
        className="block cursor-pointer rounded-[inherit] outline-1 outline-dashed outline-gold/70"
        title="Clique para editar o link"
      >
        {children}
      </span>
      {draft !== null && (
        <span className="absolute left-0 top-full z-50 mt-2 flex w-[min(320px,80vw)] items-center gap-2 rounded-xl bg-white p-2 shadow-xl ring-1 ring-ocean/20">
          <input
            autoFocus
            value={draft}
            placeholder="https://..."
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                api.setValue(path, draft);
                setDraft(null);
              }
              if (e.key === "Escape") setDraft(null);
            }}
            className="min-w-0 flex-1 rounded-md bg-sand/60 px-2 py-1 text-xs text-ink outline-none"
          />
          <button
            type="button"
            onClick={() => {
              api.setValue(path, draft);
              setDraft(null);
            }}
            className="rounded-md bg-ocean px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white"
          >
            Ok
          </button>
        </span>
      )}
    </span>
  );
}
