import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Acesso do Administrador · Praiana Pole Studio" },
      { name: "description", content: "Área restrita para administração do site da Praiana Pole Studio." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Acesso do Administrador · Praiana" },
      { property: "og:description", content: "Área restrita de administração do studio Praiana." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        navigate({ to: "/admin", replace: true });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!email.trim() || password.length < 6) {
      setError("Informe um e-mail válido e uma senha com pelo menos 6 caracteres.");
      return;
    }
    setLoading(true);
    if (mode === "signup") {
      const { data, error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (err) {
        setLoading(false);
        return setError(err.message);
      }
      if (!data.session) {
        // fallback: já existe conta ou confirmação pendente — tenta entrar direto
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        setLoading(false);
        if (signInErr) return setError(signInErr.message);
        return;
      }
      setLoading(false);
      setMessage("Acesso criado! Entrando...");
      return;
    }

    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (err) setError(err.message);
  };

  const google = async () => {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) setError("Não foi possível entrar com o Google.");
  };

  return (
    <div className="dark min-h-screen bg-sand text-ink font-sans grid place-items-center px-6 py-16">
      <div className="w-full max-w-md rounded-[32px] bg-card/90 backdrop-blur ring-1 ring-ocean/20 p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)]">
        <p className="text-xs uppercase tracking-[0.3em] text-mist">Praiana</p>
        <h1 className="mt-2 font-serif text-3xl italic text-ocean">
          {mode === "signin" ? "Entrar na administração" : "Criar acesso"}
        </h1>
        <p className="mt-2 text-sm text-ink/70">
          Área restrita para gerenciar o conteúdo do site.
        </p>

        <button
          type="button"
          onClick={google}
          className="mt-6 w-full rounded-2xl border border-ocean/20 bg-background py-3 text-sm font-semibold text-ocean hover:bg-ocean/10 transition-colors"
        >
          Continuar com Google
        </button>

        <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-widest text-ink/40">
          <span className="h-px flex-1 bg-ocean/20" /> ou <span className="h-px flex-1 bg-ocean/20" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            maxLength={255}
            className="w-full rounded-2xl border border-ocean/20 bg-background px-4 py-3 text-sm text-ink placeholder:text-ink/40 outline-none focus:border-ocean"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            maxLength={72}
            className="w-full rounded-2xl border border-ocean/20 bg-background px-4 py-3 text-sm text-ink placeholder:text-ink/40 outline-none focus:border-ocean"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-ocean py-3 text-sm font-semibold text-sand hover:bg-deep transition-colors disabled:opacity-60"
          >
            {loading ? "Aguarde..." : mode === "signin" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        {message && <p className="mt-4 text-sm text-ocean">{message}</p>}

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setMessage(null);
          }}
          className="mt-6 text-sm text-mist hover:text-ocean transition-colors"
        >
          {mode === "signin" ? "Ainda não tenho acesso — criar conta" : "Já tenho conta — entrar"}
        </button>
      </div>
    </div>
  );
}
