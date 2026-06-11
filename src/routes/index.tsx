import { createFileRoute } from "@tanstack/react-router";
import PraianaSite from "@/components/site/PraianaSite";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Praiana Pole Studio · Pole Dance & Artes" },
      {
        name: "description",
        content:
          "Studio de Pole Dance, Pole Coreográfico e Flex Flow. Aulas para todos os níveis em um espaço acolhedor — venha se mover na Praiana.",
      },
      { property: "og:title", content: "Praiana Pole Studio" },
      {
        property: "og:description",
        content:
          "Pole Dance, Pole Coreográfico e Flex Flow para todos os níveis. Aulas, horários, planos e área da aluna.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PraianaSite,
});
