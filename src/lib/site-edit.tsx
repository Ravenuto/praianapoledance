import { createContext, useContext, useState, type ReactNode, type KeyboardEvent } from "react";
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

/** Renderiza texto com quebras de parágrafo (\n\n) e quebras de linha (\n). */
function Paragraphs({ text, className = "" }: { text: string; className?: string }) {
  if (!text) return null;
  const paragraphs = text.split("\n\n");
  return (
    <>
      {paragraphs.map((para, i) => (
        <span key={i} className={`block ${className} ${i > 0 ? "mt-4" : ""}`}>
          {para.split("\n").map((line, j, arr) => (
            <span key={j}>
              {line}
              {j < arr.length - 1 && <br />}
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

/** Insere texto na posição do cursor de um textarea/input. */
function insertAtCursor(input: HTMLTextAreaElement, text: string) {
  const start = input.selectionStart ?? 0;
  const end = input.selectionEnd ?? 0;
  const before = input.value.slice(0, start);
  const after = input.value.slice(end);
  input.value = before + text + after;
  input.selectionStart = input.selectionEnd = start + text.length;
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

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

  if (!api?.editing) {
    if (!multiline) return <>{value}</>;
    return <Paragraphs text={value} className={className} />;
  }

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
        onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
          if (e.key === "Escape") {
            e.preventDefault();
            setDraft(null);
            return;
          }
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            insertAtCursor(e.currentTarget, "\n\n");
            setDraft(e.currentTarget.value);
            return;
          }
          if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            insertAtCursor(e.currentTarget, "\n");
            setDraft(e.currentTarget.value);
          }
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
      {multiline ? <Paragraphs text={value} className={className} /> : value || "clique para escrever"}
    </span>
  );
}

/** Overlay clicável sobre as imagens editáveis. */
export function EdImage({ which, children }: { which: ImageKey; children: ReactNode }) {
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
