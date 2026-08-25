import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/fontes-numeros")({
  head: () => ({
    meta: [
      { title: "Prévia de fontes para números — Praiana" },
      { name: "description", content: "Comparativo de fontes itálicas para os algarismos do site Praiana." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Prévia de fontes para números — Praiana" },
      { property: "og:description", content: "Comparativo de fontes itálicas para os algarismos do site Praiana." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FontesNumeros,
});

type Opcao = {
  id: string;
  nome: string;
  desc: string;
  family: string | null;
};

const OPCOES: Opcao[] = [
  {
    id: "A",
    nome: "EB Garamond itálico 400",
    desc: "A atual, porém mais fina (sem negrito).",
    family: '"NumsEBGaramond", "Cormorant Garamond", Georgia, serif',
  },
  {
    id: "B",
    nome: "Cormorant Garamond itálico 400",
    desc: "Mais delicada e fina, combina com os títulos.",
    family: '"NumsCormorant", "Cormorant Garamond", Georgia, serif',
  },
  {
    id: "C",
    nome: "Playfair Display itálico 400",
    desc: "Serifa com mais contraste, elegante.",
    family: '"NumsPlayfair", "Cormorant Garamond", Georgia, serif',
  },
  {
    id: "D",
    nome: "Lora itálico 400",
    desc: "Serifa mais neutra e legível.",
    family: '"NumsLora", "Cormorant Garamond", Georgia, serif',
  },
  {
    id: "E",
    nome: "Sem fonte especial",
    desc: "Os números herdam a fonte do próprio texto.",
    family: null,
  },
];

function Amostra({ family }: { family: string | null }) {
  const style = family
    ? ({ fontFamily: family, fontVariantNumeric: "lining-nums" } as const)
    : ({ fontVariantNumeric: "lining-nums" } as const);
  return (
    <div className="space-y-4">
      <p
        className="font-serif italic text-3xl sm:text-4xl font-normal tracking-wide text-foreground"
        style={style}
      >
        12 · 24 · 48 · 490 · 120 · 30 · 19:30 · 2026
      </p>

      <div className="rounded-xl border border-border bg-card p-4 max-w-xs" style={style}>
        <p className="font-serif italic text-lg font-semibold text-foreground">12 aulas · Mensal</p>
        <p className="font-serif italic text-3xl font-semibold text-foreground mt-1">R$ 490</p>
        <p className="text-sm text-muted-foreground mt-2">Aula experimental R$ 30 · Particular R$ 120</p>
        <p className="text-sm text-muted-foreground">Seg 19:30 · Qua 07:00 · Sáb 10:15</p>
      </div>
    </div>
  );
}

function FontesNumeros() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground">Fontes para os números</h1>
          <p className="text-muted-foreground">
            Todas itálicas, com algarismos alinhados (mesma altura e mesma linha de base) e peso leve.
            Escolha uma letra (A–E) e eu aplico em todo o site.
          </p>
        </header>

        {OPCOES.map((o) => (
          <section key={o.id} className="space-y-3 border-t border-border pt-8">
            <div>
              <h2 className="font-serif text-xl text-foreground">
                Opção {o.id} — {o.nome}
              </h2>
              <p className="text-sm text-muted-foreground">{o.desc}</p>
            </div>
            <Amostra family={o.family} />
          </section>
        ))}
      </div>
    </main>
  );
}
